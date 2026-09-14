import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderCollections} from '../src/components/collections.mjs';
test('23 gallery archives render across five categories',async()=>{
  const records=JSON.parse(await readFile(new URL('../src/data/galleryCards.json',import.meta.url),'utf8'));
  const page=JSON.parse(await readFile(new URL('../src/pages/gallery.json',import.meta.url),'utf8'));
  assert.equal(records.length,23);
  assert.equal(new Set(records.map(x=>x.category)).size,5);
  const result=renderCollections(page.contentHtml,{galleryCards:records});
  assert(!result.includes('{{galleryCards:'));
  assert.equal((result.match(/class="gallery-archive-entry"/g)||[]).length,23);
  for(const record of records)assert(result.includes('href="'+record.href+'"'));
});
