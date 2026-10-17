import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {parseFragment} from 'parse5';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {AlbumCard, renderCollections} from '../src/components/collections.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
import {buildSourceSearchCatalog} from './search-fixture.mjs';

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
// Captured from the approved main commit; never refresh this fixture during tests.
const baseline = await readJson('./fixtures/album-reference-baseline.json');
const albums = await readJson('../src/data/albums.json');
const page = await readJson('../src/pages/discography.json');
const rendered = renderCollections(page.contentHtml, {albums});
const sha256 = text => createHash('sha256').update(text).digest('hex');
const walk = node => [node, ...(node.childNodes || []).flatMap(walk)];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const cardIds = html => walk(parseFragment(html))
  .filter(node => node.tagName === 'article' && /\b(?:discography-card|album-card)\b/.test(attr(node, 'class') || ''))
  .map(node => attr(node, 'id'));

test('the eighteen album IDs remain unique and retain their catalog input order', () => {
  assert.equal(albums.length, 18);
  assert.equal(new Set(albums.map(album => album.id)).size, 18);
  assert.deepEqual(albums.map(album => album.id), baseline.albumIds);
  for (const album of albums) {
    assert.equal(typeof album.id, 'string');
    assert.ok(album.id);
    assert.equal(cardIds(AlbumCard(album))[0], album.id);
  }
});

test('all eighteen ID slots reference the same approved albums in the same positions', () => {
  const ids = [...page.contentHtml.matchAll(/\{\{album:([^{}]+)\}\}/g)].map(match => match[1]);
  assert.equal(ids.length, 18);
  assert.equal(new Set(ids).size, 18);
  assert.deepEqual(ids, baseline.slots.map(slot => slot.id));
  assert.equal(page.contentHtml.includes('{{albums:'), false);
  assert.equal(rendered.includes('{{album:'), false);
  assert.equal(rendered.includes('{{albums:'), false);
});

test('ID rendering is byte-identical to the approved numeric-slot expansion', () => {
  // Test-only legacy oracle: production deliberately rejects numeric references.
  const numeric = page.contentHtml.replace(/\{\{album:([^{}]+)\}\}/g, (_, id) => {
    const slot = baseline.slots.find(slot => slot.id === id);
    assert.ok(slot, id);
    return `{{albums:${slot.index}}}`;
  });
  const legacy = numeric.replace(/\{\{albums:(\d+)\}\}/g, (_, index) => AlbumCard(albums[Number(index)]));
  assert.equal(sha256(legacy), baseline.renderedContentSha256);
  assert.equal(rendered, legacy);
});

test('ID lookup is independent of array positions without mutating the array', () => {
  const original = structuredClone(albums);
  for (const reordered of [[...albums].reverse(), [...albums.slice(1), albums[0]]]) {
    assert.equal(renderCollections(page.contentHtml, {albums:reordered}), rendered);
  }
  assert.deepEqual(albums, original);
});

test('the nineteen authored cards retain their exact rendered content and source order', () => {
  const ids = cardIds(rendered);
  assert.equal(ids.length, 19);
  assert.equal(new Set(ids).size, 19);
  assert.deepEqual(ids, baseline.sourceCardOrder);
  assert.equal(sha256(rendered), baseline.renderedContentSha256);
});

test('the real React renderer preserves the nineteen cards in their visible release order', async () => {
  // Bundle JSX in memory, sharing this test's React instance. No dist prerequisite
  // or generated source files: npm test must work before npm run build.
  const bundle = await build({
    entryPoints:[new URL('../src/react/ArchivePages.jsx', import.meta.url).pathname],
    bundle:true, write:false, platform:'node', format:'esm', jsx:'automatic',
    plugins:[{name:'share-test-react', setup(builder) {
      builder.onResolve({filter:/^react(?:\/.*)?$/}, ({path}) => ({path:import.meta.resolve(path), external:true}));
    }}]
  });
  const {ArchivePage} = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
  const html = renderToStaticMarkup(createElement(ArchivePage, {route:'discography.html', nodes:pageTree(rendered)}));
  assert.deepEqual(cardIds(html), baseline.displayCardOrder);
});

