import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function buildReactHome() {
  const temporary=join(root,'.react-build');
  await mkdir(temporary,{recursive:true});
  await build({entryPoints:[join(root,'src/react/client.jsx')],outfile:join(root,'dist/assets/js/react-home.js'),bundle:true,minify:true,jsx:'automatic',platform:'browser',format:'esm',target:['es2020'],define:{'process.env.NODE_ENV':'"production"'}});
  const serverFile=join(temporary,'home-server.mjs');
  await build({entryPoints:[join(root,'src/react/server.jsx')],outfile:serverFile,bundle:true,jsx:'automatic',platform:'node',format:'esm',packages:'external'});
  const {renderHome}=await import(pathToFileURL(serverFile).href);
  const page=JSON.parse(await readFile(join(root,'src/pages/index.json'),'utf8'));
  const markup=renderHome();
  const body=page.beforeHeaderHtml+'<div id="night-react-root">'+markup+'</div><noscript><style>.reveal{opacity:1!important;transform:none!important}.nav-links{display:flex!important;flex-wrap:wrap}</style></noscript><script type="module" src="assets/js/react-home.js"></script>';
  await writeFile(join(root,'dist/index.html'),'<!DOCTYPE html>\n<html '+page.htmlAttributes+'><head>'+page.headHtml+'</head><body '+page.bodyAttributes+'>'+body+'</body></html>\n');
  console.log('React HOME pre-rendered and hydrated; 51 other routes remain unchanged.');
}
