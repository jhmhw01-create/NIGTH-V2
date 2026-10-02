import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile,readdir} from 'node:fs/promises';
import {syncHubPage} from '../scripts/hub-sync.mjs';
import {visualRoutes} from '../src/react/routes.mjs';

const root=new URL('../',import.meta.url);
const readPage=async route=>JSON.parse(await readFile(new URL(`src/pages/${route.replace('.html','.json')}`,root),'utf8'));

const groups=[
  ['night-selfie-archive.html','selfie',26],
  ['member-fragrance-match.html','NIGHT-MEMBER FRAGRANCE MATCH',5],
  ['luxury-brand-ambassador-2030.html','2030 NIGHT-LUXURY BRAND AMBASSADOR',5]
];

test('all 36 supplied WebP assets are referenced exactly once by their matching archive',async()=>{
  for(const [route,directory,count] of groups){
    const page=await readPage(route);
    const inventory=(await readdir(new URL(`public/assets/images/${directory}/`,root))).filter(file=>file.endsWith('.webp')).sort();
    const escaped=directory.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const references=[...page.contentHtml.matchAll(new RegExp(`assets/images/${escaped}/([^\"']+\\.webp)`,'g'))].map(match=>match[1].replaceAll('&amp;','&')).sort();
    assert.equal(inventory.length,count);assert.deepEqual(references,inventory);
    await Promise.all(inventory.map(file=>access(new URL(`public/assets/images/${directory}/${file}`,root))));
    assert.match(page.contentHtml,/archive-new-grid--natural-images/);
  }
});

test('selfie archive preserves theme order, member order, loading policy and wide NIGHT image',async()=>{
  const page=await readPage('night-selfie-archive.html');
  const themes=['BED SELFIE','POST-WORKOUT SELFIE','POST-SHOWER SELFIE','BACKSTAGE SELFIE','WITH SNOWMAN'];
  let cursor=-1;for(const theme of themes){const next=page.contentHtml.indexOf(`<h2>${theme}</h2>`);assert.ok(next>cursor);cursor=next;}
  assert.equal((page.contentHtml.match(/loading=\"eager\"/g)||[]).length,1);
  assert.equal((page.contentHtml.match(/loading=\"lazy\"/g)||[]).length,25);
  assert.match(page.contentHtml,/archive-new-card archive-new-card--wide[^]*backstage selfie night\.webp/);
  for(const theme of ['bed selfie','post-workout selfie','post-shower selfie','backstage selfie']){
    const section=page.contentHtml.slice(page.contentHtml.indexOf(`id=\"${theme.replaceAll(' ','-')}\"`));
    const positions=['doha','woohyun','jiwoo','ihwan','taehoon'].map(member=>section.toLowerCase().indexOf(`${theme} ${member}`)>-1?section.toLowerCase().indexOf(`${theme} ${member}`):section.toLowerCase().indexOf(`${member} ${theme}`));
    assert.ok(positions.every(position=>position>=0));assert.deepEqual([...positions].sort((a,b)=>a-b),positions);
  }
});

test('fragrance match and ambassador pages keep only confirmed labels',async()=>{
  const fragrance=await readPage('member-fragrance-match.html');
  const ambassador=await readPage('luxury-brand-ambassador-2030.html');
  assert.doesNotMatch(fragrance.contentHtml,/AMBASSADOR|BRAND PARTNER|OFFICIAL CAMPAIGN|SPONSORED/);
  assert.match(fragrance.contentHtml,/DOHA × TOM FORD OUD WOOD/);
  assert.match(ambassador.contentHtml,/DOHA × SAINT LAURENT/);
  assert.doesNotMatch(ambassador.contentHtml,/CONTRACT|CAMPAIGN|COLLECTION|행사|계약/);
  assert.ok(groups.every(([route])=>visualRoutes.includes(route)));
});

test('all five member pages receive one shared ambassador CTA and no selfie or fragrance CTA',async()=>{
  for(const member of ['doha','woohyun','jiwoo','ihwan','taehoon']){
    const page=syncHubPage(await readPage(`member-${member}.html`));
    assert.equal((page.contentHtml.match(/href=\"luxury-brand-ambassador-2030\.html\"/g)||[]).length,1);
    assert.doesNotMatch(page.contentHtml,/night-selfie-archive\.html|member-fragrance-match\.html/);
  }
});
