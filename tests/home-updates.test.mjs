import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {homeUpdates} from '../scripts/home-updates.mjs';
test('home updates reuse the three latest dated notices with authored valid destinations',async()=>{
  const notices=JSON.parse(await readFile(new URL('../src/data/notices.json',import.meta.url),'utf8'));
  const updates=homeUpdates(notices);assert.equal(updates.length,3);
  for(const update of updates){
    const original=notices.find(item=>item.id===update.id);
    assert.equal(update.title,original.title);
    assert.equal(update.date,original.dateDisplay);
    assert.equal(update.href,original.href);
  }
  assert.ok(updates.every((item,index)=>index===0||updates[index-1].date>=item.date));
  assert.equal(updates[0].date,'2030.04.08');
  assert.equal(updates[0].href,'sometime.html');
  assert.deepEqual(updates.map(update=>update.date),['2030.04.08','2029.12.01','2029.11.20']);
  assert.equal(updates[2].href,'luna7.html');
});
