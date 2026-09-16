import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {storyRoutes,reactRoutes} from '../src/react/routes.mjs';
import {archiveMarkup} from '../scripts/archive-markup.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
const walk=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...walk(node.children)]);
test('four story archives remain in unique React routes',()=>{
  assert.deepEqual(storyRoutes,['behind.html','travel.html','observation-2027.html','night-off-summer.html']);
  assert.equal(new Set(reactRoutes).size,reactRoutes.length);assert.ok(storyRoutes.every(route=>reactRoutes.includes(route)));
});
test('all 101 story photos keep their full and thumbnail paths and viewer styles',async()=>{
  let count=0;
  for(const route of storyRoutes){
    const page=JSON.parse(await readFile(new URL('../src/pages/'+route.replace('.html','.json'),import.meta.url),'utf8'));
    const original=walk(pageTree(page.contentHtml));const converted=walk(pageTree(archiveMarkup(page)));
    const photos=nodes=>nodes.filter(node=>node.props['data-full']).map(node=>node.props['data-full']);
    assert.deepEqual(photos(converted),photos(original));count+=photos(original).length;
    const images=nodes=>nodes.filter(node=>node.tag==='img'&&node.props.src).map(node=>node.props.src);
    assert.deepEqual(images(converted),images(original));
    assert.equal(converted.filter(node=>['behindLightbox','travelLightbox','archive26Lightbox'].includes(node.props.id)).length,1);
  }
  assert.equal(count,101);
});
