import {readFile} from 'node:fs/promises';
import {reactRoutes} from '../src/react/routes.mjs';
import {buildSearchCatalog} from '../scripts/search-catalog.mjs';

export async function buildSourceSearchCatalog(){
  const albums=JSON.parse(await readFile(new URL('../src/data/albums.json',import.meta.url),'utf8'));
  const documents={};
  for(const route of reactRoutes){
    const page=JSON.parse(await readFile(new URL('../src/pages/'+route.replace('.html','.json'),import.meta.url),'utf8'));
    documents[route]={headHtml:page.headHtml,markup:page.contentHtml};
  }
  return buildSearchCatalog({routes:reactRoutes,documents,albums});
}
