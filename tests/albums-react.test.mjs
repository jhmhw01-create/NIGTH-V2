import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {albumRoutes,reactRoutes} from '../src/react/routes.mjs';
import {albumMarkup} from '../scripts/album-markup.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
const walk=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...walk(node.children)]);
test('nine album archives remain in unique React routes',()=>{
  assert.equal(albumRoutes.length,9);assert.equal(new Set(reactRoutes).size,reactRoutes.length);assert.ok(albumRoutes.every(route=>reactRoutes.includes(route)));
});
test('album conversion preserves photos and exactly one authored dialog where needed',async()=>{
  for(const route of albumRoutes){
    const page=JSON.parse(await readFile(new URL('../src/pages/'+route.replace('.html','.json'),import.meta.url),'utf8'));
    const original=walk(pageTree(page.contentHtml));const converted=walk(pageTree(albumMarkup(page)));
    const photos=nodes=>nodes.filter(node=>(node.props.className??'').split(/\s+/).includes('archive26-photo')).map(node=>node.props['data-full']);
    assert.deepEqual(photos(converted),photos(original));
    assert.equal(converted.filter(node=>node.props.id==='archive26Lightbox').length,photos(original).length?1:0,route);
    assert.ok(!converted.some(node=>node.tag==='script'));
    assert.ok(converted.some(node=>node.tag==='main'));
  }
});
test('album footer conversion fails on unexpected markup',()=>{
  assert.throws(()=>albumMarkup({route:'unexpected.html',contentHtml:'<main></main>',afterFooterHtml:'<div>unknown</div>'}),/Unexpected album footer/);
});
test('album hero loading priority uses the React attribute name',()=>{
  assert.equal(pageTree('<img fetchpriority="high">')[0].props.fetchPriority,'high');
});
