import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {ihwanMusicalFilmography,ihwanMusicalImages} from '../src/data/ihwanMusical.mjs';
import {personalRoutes,reactRoutes} from '../src/react/routes.mjs';
import {syncHubPage} from '../scripts/hub-sync.mjs';
import {ihwanMusicalPlacement} from '../scripts/audit-site.mjs';
import {PageLayout} from '../src/components/layout.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));

test('IHWAN musical filmography keeps the confirmed year, work and role order',()=>{
  assert.deepEqual(ihwanMusicalFilmography.map(({year,title,koreanTitle,role})=>({year,title,koreanTitle,role})),[
    {year:2025,title:'PHANTOM',koreanTitle:'팬텀',role:'필립 드 샹동'},{year:2025,title:'ELISABETH',koreanTitle:'엘리자벳',role:'루이지 루케니'},{year:2026,title:'DEATH NOTE',koreanTitle:'데스노트',role:'야가미 라이토'},{year:2027,title:'THE MAN WHO LAUGHS',koreanTitle:'웃는 남자',role:'그윈 플렌'},{year:2028,title:'FRANKENSTEIN',koreanTitle:'프랑켄슈타인',role:'앙리 뒤프레 / 괴물'},{year:2029,title:'PHANTOM',koreanTitle:'팬텀',role:'에릭'},{year:2029,title:'JEKYLL & HYDE',koreanTitle:'지킬앤하이드',role:'지킬 / 하이드'},{year:2030,title:'HEDWIG',koreanTitle:'헤드윅',role:null}
  ]);
  assert.deepEqual([...new Set(ihwanMusicalFilmography.map(work=>work.year))],[2025,2026,2027,2028,2029,2030]);
  assert.notEqual(ihwanMusicalFilmography[0].slug,ihwanMusicalFilmography[5].slug);
});

test('all 34 images map exactly once to the confirmed works and content types',async()=>{
  const entries=ihwanMusicalFilmography.flatMap(work=>work.entries.map(entry=>({...entry,work:work.slug})));
  assert.equal(entries.length,34);assert.equal(new Set(ihwanMusicalImages).size,34);
  assert.deepEqual(entries.map(entry=>entry.number),Array.from({length:34},(_,index)=>index+1));
  assert.deepEqual(ihwanMusicalFilmography.map(work=>work.entries.map(entry=>entry.number)),[[1,2,3,4,5],[6,7],[8,9],[10,11],[12,13,14,15,16,17,18],[19,20,21,22,23,24],[25,26,27],[28,29,30,31,32,33,34]]);
  const expectedTypes=['CASTING INTERVIEW','CASTING BOARD','SCRIPT READING','PERFORMANCE STILL','CURTAIN CALL','CASTING BOARD','PERFORMANCE STILL','CASTING BOARD','PERFORMANCE STILL','CASTING BOARD','PERFORMANCE STILL','INTERVIEW','CASTING BOARD','REHEARSAL — HENRI DUPRÉ','REHEARSAL — THE CREATURE','PERFORMANCE STILL — HENRI DUPRÉ','PERFORMANCE STILL — THE CREATURE','CURTAIN CALL','CASTING INTERVIEW','CASTING BOARD','REHEARSAL ROOM','REHEARSAL WITH CHRISTINE','PERFORMANCE STILL','CURTAIN CALL','CASTING BOARD','PERFORMANCE STILL — JEKYLL','PERFORMANCE STILL — HYDE','POSTER','CASTING BOARD','DRESSING ROOM','PERFORMANCE STILL 01','PERFORMANCE STILL 02','PERFORMANCE STILL 03','CURTAIN CALL'];
  assert.deepEqual(entries.map(entry=>entry.type),expectedTypes);
  assert.deepEqual(entries.filter(entry=>entry.interview).map(entry=>entry.number),[1,12,19]);
  assert.ok(entries.filter(entry=>entry.interview).every(entry=>entry.interview.length===3));
  await Promise.all(ihwanMusicalImages.map(image=>access(join(root,'public',image))));
});

test('IHWAN musical archive participates in React rendering and member navigation',async()=>{assert.ok(personalRoutes.includes('ihwan-musical.html'));assert.ok(reactRoutes.includes('ihwan-musical.html'));const page=JSON.parse(await readFile(join(root,'src/pages/member-ihwan.json'),'utf8'));const synced=syncHubPage(page);assert.match(synced.contentHtml,/PERSONAL SCHEDULE/);assert.match(synced.contentHtml,/href="ihwan-musical\.html"/);assert.match(synced.contentHtml,/VIEW ARCHIVE →/);const placement=ihwanMusicalPlacement(PageLayout(synced));assert.equal(placement.valid,true);assert.equal(placement.musicalIndex,placement.keywordIndex+1);assert.equal(placement.switchIndex,placement.musicalIndex+1);});

test('IHWAN musical styles preserve image ratios and collapse editorial layouts on mobile',async()=>{const css=await readFile(join(root,'public/assets/css/ihwan-musical.css'),'utf8');assert.match(css,/\.musical-entry-image img\{[^}]*height:auto/);assert.match(css,/\.musical-work-content\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);assert.match(css,/@media\(max-width:820px\)[\s\S]*\.musical-work-content\{grid-template-columns:1fr/);assert.match(css,/\.musical-editorial\{grid-column:1\/-1;display:grid/);assert.doesNotMatch(css,/object-fit\s*:\s*cover/);});

test('IHWAN musical source renders the filmography hierarchy and only confirmed metadata',async()=>{const source=await readFile(join(root,'src/react/IhwanMusicalPage.jsx'),'utf8');assert.match(source,/YEAR → WORK → CONTENT/);assert.match(source,/FILMOGRAPHY/);assert.doesNotMatch(source,/THEATER|AWARD|PRODUCTION COMPANY/);});
