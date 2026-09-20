import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ContentsEntry} from '../src/components/collections.mjs';
test('28 text entries keep links, categories and existing deep links',async()=>{
  const entries=JSON.parse(await readFile(new URL('../src/data/contentsEntries.json',import.meta.url),'utf8'));
  assert.equal(entries.length,28);
  assert.equal(new Set(entries.map(x=>x.href)).size,28);
  assert.equal(new Set(entries.map(x=>x.category)).size,6);
  assert.equal(entries[0].category,'daily');
  for(const entry of entries){
    const output=ContentsEntry(entry);
    assert(!output.includes('<img'));
    assert(output.includes('data-category="'+entry.category+'"'));
    assert(output.includes('href="'+entry.href+'"'));
  }
  assert(entries.some(x=>x.anchor==='season-2027'));
  assert(entries.some(x=>x.href==='out-of-frame.html'));
  assert(entries.some(x=>x.href==='night-off-summer.html'));
  assert(entries.some(x=>x.href==='moonlight-club-2029.html'));
  assert(entries.some(x=>x.href==='coachella-2029.html'));
});
