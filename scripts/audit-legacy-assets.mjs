import {readFile,readdir,writeFile} from 'node:fs/promises';
import {extname,join,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const publicRoot=join(root,'public');
const maintenancePath=join(root,'maintenance','legacy-asset-audit.json');
const textExt=new Set(['.css','.html','.js','.jsx','.json','.md','.mjs','.ts','.tsx']);
const slash=value=>value.split(sep).join('/');
const compare=(a,b)=>Buffer.from(a).compare(Buffer.from(b));

async function walk(directory,predicate=()=>true){
  const out=[];
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const path=join(directory,entry.name);
    if(entry.isDirectory())out.push(...await walk(path,predicate));
    else if(entry.isFile()&&predicate(path))out.push(path);
  }
  return out;
}

async function textCorpus(directory,{exclude=[]}={}){
  const chunks=[];
  for(const path of await walk(directory,path=>textExt.has(extname(path).toLowerCase())&&!exclude.includes(path))){
    chunks.push({path,content:await readFile(path,'utf8')});
  }
  return chunks;
}

function mentionsAsset(content,assetPath){
  const publicPath='public/'+assetPath;
  return content.includes(assetPath)||content.includes(publicPath)||content.includes(assetPath.replaceAll('/','\\\\'));
}

export async function createLegacyAssetAudit(distRoot){
  const publicAssets=[];
  for(const type of ['css','js']){
    const directory=join(publicRoot,'assets',type);
    for(const path of await walk(directory,path=>extname(path).toLowerCase()===`.${type}`)){
      publicAssets.push({path:slash(relative(publicRoot,path)),type});
    }
  }
  publicAssets.sort((a,b)=>compare(a.path,b.path));

  const runtimeCorpus=await textCorpus(distRoot);
  const sourceRoots=['src','scripts','tests'].map(name=>join(root,name));
  const sourceCorpus=[];
  for(const directory of sourceRoots)sourceCorpus.push(...await textCorpus(directory));

  const records=publicAssets.map(asset=>{
    const runtimeReferences=runtimeCorpus
      .filter(item=>item.path!==join(distRoot,asset.path)&&mentionsAsset(item.content,asset.path))
      .map(item=>slash(relative(distRoot,item.path)))
      .sort(compare);
    const buildReferences=sourceCorpus
      .filter(item=>item.path!==join(root,'scripts','audit-legacy-assets.mjs')&&mentionsAsset(item.content,asset.path))
      .map(item=>slash(relative(root,item.path)))
      .sort(compare);
    const status=runtimeReferences.length?'runtime':buildReferences.length?'build-input':'unresolved';
    return {...asset,status,runtimeReferences,buildReferences};
  });

  const groups={runtime:[],buildInput:[],unresolved:[]};
  for(const record of records){
    const target=record.status==='runtime'?groups.runtime:record.status==='build-input'?groups.buildInput:groups.unresolved;
    target.push(record.path);
  }
  return {
    schemaVersion:1,
    summary:{assets:records.length,css:records.filter(r=>r.type==='css').length,js:records.filter(r=>r.type==='js').length,runtime:groups.runtime.length,buildInput:groups.buildInput.length,unresolved:groups.unresolved.length},
    groups,
    records,
    policy:'public CSS/JS is classified against generated dist output first, then repository build-source references. unresolved means no current runtime or build-input evidence and is a review candidate, not automatic deletion permission.'
  };
}

export async function auditLegacyAssets(distRoot,{write=false}={}){
  const current=await createLegacyAssetAudit(distRoot);
  if(write){
    await writeFile(maintenancePath,JSON.stringify(current,null,2)+'\n');
  }else{
    const stored=JSON.parse(await readFile(maintenancePath,'utf8'));
    if(JSON.stringify(stored)!==JSON.stringify(current))throw Error('maintenance/legacy-asset-audit.json is stale. Rebuild with UPDATE_LEGACY_ASSET_AUDIT=1 and review the diff.');
  }
  return current.summary;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const dist=resolve(process.argv[2]||join(root,'dist'));
  const result=await auditLegacyAssets(dist,{write:process.argv.includes('--write')});
  console.log(`Legacy asset audit passed: ${result.assets} public CSS/JS (${result.runtime} runtime, ${result.buildInput} build-input, ${result.unresolved} unresolved).`);
}
