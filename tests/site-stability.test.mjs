import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('content visibility and reduced motion do not depend on scripts',async()=>{
  const css=await readFile(new URL('../public/assets/css/site-stability.css',import.meta.url),'utf8');
  assert.match(css,/#night-react-root \.reveal\{opacity:1!important;transform:none!important\}/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/focus-visible/);
  assert.match(css,/min-width:44px;min-height:44px/);
});
