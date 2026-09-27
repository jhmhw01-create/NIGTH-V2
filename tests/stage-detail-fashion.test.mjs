import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stageRoutes,eventRoutes} from '../src/react/routes.mjs';
test('all concert and fan-event detail routes use the scoped editorial layout',async()=>{
  const css=await readFile(new URL('../public/assets/css/stage-detail-fashion.css',import.meta.url),'utf8');
  const build=await readFile(new URL('../scripts/build-react.mjs',import.meta.url),'utf8');
  assert.equal(stageRoutes.length+eventRoutes.length,17);
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

test('NIGHT IN THE HOUSE visuals use the source component masonry without changing archive media',async()=>{
  const component=await readFile(new URL('../src/react/ArchivePages.jsx',import.meta.url),'utf8');
  const css=await readFile(new URL('../public/assets/css/stage-detail-fashion.css',import.meta.url),'utf8');
  const page=JSON.parse(await readFile(new URL('../src/pages/night-in-the-house-2030.json',import.meta.url),'utf8'));
  const visuals=page.contentHtml.slice(page.contentHtml.indexOf('id="visuals"'),page.contentHtml.indexOf('id="part-1"'));
  assert.match(component,/route==='night-in-the-house-2030\.html'&&node\.props\.id==='visuals'/);
  assert.match(component,/night-house-visuals-masonry/);
  assert.match(css,/\.night-house-visuals-masonry \.gallery-grid\{display:block;columns:3 280px/);
  assert.match(css,/\.night-house-visuals-masonry \.gallery-item\{display:inline-block;width:100%/);
  assert.match(css,/height:auto;aspect-ratio:auto;object-fit:contain/);
  assert.doesNotMatch(page.headHtml,/#visuals \.gallery-grid/);
  assert.equal((visuals.match(/<figure /g)||[]).length,7);
  assert.equal((visuals.match(/target="_blank"/g)||[]).length,7);
});
