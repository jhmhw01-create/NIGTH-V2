import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const page=JSON.parse(await readFile(new URL('src/pages/awards.json',root),'utf8'));
const html=page.contentHtml;
const records=[...html.matchAll(/<article class="award-record[^"]*">([\s\S]*?)<\/article>/g)].map(match=>match[1]);
const currentRecords=records.filter(record=>/· (?:DOMESTIC|GLOBAL)/.test(record));

test('Awards keeps 20 existing records and adds exactly seven confirmed records',()=>{
  assert.equal(records.length,27);
  assert.equal(currentRecords.length,7);
  const yearCount=year=>records.filter(record=>record.includes(`<span class="record-index">${year}</span>`)).length;
  assert.deepEqual({2022:yearCount(2022),2023:yearCount(2023),2024:yearCount(2024),2025:yearCount(2025),2026:yearCount(2026),2027:yearCount(2027),2028:yearCount(2028),2029:yearCount(2029)},
    {2022:1,2023:1,2024:3,2025:3,2026:5,2027:4,2028:5,2029:5});
});

test('the seven confirmed awards preserve their year, award and target',()=>{
  const expected=[
    ['2026','GCMA · NIGHT · GLOBAL','Breakthrough Global Artist','Global Chart Music Awards','NIGHT'],
    ['2027','GVMA · NIGHT · GLOBAL','Best Group','Global Video Music Awards','NIGHT'],
    ['2029','KMCA · PARADOX · DOMESTIC','Bonsang','Korea Music Crown Awards','PARADOX'],
    ['2029','ASA · NIGHTMARE · DOMESTIC','Best Album','Asia Starlight Awards','NIGHTMARE'],
    ['2029','MSA · NIGHT · DOMESTIC','Best Male Group','Music Spectrum Awards','NIGHT'],
    ['2029','KPA · BLACK NIGHT · DOMESTIC','Best Male Group Performance','K-Performance Awards','BLACK NIGHT'],
    ['2029','GCMA · NIGHT · GLOBAL','Global Artist of the Year','Global Chart Music Awards','NIGHT']
  ];
  for(const values of expected){
    const record=currentRecords.find(item=>values.every(value=>item.includes(value)));
    assert.ok(record,values.join(' / '));
  }
  assert.equal(currentRecords.filter(record=>record.includes('2029')).length,5);
});

test('Grand Prize remains two Daesangs and excluded NIGHTMARE idea stays absent',()=>{
  assert.equal((html.match(/<h3>[^<]*\(Daesang\)<\/h3>/g)||[]).length,2);
  assert.match(html,/Album of the Year \(Daesang\)[\s\S]*COMPLETE · FIRST GRAND PRIZE/);
  assert.match(html,/Artist of the Year \(Daesang\)[\s\S]*NIGHT · SECOND GRAND PRIZE/);
  assert.match(html,/GRAND PRIZE<\/small><strong>2 DAESANGS/);
  assert.doesNotMatch(html,/NO 2029 YEAR-END AWARDS/);
  assert.doesNotMatch(html,/Best Art Direction/);
});

test('three global Award images are linked only to their matching records',async()=>{
  const images=[
    ['night-2026-gcma-breakthrough-global-artist.webp','NIGHT — 2026 GCMA Breakthrough Global Artist','1536','1024'],
    ['night-2027-gvma-best-group.webp','NIGHT — 2027 GVMA Best Group','1536','1024'],
    ['night-2029-gcma-global-artist-of-the-year.webp','NIGHT — 2029 GCMA Global Artist of the Year','1448','1086']
  ];
  assert.equal((html.match(/assets\/images\/GLOBAL_AWARDS\//g)||[]).length,3);
  for(const [file,alt,width,height] of images){
    await access(new URL(`public/assets/images/GLOBAL_AWARDS/${file}`,root));
    assert.equal((html.match(new RegExp(file.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length,1);
    assert.match(html,new RegExp(`src="assets/images/GLOBAL_AWARDS/${file}" alt="${alt}" width="${width}" height="${height}" loading="lazy"`));
  }
});
