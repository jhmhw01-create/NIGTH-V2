import {readFile, writeFile, mkdir, readdir, cp, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, join, basename} from 'node:path';
import {PageLayout} from '../src/components/layout.mjs';
import {renderCollections} from '../src/components/collections.mjs';
import {buildReactPages} from './build-react.mjs';
import {auditSite} from './audit-site.mjs';
import {normalizeSeasonGreetingsPage} from './season-greetings-normalization.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
await mkdir(output, {recursive:true});
const pagesDir = join(root, 'src/pages');
const pages = await readdir(pagesDir);
const routes = new Set();
const collections = {};
for (const name of ['albums','notices','memberships','galleryCards','contentsEntries']) {
  collections[name] = JSON.parse(await readFile(join(root,'src/data',name+'.json'),'utf8'));
}
for (const file of pages.filter(file => file.endsWith('.json')).sort()) {
  let page = JSON.parse(await readFile(join(pagesDir,file),'utf8'));
  page = normalizeSeasonGreetingsPage(page);
  page.contentHtml = renderCollections(page.contentHtml,collections);
  if (!/^[a-z0-9-]+\.html$/.test(page.route) || basename(page.route) !== page.route) throw Error('Invalid route: ' + page.route);
  if (routes.has(page.route)) throw Error('Duplicate route: ' + page.route);
  routes.add(page.route);
  await writeFile(join(output,page.route),PageLayout(page),'utf8');
}
const legacyMemberRedirects = {
  'member-taehun.html': 'member-taehoon.html'
};
for (const [legacyRoute, canonicalRoute] of Object.entries(legacyMemberRedirects)) {
  if (routes.has(legacyRoute)) throw Error('Legacy redirect conflicts with route: ' + legacyRoute);
  await writeFile(
    join(output, legacyRoute),
    `<!doctype html><html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>TAEHOON — NIGHT</title><link rel="canonical" href="${canonicalRoute}"/><meta http-equiv="refresh" content="0; url=${canonicalRoute}"/></head><body><p><a href="${canonicalRoute}">TAEHOON profile</a></p></body></html>`,
    'utf8'
  );
}
await cp(join(root,'public'),output,{recursive:true});
const siteBase = 'https://jhmhw01-create.github.io/NIGTH-V2/';
const sitemapUrls = [...routes].sort().map(route => route === 'index.html' ? siteBase : siteBase + route);
await writeFile(
  join(output,'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`,
  'utf8'
);
await writeFile(
  join(output,'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${siteBase}sitemap.xml\n`,
  'utf8'
);
const catalog = JSON.parse(await readFile(join(root,'src/data/archive.json'),'utf8'));
await mkdir(join(output,'assets/data'),{recursive:true});
await writeFile(join(output,'assets/data/archive-catalog.js'),'window.NightArchiveCatalog = ' + JSON.stringify(catalog) + ';\n');
await buildReactPages();
let hasOriginalAssets = false;
try { hasOriginalAssets = (await stat(join(output,'assets/css/style.css'))).isFile(); } catch {}
console.log('Built ' + routes.size + ' routes with shared Header/Footer.');
if (!hasOriginalAssets) console.log('Asset overlay build: retain original assets directory, or copy it into public/assets before building a standalone site.');
if (hasOriginalAssets) {
  const audit=await auditSite(output);
  console.log(`Site audit passed: ${audit.pages} pages, ${audit.links} local references, ${audit.files} unique targets.`);
}
