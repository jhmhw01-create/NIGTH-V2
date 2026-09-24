import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {releaseOrder} from '../src/react/release-order.mjs';
import {renderCollections} from '../src/components/collections.mjs';
test('legacy activity-year labels never sort above recent releases',()=>{
  assert.equal(releaseOrder('lucid','3RD YEAR').year,'2025');
  assert.equal(releaseOrder('nocturne','1ST YEAR · LATE').year,'2023');
  const rows=[['rest','2029.11.02'],['eclipse','2ND YEAR · EARLY'],['new-moon','2ND YEAR · LATE'],['no-signal','2ND YEAR · MID']];
  assert.deepEqual(rows.sort((a,b)=>releaseOrder(...b).key.localeCompare(releaseOrder(...a).key)).map(r=>r[0]),['rest','new-moon','no-signal','eclipse']);
});
test('discography fashion is scoped and preserves text-only accessible releases',async()=>{
  const css=await readFile(new URL('../public/assets/css/discography-fashion.css',import.meta.url),'utf8');
  assert.ok(css.includes('body:has(.discography-section)'));
  assert.ok(!css.includes('url('));
  assert.ok(css.includes('grid-template-columns:1fr'));
  assert.ok(css.includes(':focus-visible'));
  const source=await readFile(new URL('../src/react/ArchivePages.jsx',import.meta.url),'utf8');
  assert.ok(source.includes("route==='discography.html'&&cls.has('discography-list')"));
  assert.ok(source.includes('aria-labelledby'));
  assert.ok(source.includes('<summary>트랙리스트 · 앨범 정보</summary>'));
  assert.ok(source.includes('<summary>아카이브 안내 · 관련 링크</summary>'));
});
test('2030 SOMETIME appears first with release date, tracks, two versions and archive link',async()=>{
  const albums=JSON.parse(await readFile(new URL('../src/data/albums.json',import.meta.url),'utf8'));
  const page=JSON.parse(await readFile(new URL('../src/pages/discography.json',import.meta.url),'utf8'));
  const sometime=albums.find(album=>album.id==='sometime');
  assert.ok(sometime);
  assert.match(sometime.bodyTemplateHtml,/2030\.04\.08/);
  for(const track of ['ON MORE TIME','밤의 페이지','CINEMATIC','TOGETHER','YOU AND I (VOCAL UNIT)']){
    assert.ok(sometime.bodyTemplateHtml.includes(track));
  }
  assert.match(sometime.bodyTemplateHtml,/<li class="is-title"><b>03<\/b><strong>CINEMATIC<\/strong><em>TITLE<\/em><\/li>/);
  assert.match(sometime.bodyTemplateHtml,/SOMEDAY · SOMEWHERE/);
  assert.match(sometime.bodyTemplateHtml,/href=\"sometime\.html\"/);
  const html=renderCollections(page.contentHtml,{albums});
  assert.ok(html.indexOf('id=\"sometime\"')<html.indexOf('id=\"rest\"'));
});
