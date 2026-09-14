import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('archive fashion is scoped, responsive and preserves unmodified photo rendering',async()=>{
 const css=await readFile(new URL('../public/assets/css/archive-fashion.css',import.meta.url),'utf8');
 assert.ok(css.includes('body.archive-explorer'));
 assert.ok(css.includes('object-fit:contain;filter:none;opacity:1'));
 assert.ok(!css.includes('object-fit:cover'));
 assert.ok(!css.includes('url('));
 assert.ok(css.includes('grid-template-columns:1fr'));
 assert.ok(css.includes('input:focus-visible'));
 assert.ok(css.includes('button[aria-pressed=true]'));
 const build=await readFile(new URL('../scripts/build-react.mjs',import.meta.url),'utf8');
 assert.ok(build.includes("route==='archive.html'?'<link rel=\"stylesheet\" href=\"assets/css/archive-fashion.css?v='"));
});
