import {readFile, writeFile, rename, unlink, readdir, stat} from 'node:fs/promises';
import {join, extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const oldRoute = 'member-taehun.html';
const newRoute = 'member-taehoon.html';
const oldSource = join(root, 'src/pages/member-taehun.json');
const newSource = join(root, 'src/pages/member-taehoon.json');

const textExtensions = new Set(['.html', '.js', '.jsx', '.json', '.md', '.mjs', '.ts', '.tsx', '.txt']);

async function replaceInTree(dir, replacements) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await replaceInTree(path, replacements);
      continue;
    }
    if (!textExtensions.has(extname(entry.name))) continue;
    let text = await readFile(path, 'utf8');
    const before = text;
    for (const [from, to] of replacements) text = text.replaceAll(from, to);
    if (text !== before) await writeFile(path, text, 'utf8');
  }
}

// Move all authored/internal references to the canonical spelling first.
await replaceInTree(join(root, 'src'), [
  [oldRoute, newRoute],
  ['assets/images/taehun.webp', 'assets/images/member-taehoon.webp'],
  ['TAEHUN', 'TAEHOON']
]);
await replaceInTree(join(root, 'tests'), [
  [oldRoute, newRoute],
  ['assets/images/taehun.webp', 'assets/images/member-taehoon.webp'],
  ['TAEHUN', 'TAEHOON']
]);

// Canonicalize TAEHOON's authored profile instead of patching it at build time.
let profileText = await readFile(oldSource, 'utf8');
profileText = profileText
  .replaceAll(oldRoute, newRoute)
  .replaceAll('assets/images/taehun.webp', 'assets/images/member-taehoon.webp')
  .replace('<dt>FAMILY</dt><dd>부모님 · 외동</dd>', '<dt>FAMILY</dt><dd>부모님 · 외동 (어릴 때부터 옆집 누나와 함께 자람)</dd>')
  .replace(
    '<p>이 친화력은 특정 인물이나 특정한 성장 배경 때문에 만들어진 것이 아니라, 태훈이 원래부터 가지고 있는 성격이다.</p>',
    '<p>외동이지만 어릴 때부터 옆집 누나와 자주 어울려 자라 혼자 지내는 데 익숙한 외동 스타일은 아니며, 이런 성장 배경은 NIGHT 형들에게 자연스럽게 붙고 함께 시간을 보내는 친밀한 성향과도 이어진다.</p>'
  )
  .replaceAll('TAEHUN', 'TAEHOON');
await writeFile(oldSource, profileText, 'utf8');
await rename(oldSource, newSource);

// TAEHOON no longer needs legacy portrait/content normalization; the other four members keep it.
await writeFile(join(root, 'scripts/member-page-normalization.mjs'), `const memberPortraits = {
  'member-doha.html': ['assets/images/doha.webp', 'assets/images/member-doha.webp'],
  'member-woohyun.html': ['assets/images/woohyun.webp', 'assets/images/member-woohyun.webp'],
  'member-jiwoo.html': ['assets/images/jiwoo.webp', 'assets/images/member-jiwoo.webp'],
  'member-ihwan.html': ['assets/images/ihwan.webp', 'assets/images/member-ihwan.webp']
};

export function normalizeMemberPage(page) {
  const portrait = memberPortraits[page?.route];
  if (!portrait || typeof page.contentHtml !== 'string') return page;

  const contentHtml = page.contentHtml.replace(\`src="\${portrait[0]}"\`, \`src="\${portrait[1]}"\`);
  return {...page, contentHtml};
}

export const currentMemberPortraits = Object.fromEntries(
  Object.entries(memberPortraits).map(([route, [, current]]) => [route, current])
);
`, 'utf8');

