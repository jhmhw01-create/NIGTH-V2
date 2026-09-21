import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('notice fashion is page-scoped, readable, responsive and preserves native disclosure',async()=>{
 const css=await readFile(new URL('../public/assets/css/notice-fashion.css',import.meta.url),'utf8');
 assert.ok(css.includes('body:has(.notice-section)'));
 assert.ok(!css.includes('url('));
 assert.ok(css.includes('summary:focus-visible'));
 assert.ok(css.includes('grid-column:1/span 2'));
 assert.ok(css.includes('filter:none;opacity:1'));
 assert.ok(!css.includes('object-fit:cover'));
 const page=JSON.parse(await readFile(new URL('../src/pages/notice.json',import.meta.url),'utf8'));
 assert.equal((page.contentHtml.match(/\{\{notices:\d+\}\}/g)||[]).length,29);
 const notices=JSON.parse(await readFile(new URL('../src/data/notices.json',import.meta.url),'utf8'));
 assert.equal(notices.length,29);
 for(const notice of notices)assert.ok(notice.bodyTemplateHtml.includes('<summary>'));
});
