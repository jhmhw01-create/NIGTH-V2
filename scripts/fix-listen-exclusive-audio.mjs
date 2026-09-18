import fs from 'node:fs';

const pagePath = 'src/pages/listen.json';
const page = JSON.parse(fs.readFileSync(pagePath, 'utf8'));
const marker = '<script src="assets/js/main.js"></script>';
const exclusive = `<script>\n(() => {\n  const players = [...document.querySelectorAll('.listen-list audio')];\n  players.forEach((player) => {\n    player.addEventListener('play', () => {\n      players.forEach((other) => {\n        if (other !== player && !other.paused) other.pause();\n      });\n    });\n  });\n})();\n</script>`;

if (!page.afterFooterHtml.includes(marker)) {
  throw new Error('LISTEN main script marker not found');
}
if (!page.afterFooterHtml.includes("document.querySelectorAll('.listen-list audio')")) {
  page.afterFooterHtml = page.afterFooterHtml.replace(marker, `${marker}\n  ${exclusive}`);
}
fs.writeFileSync(pagePath, JSON.stringify(page, null, 2) + '\n');

const testPath = 'tests/listen-exclusive-audio.test.mjs';
const test = `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { readFile } from 'node:fs/promises';\n\nconst root = new URL('../', import.meta.url);\nconst page = JSON.parse(await readFile(new URL('src/pages/listen.json', root), 'utf8'));\n\ntest('LISTEN audio players pause any previously playing track', () => {\n  const html = page.afterFooterHtml;\n  assert.match(html, /document\\.querySelectorAll\\('\\.listen-list audio'\\)/);\n  assert.match(html, /player\\.addEventListener\\('play'/);\n  assert.match(html, /other !== player && !other\\.paused/);\n  assert.match(html, /other\\.pause\\(\\)/);\n  assert.doesNotMatch(html, /currentTime\\s*=\\s*0/);\n});\n\ntest('LISTEN keeps thirteen native audio players', () => {\n  const count = (page.contentHtml.match(/<audio\\b/g) || []).length;\n  assert.equal(count, 13);\n});\n`;
fs.writeFileSync(testPath, test);

console.log('LISTEN now pauses any previously playing track before a new track continues.');
