import test from 'node:test';
import assert from 'node:assert/strict';
import {enhanceHead} from '../src/components/layout.mjs';

const count=(text,pattern)=>(text.match(pattern)||[]).length;
const page=(route,title,extra='')=>({route,headHtml:`<meta charset="utf-8"/><title>${title}</title>${extra}<link rel="stylesheet" href="assets/css/style.css"/>`});

test('SEO fallback gives core routes distinct canonical descriptions',()=>{
  const woohyun=enhanceHead(page('member-woohyun.html','성우현 — NIGHT'));
  const history=enhanceHead(page('history.html','HISTORY — NIGHT'));
  assert.match(woohyun,/메인댄서 WOOHYUN 성우현의 공식 프로필/);
  assert.match(history,/데뷔부터 현재까지 주요 앨범, 공연, 팬클럽과 활동 기록/);
  assert.notEqual(woohyun.match(/name="description" content="([^"]+)"/)?.[1],history.match(/name="description" content="([^"]+)"/)?.[1]);
  assert.match(woohyun,/rel="canonical" href="https:\/\/jhmhw01-create\.github\.io\/NIGTH-V2\/member-woohyun\.html"/);
});

test('authored description remains the source for social metadata',()=>{
  const authored='직접 작성한 페이지 설명입니다.';
  const head=enhanceHead(page('custom.html','CUSTOM — NIGHT',`<meta name="description" content="${authored}"/>`));
  assert.equal(count(head,/name="description"/g),1);
  assert.match(head,new RegExp(`property="og:description" content="${authored}"`));
  assert.match(head,new RegExp(`name="twitter:description" content="${authored}"`));
});

test('detail pages without authored copy receive title-based unique descriptions',()=>{
  const head=enhanceHead(page('paradox-2029.html','PARADOX — NIGHT'));
  assert.match(head,/PARADOX에 관한 NIGHT 공식 페이지입니다/);
});

test('SEO enhancement never duplicates canonical, Open Graph or Twitter tags',()=>{
  const existing='<meta name="description" content="기존 설명"/><link rel="canonical" href="https://example.com/existing"/><meta property="og:title" content="기존 OG"/><meta name="twitter:title" content="기존 Twitter"/>';
  const head=enhanceHead(page('notice.html','NOTICE — NIGHT',existing));
  assert.equal(count(head,/rel="canonical"/g),1);
  assert.equal(count(head,/property="og:title"/g),1);
  assert.equal(count(head,/name="twitter:title"/g),1);
  assert.match(head,/https:\/\/example\.com\/existing/);
});

test('home canonical resolves to the site root',()=>{
  const head=enhanceHead(page('index.html','NIGHT — Official Website'));
  assert.match(head,/rel="canonical" href="https:\/\/jhmhw01-create\.github\.io\/NIGTH-V2\/"/);
  assert.doesNotMatch(head,/NIGTH-V2\/index\.html/);
});
