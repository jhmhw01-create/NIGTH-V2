import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('LUNA MD entry has a quiet link and retains the store destination and original media',async()=>{
  const page=JSON.parse(await readFile(new URL('../src/pages/fanclub.json',import.meta.url),'utf8'));
  const css=await readFile(new URL('../public/assets/css/fanclub-fashion.css',import.meta.url),'utf8');
  assert.match(page.contentHtml,/class="md-archive-link" href="store\.html"/);
  assert.doesNotMatch(page.contentHtml,/class="btn" href="store\.html"/);
  assert.match(page.contentHtml,/assets\/images\/md\/thumbs\/응원봉 무드등\.webp/);
  assert.match(css,/\.md-store-entry a\.md-archive-link:not\(:has\(img\)\)/);
  assert.match(css,/color:var\(--muted\);background:transparent/);
  assert.match(css,/min-height:44px/);
});
