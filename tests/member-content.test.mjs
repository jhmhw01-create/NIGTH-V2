import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile,readdir} from 'node:fs/promises';
import {memberContentRoutes} from '../src/react/routes.mjs';

const root=new URL('../',import.meta.url);
const members=['doha','woohyun','jiwoo','ihwan','taehoon'];
const readPage=async route=>JSON.parse(await readFile(new URL(`src/pages/${route.replace('.html','.json')}`,root),'utf8'));

test('member content routes use all 30 supplied WebP assets once',async()=>{
  assert.deepEqual(memberContentRoutes,['nights-closet.html','night-files.html']);
  const closet=await readPage('nights-closet.html');
  const files=await readPage('night-files.html');
  const groups=[['nights-closet',closet,5],['member-misc',files,20],['night-camera-roll',files,5]];
  for(const [directory,page,count] of groups){
    const inventory=(await readdir(new URL(`public/assets/images/${directory}/`,root))).filter(file=>file.endsWith('.webp')).sort();
    const references=[...page.contentHtml.matchAll(new RegExp(`assets/images/${directory}/([^\"']+\\.webp)`,'g'))].map(match=>match[1]).sort();
    assert.equal(inventory.length,count);assert.deepEqual(references,inventory);
    await Promise.all(inventory.map(file=>access(new URL(`public/assets/images/${directory}/${file}`,root))));
  }
});

test("NIGHT'S CLOSET preserves member order, natural ratios and loading policy",async()=>{
  const page=await readPage('nights-closet.html');
  const positions=members.map(member=>page.contentHtml.indexOf(`nights-closet-${member}.webp`));
  assert.ok(positions.every(position=>position>=0));assert.deepEqual([...positions].sort((a,b)=>a-b),positions);
  assert.equal((page.contentHtml.match(/loading=\"eager\"/g)||[]).length,1);
  assert.equal((page.contentHtml.match(/loading=\"lazy\"/g)||[]).length,4);
  assert.doesNotMatch(page.contentHtml,/브랜드|가격|협찬|소장품|패션 철학/);
});

test('NIGHT FILES preserves theme and member order with neutral metadata',async()=>{
  const page=await readPage('night-files.html');
  const themes=['selfie-sequence','outfit-match','four-cut','profile-photo-history','camera-roll'];
  let cursor=-1;
  for(const theme of themes){
    const sectionStart=page.contentHtml.indexOf(`id=\"${theme}\"`);assert.ok(sectionStart>cursor);cursor=sectionStart;
    const section=page.contentHtml.slice(sectionStart,page.contentHtml.indexOf('</section>',sectionStart));
    const positions=members.map(member=>section.indexOf(theme==='camera-roll'?`night-camera-roll-${member}.webp`:`${member}-${theme}.webp`));
    assert.ok(positions.every(position=>position>=0));assert.deepEqual([...positions].sort((a,b)=>a-b),positions);
  }
  assert.equal((page.contentHtml.match(/loading=\"eager\"/g)||[]).length,1);
  assert.equal((page.contentHtml.match(/loading=\"lazy\"/g)||[]).length,24);
  assert.doesNotMatch(page.contentHtml,/기밀|유출|성향 분석|데이터베이스/);
});

test('member content styling is scoped, natural and responsive',async()=>{
  const css=await readFile(new URL('public/assets/css/member-content.css',root),'utf8');
  assert.match(css,/member-content-page/);assert.match(css,/width:100%;height:auto/);
  assert.match(css,/@media\(max-width:900px\)/);assert.match(css,/@media\(max-width:520px\)/);
  assert.doesNotMatch(css,/object-fit:cover|aspect-ratio|height:\d+px/);
});

test('member content is data-driven in CONTENTS and excluded from unrelated areas',async()=>{
  const contents=JSON.parse(await readFile(new URL('src/data/contentsEntries.json',root),'utf8'));
  for(const route of memberContentRoutes){
    const matches=contents.filter(entry=>entry.href===route);
    assert.equal(matches.length,1);assert.equal(matches[0].category,'daily');assert.equal(matches[0].date,null);
  }
  for(const path of ['src/pages/history.json','src/pages/discography.json','src/pages/notice.json']){
    const source=await readFile(new URL(path,root),'utf8');
    for(const route of memberContentRoutes)assert.doesNotMatch(source,new RegExp(route.replaceAll('.','\\.')));
  }
});
