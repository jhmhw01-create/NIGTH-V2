import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {syncHubPage} from '../scripts/hub-sync.mjs';
import {PageLayout} from '../src/components/layout.mjs';
import {jiwooActingPlacement} from '../scripts/audit-site.mjs';

const page=async route=>syncHubPage(JSON.parse(await readFile(new URL(`../src/pages/${route}.json`,import.meta.url),'utf8')));

test('DOHA profile links to the separate PLAY ON personal schedule archive',async()=>{
  const doha=await page('member-doha');
  assert.match(doha.contentHtml,/PERSONAL SCHEDULE/);
  assert.match(doha.contentHtml,/VARIETY · SPORTS/);
  assert.match(doha.contentHtml,/href="doha-play-on\.html"/);
});

test('JIWOO acting card is rendered directly after KEYWORDS with the DOHA card pattern',async()=>{
  const jiwoo=await page('member-jiwoo');
  assert.match(jiwoo.contentHtml,/class="doha-personal-card reveal"/);
  assert.match(jiwoo.contentHtml,/PERSONAL SCHEDULE/);
  assert.match(jiwoo.contentHtml,/DRAMA · FILM/);
  assert.match(jiwoo.contentHtml,/VIEW FILMOGRAPHY →/);
  const placement=jiwooActingPlacement(PageLayout(jiwoo));
  assert.equal(placement.valid,true);
  assert.equal(placement.actingIndex,placement.keywordIndex+1);
  assert.equal(placement.switchIndex,placement.actingIndex+1);
});

test('fanmeeting archive keeps its content and adds the 2030 archive entry',async()=>{
  const fanmeeting=await page('fanmeeting');
  assert.match(fanmeeting.contentHtml,/CHAPTER 01/);
  assert.match(fanmeeting.contentHtml,/2030\.07\.06/);
  assert.match(fanmeeting.contentHtml,/href="night-in-the-house-2030\.html"/);
});

test('hub cards use responsive scoped styling',async()=>{
  const css=await readFile(new URL('../public/assets/css/hub-sync.css',import.meta.url),'utf8');
  assert.match(css,/@media\(max-width:720px\)/);
  assert.match(css,/\.doha-personal-card/);
  assert.match(css,/\.fm-archive-entry/);
});
