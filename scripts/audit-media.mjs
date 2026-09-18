import {createHash} from 'node:crypto';
import {readFile,readdir,stat,writeFile} from 'node:fs/promises';
import {extname,join,relative,resolve,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {readImageDimensions} from './image-dimensions.mjs';

const repositoryRoot=resolve(new URL('..',import.meta.url).pathname);
const publicRoot=join(repositoryRoot,'public');
const mediaRoot=join(publicRoot,'assets');
const maintenanceRoot=join(repositoryRoot,'maintenance');
const mediaExtensions=new Set(['.gif','.jpeg','.jpg','.m4a','.mp3','.ogg','.png','.wav','.webp']);
const textExtensions=new Set(['.css','.html','.js','.jsx','.json','.md','.mjs','.ts','.tsx','.txt']);

const slash=path=>path.split(sep).join('/');
const comparePath=(a,b)=>Buffer.from(a).compare(Buffer.from(b));
const digest=buffer=>createHash('sha256').update(buffer).digest('hex');

async function walk(directory,predicate=()=>true){
  const files=[];
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const path=join(directory,entry.name);
    if(entry.isDirectory())files.push(...await walk(path,predicate));
    else if(entry.isFile()&&predicate(path))files.push(path);
  }
  return files;
}

async function currentMedia(){
  const paths=(await walk(mediaRoot,path=>mediaExtensions.has(extname(path).toLowerCase())))
    .sort((a,b)=>comparePath(slash(relative(publicRoot,a)),slash(relative(publicRoot,b))));
  return Promise.all(paths.map(async path=>{
    const buffer=await readFile(path);
    return {path:slash(relative(publicRoot,path)),bytes:buffer.length,sha256:digest(buffer)};
  }));
}

async function sourceCorpus(){
  const roots=['src','scripts','public'].map(name=>join(repositoryRoot,name));
  const chunks=[];
  for(const root of roots){
    for(const path of await walk(root,path=>{
      if(path.startsWith(join(publicRoot,'assets','images')+sep)||path.startsWith(join(publicRoot,'assets','audio')+sep))return false;
      return textExtensions.has(extname(path).toLowerCase());
    }))chunks.push(await readFile(path,'utf8'));
  }
  return chunks.join('\n');
}

function createWebManifest(files){
  const extensions={};
  for(const file of files){const extension=extname(file.path).toLowerCase();extensions[extension]=(extensions[extension]??0)+1;}
  const fingerprint=digest(Buffer.from(files.map(file=>`${file.path}\0${file.bytes}\0${file.sha256}`).join('\n')));
  return {schemaVersion:1,root:'public',summary:{files:files.length,bytes:files.reduce((sum,file)=>sum+file.bytes,0),sha256:fingerprint,extensions}};
}

async function createImageAudit(files){
  const dimensions=await readImageDimensions(publicRoot);
  const corpus=await sourceCorpus();
  const images=files.filter(file=>file.path.startsWith('assets/images/'));
  const byHash=new Map();
  for(const file of images){const group=byHash.get(file.sha256)??[];group.push(file.path);byHash.set(file.sha256,group);}
  const duplicates=[...byHash.entries()].filter(([,paths])=>paths.length>1).map(([sha256,paths])=>({sha256,paths}));
  const records=images.map(file=>{const literalReferenceFound=corpus.includes(file.path);return {...file,...dimensions[file.path],folder:file.path.slice(0,file.path.lastIndexOf('/')),literalReferenceFound,status:literalReferenceFound?'referenced':'needs-dynamic-reference-review'};});
  const folders={};
  for(const file of records){const item=folders[file.folder]??{files:0,bytes:0};item.files+=1;item.bytes+=file.bytes;folders[file.folder]=item;}
  return {schemaVersion:2,summary:{images:images.length,bytes:images.reduce((sum,file)=>sum+file.bytes,0),exactDuplicateGroups:duplicates.length,literalReferenceFound:records.filter(file=>file.literalReferenceFound).length,dynamicReviewRequired:records.filter(file=>!file.literalReferenceFound).length,emptyFiles:records.filter(file=>file.bytes===0).length},duplicates,emptyFiles:records.filter(file=>file.bytes===0).map(file=>file.path),folders:Object.fromEntries(Object.entries(folders).sort(([a],[b])=>comparePath(a,b))),policy:'public/assets/images contains web-delivery assets. A missing literal reference is not deletion permission; dynamic path conventions require review.'};
}

