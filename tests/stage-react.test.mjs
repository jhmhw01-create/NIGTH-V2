import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stageRoutes,reactRoutes} from '../src/react/routes.mjs';
import {archiveMarkup} from '../scripts/archive-markup.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
const walk=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...walk(node.children)]);
test('eight performance and broadcast archives join 30 React routes',()=>{
  assert.equal(stageRoutes.length,8);assert.equal(reactRoutes.length,30);assert.equal(new Set(reactRoutes).size,30);
});
test('performance records preserve every photo and original viewer variant',async()=>{
  let count=0;
  for(const route of stageRoutes){
    const page=JSON.parse(await readFile(new URL('../src/pages/'+route.replace('.html','.json'),import.meta.url),'utf8'));
    const before=walk(pageTree(page.contentHtml));const after=walk(pageTree(archiveMarkup(page)));
    const photos=nodes=>nodes.filter(node=>node.props['data-full']).map(node=>node.props['data-full']);
    assert.deepEqual(photos(after),photos(before));count+=photos(before).length;
    assert.equal(after.filter(node=>['archive26Lightbox','fmLightbox','sg-viewer'].includes(node.props.id)).length,photos(before).length?1:0,route);
    assert.ok(!after.some(node=>node.tag==='script'));
  }
  assert.equal(count,144);
});
test('unexpected archive footer markup is rejected',()=>{
  assert.throws(()=>archiveMarkup({route:'unknown.html',contentHtml:'<main></main>',afterFooterHtml:'<div>unknown</div>'}),/Unexpected archive footer/);
});
