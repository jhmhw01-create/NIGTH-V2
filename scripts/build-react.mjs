import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {pageTree} from './page-tree.mjs';
import {renderCollections} from '../src/components/collections.mjs';
import {enhanceHead} from '../src/components/layout.mjs';
import {albumRoutes,stageRoutes,fanclubDetailRoutes,storyRoutes,playerRoutes,collectionRoutes,editorialRoutes,eventRoutes,visualRoutes,reactRoutes} from '../src/react/routes.mjs';
import {readPhotoEpisodes} from './photo-episodes.mjs';
import {readStoreProducts} from './store-products.mjs';
import {albumMarkup} from './album-markup.mjs';
import {archiveMarkup} from './archive-markup.mjs';
import {detailNavigation} from './detail-navigation.mjs';
import {routeData,serializeRouteData} from './route-data.mjs';
import {homeUpdates} from './home-updates.mjs';
import {readImageDimensions} from './image-dimensions.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function buildReactPages() {
  const temporary=join(root,'.react-build');
  await mkdir(temporary,{recursive:true});
  const photos=await readPhotoEpisodes(new URL('../',import.meta.url));
  const products=await readStoreProducts(new URL('../',import.meta.url));
  const catalog=JSON.parse(await readFile(join(root,'src/data/archive.json'),'utf8'));
  const imageDimensions=await readImageDimensions(join(root,'dist'));
  await writeFile(join(temporary,'photo-episodes.json'),JSON.stringify(photos));
  await writeFile(join(temporary,'store-products.json'),JSON.stringify(products));
  const routes=reactRoutes;
  const detailMap={};
  for(const route of routes){const page=JSON.parse(await readFile(join(root,'src/pages',route.replace('.html','.json')),'utf8'));detailMap[route]=detailNavigation(page);}
  await writeFile(join(temporary,'detail-navigation.json'),JSON.stringify(detailMap));
  const collections={};
  for(const name of ['albums','notices','contentsEntries','memberships','galleryCards'])collections[name]=JSON.parse(await readFile(join(root,'src/data',name+'.json'),'utf8'));
  const trees={};
  for(const route of routes.slice(1)) {
    if(route==='store.html'||route==='archive.html'||playerRoutes.includes(route)||collectionRoutes.includes(route))continue;
    const page=JSON.parse(await readFile(join(root,'src/pages',route.replace('.html','.json')),'utf8'));
    trees[route]=pageTree(renderCollections(albumRoutes.includes(route)?albumMarkup(page):stageRoutes.includes(route)||fanclubDetailRoutes.includes(route)||storyRoutes.includes(route)||editorialRoutes.includes(route)||eventRoutes.includes(route)||visualRoutes.includes(route)?archiveMarkup(page):page.contentHtml,collections),imageDimensions);
  }
  await writeFile(join(temporary,'page-trees.json'),JSON.stringify(trees));
  const clientBuild=await build({entryPoints:[join(root,'src/react/client.jsx')],outfile:join(root,'dist/assets/js/react-site.js'),write:false,bundle:true,minify:true,jsx:'automatic',platform:'browser',format:'esm',target:['es2020'],define:{'process.env.NODE_ENV':'"production"'}});
  const clientBytes=clientBuild.outputFiles[0].contents;
  const clientFile='react-site.'+createHash('sha256').update(clientBytes).digest('hex').slice(0,16)+'.js';
  await writeFile(join(root,'dist/assets/js',clientFile),clientBytes);
  const serverFile=join(temporary,'home-server.mjs');
  await build({entryPoints:[join(root,'src/react/server.jsx')],outfile:serverFile,bundle:true,jsx:'automatic',platform:'node',format:'esm',packages:'external'});
  const {renderPage}=await import(pathToFileURL(serverFile).href);
  const homeStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/home-fashion.css'))).digest('hex').slice(0,12);
  const discographyStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/discography-fashion.css'))).digest('hex').slice(0,12);
  const historyStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/history-fashion.css'))).digest('hex').slice(0,12);
  const galleryStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/gallery-fashion.css'))).digest('hex').slice(0,12);
  const contentsStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/contents-fashion.css'))).digest('hex').slice(0,12);
  const archiveStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/archive-fashion.css'))).digest('hex').slice(0,12);
  const noticeStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/notice-fashion.css'))).digest('hex').slice(0,12);
  const fanclubStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/fanclub-fashion.css'))).digest('hex').slice(0,12);
  const fanclubDetailStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/fanclub-detail-fashion.css'))).digest('hex').slice(0,12);
  const listenStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/listen-fashion.css'))).digest('hex').slice(0,12);
  const albumDetailStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/album-detail-fashion.css'))).digest('hex').slice(0,12);
  const subpageStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/subpage-fashion.css'))).digest('hex').slice(0,12);
  const stageStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/stage-detail-fashion.css'))).digest('hex').slice(0,12);
  const storeStyleVersion=createHash('sha256').update(await readFile(join(root,'public/assets/css/store-fashion.css'))).digest('hex').slice(0,12);
  const indexRoutes=new Set(['index.html','discography.html','history.html','listen.html','gallery.html','contents.html','archive.html','notice.html','fanclub.html']);
  for(const route of routes) {
    const page=JSON.parse(await readFile(join(root,'src/pages',route.replace('.html','.json')),'utf8'));
    const pageData=routeData(route,{trees,navigation:detailMap,catalog,photos,products,updates:homeUpdates(collections.notices)});
    const markup=renderPage(route,pageData);
    const homeTheme=route==='index.html'?'<link rel="stylesheet" href="assets/css/home-fashion.css?v='+homeStyleVersion+'">':route==='discography.html'?'<link rel="stylesheet" href="assets/css/discography-fashion.css?v='+discographyStyleVersion+'">':route==='history.html'?'<link rel="stylesheet" href="assets/css/history-fashion.css?v='+historyStyleVersion+'">':route==='gallery.html'?'<link rel="stylesheet" href="assets/css/gallery-fashion.css?v='+galleryStyleVersion+'">':route==='contents.html'?'<link rel="stylesheet" href="assets/css/contents-fashion.css?v='+contentsStyleVersion+'">':route==='archive.html'?'<link rel="stylesheet" href="assets/css/archive-fashion.css?v='+archiveStyleVersion+'">':route==='notice.html'?'<link rel="stylesheet" href="assets/css/notice-fashion.css?v='+noticeStyleVersion+'">':route==='fanclub.html'?'<link rel="stylesheet" href="assets/css/fanclub-fashion.css?v='+fanclubStyleVersion+'">':'';
    const stageTheme=stageRoutes.includes(route)||eventRoutes.includes(route)?'<link rel="stylesheet" href="assets/css/stage-detail-fashion.css?v='+stageStyleVersion+'">':'';
    const subpageTheme=!indexRoutes.has(route)?'<link rel="stylesheet" href="assets/css/subpage-fashion.css?v='+subpageStyleVersion+'">':'';
    const listenTheme=route==='listen.html'?'<link rel="stylesheet" href="assets/css/listen-fashion.css?v='+listenStyleVersion+'">':'';
    const fanclubDetailTheme=fanclubDetailRoutes.includes(route)?'<link rel="stylesheet" href="assets/css/fanclub-detail-fashion.css?v='+fanclubDetailStyleVersion+'">':'';
    const albumDetailTheme=albumRoutes.includes(route)?'<link rel="stylesheet" href="assets/css/album-detail-fashion.css?v='+albumDetailStyleVersion+'">':'';
    const storeTheme=route==='store.html'?'<link rel="stylesheet" href="assets/css/store-fashion.css?v='+storeStyleVersion+'">':'';
    const fallback=route==='archive.html'||playerRoutes.includes(route)||collectionRoutes.includes(route)?(page.contentHtml.match(/<noscript>[\s\S]*?<\/noscript>/)?.[0]||''):'';
    const body=page.beforeHeaderHtml+'<div id="night-react-root">'+markup+'</div>'+fallback+'<noscript><style>.reveal{opacity:1!important;transform:none!important}.nav-links{display:flex!important;flex-wrap:wrap}</style></noscript><script id="night-page-data" type="application/json">'+serializeRouteData(pageData)+'</script><script type="module" src="assets/js/'+clientFile+'"></script>';
await writeFile(join(root,'dist',route),'<!DOCTYPE html>\n<html '+page.htmlAttributes+'><head>'+enhanceHead(page)+'<link rel="stylesheet" href="assets/css/detail-navigation.css"><link rel="stylesheet" href="assets/css/site-stability.css"><link rel="stylesheet" href="assets/css/discovery-guide.css"><link rel="stylesheet" href="assets/css/readability.css">'+homeTheme+subpageTheme+fanclubDetailTheme+listenTheme+albumDetailTheme+stageTheme+storeTheme+'</head><body '+page.bodyAttributes+(fanclubDetailRoutes.includes(route)?' data-night-fanclub-detail="true"':'')+(route==='listen.html'?' data-night-listen="true"':'')+(albumRoutes.includes(route)?' data-night-album-detail="true"':'')+(!indexRoutes.has(route)?' data-night-subpage="true"':'')+(stageRoutes.includes(route)||eventRoutes.includes(route)?' data-night-stage-detail="true"':'')+' data-night-surface="'+(route==='index.html'?'home':'information')+'">'+body+'</body></html>\n');
  }
  console.log(`All ${routes.length} routes pre-rendered with React; existing page URLs preserved.`);
}