function sameJson(a,b){return JSON.stringify(a)===JSON.stringify(b);}
async function json(path){return JSON.parse(await readFile(path,'utf8'));}

export async function auditMedia({write=false}={}){
  const files=await currentMedia();
  const emptyMedia=files.filter(file=>file.bytes===0);
  if(emptyMedia.length)throw Error('Media audit failed: empty deployed media:\n'+emptyMedia.map(file=>file.path).join('\n'));
  const webManifest=createWebManifest(files);
  const imageAudit=await createImageAudit(files);
  const webManifestPath=join(maintenanceRoot,'web-media-manifest.json');
  const imageAuditPath=join(maintenanceRoot,'image-audit.json');
  if(write){
    await writeFile(webManifestPath,JSON.stringify(webManifest,null,2)+'\n');
    await writeFile(imageAuditPath,JSON.stringify(imageAudit,null,2)+'\n');
  }else{
    const storedWeb=await json(webManifestPath);
    const storedAudit=await json(imageAuditPath);
    if(!sameJson(storedWeb,webManifest))throw Error('maintenance/web-media-manifest.json is stale. Run npm run audit:media:update.');
    if(!sameJson(storedAudit,imageAudit))throw Error('maintenance/image-audit.json is stale. Run npm run audit:media:update.');
  }

  const sourceManifest=await json(join(maintenanceRoot,'original-media-manifest.json'));
  const conversionManifest=await json(join(maintenanceRoot,'media-conversions.json'));
  const retiredManifest=await json(join(maintenanceRoot,'retired-media.json'));
  const retired=new Set(retiredManifest.retired??[]);
  const sources=new Map(sourceManifest.files.map(file=>[file.path,file]));
  const deployed=new Map(files.map(file=>[file.path,file]));
  const conversionsByWeb=new Map(conversionManifest.files.map(file=>[file.web.path,file]));
  const dimensions=await readImageDimensions(publicRoot);
  const corpus=await sourceCorpus();
  const failures=[];

  for(const retiredPath of retired){
    if(!conversionsByWeb.has(retiredPath))failures.push(`retired path has no conversion history: ${retiredPath}`);
    if(deployed.has(retiredPath))failures.push(`retired web media is deployed: ${retiredPath}`);
    if(corpus.includes(retiredPath))failures.push(`source references retired web media: ${retiredPath}`);
  }

  for(const conversion of conversionManifest.files){
    const source=sources.get(conversion.original.path);
    const web=deployed.get(conversion.web.path);
    const isRetired=retired.has(conversion.web.path);
    if(!source||source.bytes!==conversion.original.bytes||source.sha256!==conversion.original.sha256)failures.push(`invalid original record: ${conversion.original.path}`);
    if(!isRetired&&(!web||web.bytes!==conversion.web.bytes||web.sha256!==conversion.web.sha256))failures.push(`invalid web record: ${conversion.web.path}`);
    if(isRetired&&web)failures.push(`retired web media is deployed: ${conversion.web.path}`);
    if(await stat(join(publicRoot,conversion.original.path)).then(()=>true,()=>false))failures.push(`archival original is deployed: ${conversion.original.path}`);
    if(corpus.includes(conversion.original.path))failures.push(`source still references archival original: ${conversion.original.path}`);
    if(!isRetired){
      const size=dimensions[conversion.web.path];
      if(!size||size.width!==conversion.web.width||size.height!==conversion.web.height)failures.push(`dimension mismatch: ${conversion.web.path}`);
    }
    if(conversion.method==='png-to-webp'&&(conversion.original.width!==conversion.web.width||conversion.original.height!==conversion.web.height))failures.push(`new conversion changed dimensions: ${conversion.web.path}`);
  }
  if(conversionManifest.summary.files!==conversionManifest.files.length)failures.push('media conversion summary count is stale');
  if(failures.length)throw Error('Media source-management audit failed:\n'+failures.join('\n'));
  return {media:files.length,images:imageAudit.summary.images,conversions:conversionManifest.files.length,retired:retired.size,bytes:webManifest.summary.bytes};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const result=await auditMedia({write:process.argv.includes('--write')});
  console.log(`Media audit passed: ${result.media} deployed files, ${result.images} images, ${result.conversions} recorded conversions (${result.retired} retired), ${result.bytes} bytes.`);
}
