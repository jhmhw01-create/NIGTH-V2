import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
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
