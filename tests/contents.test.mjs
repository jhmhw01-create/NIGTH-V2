import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ContentsEntry,renderCollections} from '../src/components/collections.mjs';
test('51 text entries keep links, categories and existing deep links',async()=>{
  const entries=JSON.parse(await readFile(new URL('../src/data/contentsEntries.json',import.meta.url),'utf8'));
  assert.equal(entries.length,51);
  assert.equal(new Set(entries.map(x=>x.href)).size,51);
  assert.equal(new Set(entries.map(x=>x.category)).size,6);
  assert.equal(entries[0].category,'daily');
  for(const entry of entries){
    const output=ContentsEntry(entry);
    assert(!output.includes('<img'));
    assert(output.includes('data-category="'+entry.category+'"'));
    assert(output.includes('href="'+entry.href+'"'));
  }
  assert(entries.some(x=>x.anchor==='season-2027'));
  assert(entries.some(x=>x.href==='out-of-frame.html'));
  assert(entries.some(x=>x.href==='night-off-summer.html'));
  assert(entries.some(x=>x.href==='moonlight-club-2029.html'));
  assert(entries.some(x=>x.href==='coachella-2029.html'));
  assert(entries.some(x=>x.href==='global-special-music-show.html'&&x.category==='stage'));
  assert(entries.some(x=>x.href==='documentary-2029.html'));
  assert(entries.some(x=>x.href==='woohyun-jiwoo-unit-2024.html'));
  assert(entries.some(x=>x.href==='so-good-2028.html'));
  assert(entries.some(x=>x.href==='sometime.html'));
  assert(entries.some(x=>x.href==='night-in-the-house-2030.html'));
  assert(entries.some(x=>x.href==='doha-play-on.html'));
  assert(entries.some(x=>x.href==='nights-closet.html'&&x.category==='daily'));
  assert(entries.some(x=>x.href==='night-files.html'&&x.category==='daily'));
  const sundayClub=entries.find(x=>x.href==='season-greetings-2029.html');
  assert.equal(sundayClub?.category,'luna');
  for(const route of ['luna4.html','luna5.html','luna6.html','luna7.html'])assert(!entries.some(x=>x.href===route));
  const externalEditorial=entries.find(x=>x.href==='https://jhmhw01-create.github.io/NIGHT_EDITORIAL/');
  assert.equal(externalEditorial?.category,'editorial');
  assert(ContentsEntry(externalEditorial).includes('target="_blank" rel="noopener noreferrer"'));
});

test('contents counts follow selected cards rather than the whole collection',async()=>{
  const entries=JSON.parse(await readFile(new URL('../src/data/contentsEntries.json',import.meta.url),'utf8'));
  const content='{{contentsCount:all}} / {{contentsCount:album}} / {{contentsCount:daily}} / {{contentsEntries:36}}';
  assert(renderCollections(content,{contentsEntries:entries}).startsWith('1 / 1 / 0 / '));
  assert(renderCollections(content+'{{contentsEntries:6}}',{contentsEntries:entries}).startsWith('2 / 1 / 1 / '));
});

test('contents page renders every entry from the data-driven collection',async()=>{
  const entries=JSON.parse(await readFile(new URL('../src/data/contentsEntries.json',import.meta.url),'utf8'));
  const {syncHubPage}=await import('../scripts/hub-sync.mjs');
  const page=syncHubPage(JSON.parse(await readFile(new URL('../src/pages/contents.json',import.meta.url),'utf8')));
  const placeholders=[...page.contentHtml.matchAll(/\{\{contentsEntries:([^}]+)\}\}/g)].map(match=>match[1]);
  assert.deepEqual(placeholders,['all']);
  const rendered=renderCollections(page.contentHtml,{contentsEntries:entries});
  assert(rendered.includes('전체 <span>51</span>'));
  for(const entry of entries)assert(rendered.includes(`href="${entry.href}"`),entry.href);
  for(const route of ['return-2030.html','paradox-2029.html','nightmare-2029.html','phantom-2026.html'])assert(entries.some(entry=>entry.href===route&&entry.category==='album'));
  assert(!rendered.includes('{{contentsCount:'));
  const labels={daily:'일상·자체 콘텐츠',album:'앨범',stage:'공연·방송·수상',luna:'LUNA·시즌그리팅',editorial:'에디토리얼',social:'SNS'};
  for(const [category,label] of Object.entries(labels)){
    const count=entries.filter(entry=>entry.category===category).length;
    assert(page.contentHtml.includes(`data-content-filter=\"${category}\"`));
    assert(rendered.includes(`${label} <span>${count}</span>`));
  }
});
