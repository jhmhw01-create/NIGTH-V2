import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {albumRoutes,reactRoutes} from '../src/react/routes.mjs';
import {albumMarkup} from '../scripts/album-markup.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
const walk=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...walk(node.children)]);
test('twelve album archives remain in unique React routes',()=>{
  assert.equal(albumRoutes.length,12);assert.equal(new Set(reactRoutes).size,reactRoutes.length);assert.ok(albumRoutes.every(route=>reactRoutes.includes(route)));
});
test('SOMETIME preserves all 107 unique archive images across six sections',async()=>{
  const page=JSON.parse(await readFile(new URL('../src/pages/sometime.json',import.meta.url),'utf8'));
  const nodes=walk(pageTree(page.contentHtml));
  const photos=nodes.filter(node=>(node.props.className??'').split(/\s+/).includes('archive26-photo'));
  assert.equal(photos.length,107);
  assert.equal(new Set(photos.map(node=>node.props['data-full'])).size,107);
  assert.equal(photos.filter(node=>node.props['data-full'].includes('/comeback/')).length,26);
  assert.equal(photos.filter(node=>node.props['data-full'].includes('/performance/')).length,6);
  for(const id of ['comeback','album','mv','performance','someday','somewhere']) assert.ok(nodes.some(node=>node.props.id===id));
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
test('first eager image is high priority while authored lazy images remain lazy',()=>{
  const eager=pageTree('<img src="hero.webp"><img src="detail.webp">');
  assert.equal(eager[0].props.fetchPriority,'high');
  assert.equal(eager[1].props.loading,'lazy');
  const lazy=pageTree('<img src="card.webp" loading="lazy">');
  assert.equal(lazy[0].props.fetchPriority,undefined);
  assert.equal(lazy[0].props.loading,'lazy');
});

test('all album detail routes receive the shared editorial stylesheet without replacing media',async()=>{
  const build=await readFile(new URL('../scripts/build-react.mjs',import.meta.url),'utf8');
  const css=await readFile(new URL('../public/assets/css/album-detail-fashion.css',import.meta.url),'utf8');
  assert.match(build,/albumRoutes\.includes\(route\).*album-detail-fashion\.css/);
  assert.match(build,/data-night-album-detail/);
  assert.match(css,/body\[data-night-album-detail\]/);
  assert.ok(!css.includes('url('));
  assert.match(css,/object-fit:contain/);
  assert.match(css,/\.stm-section \.archive26-photo span\{[^}]*background:/);
  assert.match(css,/@media\(max-width:600px\)/);
});
