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

test('NIGHT IN THE HOUSE photo archive uses scoped masonry, fixed ordering, and authored event logs',async()=>{
  const component=await readFile(new URL('../src/react/ArchivePages.jsx',import.meta.url),'utf8');
  const css=await readFile(new URL('../public/assets/css/stage-detail-fashion.css',import.meta.url),'utf8');
  const page=JSON.parse(await readFile(new URL('../src/pages/night-in-the-house-2030.json',import.meta.url),'utf8'));
  const section=id=>{
    const start=page.contentHtml.indexOf(`id="${id}"`);
    const end=page.contentHtml.indexOf('<section',start+10);
    return page.contentHtml.slice(start,end<0?undefined:end);
  };
  const files=id=>[...section(id).matchAll(/href="[^"]+\/([^/]+\.webp)"/g)].map(match=>match[1]);
  assert.match(component,/\['visuals','part-1','part-2','encore'\]\.includes\(node\.props\.id\)/);
  assert.match(component,/night-house-photo-masonry/);
  assert.match(css,/\.night-house-photo-masonry \.gallery-grid\{display:block;columns:3 280px/);
  assert.match(css,/\.night-house-photo-masonry \.gallery-item\{display:inline-block;width:100%/);
  assert.match(css,/height:auto;aspect-ratio:auto;object-fit:contain/);
  assert.match(css,/\.event-log\{/);
  assert.match(css,/\.event-speaker\{/);
  assert.match(css,/\.event-action/);
  assert.doesNotMatch(page.headHtml,/#visuals \.gallery-grid/);
  assert.equal(files('visuals').length,7);
  assert.deepEqual(files('part-1'),[
    'night-in-the-house-part-1-opening.webp','night-in-the-house-part-1-talk.webp','night-in-the-house-part-1.webp','night-in-the-house-part-1-2.webp','night-in-the-house-part-1-3.webp','night-in-the-house-part-1-balloon-pop-game-jiwoo-x-ihwan.webp','night-in-the-house-part-1-balloon-pop-game-woohyun-x-taehoon.webp','night-in-the-house-part-1-game.webp','night-in-the-house-part-1-game-2.webp','night-in-the-house-part-1-game-cut-blindfold-guess-doha-woohyun.webp','night-in-the-house-part-1-game-cut-blindfold-guess-taehoon-ihwan.webp','night-in-the-house-part-1-pepero-game-doha-x-jiwoo.webp','night-in-the-house-part-1-pepero-game-woohyun-x-ihwan.webp'
  ]);
  assert.deepEqual(files('encore'),[
    'fanmeeting-night-in-the-house-encore.webp','fanmeeting-night-in-the-house-encore-stage.webp','fanmeeting-night-in-the-house-encore-stage-2.webp','fanmeeting-night-in-the-house-encore-photo-time.webp','fanmeeting-night-in-the-house-encore-photo-time2.webp','fanmeeting-night-in-the-house-encore-ment.webp','fanmeeting-night-in-the-house-encore-ment2.webp','fanmeeting-night-in-the-house-encore-doha-x-taehoon.webp','fanmeeting-night-in-the-house-encore-ending-stage.webp','fanmeeting-night-in-the-house-encore-ending.webp'
  ]);
  assert.equal(files('part-2').length,33);
  assert.equal(files('part-2').at(-1),'image-07.webp');
  for(const id of ['part-1','part-2','encore'])assert.doesNotMatch(section(id),/loading="lazy"/);
  assert.equal((page.contentHtml.match(/class="event-log"/g)||[]).length,22);
  assert.equal((page.contentHtml.match(/target="_blank"/g)||[]).length,63);
});
