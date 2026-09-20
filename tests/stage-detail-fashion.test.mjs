import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stageRoutes,eventRoutes} from '../src/react/routes.mjs';
test('all concert and fan-event detail routes use the scoped editorial layout',async()=>{
  const css=await readFile(new URL('../public/assets/css/stage-detail-fashion.css',import.meta.url),'utf8');
  const build=await readFile(new URL('../scripts/build-react.mjs',import.meta.url),'utf8');
  assert.equal(stageRoutes.length+eventRoutes.length,14);
  assert.match(build,/stageRoutes\.includes\(route\)\|\|eventRoutes\.includes\(route\)/);
  assert.match(build,/stage-detail-fashion\.css/);
  assert.match(build,/data-night-stage-detail/);
  assert.match(css,/body\[data-night-stage-detail\]/);
  for(const className of ['archive26-photo','fm-photo','sg-photo','fansign-photo','award-record'])assert.ok(css.includes(className));
  assert.ok(css.includes('object-fit:contain'));
  assert.ok(!css.includes('url('));
  assert.ok(!css.includes('object-fit:cover'));
  assert.match(css,/@media\(max-width:600px\)/);
});
