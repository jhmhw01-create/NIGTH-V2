import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {normalizeMemberPage, currentMemberPortraits} from '../scripts/member-page-normalization.mjs';

const legacyPortraits = {
  'member-doha.html': 'assets/images/doha.webp',
  'member-woohyun.html': 'assets/images/woohyun.webp',
  'member-jiwoo.html': 'assets/images/jiwoo.webp',
  'member-ihwan.html': 'assets/images/ihwan.webp'
};

test('legacy portraits for the first four current members are normalized before rendering', () => {
  for (const [route, legacy] of Object.entries(legacyPortraits)) {
    const page = normalizeMemberPage({route, contentHtml: `<img src="${legacy}">`});
    assert.match(page.contentHtml, new RegExp(currentMemberPortraits[route].replaceAll('.', '\\.')));
    assert.doesNotMatch(page.contentHtml, new RegExp(legacy.replaceAll('.', '\\.')));
  }
});

test('TAEHOON profile is canonical in authored source', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const source = JSON.parse(await readFile(root + 'src/pages/member-taehoon.json', 'utf8'));
  assert.equal(source.route, 'member-taehoon.html');
  assert.match(source.contentHtml, /assets\/images\/member-taehoon\.webp/);
  assert.match(source.contentHtml, /<dt>FAMILY<\/dt><dd>부모님 · 외동<\/dd>/);
  assert.doesNotMatch(source.contentHtml, /옆집 누나|소꿉친구|짝사랑|연상의 여성/);
  assert.match(source.contentHtml, /친구가 많은 편이며/);
  assert.doesNotMatch(source.contentHtml, /특정한 성장 배경 때문에 만들어진 것이 아니라/);
});

test('canonical TAEHOON pages do not require normalization', () => {
  const page = {route: 'member-taehoon.html', contentHtml: '<p>canonical</p>'};
  assert.equal(normalizeMemberPage(page), page);
});

test('non-member pages remain untouched', () => {
  const page = {route: 'notice.html', contentHtml: '<p>unchanged</p>'};
  assert.equal(normalizeMemberPage(page), page);
});
