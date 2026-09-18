import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const page = JSON.parse(await readFile(new URL('src/pages/listen.json', root), 'utf8'));

test('LISTEN audio players pause any previously playing track', () => {
  const html = page.afterFooterHtml;
  assert.match(html, /document\.querySelectorAll\('\.listen-list audio'\)/);
  assert.match(html, /player\.addEventListener\('play'/);
  assert.match(html, /other !== player && !other\.paused/);
  assert.match(html, /other\.pause\(\)/);
  assert.doesNotMatch(html, /currentTime\s*=\s*0/);
});

test('LISTEN keeps thirteen native audio players', () => {
  const count = (page.contentHtml.match(/<audio\b/g) || []).length;
  assert.equal(count, 13);
});
