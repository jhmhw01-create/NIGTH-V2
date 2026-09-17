import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeMemberPage, currentMemberPortraits} from '../scripts/member-page-normalization.mjs';

const legacyPortraits = {
  'member-doha.html': 'assets/images/doha.webp',
  'member-woohyun.html': 'assets/images/woohyun.webp',
  'member-jiwoo.html': 'assets/images/jiwoo.webp',
  'member-ihwan.html': 'assets/images/ihwan.webp',
  'member-taehun.html': 'assets/images/taehun.webp'
};

test('all current member portraits are normalized before rendering', () => {
  for (const [route, legacy] of Object.entries(legacyPortraits)) {
    const page = normalizeMemberPage({route, contentHtml: `<img src="${legacy}">`});
    assert.match(page.contentHtml, new RegExp(currentMemberPortraits[route].replaceAll('.', '\\.')));
    assert.doesNotMatch(page.contentHtml, new RegExp(legacy.replaceAll('.', '\\.')));
  }
});

test('TAEHOON family and childhood context are normalized in authored content', () => {
  const page = normalizeMemberPage({
    route: 'member-taehun.html',
    contentHtml: '<dt>FAMILY</dt><dd>부모님 · 외동</dd><p>이 친화력은 특정 인물이나 특정한 성장 배경 때문에 만들어진 것이 아니라, 태훈이 원래부터 가지고 있는 성격이다.</p>'
  });

  assert.match(page.contentHtml, /외동 \(어릴 때부터 옆집 누나와 함께 자람\)/);
  assert.match(page.contentHtml, /옆집 누나와 자주 어울려 자라/);
  assert.doesNotMatch(page.contentHtml, /특정한 성장 배경 때문에 만들어진 것이 아니라/);
});

test('non-member pages remain untouched', () => {
  const page = {route: 'notice.html', contentHtml: '<p>unchanged</p>'};
  assert.equal(normalizeMemberPage(page), page);
});
