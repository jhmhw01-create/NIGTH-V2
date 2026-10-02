import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile,readdir} from 'node:fs/promises';
import {jiwooDramaOsts} from '../src/data/jiwooFilmography.mjs';
import {fanclubDetailRoutes,personalRoutes,visualRoutes} from '../src/react/routes.mjs';

const root=new URL('../',import.meta.url);
const readPage=async route=>JSON.parse(await readFile(new URL(`src/pages/${route.replace('.html','.json')}`,root),'utf8'));

test('new content routes use every supplied WebP exactly once without invented dates',async()=>{
  const groups=[
    ['luna8.html','LUNA_8TH',22],
    ['taehoon-todays-scenery.html','TAEHOON_solo_single',2],
    ['ihwan-graduation.html','IHWAN_graduation',5],
    ['fashion-week-2030.html','2030_FASHION_WEEK',5]
  ];
  for(const [route,directory,count] of groups){
    const page=await readPage(route);
    const inventory=(await readdir(new URL(`public/assets/images/${directory}/`,root))).filter(file=>file.endsWith('.webp')).sort();
    const references=[...page.contentHtml.matchAll(new RegExp(`assets/images/${directory.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}/([^"']+\\.webp)`,'g'))].map(match=>match[1].replaceAll('&amp;','&')).sort();
    assert.equal(inventory.length,count);assert.deepEqual(references,inventory);
    assert.equal((page.contentHtml.match(/loading="eager"/g)||[]).length,1);
    assert.equal((page.contentHtml.match(/loading="lazy"/g)||[]).length,count-1);
    const visibleCopy=(page.headHtml+page.contentHtml).replace(/\bsrc="[^"]*"/g,'');
    assert.doesNotMatch(visibleCopy,/2030\.\d{2}\.\d{2}|대학교|학위|MILAN|PARIS/);
    await Promise.all(inventory.map(file=>access(new URL(`public/assets/images/${directory}/${file}`,root))));
  }
  assert.ok(fanclubDetailRoutes.includes('luna8.html'));
  assert.ok(visualRoutes.includes('fashion-week-2030.html'));
  assert.ok(personalRoutes.includes('taehoon-todays-scenery.html'));
  assert.ok(personalRoutes.includes('ihwan-graduation.html'));
});

test('the two OST covers remain attached only to their confirmed JIWOO works',async()=>{
  assert.deepEqual(Object.keys(jiwooDramaOsts).sort(),['flawless','instead-of-saying-i-like-you']);
  assert.deepEqual(Object.values(jiwooDramaOsts).map(item=>item.title).sort(),['INNOCENT','말하지 않아도']);
  for(const item of Object.values(jiwooDramaOsts))await access(new URL(`public/${item.image}`,root));
  const component=await readFile(new URL('src/react/JiwooActingPage.jsx',root),'utf8');
  assert.match(component,/ORIGINAL SOUNDTRACK/);
  assert.doesNotMatch(component,/JIWOO.*VOCAL|JIWOO.*가창/);
});

test('fashion week and IHWAN graduation alone use natural-ratio archive cards',async()=>{
  const fashion=await readPage('fashion-week-2030.html');
  const graduation=await readPage('ihwan-graduation.html');
  const luna=await readPage('luna8.html');
  const css=await readFile(new URL('public/assets/css/archive-new.css',root),'utf8');
  assert.match(fashion.contentHtml,/archive-new-grid archive-new-grid--natural-images/);
  assert.match(graduation.contentHtml,/archive-new-grid archive-new-grid--natural-images/);
  assert.doesNotMatch(luna.contentHtml,/archive-new-grid--natural-images/);
  assert.match(css,/\.archive-new-grid--natural-images \.archive-new-card img\{[^}]*width:100%;height:auto;aspect-ratio:auto;object-fit:initial/);
});
