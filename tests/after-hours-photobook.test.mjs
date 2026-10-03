import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile,readdir} from 'node:fs/promises';
import {visualRoutes,albumRoutes} from '../src/react/routes.mjs';
import {buildSearchCatalog} from '../scripts/search-catalog.mjs';

const root=new URL('../',import.meta.url);
const page=JSON.parse(await readFile(new URL('src/pages/after-hours-photobook.json',root),'utf8'));
const images=[...page.contentHtml.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)].map(match=>match[1]);

test('AFTER HOURS photobook uses all 18 main and six behind WebP files exactly once',async()=>{
  const groups=[['NIGHT_AFTER_HOURS_PHOTOBOOK',18],['AFTER_HOURS_BEHIND',6]];
  for(const [directory,count] of groups){
    const inventory=(await readdir(new URL(`public/assets/images/${directory}/`,root))).filter(file=>file.endsWith('.webp')).sort();
    const references=images.filter(path=>path.startsWith(`assets/images/${directory}/`)).map(path=>path.slice(`assets/images/${directory}/`.length)).sort();
    assert.equal(inventory.length,count);assert.deepEqual(references,inventory);
    await Promise.all(inventory.map(file=>access(new URL(`public/assets/images/${directory}/${file}`,root))));
  }
  assert.equal(images.length,24);
  assert.equal((page.contentHtml.match(/loading="eager"/g)||[]).length,1);
  assert.equal((page.contentHtml.match(/loading="lazy"/g)||[]).length,23);
});

test('photobook preserves concept and member order with a separate behind section',()=>{
  let cursor=-1;
  for(const text of ['01 — ALLURE','YOU NOTICE HIM','02 — PROVOCATION','HE NOTICES YOU','03 — DANGER','HE COMES CLOSER','BEHIND THE SCENES']){const next=page.contentHtml.indexOf(text,cursor+1);assert.ok(next>cursor,text);cursor=next;}
  for(const concept of ['ALLURE','PROVOCATION','DANGER']){
    const section=page.contentHtml.slice(page.contentHtml.indexOf(`id="${concept.toLowerCase()}"`),page.contentHtml.indexOf('</section>',page.contentHtml.indexOf(`id="${concept.toLowerCase()}"`))+10);
    const positions=['DOHA','WOOHYUN','JIWOO','IHWAN','TAEHOON'].map(member=>section.indexOf(`${member}-${String(['ALLURE','PROVOCATION','DANGER'].indexOf(concept)+1).padStart(2,'0')} ${concept}.webp`));
    assert.ok(positions.every(position=>position>=0));assert.deepEqual([...positions].sort((a,b)=>a-b),positions);
  }
  assert.match(page.bodyAttributes,/after-hours-photobook-page/);
  assert.match(page.contentHtml,/archive-new-grid--natural-images/);
});

test('photobook remains a distinct visual route and search record from the album',()=>{
  assert.ok(visualRoutes.includes('after-hours-photobook.html'));
  assert.ok(albumRoutes.includes('after-hours.html'));
  assert.ok(!albumRoutes.includes('after-hours-photobook.html'));
  const documents={
    'after-hours-photobook.html':{headHtml:page.headHtml,markup:page.contentHtml},
    'after-hours.html':{headHtml:'<title>AFTER HOURS — NIGHT</title>',markup:'<main><h1>AFTER HOURS</h1><p>WINTER SPECIAL ALBUM</p></main>'}
  };
  const catalog=buildSearchCatalog({routes:Object.keys(documents),documents,albums:[]});
  const photobook=catalog.records.find(record=>record.href==='after-hours-photobook.html');
  const album=catalog.records.find(record=>record.href==='after-hours.html');
  assert.equal(photobook?.category,'visual');assert.equal(album?.category,'music');
  assert.match(photobook?.keywords??'',/PHOTOBOOK VISUAL/);
  assert.equal(photobook?.image,'assets/images/NIGHT_AFTER_HOURS_PHOTOBOOK/FRONT COVER.webp');
  assert.doesNotMatch(page.contentHtml,/WINTER SPECIAL ALBUM|NO SUNRISE|앨범 콘셉트|발매|2026\.12\.10/);
});
