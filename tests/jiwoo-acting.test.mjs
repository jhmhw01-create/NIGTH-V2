import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {jiwooFilmography,jiwooActingImageCount} from '../src/data/jiwooFilmography.mjs';
import {personalRoutes,reactRoutes} from '../src/react/routes.mjs';
import {syncHubPage} from '../scripts/hub-sync.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));

test('JIWOO filmography keeps the confirmed seven-work chronology and all 70 assets',async()=>{
  assert.equal(jiwooFilmography.length,7);
  assert.equal(jiwooActingImageCount,70);
  assert.deepEqual(jiwooFilmography.map(work=>work.title),['열아홉의 온도','사각지대','좋아한다는 말 대신','완벽한 불일치','무결점','경계선','평범한 날']);
  assert.deepEqual(jiwooFilmography.map(work=>work.images.length),[7,3,4,17,20,12,7]);
  const images=jiwooFilmography.flatMap(work=>work.images);
  assert.equal(new Set(images).size,70);
  await Promise.all(images.map(image=>access(join(root,'public',image))));
});

test('JIWOO acting archive participates in React rendering and member navigation',async()=>{
  assert.ok(personalRoutes.includes('jiwoo-acting.html'));
  assert.ok(reactRoutes.includes('jiwoo-acting.html'));
  const page=JSON.parse(await readFile(join(root,'src/pages/member-jiwoo.json'),'utf8'));
  const synced=syncHubPage(page);
  assert.match(synced.contentHtml,/PERSONAL SCHEDULE/);
  assert.match(synced.contentHtml,/href="jiwoo-acting\.html"/);
  assert.match(synced.contentHtml,/VIEW FILMOGRAPHY →/);
});

test('archive styles preserve image ratios and provide responsive grids',async()=>{
  const css=await readFile(join(root,'public/assets/css/jiwoo-acting.css'),'utf8');
  assert.match(css,/\.acting-card img\{[^}]*height:auto/);
  assert.match(css,/\.acting-photo img\{[^}]*height:auto/);
  assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css,/@media\(max-width:480px\)\{\.acting-gallery\{grid-template-columns:1fr\}/);
  assert.doesNotMatch(css,/object-fit\s*:\s*cover/);
});
