import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';

const pressUrl=new URL('../src/pages/press.json',import.meta.url);
const image='assets/images/GLOBAL_AWARDS/night-2029-gcma-global-artist-of-the-year.webp';

const getArticle=(html,id)=>html.match(new RegExp(`<article class="[^"]*press-record[^"]*" id="article-${id}"[\\s\\S]*?<\\/article>`))?.[0]??'';

test('PRESS adds two year-only articles without changing the existing 29 records',async()=>{
  const {contentHtml}=JSON.parse(await readFile(pressUrl,'utf8'));
  const ids=[...contentHtml.matchAll(/id="article-(\d+)"/g)].map(match=>match[1]);
  assert.equal(ids.length,31);
  assert.equal(new Set(ids).size,31);
  assert.ok(getArticle(contentHtml,30));
  assert.ok(getArticle(contentHtml,31));
  assert.doesNotMatch(getArticle(contentHtml,30),/<time|datetime=/);
  assert.doesNotMatch(getArticle(contentHtml,31),/<time|datetime=/);
});

test('global PRESS article records the three confirmed overseas awards',async()=>{
  const {contentHtml}=JSON.parse(await readFile(pressUrl,'utf8'));
  const article=getArticle(contentHtml,31);
  for(const text of ['2026년 GCMA Breakthrough Global Artist','2027년 GVMA Best Group','2029년 GCMA Global Artist of the Year'])assert.ok(article.includes(text),text);
  assert.ok(article.includes(`src="${image}"`));
  assert.ok(article.includes('alt="NIGHT — 2029 GCMA Global Artist of the Year"'));
  assert.ok(article.includes('width="1448" height="1086" loading="lazy"'));
  await access(new URL(`../public/${image}`,import.meta.url));
});

test('2029 year-end PRESS article contains exactly the four confirmed domestic awards',async()=>{
  const {contentHtml}=JSON.parse(await readFile(pressUrl,'utf8'));
  const article=getArticle(contentHtml,30);
  for(const text of ['PARADOX가 KMCA Bonsang','NIGHTMARE가 ASA Best Album','NIGHT가 MSA Best Male Group','BLACK NIGHT이 KPA Best Male Group Performance'])assert.ok(article.includes(text),text);
  assert.equal((article.match(/<img\b/g)||[]).length,0);
  assert.doesNotMatch(article,/Daesang|Best Art Direction|수상 소감|후보|투표|판매량|스트리밍/);
});

test('PRESS awards image is natural-size and responsive',async()=>{
  const css=await readFile(new URL('../public/assets/css/press.css',import.meta.url),'utf8');
  assert.match(css,/\.press-award-overview>img\{[^}]*width:100%;height:auto/);
  assert.doesNotMatch(css,/\.press-award-overview>img\{[^}]*object-fit/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*\.press-award-overview\{grid-template-columns:1fr/);
});

test('obsolete 2029 no-awards copy and excluded idea remain absent',async()=>{
  const {contentHtml}=JSON.parse(await readFile(pressUrl,'utf8'));
  assert.doesNotMatch(contentHtml,/NO 2029 YEAR-END AWARDS/i);
  assert.doesNotMatch(contentHtml,/Best Art Direction/i);
});
