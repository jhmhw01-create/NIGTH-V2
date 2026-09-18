import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildSourceSearchCatalog} from './search-fixture.mjs';

test('PRESS archive includes the latest three missing releases in newest-first order', async () => {
  const page=JSON.parse(await readFile(new URL('../src/pages/press.json',import.meta.url),'utf8'));
  const section=page.contentHtml.split('id="post-phantom-heading"')[1]?.split('<h2 class="archive-heading">ARCHIVE</h2>')[0];
  assert.ok(section,'post-PHANTOM section should exist');
  for(const [id,date,album,track] of [
    ['20','2027-08-01','INFINITY','RESTART'],
    ['21','2029-08-27','PARADOX','PARADISE'],
    ['22','2029-11-02','REST','NEXT TIME']
  ]) {
    assert.match(section,new RegExp('id="article-'+id+'"[^>]*>[\\s\\S]*?datetime="'+date+'"'));
    assert.ok(section.includes(album));
    assert.ok(section.includes(track));
  }
  const dates=[...section.matchAll(/<time class="press-year" datetime="([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(dates,[...dates].sort().reverse());
  const ids=[...section.matchAll(/<article class="press-record press-short" id="article-(\d+)"/g)].map(match=>match[1]);
  assert.equal(ids.indexOf('13'),ids.indexOf('20')+1,'INFINITY should appear immediately before COMPLETE');
  const css=await readFile(new URL('../public/assets/css/press.css',import.meta.url),'utf8');
  assert.doesNotMatch(css,/#article-\d+\s*\{\s*order\s*:/,'CSS must not override editorial date order');
  assert.equal(dates[0],'2029-11-02');
  const catalog=await buildSourceSearchCatalog();
  const record=catalog.records.find(row=>row.href==='press.html');
  assert.ok(record);
  for(const album of ['INFINITY','PARADOX','REST'])assert.ok(record.searchText.includes(album));
});
