import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {taehoonCameraTitle,taehoonCameraEpisodes,taehoonCameraPhotoCount} from '../src/data/taehoonCamera.mjs';
import {personalRoutes,reactRoutes} from '../src/react/routes.mjs';
import {syncHubPage} from '../scripts/hub-sync.mjs';
import {enhanceHead} from '../src/components/layout.mjs';
import {buildSearchCatalog} from '../scripts/search-catalog.mjs';
import {searchRecords} from '../src/react/search.mjs';
const root=new URL('../',import.meta.url),route='taehoon-camera-on-off.html';
const page=JSON.parse(await readFile(new URL('src/pages/taehoon-camera-on-off.json',root),'utf8'));

test('TAEHOON camera archive maps exactly the uploaded 35 photos with explicit episode picks',async()=>{
  assert.equal(taehoonCameraTitle,'태훈의 카메라 ON-OFF');assert.equal(taehoonCameraPhotoCount,35);
  assert.deepEqual(taehoonCameraEpisodes.map(e=>e.images.length),[6,6,5,6,6,6]);
  assert.deepEqual(taehoonCameraEpisodes.map(e=>e.pick),[6,6,5,6,6,6]);
  const all=[];
  for(const episode of taehoonCameraEpisodes){
    const inventory=(await readdir(new URL('public/assets/images/taehoon-camera-on-off/'+episode.id+'/',root))).sort();
    assert.deepEqual(episode.images.map(image=>image.src.split('/').at(-1)),inventory);
    assert.equal(episode.images.filter(image=>image.number===episode.pick).length,1);
    assert.deepEqual(episode.images.map(image=>image.number),Array.from({length:episode.images.length},(_,i)=>i+1));
    for(const image of episode.images){assert((await stat(new URL('public/'+image.src,root))).size>0);all.push(image.src);}
  }
  assert.equal(new Set(all).size,35);
});

test('TAEHOON member entry follows KEYWORDS and precedes member navigation without duplication',async()=>{
  const source=JSON.parse(await readFile(new URL('src/pages/member-taehoon.json',root),'utf8'));
  const synced=syncHubPage(source),markup=synced.contentHtml;
  assert(markup.indexOf('member-highlights-section')<markup.indexOf('taehoon-personal-schedule'));
  assert(markup.indexOf('taehoon-personal-schedule')<markup.indexOf('member-switch-section'));
  assert.match(markup.replace(/<[^>]+>/g,''),/태훈의 카메라 ON-OFF/);assert.match(markup,/href="taehoon-camera-on-off.html"/);
  assert.equal(syncHubPage(synced).contentHtml,markup);
});

test('TAEHOON has one canonical route, neutral metadata and a stories search record for all required terms',()=>{
  assert(personalRoutes.includes(route));assert.equal(reactRoutes.filter(r=>r===route).length,1);
  const head=enhanceHead(page);assert.match(head,/rel="canonical" href="https:\/\/jhmhw01-create.github.io\/NIGTH-V2\/taehoon-camera-on-off.html"/);
  assert.match(head,/og:image:width" content="1536/);assert.match(head,/og:image:height" content="1024/);
  const copy=page.headHtml.match(/<title>(.*?)<\/title>/)[1]+page.headHtml.match(/name="description" content="([^"]*)"/)[1];
  assert.doesNotMatch(copy,/20\d\d|EVERY|CAMERA · CONTENT|TAEHOON.S CAMERA ON-OFF/);
  const catalog=buildSearchCatalog({routes:[route],documents:{[route]:{headHtml:page.headHtml,markup:page.contentHtml}},albums:[]});
  assert.equal(catalog.records[0].category,'stories');
  for(const query of ['TAEHOON','태훈','태훈의 카메라 ON-OFF'])assert(searchRecords(catalog,{query}).some(record=>record.href===route));
});
