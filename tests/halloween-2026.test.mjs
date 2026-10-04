import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile,readdir} from 'node:fs/promises';
import {visualRoutes,reactRoutes} from '../src/react/routes.mjs';
import {buildSearchCatalog} from '../scripts/search-catalog.mjs';

const root=new URL('../',import.meta.url);
const page=JSON.parse(await readFile(new URL('src/pages/halloween-2026.json',root),'utf8'));
const entries=JSON.parse(await readFile(new URL('src/data/contentsEntries.json',root),'utf8'));
const directory='HALLOWEEN_COSTUME';
const images=[...page.contentHtml.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)].map(match=>match[1]);

test('HALLOWEEN 2026 is one canonical visual route with one CONTENTS entry',()=>{
  assert.equal(page.route,'halloween-2026.html');
  assert.ok(visualRoutes.includes(page.route));
  assert.ok(reactRoutes.includes(page.route));
  assert.equal(entries.filter(entry=>entry.href===page.route).length,1);
  assert.equal(entries.find(entry=>entry.href===page.route)?.category,'editorial');
  assert.equal(entries.find(entry=>entry.href===page.route)?.year,2026);
  assert.ok(!reactRoutes.includes('halloween-costume-party-2026.html'));
  assert.equal(entries.filter(entry=>/halloween-costume-party/i.test(entry.href)).length,0);
});

test('all 12 supplied WebP files are used once with natural dimensions and loading policy',async()=>{
  const inventory=(await readdir(new URL(`public/assets/images/${directory}/`,root))).filter(file=>file.endsWith('.webp')).sort();
  const references=images.map(path=>path.slice(`assets/images/${directory}/`.length)).sort();
  assert.equal(inventory.length,12);
  assert.deepEqual(references,inventory);
  await Promise.all(inventory.map(file=>access(new URL(`public/assets/images/${directory}/${file}`,root))));
  assert.equal((page.contentHtml.match(/loading="eager"/g)||[]).length,1);
  assert.equal((page.contentHtml.match(/loading="lazy"/g)||[]).length,11);
  assert.equal((page.contentHtml.match(/width="2172" height="724"/g)||[]).length,2);
  assert.equal((page.contentHtml.match(/width="1024" height="1536"/g)||[]).length,10);
  assert.match(page.contentHtml,/archive-new-grid--natural-images/);
});

test('both collections preserve confirmed member and costume order without an invented date',()=>{
  const expected=[
    ['HALLOWEEN 2026','DOHA','WEREWOLF','WOOHYUN','VAMPIRE','JIWOO','GRIM REAPER','IHWAN','PHANTOM','TAEHOON','DEVIL'],
    ['HALLOWEEN COSTUME PARTY 2026','DOHA','GLADIATOR','WOOHYUN','PIRATE','JIWOO','DARK KNIGHT','IHWAN','VICTORIAN MAGICIAN','TAEHOON','WHIMSICAL HATTER']
  ];
  for(const values of expected){let cursor=-1;for(const value of values){const next=page.contentHtml.indexOf(value,cursor+1);assert.ok(next>cursor,value);cursor=next;}}
  assert.doesNotMatch(page.headHtml+page.contentHtml,/2026[-.]10[-.]31|촬영일|촬영 장소|실제 행사|공식 일정/);
});

test('Archive/Search exposes one visual record and no costume-party route',()=>{
  const catalog=buildSearchCatalog({routes:[page.route],documents:{[page.route]:{headHtml:page.headHtml,markup:page.contentHtml}},albums:[]});
  assert.equal(catalog.records.length,1);
  const record=catalog.records[0];
  assert.equal(record.href,page.route);
  assert.equal(record.category,'visual');
  assert.equal(record.image,'assets/images/HALLOWEEN_COSTUME/halloween-2026.webp');
  for(const keyword of ['HALLOWEEN COSTUME PARTY','할로윈','윤도하','VICTORIAN MAGICIAN'])assert.match(record.keywords,new RegExp(keyword));
});
