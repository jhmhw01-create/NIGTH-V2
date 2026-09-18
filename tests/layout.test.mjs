import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {Header,PageLayout,navigation} from '../src/components/layout.mjs';
import {reactRoutes} from '../src/react/routes.mjs';
import {buildSourceSearchCatalog} from './search-fixture.mjs';
const root=new URL('../',import.meta.url);
test('shared navigation has eleven unique entries and one active item',()=>{
  assert.equal(new Set(navigation.map(x=>x[0])).size,11);
  const header=Header({route:'listen.html',activeNav:'LISTEN'});
  assert.equal((header.match(/aria-current="page"/g)||[]).length,1);
  assert(header.includes('type="button"'));
});
test('all page content and overlays survive layout rendering',async()=>{
  const pages=await readdir(new URL('src/pages/',root));
  assert.equal(pages.filter(x=>x.endsWith('.json')).length,reactRoutes.length);
  for(const name of pages){
    const page=JSON.parse(await readFile(new URL('src/pages/'+name,root),'utf8'));
    const output=PageLayout(page);
    assert(output.includes(page.contentHtml));
    assert(output.includes(page.afterFooterHtml));
    assert.equal((output.match(/<header class="site-header"/g)||[]).length,1);
    assert.equal((output.match(/<footer class="site-footer"/g)||[]).length,1);
  }
});
test('archive contains every current route and every current album anchor',async()=>{
  const catalog=await buildSourceSearchCatalog();
  const albums=JSON.parse(await readFile(new URL('src/data/albums.json',root),'utf8'));
  assert.equal(catalog.records.length,reactRoutes.length+albums.length);
  assert.equal(new Set(catalog.records.map(x=>x.id)).size,catalog.records.length);
  assert.equal(catalog.records.filter(x=>x.href.startsWith('discography.html#')).length,albums.length);
  for(const route of reactRoutes)assert.ok(catalog.records.some(record=>record.href===route),route);
});
