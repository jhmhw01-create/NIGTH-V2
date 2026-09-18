import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const page = JSON.parse(await readFile(new URL('src/pages/listen.json', root), 'utf8'));
const nativeAudio = await readFile(new URL('src/react/NativeAudio.jsx', root), 'utf8');

test('LISTEN React audio pauses any previously playing track', () => {
  assert.match(nativeAudio, /event\.currentTarget\.closest\('\.listen-list'\)/);
  assert.match(nativeAudio, /document\.querySelectorAll\('\.listen-list audio'\)/);
  assert.match(nativeAudio, /other!==event\.currentTarget&&!other\.paused/);
  assert.match(nativeAudio, /other\.pause\(\)/);
  assert.match(nativeAudio, /onPlay\?\.\(event\)/);
  assert.doesNotMatch(nativeAudio, /currentTime\s*=\s*0/);
});

test('LISTEN keeps thirteen native audio players', () => {
  const count = (page.contentHtml.match(/<audio\b/g) || []).length;
  assert.equal(count, 13);
});

test('LISTEN hides native download controls on all thirteen players', () => {
  const tags = page.contentHtml.match(/<audio\b[^>]*>/g) || [];
  assert.equal(tags.length, 13);
  assert.ok(tags.every(tag => tag.includes('controlsList=\"nodownload\"')));
});
