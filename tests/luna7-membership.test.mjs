import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderCollections} from '../src/components/collections.mjs';
const root=new URL('../',import.meta.url);
const readJson=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
test('LUNA 7th membership is the newest fanclub archive entry',async()=>{
  const fanclub=await readJson('src/pages/fanclub.json');
  const memberships=await readJson('src/data/memberships.json');
  const rendered=renderCollections(fanclub.contentHtml,{memberships});
  const seventh=rendered.indexOf('MIDNIGHT OBSERVATORY');
  const sixth=rendered.indexOf('AFTERIMAGE');
  assert.ok(seventh>=0&&sixth>=0&&seventh<sixth);
  assert.match(rendered,/luna7\.html/);
  assert.match(rendered,/2029\.11\.20/);
});
test('LUNA 7th detail uses all twelve supplied web images',async()=>{
  const page=await readJson('src/pages/luna7.json');
  const matches=[...page.contentHtml.matchAll(/assets\/images\/7TH LUNA\/[^\"']+\.webp/g)].map(match=>match[0]);
  assert.equal(matches.length,12);
  assert.equal(new Set(matches).size,12);
  assert.match(page.contentHtml,/MIDNIGHT OBSERVATORY/);
  assert.match(page.contentHtml,/SAME ORBIT, ANOTHER NIGHT\./);
  assert.match(page.contentHtml,/2029\.11\.20/);
});
