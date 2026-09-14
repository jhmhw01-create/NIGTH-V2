import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {editorialRoutes,reactRoutes} from '../src/react/routes.mjs';
import {archiveMarkup} from '../scripts/archive-markup.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
const walk=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...walk(node.children)]);
test('PRESS and FIVE VOICES remain in unique React routes',()=>{
  assert.deepEqual(editorialRoutes,['press.html','five-voices.html']);assert.equal(new Set(reactRoutes).size,reactRoutes.length);assert.ok(editorialRoutes.every(route=>reactRoutes.includes(route)));
});
test('editorial conversion preserves all authored articles and interview photos',async()=>{
  for(const route of editorialRoutes){
    const page=JSON.parse(await readFile(new URL('../src/pages/'+route.replace('.html','.json'),import.meta.url),'utf8'));
    const original=walk(pageTree(page.contentHtml)),converted=walk(pageTree(archiveMarkup(page)));
    const sources=nodes=>nodes.filter(node=>node.tag==='img'&&node.props.src).map(node=>node.props.src);
    const links=nodes=>nodes.filter(node=>node.tag==='a').map(node=>node.props.href);
    assert.deepEqual(sources(converted),sources(original));assert.deepEqual(links(converted),links(original));
    if(route==='press.html'){assert.equal(converted.filter(node=>node.tag==='details').length,4);assert.equal(converted.filter(node=>node.tag==='article').length,original.filter(node=>node.tag==='article').length);}
    else{assert.equal(converted.filter(node=>node.props['data-full']).length,6);assert.equal(converted.filter(node=>node.props.id==='fv-viewer').length,1);}
    assert.ok(!converted.some(node=>node.tag==='script'));
  }
});
