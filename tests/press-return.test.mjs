import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';

const headline='NIGHT, 데뷔 프로모션 다시 꺼냈다…‘RETURN’으로 돌아본 시작';
const summary='그룹 NIGHT가 ‘RETURN’을 통해 데뷔 당시의 프로모션을 현재의 모습으로 다시 재현했다.';
const image='assets/images/return/promotion-1/return-new night logo.webp';

test('RETURN PRESS article uses the existing expandable archive pattern',async()=>{
  const page=JSON.parse(await readFile(new URL('../src/pages/press.json',import.meta.url),'utf8'));
  const article=page.contentHtml.match(/<details class="press-record return-press-record" id="article-29">[\s\S]*?<\/details>/)?.[0];
  assert.ok(article);
  assert.match(article,/^<details/);
  assert.match(article,/<summary>/);
  assert.match(article,/<span class="press-toggle" aria-hidden="true"><\/span>/);
  assert.ok(article.includes('RETURN · PRESS'));
  assert.ok(article.includes(headline));
  assert.ok(article.includes(summary));
  assert.ok(article.includes(`src="${image}"`));
  assert.match(article,/role="region" aria-label="NIGHT, 데뷔 프로모션 다시 꺼냈다…‘RETURN’으로 돌아본 시작 전문"/);
  assert.equal((article.match(/<p>/g)||[]).length,13);
  await access(new URL(`../public/${image}`,import.meta.url));
});

test('RETURN PRESS copy preserves the confirmed reveal flow without invented claims',async()=>{
  const page=JSON.parse(await readFile(new URL('../src/pages/press.json',import.meta.url),'utf8'));
  const article=page.contentHtml.match(/<details class="press-record return-press-record" id="article-29">[\s\S]*?<\/details>/)?.[0]??'';
  for(const text of ['RETURN — NEW NIGHT LOGO','NIGHT IS BACK','RETURN TO NIGHT','WHO ARE YOU','DOHA, WOOHYUN, TAEHOON, IHWAN, JIWOO','RETURN — NIGHT IS NIGHT'])assert.ok(article.includes(text),text);
  assert.doesNotMatch(article,/관계자|기자회견|조회수|판매량|차트|수상|제작 비하인드/);
});

test('RETURN PRESS image remains uncropped and mobile layout collapses to one column',async()=>{
  const css=await readFile(new URL('../public/assets/css/press.css',import.meta.url),'utf8');
  assert.match(css,/\.return-press-overview>img\{[^}]*width:100%;height:auto/);
  assert.doesNotMatch(css,/\.return-press-overview>img\{[^}]*object-fit/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*\.return-press-overview\{grid-template-columns:1fr/);
});
