import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {renderCollections} from '../src/components/collections.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
import {detailNavigation} from '../scripts/detail-navigation.mjs';
import {buildSourceSearchCatalog} from './search-fixture.mjs';
const json=async name=>JSON.parse(await readFile(new URL('../src/'+name+'.json',import.meta.url),'utf8'));
const walk=nodes=>nodes.flatMap(n=>typeof n==='string'?[]:[n,...walk(n.children)]);
test('REST has one title track, a text-only entry and exactly two notice images without a standalone route',async()=>{
 const albums=await json('data/albums'),notices=await json('data/notices');
 const rest=albums.find(a=>a.id==='rest');assert(rest);assert.match(rest.bodyTemplateHtml,/2029\.11\.02/);assert.match(rest.bodyTemplateHtml,/NEXT TIME/);assert.equal((rest.bodyTemplateHtml.match(/<li/g)||[]).length,1);assert(!rest.bodyTemplateHtml.includes('<img'));
 const notice=notices.find(n=>n.id==='rest-release');assert.equal((notice.bodyTemplateHtml.match(/<img/g)||[]).length,2);assert.match(notice.bodyTemplateHtml,/discography\.html#rest/);
 assert(!(await readdir(new URL('../src/pages',import.meta.url))).includes('rest.json'));
 const p=await json('pages/discography');const html=renderCollections(p.contentHtml,{albums});assert(html.indexOf('id="rest"')<html.indexOf('id="paradox"'));assert(html.indexOf('id="paradox"')<html.indexOf('id="nightmare"'));
});
test('PARADOX retains 58 unique photos, five supplied tracks, date and five section anchors',async()=>{
 const p=await json('pages/paradox-2029');const nodes=walk(pageTree(p.contentHtml));const photos=nodes.filter(n=>(n.props.className||'').split(' ').includes('archive26-photo'));
 assert.equal(photos.length,58);assert.equal(new Set(photos.map(n=>n.props['data-full'])).size,58);
 assert.match(p.contentHtml,/2029\.08\.27/);for(const t of ['PROMISE','ARRIVAL','PARADISE','STRANGE','THRESHOLD'])assert.match(p.contentHtml,new RegExp('<strong>'+t+'</strong>'));
 assert.equal(detailNavigation(p).parent.href,'discography.html');assert.equal(detailNavigation(p).sections.length,5);
 assert(nodes.some(n=>n.props.id==='archive26Lightbox'));assert(!nodes.some(n=>n.tag==='audio'));
});
test('2029 notices are reachable through the year filter and REST and PARADOX are searchable',async()=>{
 const p=await json('pages/notice'),notices=await json('data/notices');const html=renderCollections(p.contentHtml,{notices});assert.match(html,/value="2029"/);assert(html.indexOf('id="rest-release"')<html.indexOf('id="paradox-release"'));
 const catalog=await buildSourceSearchCatalog();assert(catalog.records.some(r=>r.href==='discography.html#rest'));assert(catalog.records.some(r=>r.href==='paradox-2029.html'));
});
