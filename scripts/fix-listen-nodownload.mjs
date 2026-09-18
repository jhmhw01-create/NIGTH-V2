import fs from 'node:fs';

const pagePath = 'src/pages/listen.json';
const page = JSON.parse(fs.readFileSync(pagePath, 'utf8'));
const before = '<audio controls preload="metadata"';
const after = '<audio controls controlsList="nodownload" preload="metadata"';
const count = (page.contentHtml.match(/<audio controls preload="metadata"/g) || []).length;
if (count !== 13) throw new Error(`Expected 13 LISTEN audio tags without controlsList, found ${count}`);
page.contentHtml = page.contentHtml.split(before).join(after);
fs.writeFileSync(pagePath, JSON.stringify(page, null, 2) + '\n');

const testPath = 'tests/listen-exclusive-audio.test.mjs';
let test = fs.readFileSync(testPath, 'utf8');
if (!test.includes("LISTEN hides native download controls")) {
  test += `\ntest('LISTEN hides native download controls on all thirteen players', () => {\n  const tags = page.contentHtml.match(/<audio\\b[^>]*>/g) || [];\n  assert.equal(tags.length, 13);\n  assert.ok(tags.every(tag => tag.includes('controlsList=\\"nodownload\\"')));\n});\n`;
  fs.writeFileSync(testPath, test);
}
console.log('Added controlsList=nodownload to all LISTEN audio players.');
