import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ContentsEntry} from '../src/components/collections.mjs';
test('32 text entries keep links, categories and existing deep links',async()=>{
  const entries=JSON.parse(await readFile(new URL('../src/data/contentsEntries.json',import.meta.url),'utf8'));
  assert.equal(entries.length,32);
  assert.equal(new Set(entries.map(x=>x.href)).size,32);
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
  assert(entries.some(x=>x.href==='documentary-2029.html'));
  assert(entries.some(x=>x.href==='woohyun-jiwoo-unit-2024.html'));
  assert(entries.some(x=>x.href==='so-good-2028.html'));
  assert(entries.some(x=>x.href==='sometime.html'));
});

test('contents page renders every entry and keeps SOMETIME first in the album group',async()=>{
  const page=JSON.parse(await readFile(new URL('../src/pages/contents.json',import.meta.url),'utf8'));
  const placeholders=[...page.contentHtml.matchAll(/\{\{contentsEntries:(\d+)\}\}/g)].map(match=>Number(match[1]));
  assert.equal(placeholders.length,32);
  assert.equal(new Set(placeholders).size,32);
  assert.deepEqual([...placeholders].sort((a,b)=>a-b),Array.from({length:32},(_,index)=>index));
  assert(placeholders.indexOf(31)<placeholders.indexOf(7));
  assert(page.contentHtml.includes('전체 <span>32</span>'));
  assert(page.contentHtml.includes('앨범 <span>7</span>'));
  assert(page.contentHtml.includes('에디토리얼 <span>3</span>'));
});
