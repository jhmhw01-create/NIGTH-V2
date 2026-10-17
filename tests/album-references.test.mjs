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

test('all eighteen numeric slots resolve to the approved album IDs exactly once', () => {
  const indices = [...page.contentHtml.matchAll(/\{\{albums:(\d+)\}\}/g)].map(match => Number(match[1]));
  assert.equal(indices.length, 18);
  assert.equal(new Set(indices).size, 18);
  const references = indices.map(index => {
    assert.ok(albums[index], `Missing album at index ${index}`);
    return {index, id:albums[index].id};
  });
  assert.deepEqual(references, baseline.slots);
  assert.equal(rendered.includes('{{albums:'), false);
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

test('invalid numeric album references fail instead of rendering an empty or wrong card', () => {
  for (const index of [18, 99]) {
    assert.throws(() => renderCollections(`{{albums:${index}}}`, {albums}), {
      message:`Unknown record: albums:${index}`
    });
  }
  assert.throws(() => renderCollections('{{albums:0}}', {}), {message:'Unknown record: albums:0'});
  assert.throws(() => renderCollections('{{albums:0}}', {albums:[undefined]}), {message:'Unknown record: albums:0'});
});
