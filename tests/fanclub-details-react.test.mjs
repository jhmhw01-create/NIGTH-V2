import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fanclubDetailRoutes,reactRoutes} from '../src/react/routes.mjs';
import {archiveMarkup} from '../scripts/archive-markup.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
const walk=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...walk(node.children)]);
test('LUNA 4–6 and both season greetings remain in unique React routes',()=>{
  assert.equal(fanclubDetailRoutes.length,5);assert.equal(new Set(reactRoutes).size,reactRoutes.length);assert.ok(fanclubDetailRoutes.every(route=>reactRoutes.includes(route)));
  assert.ok(fanclubDetailRoutes.includes('season-greetings-2027.html'));assert.ok(fanclubDetailRoutes.includes('season-greetings-2028.html'));
});
test('fanclub details preserve all 93 photos and both season viewers',async()=>{
  let images=0,photos=0;
  for(const route of fanclubDetailRoutes){
    const page=JSON.parse(await readFile(new URL('../src/pages/'+route.replace('.html','.json'),import.meta.url),'utf8'));
    const before=walk(pageTree(page.contentHtml));const after=walk(pageTree(archiveMarkup(page)));
    const sources=nodes=>nodes.filter(node=>node.tag==='img'&&node.props.src).map(node=>node.props.src);
    assert.deepEqual(sources(after),sources(before),route);images+=sources(before).length;
    const full=nodes=>nodes.filter(node=>node.props['data-full']).map(node=>node.props['data-full']);
    assert.deepEqual(full(after),full(before));photos+=full(before).length;
    assert.equal(after.filter(node=>node.props.id==='sg-viewer').length,route.startsWith('season-')?1:0);
    assert.ok(!after.some(node=>node.tag==='script'));
  }
  assert.equal(images,93);assert.equal(photos,36);
});
