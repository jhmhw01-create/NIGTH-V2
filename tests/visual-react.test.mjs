import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {visualRoutes,reactRoutes} from '../src/react/routes.mjs';
import {archiveMarkup} from '../scripts/archive-markup.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
const root=new URL('../',import.meta.url);
const walk=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...walk(node.children)]);
test('visual and fashion archives remain in unique React routes',()=>{
  assert.deepEqual(visualRoutes,['debut-archive.html','out-of-frame.html','social-archive.html','fashion-week-2030.html','night-selfie-archive.html','member-fragrance-match.html','luxury-brand-ambassador-2030.html','after-hours-photobook.html']);assert.equal(new Set(reactRoutes).size,reactRoutes.length);assert.ok(visualRoutes.every(route=>reactRoutes.includes(route)));
});
test('all 113 visual archive images and social photo viewer are preserved',async()=>{
  let total=0;
  for(const route of visualRoutes){
    const page=JSON.parse(await readFile(new URL('src/pages/'+route.replace('.html','.json'),root),'utf8'));
    const before=walk(pageTree(page.contentHtml)),after=walk(pageTree(archiveMarkup(page)));
    const sources=nodes=>nodes.filter(node=>node.tag==='img'&&node.props.src).map(node=>node.props.src);
    assert.deepEqual(sources(after),sources(before));total+=sources(after).length;
    const links=nodes=>nodes.filter(node=>node.tag==='a').map(node=>node.props.href);assert.deepEqual(links(after),links(before));
    if(route==='social-archive.html'){assert.equal(after.filter(node=>node.props.id==='sg-viewer').length,1);assert.equal(after.filter(node=>node.props['data-full']).length,33);}
    await Promise.all(sources(after).map(path=>access(new URL('public/'+path,root))));
  }
  assert.equal(total,113);
});
