import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {detailNavigation} from '../scripts/detail-navigation.mjs';

const pressUrl=new URL('../src/pages/press.json',import.meta.url);
const image='assets/images/GLOBAL_AWARDS/night-2029-gcma-global-artist-of-the-year.webp';

const getArticle=(html,id)=>html.match(new RegExp(`<article class="[^"]*press-record[^"]*" id="article-${id}"[\\s\\S]*?<\\/article>`))?.[0]??'';

test('PRESS keeps the existing 31 records and adds two year-only Daesang articles',async()=>{
  const {contentHtml}=JSON.parse(await readFile(pressUrl,'utf8'));
  const ids=[...contentHtml.matchAll(/id="article-(\d+)"/g)].map(match=>match[1]);
  assert.equal(ids.length,33);
  assert.equal(new Set(ids).size,33);
  assert.deepEqual([...ids].map(Number).sort((a,b)=>a-b),Array.from({length:33},(_,index)=>index+1));
  assert.ok(getArticle(contentHtml,30));
  assert.ok(getArticle(contentHtml,31));
  assert.ok(getArticle(contentHtml,32));
  assert.ok(getArticle(contentHtml,33));
  for(const id of [30,31,32,33])assert.doesNotMatch(getArticle(contentHtml,id),/<time|datetime=/);
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

test('PRESS and Awards agree on the two confirmed Daesangs',async()=>{
  const press=JSON.parse(await readFile(pressUrl,'utf8')).contentHtml;
  const awards=JSON.parse(await readFile(new URL('../src/pages/awards.json',import.meta.url),'utf8')).contentHtml;
  const first=getArticle(press,32);
  const second=getArticle(press,33);
  for(const text of ['2027','COMPLETE','Album of the Year (Daesang)','첫 Grand Prize'])assert.ok(first.includes(text),text);
  for(const text of ['2028','Artist of the Year (Daesang)','NIGHT','두 번째 Grand Prize'])assert.ok(second.includes(text),text);
  assert.ok(awards.includes('Album of the Year (Daesang)'));
  assert.ok(awards.includes('Artist of the Year (Daesang)'));
  assert.ok(awards.includes('2 DAESANGS'));
  assert.doesNotMatch(press+awards,/Best Art Direction/i);
});

test('Awards PRESS articles link only to existing related records',async()=>{
  const {contentHtml}=JSON.parse(await readFile(pressUrl,'utf8'));
  const expected={
    30:['awards.html','paradox-2029.html','nightmare-2029.html'],
    31:['awards.html'],
    32:['awards.html','complete-2027.html','daesang-moments.html'],
    33:['awards.html','persona-2028.html','daesang-moments.html']
  };
  for(const [id,hrefs] of Object.entries(expected)){
    const article=getArticle(contentHtml,id);
    assert.deepEqual([...article.matchAll(/<a href="([^"]+)"/g)].map(match=>match[1]),hrefs);
    for(const href of hrefs)await access(new URL(`../src/pages/${href.replace('.html','.json')}`,import.meta.url));
  }
});

test('PRESS uses Archive as its header and detail-navigation parent',async()=>{
  const page=JSON.parse(await readFile(pressUrl,'utf8'));
  assert.equal(page.activeNav,'ARCHIVE');
  assert.deepEqual(detailNavigation(page).parent,{label:'ARCHIVE',href:'archive.html',back:'전체 아카이브로'});
});

test('PRESS awards image is natural-size and responsive',async()=>{
  const {contentHtml}=JSON.parse(await readFile(pressUrl,'utf8'));
  const css=await readFile(new URL('../public/assets/css/press.css',import.meta.url),'utf8');
  assert.match(css,/\.press-award-overview>img\{[^}]*width:100%;height:auto/);
  assert.doesNotMatch(css,/\.press-award-overview>img\{[^}]*object-fit/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*\.press-award-overview\{grid-template-columns:1fr/);
  for(const [id,image] of [[32,'assets/images/final-additions/awards/awards-03.webp'],[33,'assets/images/final-additions/awards/awards-02.webp']]){
    const article=getArticle(contentHtml,id);
    assert.ok(article.includes(`src="${image}"`));
    assert.ok(article.includes('width="1448" height="1086" loading="lazy"'));
    await access(new URL(`../public/${image}`,import.meta.url));
  }
});

test('obsolete 2029 no-awards copy and excluded idea remain absent',async()=>{
  const {contentHtml}=JSON.parse(await readFile(pressUrl,'utf8'));
  assert.doesNotMatch(contentHtml,/NO 2029 YEAR-END AWARDS/i);
  assert.doesNotMatch(contentHtml,/Best Art Direction/i);
});
