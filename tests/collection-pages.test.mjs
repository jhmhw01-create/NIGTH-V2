import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {readPhotoEpisodes} from '../scripts/photo-episodes.mjs';
import {collectionRoutes,reactRoutes} from '../src/react/routes.mjs';
const root=new URL('../',import.meta.url);
test('WITH LUNA and IF NIGHT join 42 unique React routes',()=>{
  assert.deepEqual(collectionRoutes,['with-luna.html','if-night.html']);assert.equal(reactRoutes.length,42);assert.equal(new Set(reactRoutes).size,42);
});
test('all five members, eleven themes and 70 photos match canonical source data',async()=>{
  const data=await readPhotoEpisodes(root);
  const original=JSON.parse((await readFile(new URL('public/assets/js/night-collections-data.js',root),'utf8')).replace(/^window\.NightCollections\s*=\s*/,'').replace(/;\s*$/,''));
  assert.deepEqual(data.luna,original.luna);assert.deepEqual(data.gallery,original.gallery);
  assert.deepEqual(data.luna.map(member=>member.name),['DOHA','WOOHYUN','JIWOO','IHWAN','TAEHOON']);
  assert.equal(data.gallery.length,11);assert.ok(data.luna.every(member=>member.scenes.length===3));assert.ok(data.gallery.every(theme=>theme.images.length===5));
  const photos=[...data.luna.flatMap(member=>member.scenes),...data.gallery.flatMap(theme=>theme.images)];assert.equal(photos.length,70);
  await Promise.all(photos.flatMap(photo=>[photo.full,photo.thumb]).map(path=>access(new URL('public/'+path,root))));
});