// Test the remaining normalization and assert that TAEHOON is canonical at the source.
await writeFile(join(root, 'tests/member-page-normalization.test.mjs'), `import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {normalizeMemberPage, currentMemberPortraits} from '../scripts/member-page-normalization.mjs';

const legacyPortraits = {
  'member-doha.html': 'assets/images/doha.webp',
  'member-woohyun.html': 'assets/images/woohyun.webp',
  'member-jiwoo.html': 'assets/images/jiwoo.webp',
  'member-ihwan.html': 'assets/images/ihwan.webp'
};

test('legacy portraits for the first four current members are normalized before rendering', () => {
  for (const [route, legacy] of Object.entries(legacyPortraits)) {
    const page = normalizeMemberPage({route, contentHtml: \`<img src="\${legacy}">\`});
    assert.match(page.contentHtml, new RegExp(currentMemberPortraits[route].replaceAll('.', '\\\\.')));
    assert.doesNotMatch(page.contentHtml, new RegExp(legacy.replaceAll('.', '\\\\.')));
  }
});

test('TAEHOON profile is canonical in authored source', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const source = JSON.parse(await readFile(root + 'src/pages/member-taehoon.json', 'utf8'));
  assert.equal(source.route, 'member-taehoon.html');
  assert.match(source.contentHtml, /assets\\/images\\/member-taehoon\\.webp/);
  assert.match(source.contentHtml, /외동 \\(어릴 때부터 옆집 누나와 함께 자람\\)/);
  assert.match(source.contentHtml, /옆집 누나와 자주 어울려 자라/);
  assert.doesNotMatch(source.contentHtml, /특정한 성장 배경 때문에 만들어진 것이 아니라/);
});

test('canonical TAEHOON pages do not require normalization', () => {
  const page = {route: 'member-taehoon.html', contentHtml: '<p>canonical</p>'};
  assert.equal(normalizeMemberPage(page), page);
});

test('non-member pages remain untouched', () => {
  const page = {route: 'notice.html', contentHtml: '<p>unchanged</p>'};
  assert.equal(normalizeMemberPage(page), page);
});
`, 'utf8');

// Keep only the old public URL as a compatibility redirect.
const buildPath = join(root, 'scripts/build.mjs');
let buildText = await readFile(buildPath, 'utf8');
const marker = "await cp(join(root,'public'),output,{recursive:true});";
if (!buildText.includes('legacyMemberRedirects')) {
  const redirectBlock = `const legacyMemberRedirects = {\n  'member-taehun.html': 'member-taehoon.html'\n};\nfor (const [legacyRoute, canonicalRoute] of Object.entries(legacyMemberRedirects)) {\n  if (routes.has(legacyRoute)) throw Error('Legacy redirect conflicts with route: ' + legacyRoute);\n  await writeFile(\n    join(output, legacyRoute),\n    \`<!doctype html><html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>TAEHOON — NIGHT</title><link rel="canonical" href="\${canonicalRoute}"/><meta http-equiv="refresh" content="0; url=\${canonicalRoute}"/></head><body><p><a href="\${canonicalRoute}">TAEHOON profile</a></p></body></html>\`,\n    'utf8'\n  );\n}\n`;
  if (!buildText.includes(marker)) throw new Error('Build insertion marker not found');
  buildText = buildText.replace(marker, redirectBlock + marker);
  await writeFile(buildPath, buildText, 'utf8');
}

// Retire the obsolete conversion record together with the obsolete generic portrait.
const conversionPath = join(root, 'maintenance/media-conversions.json');
const conversionManifest = JSON.parse(await readFile(conversionPath, 'utf8'));
const conversionCountBefore = conversionManifest.files.length;
conversionManifest.files = conversionManifest.files.filter(file => file?.web?.path !== 'assets/images/taehun.webp');
if (conversionManifest.files.length !== conversionCountBefore) {
  conversionManifest.summary.files = conversionManifest.files.length;
  conversionManifest.summary.originalBytes = conversionManifest.files.reduce((sum, file) => sum + file.original.bytes, 0);
  conversionManifest.summary.webBytes = conversionManifest.files.reduce((sum, file) => sum + file.web.bytes, 0);
  conversionManifest.summary.newWebp = conversionManifest.files.filter(file => file.method === 'png-to-webp').length;
  conversionManifest.summary.reusedWebp = conversionManifest.files.filter(file => file.method === 'existing-webp-reused').length;
  conversionManifest.summary.resolutionPreserved = conversionManifest.files.filter(file => file.original.width === file.web.width && file.original.height === file.web.height).length;
  await writeFile(conversionPath, JSON.stringify(conversionManifest, null, 2) + '\n', 'utf8');
}

try {
  const legacyImage = join(root, 'public/assets/images/taehun.webp');
  if ((await stat(legacyImage)).isFile()) await unlink(legacyImage);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

console.log('TAEHOON canonical migration applied.');