test('RETURN remains a single directly authored card outside the album collection', () => {
  assert.equal(albums.some(album => album.id === 'return'), false);
  assert.deepEqual(cardIds(page.contentHtml), ['return']);
  const cards = page.contentHtml.match(/<article\b[^>]*\bid="return"[\s\S]*?<\/article>/g) || [];
  assert.equal(cards.length, 1);
  assert.equal(sha256(cards[0]), baseline.returnCardSha256);
  assert.equal(cardIds(rendered).filter(id => id === 'return').length, 1);
});

test('PHANTOM keeps its canonical link correction without mutating authored data', () => {
  const phantom = albums.find(album => album.id === 'phantom');
  const original = structuredClone(phantom);
  assert.ok(phantom.bodyTemplateHtml.includes('href="assets/images/phantom-package-preview-0908.webp"'));
  const html = AlbumCard(phantom);
  assert.ok(html.includes('href="phantom-2026.html" aria-label="PHANTOM 공식 아카이브 열기"'));
  assert.equal(html.includes('href="assets/images/phantom-package-preview-0908.webp"'), false);
  assert.deepEqual(phantom, original);
});

test('all 105 search records preserve their IDs, URLs, order, and search metadata', async () => {
  const catalog = await buildSourceSearchCatalog();
  assert.equal(catalog.records.length, 105);
  assert.deepEqual(catalog.records.map(({id, href}) => ({id, href})), baseline.catalogEntries);
  // Source fixtures contain unresolved slot tokens in searchText. Freeze stable
  // search metadata here; compare complete production catalogs in clean builds.
  const metadata = catalog.records.map(({id, href, title, category, keywords, image}) => ({id, href, title, category, keywords, image}));
  assert.equal(sha256(JSON.stringify(metadata)), baseline.catalogMetadataSha256);
});

test('leftover numeric album references fail, even for valid indices and mixed tokens', () => {
  for (const index of [0, 17, 18, 99]) {
    assert.throws(() => renderCollections(`{{albums:${index}}}`, {albums}), {
      message:`Numeric album references are not supported: {{albums:${index}}}`
    });
  }
  assert.throws(() => renderCollections('{{album:phantom}}{{albums:7}}', {albums}), /Numeric album references are not supported/);
  assert.throws(() => renderCollections('{{album:nightmare}}', {
    albums:[{...albums[0], bodyTemplateHtml:'{{albums:0}}'}]
  }), {message:'Numeric album references are not supported: {{albums:0}}'});
});

test('unknown and duplicate album IDs produce explicit build errors', () => {
  for (const id of ['missing', '__proto__', '']) {
    assert.throws(() => renderCollections(`{{album:${id}}}`, {albums}), {message:`Unknown album id: ${id}`});
  }
  assert.throws(() => renderCollections('{{album:phantom}}', {}), {message:'Unknown album id: phantom'});
  assert.throws(() => renderCollections(page.contentHtml, {albums:[...albums, {...albums[0]}]}), {
    message:`Duplicate album id: ${albums[0].id}`
  });
  assert.throws(() => renderCollections('{{album:phantom}}', {albums:[undefined]}), {message:'Invalid album id'});
});

test('other collections retain their numeric reference behavior', () => {
  const record = {id:'sample', title:'Sample', attributesHtml:' id="sample"', bodyTemplateHtml:'<h3>{{title}}</h3>'};
  const notice = {...record, date:'2026-01-01', year:2026};
  assert.equal(renderCollections('{{notices:0}}', {notices:[notice]}), '<details id="sample"><h3>Sample</h3></details>');
  assert.equal(renderCollections('{{memberships:1}}', {memberships:[record, record]}), '<article id="sample"><h3>Sample</h3></article>');
  assert.equal(renderCollections('{{galleryCards:0}}', {galleryCards:[record]}), '<div id="sample"><h3>Sample</h3></div>');
  const entry = {...record, href:'sample.html', category:'music', label:'Music', summary:'Summary', action:'Open'};
  assert.equal(renderCollections('{{contentsEntries:0}}', {contentsEntries:[entry]}), '<a class="content-card contents-text-entry" href="sample.html" data-category="music"><small class="contents-entry-label">Music</small><h3>Sample</h3><p>Summary</p><span class="contents-entry-action">Open</span></a>');
  assert.throws(() => renderCollections('{{memberships:99}}', {}), {message:'Unknown record: memberships:99'});
});
