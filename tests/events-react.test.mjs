import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {eventRoutes,reactRoutes} from '../src/react/routes.mjs';
import {archiveMarkup} from '../scripts/archive-markup.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
const root=new URL('../',import.meta.url);
const walk=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...walk(node.children)]);
test('three event archives remain in unique React routes',()=>{
  assert.deepEqual(eventRoutes,['fansign-20260919.html','birthday-cafes-2026-2027.html','fifth-anniversary-2027.html']);assert.equal(new Set(reactRoutes).size,reactRoutes.length);assert.ok(eventRoutes.every(route=>reactRoutes.includes(route)));
});
test('all 93 event photos, links and existing viewer variants are preserved',async()=>{
  let total=0;
  for(const route of eventRoutes){
    const page=JSON.parse(await readFile(new URL('src/pages/'+route.replace('.html','.json'),root),'utf8'));
    const before=walk(pageTree(page.contentHtml)),after=walk(pageTree(archiveMarkup(page)));
    const paths=nodes=>nodes.filter(node=>node.props['data-full']).map(node=>node.props['data-full']);
    assert.deepEqual(paths(after),paths(before));total+=paths(before).length;assert.equal(new Set(paths(after)).size,paths(after).length);
    const links=nodes=>nodes.filter(node=>node.tag==='a').map(node=>node.props.href);assert.deepEqual(links(after),links(before));
    assert.equal(after.filter(node=>['archive26Lightbox','fansignLightbox'].includes(node.props.id)).length,1);
    await Promise.all(paths(after).map(path=>access(new URL('public/'+path,root))));
  }
  assert.equal(total,93);
});
