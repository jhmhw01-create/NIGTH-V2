import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {pageTree} from './page-tree.mjs';
import {renderCollections} from '../src/components/collections.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function buildReactPages() {
  const temporary=join(root,'.react-build');
  await mkdir(temporary,{recursive:true});
  const routes=['index.html','discography.html','contents.html','notice.html','fanclub.html','gallery.html','history.html','listen.html','archive.html','member-doha.html','member-ihwan.html','member-jiwoo.html','member-taehun.html','member-woohyun.html'];
  const collections={};
  for(const name of ['albums','notices','contentsEntries','memberships','galleryCards'])collections[name]=JSON.parse(await readFile(join(root,'src/data',name+'.json'),'utf8'));
  const trees={};
  for(const route of routes.slice(1)) {
    if(route==='archive.html')continue;
    const page=JSON.parse(await readFile(join(root,'src/pages',route.replace('.html','.json')),'utf8'));
    trees[route]=pageTree(renderCollections(page.contentHtml,collections));
  }
  await writeFile(join(temporary,'page-trees.json'),JSON.stringify(trees));
  const clientBuild=await build({entryPoints:[join(root,'src/react/client.jsx')],outfile:join(root,'dist/assets/js/react-site.js'),write:false,bundle:true,minify:true,jsx:'automatic',platform:'browser',format:'esm',target:['es2020'],define:{'process.env.NODE_ENV':'"production"'}});
  const clientBytes=clientBuild.outputFiles[0].contents;
  const clientFile='react-site.'+createHash('sha256').update(clientBytes).digest('hex').slice(0,16)+'.js';
  await writeFile(join(root,'dist/assets/js',clientFile),clientBytes);
  const serverFile=join(temporary,'home-server.mjs');
  await build({entryPoints:[join(root,'src/react/server.jsx')],outfile:serverFile,bundle:true,jsx:'automatic',platform:'node',format:'esm',packages:'external'});
  const {renderPage}=await import(pathToFileURL(serverFile).href);
  for(const route of routes) {
    const page=JSON.parse(await readFile(join(root,'src/pages',route.replace('.html','.json')),'utf8'));
    const markup=renderPage(route);
    const fallback=route==='archive.html'?(page.contentHtml.match(/<noscript>[\s\S]*?<\/noscript>/)?.[0]||''):'';
    const body=page.beforeHeaderHtml+'<div id="night-react-root">'+markup+'</div>'+fallback+'<noscript><style>.reveal{opacity:1!important;transform:none!important}.nav-links{display:flex!important;flex-wrap:wrap}</style></noscript><script type="module" src="assets/js/'+clientFile+'"></script>';
    await writeFile(join(root,'dist',route),'<!DOCTYPE html>\n<html '+page.htmlAttributes+'><head>'+page.headHtml+'</head><body '+page.bodyAttributes+'>'+body+'</body></html>\n');
  }
  console.log('14 React routes pre-rendered; other 38 routes unchanged.');
}
