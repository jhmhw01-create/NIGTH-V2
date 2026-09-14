import test from 'node:test';
import assert from 'node:assert/strict';
import {documentReferences} from '../scripts/audit-site.mjs';
test('site audit reads links, media, full images and duplicate anchors',()=>{
  const result=documentReferences('<main id="a"><a href="page.html#b">link</a><img src="photo.webp" data-full="full.webp"><video poster="poster.webp"></video><div id="a"></div></main>');
  assert.deepEqual(result.duplicates,['a']);
  assert.deepEqual(result.references,['page.html#b','photo.webp','full.webp','poster.webp']);
  assert.ok(result.ids.has('a'));
});
