import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {homeUpdates} from '../scripts/home-updates.mjs';
test('home updates reuse the three latest dated notices with canonical notice anchors',async()=>{
  const notices=JSON.parse(await readFile(new URL('../src/data/notices.json',import.meta.url),'utf8'));
  const updates=homeUpdates(notices);assert.equal(updates.length,3);
  for(const update of updates){
    const original=notices.find(item=>item.id===update.id);
    assert.equal(update.title,original.title);
    assert.ok(original.bodyTemplateHtml.includes(update.date));
    assert.equal(update.href,`notice.html#${original.id}`);
  }
  assert.ok(updates.every((item,index)=>index===0||updates[index-1].date>=item.date));
});
