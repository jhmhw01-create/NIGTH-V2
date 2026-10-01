import assert from 'node:assert/strict';
import {readdir, readFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {parse} from 'parse5';
import {reactRoutes} from '../src/react/routes.mjs';

const root = resolve(new URL('..', import.meta.url).pathname);
const output = join(root, 'dist');
const productionBase = 'https://jhmhw01-create.github.io/NIGTH-V2/';
const legacyRedirects = ['member-taehun.html'];

const attrs = (node) => Object.fromEntries((node.attrs || []).map(({name, value}) => [name, value]));
const walk = (node, visit) => {
  visit(node);
  for (const child of node.childNodes || []) walk(child, visit);
  if (node.content) walk(node.content, visit);
};
const text = (node) => {
  let value = node.value || '';
  for (const child of node.childNodes || []) value += text(child);
  return value.replace(/\s+/g, ' ').trim();
};
const nodes = (document, tag) => {
  const matches = [];
  walk(document, (node) => { if (node.tagName === tag) matches.push(node); });
  return matches;
};

const files = (await readdir(output)).filter((name) => name.endsWith('.html')).sort();
const expectedFiles = [...reactRoutes, ...legacyRedirects].sort();
assert.deepEqual(files, expectedFiles, 'dist HTML must contain every canonical route and only the known legacy redirect');

const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8');
const sitemapRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1] === productionBase ? 'index.html' : match[1].replace(productionBase, ''))
  .sort();
assert.deepEqual(sitemapRoutes, [...reactRoutes].sort(), 'sitemap must match the canonical route registry exactly');

let imageCount = 0;
let largeGalleryCount = 0;
for (const route of reactRoutes) {
  const html = await readFile(join(output, route), 'utf8');
  const document = parse(html);
  const titles = nodes(document, 'title');
  const metas = nodes(document, 'meta').map(attrs);
  const links = nodes(document, 'link').map(attrs);
  const canonical = links.filter((entry) => entry.rel === 'canonical');
  const descriptions = metas.filter((entry) => entry.name === 'description');
  const mains = nodes(document, 'main');
  const h1s = nodes(document, 'h1');
  assert.equal(titles.length, 1, `${route}: expected one title`);
  assert.ok(text(titles[0]), `${route}: title must not be empty`);
  assert.equal(descriptions.length, 1, `${route}: expected one meta description`);
  assert.ok(descriptions[0].content?.trim(), `${route}: meta description must not be empty`);
  const canonicalUrl = route === 'index.html' ? productionBase : `${productionBase}${route}`;
  assert.deepEqual(canonical.map((entry) => entry.href), [canonicalUrl], `${route}: canonical URL mismatch`);
  assert.equal(mains.length, 1, `${route}: expected one main landmark`);
  assert.equal(h1s.length, 1, `${route}: expected one h1`);

  const idMap = new Map();
  walk(document, (node) => { const id = attrs(node).id; if (id) idMap.set(id, node); });
  for (const image of nodes(document, 'img')) {
    const attributes = attrs(image);
    assert.ok(Object.hasOwn(attributes, 'alt'), `${route}: image is missing alt (${attributes.src || 'dynamic image'})`);
    if (attributes.src) imageCount += 1;
  }
  for (const frame of nodes(document, 'iframe')) {
    const attributes = attrs(frame);
    assert.ok(attributes.title?.trim(), `${route}: iframe is missing a title`);
    assert.equal(attributes.loading, 'lazy', `${route}: iframe must retain lazy loading`);
  }
  walk(document, (node) => {
    const attributes = attrs(node);
    if (attributes.tabindex && Number(attributes.tabindex) > 0) assert.fail(`${route}: positive tabindex is not allowed`);
    if (node.tagName !== 'button' && !(node.tagName === 'a' && attributes.href)) return;
    const labelled = (attributes['aria-labelledby'] || '').split(/\s+/).filter(Boolean).map((id) => text(idMap.get(id) || {})).join(' ');
    const descendants = text(node) || nodes(node, 'img').map((image) => attrs(image).alt || '').join(' ').trim();
    assert.ok(attributes['aria-label']?.trim() || labelled || descendants, `${route}: unnamed ${node.tagName}`);
  });

  const contentImages = nodes(document, 'img').map(attrs).filter((entry) => entry.src);
  if (contentImages.length >= 20) {
    largeGalleryCount += 1;
    const eager = contentImages.filter((entry) => entry.loading !== 'lazy');
    assert.ok(eager.length <= 2, `${route}: large image page has ${eager.length} eager images (maximum 2)`);
  }
}

console.log(`Production artifact verified: ${reactRoutes.length} canonical routes, ${legacyRedirects.length} redirect, ${imageCount} rendered images.`);
console.log(`Sitemap entries: ${sitemapRoutes.length}; large image pages checked: ${largeGalleryCount}.`);
