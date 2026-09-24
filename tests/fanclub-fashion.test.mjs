import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('fanclub editorial preserves membership records and destinations with responsive uncropped media',async()=>{
const css=await readFile(new URL('../public/assets/css/fanclub-fashion.css',import.meta.url),'utf8');
assert.ok(css.includes('body:has(.luna-membership-archive)'));
assert.ok(!css.includes('url('));
assert.ok(!css.includes('object-fit:cover'));
assert.ok(css.includes('filter:none;opacity:1'));
assert.ok(css.includes('a:focus-visible'));
assert.ok(css.includes('@media(max-width:680px)'));
const page=JSON.parse(await readFile(new URL('../src/pages/fanclub.json',import.meta.url),'utf8'));
assert.equal((page.contentHtml.match(/\{\{memberships:\d+\}\}/g)||[]).length,6);
for(const route of ['season-greetings-2027.html','season-greetings-2028.html','season-greetings-2029.html','with-luna.html','store.html','fanmeeting.html'])assert.ok(page.contentHtml.includes(route));
assert.ok(page.contentHtml.includes('멤버십 키트는 FANCLUB 전용 아카이브'));
const kits=JSON.parse(await readFile(new URL('../src/data/memberships.json',import.meta.url),'utf8'));
assert.equal(kits.length,7);
for(const route of ['luna4.html','luna5.html','luna6.html','luna7.html'])assert.ok(kits.some(k=>k.bodyTemplateHtml.includes(route)));
});
