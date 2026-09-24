import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const readJson=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
const iso=/^\d{4}-\d{2}-\d{2}$/;

test('notice and contents records keep display copy separate from sortable metadata',async()=>{
  const notices=await readJson('src/data/notices.json');
  const contents=await readJson('src/data/contentsEntries.json');
  for(const notice of notices){
    assert.match(notice.date,iso);
    assert.equal(notice.year,Number(notice.date.slice(0,4)));
    assert.equal(typeof notice.type,'string');
    assert.equal(typeof notice.dateDisplay,'string');
    assert.equal(typeof notice.href,'string');
    if(notice.endDate)assert.match(notice.endDate,iso);
  }
  for(const entry of contents){
    assert.equal(entry.type,entry.category);
    assert.ok(entry.date===null||iso.test(entry.date));
    assert.ok(entry.endDate===null||iso.test(entry.endDate));
    assert.ok(entry.year===null||Number.isInteger(entry.year));
  }
});

test('the newest album remains connected across discography, notice and contents data',async()=>{
  const albums=await readJson('src/data/albums.json');
  const notices=await readJson('src/data/notices.json');
  const contents=await readJson('src/data/contentsEntries.json');
  const latest=[...notices].filter(item=>item.type==='music').sort((a,b)=>b.date.localeCompare(a.date))[0];
  assert.equal(latest.id,'sometime-release');
  assert.ok(albums.some(item=>item.title==='SOMETIME'));
  assert.ok(contents.some(item=>item.title==='SOMETIME'&&item.date===latest.date&&item.href===latest.href));
});
