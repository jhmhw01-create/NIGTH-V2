import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {vlogEpisodes,expandVlog,sceneAt,clampTime,clock} from '../src/react/photo-data.mjs';
import {parsePhotoEpisodes,readPhotoEpisodes} from '../scripts/photo-episodes.mjs';
import {playerRoutes,reactRoutes} from '../src/react/routes.mjs';
const root=new URL('../',import.meta.url);
test('both player routes remain in unique React routes',()=>{
  assert.deepEqual(playerRoutes,['vlog.html','night-originals.html']);assert.equal(new Set(reactRoutes).size,reactRoutes.length);assert.ok(playerRoutes.every(route=>reactRoutes.includes(route)));
});
test('VLOG metadata exactly matches the six original episodes',async()=>{
  const source=await readFile(new URL('public/assets/js/vlog.js',root),'utf8');
  const literal=source.match(/const episodes = (\[[\s\S]*?\]);/)[1];
  const original=JSON.parse(JSON.stringify(runInNewContext('('+literal+')',{}, {timeout:100})));
  assert.deepEqual(vlogEpisodes,original);
  assert.equal(vlogEpisodes.reduce((sum,item)=>sum+item.count,0),55);
});
test('all photo episodes and thumbnail paths exist without media changes',async()=>{
  const data=await readPhotoEpisodes(root);assert.equal(data.originals.length,5);assert.equal(data.originals.reduce((sum,item)=>sum+item.scenes.length,0),34);assert.equal(data.flowers.length,6);
  const photos=[...vlogEpisodes.map(expandVlog).flatMap(item=>item.scenes),...data.originals.flatMap(item=>[...item.scenes,...item.extras]),...data.flowers];
  await Promise.all(photos.flatMap(photo=>[photo.full,photo.thumb]).map(path=>access(new URL('public/'+path,root))));
  assert.throws(()=>parsePhotoEpisodes('window.NightCollections = {};'),/Missing/);
});
test('six-second scene boundaries and seeking clamp correctly',()=>{
  assert.equal(sceneAt(5.9,6),0);assert.equal(sceneAt(6,6),1);assert.equal(sceneAt(36,6),5);assert.equal(sceneAt(-1,6),0);
  assert.equal(clampTime(99,36),36);assert.equal(clampTime(-1,36),0);assert.equal(clampTime(NaN,36),0);assert.equal(clock(78),'01:18');
});
