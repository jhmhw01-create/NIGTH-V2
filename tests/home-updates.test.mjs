import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {homeUpdates} from '../scripts/home-updates.mjs';
test('home updates reuse three dated non-music notices without inventing content',async()=>{
  const notices=JSON.parse(await readFile(new URL('../src/data/notices.json',import.meta.url),'utf8'));
  const updates=homeUpdates(notices);assert.equal(updates.length,3);
  for(const update of updates){const original=notices.find(item=>item.id===update.id);assert.equal(update.title,original.title);assert.ok(original.bodyTemplateHtml.includes(update.date));assert.ok(original.bodyTemplateHtml.includes(update.href));assert.ok(!original.attributesHtml.includes('data-notice-category="music"'));}
  assert.ok(updates.every((item,index)=>index===0||updates[index-1].date>=item.date));
});
