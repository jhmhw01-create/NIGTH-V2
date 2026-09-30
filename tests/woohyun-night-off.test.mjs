import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {woohyunNightOff,woohyunNightOffImages} from '../src/data/woohyunNightOff.mjs';
import {personalRoutes,reactRoutes} from '../src/react/routes.mjs';
import {syncHubPage} from '../scripts/hub-sync.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));

test('WOOHYUN NIGHT OFF keeps the confirmed program and weekly schedule',()=>{
  assert.deepEqual(woohyunNightOff.program,{title:"WOOHYUN'S NIGHT OFF",koreanTitle:'우현의 나이트 오프',period:'2027 — 2029',schedule:'EVERY FRIDAY · 10 PM',host:'HOSTED BY WOOHYUN',intro:woohyunNightOff.program.intro});
  assert.deepEqual(woohyunNightOff.schedule.map(group=>({weeks:group.weeks,parts:group.parts.map(({part,title})=>({part,title}))})),[
    {weeks:'1·3주',parts:[{part:'1부',title:'사연 읽어주는 남자'},{part:'2부',title:'다짜고짜 퀴즈'}]},
    {weeks:'2·4주',parts:[{part:'1부',title:'시 읽어드립니다'},{part:'2부',title:'오늘의 트렌드'}]}
  ]);
  assert.deepEqual(woohyunNightOff.corners.map(({weeks,part,title})=>({weeks,part,title})),[
    {weeks:'1·3주',part:'1부',title:'사연 읽어주는 남자'},{weeks:'1·3주',part:'2부',title:'다짜고짜 퀴즈'},{weeks:'2·4주',part:'1부',title:'시 읽어드립니다'},{weeks:'2·4주',part:'2부',title:'오늘의 트렌드'}
  ]);
});

test('all nine radio images map exactly once to the confirmed moments',async()=>{
  assert.equal(woohyunNightOff.moments.length,9);
  assert.equal(new Set(woohyunNightOffImages).size,9);
  assert.deepEqual(woohyunNightOff.moments.map(({number,label})=>({number,label})),[
    {number:1,label:'ON AIR'},{number:3,label:'STORY NIGHT'},{number:2,label:'READING NIGHT'},{number:4,label:'WITH DOHA'},{number:5,label:'WITH IHWAN'},{number:6,label:'DRAMA NIGHT'},{number:7,label:"TODAY'S TREND"},{number:8,label:'CHALLENGE TIME'},{number:9,label:'NIGHT TOGETHER'}
  ]);
  assert.deepEqual([...woohyunNightOff.moments].sort((a,b)=>a.number-b.number).map(moment=>moment.image),Array.from({length:9},(_,index)=>{const names=['on-air','reading-night','story-night','with-doha','with-ihwan','drama-night','todays-trend','challenge-time','night-together'];return `assets/images/woohyun/radio/woohyun-night-off-${String(index+1).padStart(2,'0')}-${names[index]}.webp`;}));
  await Promise.all(woohyunNightOffImages.map(image=>access(join(root,'public',image))));
});

test('WOOHYUN member links to NIGHT OFF immediately after keywords',async()=>{
  assert.ok(personalRoutes.includes('woohyun-night-off.html'));
  assert.ok(reactRoutes.includes('woohyun-night-off.html'));
  const page=JSON.parse(await readFile(join(root,'src/pages/member-woohyun.json'),'utf8'));
  const synced=syncHubPage(page);
  assert.match(synced.contentHtml,/PERSONAL SCHEDULE/);
  assert.match(synced.contentHtml,/<h2 id="woohyun-personal-schedule">RADIO<\/h2>/);
  assert.match(synced.contentHtml,/WOOHYUN'S NIGHT OFF/);
  assert.match(synced.contentHtml,/href="woohyun-night-off\.html"/);
  assert.match(synced.contentHtml,/VIEW NIGHT OFF →/);
  const keywordIndex=synced.contentHtml.indexOf('member-highlights-section');
  const radioIndex=synced.contentHtml.indexOf('woohyun-personal-schedule');
  const switchIndex=synced.contentHtml.indexOf('member-switch-section');
  assert.ok(keywordIndex<radioIndex&&radioIndex<switchIndex);
});

test('NIGHT OFF styles preserve image ratios and collapse layouts without horizontal overflow',async()=>{
  const css=await readFile(join(root,'public/assets/css/woohyun-night-off.css'),'utf8');
  assert.match(css,/\.night-off-moment img\{[^}]*width:100%;height:auto/);
  assert.match(css,/\.night-off-schedule\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/@media\(max-width:600px\)[\s\S]*\.night-off-moments-grid\{grid-template-columns:1fr/);
  assert.match(css,/\.night-off-archive\{overflow:clip/);
  assert.doesNotMatch(css,/object-fit\s*:\s*cover/);
});

test('NIGHT OFF source includes only confirmed program sections',async()=>{
  const source=await readFile(join(root,'src/react/WoohyunNightOffPage.jsx'),'utf8');
  assert.match(source,/PROGRAM INTRO/);assert.match(source,/WEEKLY CORNERS/);assert.match(source,/GUESTS &amp; VISIBLE RADIO/);assert.match(source,/NIGHT OFF MOMENTS/);
  const data=await readFile(join(root,'src/data/woohyunNightOff.mjs'),'utf8');
  assert.doesNotMatch(data,/주파수|청취율|수상|협찬|방송국명|제작진|첫 방송 날짜|마지막 방송 날짜/);
});
