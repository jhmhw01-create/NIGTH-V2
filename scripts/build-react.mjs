import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {join} from 'node:path';
import {pageTree} from './page-tree.mjs';
import {renderCollections} from '../src/components/collections.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function buildReactPages() {
  const temporary=join(root,'.react-build');
  await mkdir(temporary,{recursive:true});
  const routes=['index.html','discography.html','contents.html','notice.html','fanclub.html','gallery.html','history.html','listen.html'];
  const collections={};
  for(const name of ['albums','notices','contentsEntries','memberships','galleryCards'])collections[name]=JSON.parse(await readFile(join(root,'src/data',name+'.json'),'utf8'));
  const trees={};
  for(const route of routes.slice(1)) {
    const page=JSON.parse(await readFile(join(root,'src/pages',route.replace('.html','.json')),'utf8'));
    trees[route]=pageTree(renderCollections(page.contentHtml,collections));
  }
  await writeFile(join(temporary,'page-trees.json'),JSON.stringify(trees));
  await build({entryPoints:[join(root,'src/react/client.jsx')],outfile:join(root,'dist/assets/js/react-site.js'),bundle:true,minify:true,jsx:'automatic',platform:'browser',format:'esm',target:['es2020'],define:{'process.env.NODE_ENV':'"production"'}});
  const serverFile=join(temporary,'home-server.mjs');
  await build({entryPoints:[join(root,'src/react/server.jsx')],outfile:serverFile,bundle:true,jsx:'automatic',platform:'node',format:'esm',packages:'external'});
  const {renderPage}=await import(pathToFileURL(serverFile).href);
  for(const route of routes) {
    const page=JSON.parse(await readFile(join(root,'src/pages',route.replace('.html','.json')),'utf8'));
    const markup=renderPage(route);
    const body=page.beforeHeaderHtml+'<div id="night-react-root">'+markup+'</div><noscript><style>.reveal{opacity:1!important;transform:none!important}.nav-links{display:flex!important;flex-wrap:wrap}</style></noscript><script type="module" src="assets/js/react-site.js"></script>';
    await writeFile(join(root,'dist',route),'<!DOCTYPE html>\n<html '+page.htmlAttributes+'><head>'+page.headHtml+'</head><body '+page.bodyAttributes+'>'+body+'</body></html>\n');
  }
  console.log('Eight React hub routes pre-rendered; other 44 routes unchanged.');
}
