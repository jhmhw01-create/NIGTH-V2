import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {pageTree} from '../scripts/page-tree.mjs';

const page=JSON.parse(await readFile(new URL('../src/pages/doha-play-on.json',import.meta.url),'utf8'));
const nodes=pageTree(page.contentHtml);
const walk=items=>items.flatMap(item=>typeof item==='string'?[]:[item,...walk(item.children)]);
const all=walk(nodes);
const photos=all.filter(node=>(node.props.className||'').split(/\s+/).includes('play-on-photo'));

test('DOHA PLAY ON keeps all 27 photos in filename order across five chapters',async()=>{
  assert.equal(photos.length,27);
  const paths=photos.map(node=>node.props['data-full']);
  assert.deepEqual(paths.map(path=>Number(path.split('/').at(-1).slice(0,2))),Array.from({length:27},(_,index)=>index+1));
  assert.equal(new Set(paths).size,27);
  await Promise.all(paths.map(path=>access(new URL('../public/'+path,import.meta.url))));
  const chapters=all.filter(node=>(node.props.className||'').split(/\s+/).includes('play-on-chapter'));
  assert.deepEqual(chapters.map(node=>node.props.id),['first-call-up','earning-his-place','part-of-the-team','friend-or-rival','five-minutes']);
});

test('PLAY ON uses a two-column responsive grid and the authored highlights only',()=>{
  for(const index of [0,7,26])assert.match(photos[index].props.className,/play-on-featured/);
  assert.equal(photos.filter(photo=>/play-on-featured/.test(photo.props.className)).length,3);
  assert.match(page.headHtml,/\.play-on-grid\.fansign-grid\{grid-template-columns:repeat\(2/);
  assert.match(page.headHtml,/@media\(max-width:720px\)/);
  assert.match(page.headHtml,/\.play-on-grid\.fansign-grid\{grid-template-columns:1fr/);
  assert.match(page.headHtml,/\.play-on-photo img\{display:block;width:100%;height:auto;aspect-ratio:auto;object-fit:contain/);
  assert.match(page.contentHtml,/“다음 주에도 와.”/);
  assert.match(page.contentHtml,/5 MINUTES LEFT/);
  assert.equal(all.filter(node=>node.props.id==='fansignLightbox').length,1);
});
