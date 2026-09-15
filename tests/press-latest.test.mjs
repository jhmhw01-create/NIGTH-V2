import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('PRESS archive includes the latest three missing releases in date order', async () => {
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
  assert.deepEqual(dates,[...dates].sort());
  const archive=JSON.parse(await readFile(new URL('../src/data/archive.json',import.meta.url),'utf8'));
  const record=archive.records.find(row=>row.href==='press.html');
  assert.ok(record);
  for(const album of ['INFINITY','PARADOX','REST'])assert.ok(record.searchText.includes(album));
});
