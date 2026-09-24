import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const page=JSON.parse(await readFile(new URL('../src/pages/history.json',import.meta.url),'utf8'));
const html=page.contentHtml;

test('history preserves every existing event and adds the current requested records',()=>{
  const expected=["NIGHT Debut","AFTER MIDNIGHT","NOCTURNE","LUNA","ECLIPSE","ANGELO Departure","NO SIGNAL","TAEHOON Joins NIGHT","NEW MOON","LUNA 2nd Generation","LUCID","NIGHT 1ST CONCERT — INTO THE NIGHT","NIGHT 1ST OVERSEAS TOUR — INTO THE NIGHT","LUNA 3rd Generation","NIGHT OFFICIAL PHOTO BOOK","NIGHT 2ND CONCERT — BEYOND THE NIGHT","NIGHT MAGAZINE FEATURE","NIGHT 2ND OVERSEAS TOUR","PHANTOM","PHANTOM Era","LUNA 4th Generation","IHWAN / TAEHOON Birthday Café","AFTER HOURS","2026 Year-End Awards","NIGHT 3rd Concert 夢夜","DOHA / WOOHYUN / JIWOO Birthday Café","NIGHT 3RD OVERSEAS TOUR","COMPLETE","NIGHT 관찰 예능","INFINITY","SENSATIONAL","Five Years. One Night.","LUNA 5th Generation — EVERNIGHT","WINGS","NIGHT 4TH CONCERT 超夜","NIGHT 4TH OVERSEAS TOUR","PERSONA","LUNA 6th Generation — AFTERIMAGE","NIGHTMARE","SUNDAY CLUB","NIGHT 1ST FAN-CON — MOONLIGHT CLUB","LUNA 7th Generation — MIDNIGHT OBSERVATORY"];
  for(const title of expected)assert.ok(html.includes('<h3>'+title+'</h3>'),title);
  assert.equal((html.match(/class="history-event"/g)||[]).length,expected.length+7);
  assert.ok(html.includes('<h3>SOMETIME</h3>'));
  assert.ok(html.includes('ALBUM · 2030.04.08'));
  assert.ok(html.includes('<h3>MOMENTS OF THE NIGHT</h3>'));
  assert.ok(html.includes('OFFICIAL DOCUMENTARY · 2029.12.01'));
  assert.ok(html.includes('<h3>WOOHYUN × JIWOO — SO GOOD</h3>'));
  assert.ok(html.includes('UNIT ALBUM · 2028.06.16'));
  assert.ok(html.includes('LIVE · 2025.08.09'));
  assert.ok(html.includes('TOUR · 2025.08.23–10.04'));
  assert.ok(html.includes('TOUR · 2026.06.13–09.12'));
  assert.ok(html.includes('TOUR · 2027.03.13–07.17'));
  assert.ok(html.includes('TOUR · 2028.06.10–10.29'));
  assert.ok(html.includes('DIGITAL SINGLE · 2029.11.02'));
  assert.ok(html.includes('FANCLUB · 2029.11.20'));
  assert.ok(html.includes('FAN-CON · 2029.10.13–2029.10.14'));
  assert.ok(html.includes('SEASON’S GREETINGS · 2029.01.02'));
  assert.ok(html.includes('ALBUM · 2029.08.27'));
  assert.ok(html.includes('EXHIBITION · 2029.05.18–2029.06.03'));
  assert.ok(html.includes('<h3>COACHELLA</h3>'));
  assert.ok(html.includes('href="coachella-2029.html"'));
  assert.ok(!html.includes('<img'));
});

test('2029 current records are connected in newest-first order',()=>{
  const section=html.slice(html.indexOf('id="history-2029"'),html.indexOf('id="history-2028"'));
  const ordered=['MOMENTS OF THE NIGHT','LUNA 7th Generation — MIDNIGHT OBSERVATORY','REST','NIGHT 1ST FAN-CON — MOONLIGHT CLUB','PARADOX','OUT OF FRAME','NIGHTMARE','SUNDAY CLUB'];
  const positions=ordered.map(title=>section.indexOf('<h3>'+title+'</h3>'));
  assert.ok(positions.every(position=>position>=0));
  assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
  for(const href of ['luna7.html','moonlight-club-2029.html','season-greetings-2029.html']) assert.ok(section.includes('href="'+href+'"'));
});

test('history years are newest first and every detail destination exists',async()=>{
  assert.deepEqual([...html.matchAll(/<article class="history-year" id="history-([^"]+)"/g)].map(x=>x[1]),['2030','2029','2028','2027','2026','2025','2024','2022-2023']);
  for(const m of html.matchAll(/href="([^"]+\.html)(?:#[^"]*)?"/g))await access(new URL('../src/pages/'+m[1].replace('.html','.json'),import.meta.url));
});

test('history theme stays scoped, text-only and responsive',async()=>{
  const css=await readFile(new URL('../public/assets/css/history-fashion.css',import.meta.url),'utf8');
  assert.ok(!css.includes('url('));
  assert.ok(css.includes('body:has(.history-section)'));
  assert.ok(css.includes('grid-template-columns:1fr'));
  assert.ok(css.includes(':focus-visible'));
});

test('history retains canonical dates with concise fan-facing copy',()=>{
  for(const fragment of [
    '<small>2022.11.15 · DEBUT</small>',
    '<small>LIVE · 2025.08.09</small>',
    '<small>TOUR · 2025.08.23–10.04</small>',
    '<small>TOUR · 2026.06.13–09.12</small>',
    '<small>COMEBACK · 2026.09.14</small>',
    '<small>LIVE · 2027.01.29</small>',
    '<small>TOUR · 2027.03.13–07.17</small>',
    '<small>TOUR · 2028.06.10–10.29</small>',
    '<small>MINI ALBUM · 2028.08.21</small>',
    '<small>ALBUM · 2029.02.23</small>',
    '<small>ALBUM · 2029.08.27</small>',
    '<small>DIGITAL SINGLE · 2029.11.02</small>',
    '<small>FANCLUB · 2029.11.20</small>',
    '<small>FAN-CON · 2029.10.13–2029.10.14</small>',
    '<small>SEASON’S GREETINGS · 2029.01.02</small>',
    '<small>ALBUM · 2030.04.08</small>',
    'NIGHT의 공식 에디토리얼 포토북 공개.',
    '앨범 PHANTOM 발표. 타이틀곡은 ILLUSION.',
    '세 번째 단독 콘서트 夢夜 개최.',
    '미니앨범 PERSONA 발표.',
    '어둡고 긴장감 있는 사운드와 비주얼을 선보인 앨범 NIGHTMARE 발표.',
    '앨범 PARADOX 발표. 타이틀곡은 PARADISE.',
    '디지털 싱글 REST 발표.'
  ]) assert.ok(html.includes(fragment),fragment);
  assert.ok(!html.includes('NIGHT 자신들이 악몽 그 자체였음이 드러나는'));
  assert.ok(!html.includes('완벽함의 모순을 주제로 한 앨범 PARADOX'));
});

test('history events with exact dates remain in chronological order',async()=>{
  const page=JSON.parse(await readFile(new URL('../src/pages/history.json',import.meta.url),'utf8'));
  const html=page.contentHtml;
  assert.ok(html.indexOf('TOUR · 2028.06.10–10.29')<html.indexOf('UNIT ALBUM · 2028.06.16'));
  assert.ok(html.indexOf('MEMBER EVENT · 2026.09.22–11.29')<html.indexOf('FANCLUB · 2026.10.15'));
});
