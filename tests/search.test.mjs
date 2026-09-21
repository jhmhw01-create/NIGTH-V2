import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {archiveState,searchRecords} from '../src/react/search.mjs';
import {reactRoutes} from '../src/react/routes.mjs';
import {buildSearchCatalog,searchLabels} from '../scripts/search-catalog.mjs';

const albums=JSON.parse(await readFile(new URL('../src/data/albums.json',import.meta.url),'utf8'));
const documents={};
for(const route of reactRoutes){
  const page=JSON.parse(await readFile(new URL('../src/pages/'+route.replace('.html','.json'),import.meta.url),'utf8'));
  documents[route]={headHtml:page.headHtml,markup:page.contentHtml};
}
const catalog=buildSearchCatalog({routes:reactRoutes,documents,albums});

test('search catalog is generated from every current route and album anchor',()=>{
  assert.equal(catalog.records.length,reactRoutes.length+albums.length);
  assert.deepEqual(catalog.labels,searchLabels);
  assert.equal(Object.keys(catalog.labels).length,7);
  for(const route of reactRoutes)assert.ok(catalog.records.some(record=>record.href===route),route);
  for(const album of albums)assert.ok(catalog.records.some(record=>record.href==='discography.html#'+album.id),'discography.html#'+album.id);
  assert.equal(new Set(catalog.records.map(record=>record.id)).size,catalog.records.length);
  assert.equal(new Set(catalog.records.map(record=>record.href)).size,catalog.records.length);
});

test('archive search normalizes query and matches generated current content',()=>{
  assert.deepEqual(searchRecords(catalog,{query:'ＮＩＧＨＴ'}),searchRecords(catalog,{query:'night'}));
  assert.ok(searchRecords(catalog,{query:'after hours'}).some(record=>record.href==='discography.html#after-hours'||record.href==='after-hours.html'));
  assert.ok(searchRecords(catalog,{query:'night off summer'}).some(record=>record.href==='night-off-summer.html'));
  assert.equal(searchRecords(catalog,{query:'impossible-query-99999'}).length,0);
});

test('search summaries use authored content without layout or template residue',()=>{
  const sample=buildSearchCatalog({
    routes:['sample.html'],
    documents:{'sample.html':{headHtml:'<title>Sample</title>',markup:'<header>COMMON NAVIGATION</header><main><h1>Page heading</h1><p>Useful page summary.</p></main><footer>COMMON FOOTER</footer>'}},
    albums:[{id:'sample-album',title:'SAMPLE ALBUM',bodyTemplateHtml:'<h2>{{title}}</h2><p>Album summary.</p>'}]
  });
  const page=sample.records.find(record=>record.id==='sample');
  const album=sample.records.find(record=>record.id==='discography-sample-album');
  assert.match(page.summary,/Page heading Useful page summary/);
  assert.doesNotMatch(page.searchText,/COMMON NAVIGATION|COMMON FOOTER/);
  assert.match(album.summary,/SAMPLE ALBUM Album summary/);
  assert.doesNotMatch(album.summary,/\{\{title\}\}/);
  for(const record of catalog.records)assert.doesNotMatch(record.summary,/\{\{title\}\}/);
});

test('member search records are derived from the current canonical profile pages',()=>{
  const members=['member-doha','member-woohyun','member-jiwoo','member-ihwan','member-taehoon'];
  const records=Object.fromEntries(catalog.records.filter(record=>members.includes(record.id)).map(record=>[record.id,record]));
  assert.equal(Object.keys(records).length,5);
  assert.match(records['member-doha'].searchText,/3남 2녀의 장남/);
  assert.match(records['member-woohyun'].searchText,/‘야하다’, ‘위험하다’/);
  assert.match(records['member-jiwoo'].searchText,/가까워지는 것과 선을 넘는 것은 전혀 다른 일이다/);
  assert.match(records['member-taehoon'].searchText,/친구가 많은 편이며/);
  for(const record of Object.values(records))assert.doesNotMatch(record.searchText,/\bAGE\d+\b|옆집 누나|소꿉친구|짝사랑/);
  assert.ok(!catalog.records.some(record=>record.id==='member-taehun'));
});

test('archive URL state validates category and sort',()=>{
  assert.deepEqual(archiveState('?q=DOHA&category=group&sort=title',catalog.labels),{query:'DOHA',category:'group',sort:'title'});
  assert.deepEqual(archiveState('?category=invalid&sort=invalid',catalog.labels),{query:'',category:'all',sort:'category'});
  const sorted=searchRecords(catalog,{sort:'title'});
  assert.ok(sorted.slice(1).every((record,index)=>sorted[index].title.localeCompare(record.title,'ko')<=0));
});

test('React build no longer reads a hand-maintained archive catalog',async()=>{
  const buildSource=await readFile(new URL('../scripts/build-react.mjs',import.meta.url),'utf8');
  assert.doesNotMatch(buildSource,/src\/data\/archive\.json|archive\.json/);
  assert.match(buildSource,/buildSearchCatalog/);
});
