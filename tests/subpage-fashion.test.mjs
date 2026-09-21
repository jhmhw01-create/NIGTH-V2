import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {reactRoutes} from '../src/react/routes.mjs';
const indexRoutes=new Set(['index.html','discography.html','history.html','listen.html','gallery.html','contents.html','archive.html','notice.html','fanclub.html']);
test('every secondary route receives the shared Castle editorial foundation',async()=>{
  const build=await readFile(new URL('../scripts/build-react.mjs',import.meta.url),'utf8');
  const css=await readFile(new URL('../public/assets/css/subpage-fashion.css',import.meta.url),'utf8');
  assert.equal(reactRoutes.filter(route=>!indexRoutes.has(route)).length,56);
  assert.match(build,/subpage-fashion\.css/);
  assert.match(build,/data-night-subpage/);
  assert.match(css,/body\[data-night-subpage\]/);
  assert.match(css,/@media\(max-width:540px\)/);
  assert.ok(!css.includes('url('));
});
