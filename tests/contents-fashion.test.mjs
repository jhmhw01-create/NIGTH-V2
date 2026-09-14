import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('contents fashion stays scoped, text-only, responsive and keyboard accessible',async()=>{
 const css=await readFile(new URL('../public/assets/css/contents-fashion.css',import.meta.url),'utf8');
 assert.ok(!css.includes('url('));
 assert.ok(!css.includes('img'));
 assert.ok(css.includes('body.contents-page .contents-grid.is-filtered .content-card'));
 assert.ok(css.includes('min-height:0'));
 assert.ok(css.includes('grid-template-columns:1fr'));
 assert.ok(css.includes(':focus-visible'));
 const build=await readFile(new URL('../scripts/build-react.mjs',import.meta.url),'utf8');
 assert.ok(build.includes("route==='contents.html'?'<link rel=\"stylesheet\" href=\"assets/css/contents-fashion.css?v='"));
});
