import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile,readdir} from 'node:fs/promises';
import {stageRoutes} from '../src/react/routes.mjs';

const root=new URL('../',import.meta.url);
const routes=['doha-taehoon-mariners-2030.html','ihwan-mariners-2030.html','jiwoo-woohyun-mariners-2030.html'];
const expected={
  'doha-taehoon-mariners-2030.html':['01-doha-taehoon-pre-game-practice.webp','02-doha-first-pitch.webp','03-taehoon-first-hit.webp','04-doha-taehoon-after-ceremony.webp'],
  'ihwan-mariners-2030.html':['ihwan-before-national-anthem.webp','ihwan-national-anthem-main.webp','ihwan-greeting-after-anthem.webp'],
  'jiwoo-woohyun-mariners-2030.html':['05-jiwoo-woohyun-pre-game-practice.webp','06-jiwoo-first-pitch.webp','07-woohyun-first-hit.webp','08-jiwoo-woohyun-after-ceremony.webp']
};
const readPage=async route=>JSON.parse(await readFile(new URL(`src/pages/${route.replace('.html','.json')}`,root),'utf8'));

test('three MARINERS event routes use all eleven uploaded images in confirmed order',async()=>{
  const used=[];
  for(const route of routes){
    const page=await readPage(route);
    const files=[...page.contentHtml.matchAll(/assets\/images\/night-baseball\/([^"']+\.webp)/g)].map(match=>match[1]);
    assert.deepEqual(files,expected[route]);used.push(...files);
    assert.equal((page.contentHtml.match(/loading="eager"/g)||[]).length,1);
    assert.equal((page.contentHtml.match(/loading="lazy"/g)||[]).length,files.length-1);
    assert.match(page.contentHtml,/archive-new-grid--natural-images/);
    assert.ok(stageRoutes.includes(route));
  }
  const inventory=(await readdir(new URL('public/assets/images/night-baseball/',root))).filter(file=>file.endsWith('.webp')).sort();
  assert.equal(inventory.length,11);assert.deepEqual([...used].sort(),inventory);
  await Promise.all(inventory.map(file=>access(new URL(`public/assets/images/night-baseball/${file}`,root))));
});

test('event pages contain only confirmed dates, roles and neutral records',async()=>{
  const pages=await Promise.all(routes.map(readPage));
  const all=pages.map(page=>page.contentHtml).join('\n');
  for(const value of ['2030.05.18','2030.07.20','2030.09.07','INCHEON MARINERS','시구 — DOHA','시타 — TAEHOON','경기 전 애국가 제창','시구 — JIWOO','시타 — WOOHYUN'])assert.match(all,new RegExp(value));
  assert.doesNotMatch(all,/구장|상대 구단|경기 결과|스코어|관중 수|KBO|방송사|감독|리그|초청 배경|인터뷰/);
  const css=await readFile(new URL('public/assets/css/mariners-event.css',root),'utf8');
  assert.match(css,/mariners-event-page/);assert.match(css,/grid-template-columns:1fr/);assert.doesNotMatch(css,/object-fit:cover|height:\d+px/);
});

test('MARINERS events stay out of CONTENTS and are linked from 2030 HISTORY',async()=>{
  const contents=JSON.parse(await readFile(new URL('src/data/contentsEntries.json',root),'utf8'));
  assert.ok(routes.every(route=>!contents.some(entry=>entry.href===route)));
  const history=(await readPage('history.html')).contentHtml;
  for(const route of routes)assert.match(history,new RegExp(`href="${route.replaceAll('.','\\.')}"`));
});
