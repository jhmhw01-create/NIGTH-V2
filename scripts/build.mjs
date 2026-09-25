import {readFile, writeFile, mkdir, readdir, cp, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join, basename} from 'node:path';
import {PageLayout} from '../src/components/layout.mjs';
import {renderCollections} from '../src/components/collections.mjs';
import {buildReactPages} from './build-react.mjs';
import {auditSite} from './audit-site.mjs';
import {auditLegacyAssets} from './audit-legacy-assets.mjs';
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
const applyLatestArchivePatches=page=>{
  if(page.route!=='history.html')return page;
  page.contentHtml=page.contentHtml
    .replace('데뷔부터 SOMETIME까지, NIGHT의 앨범과 공연, 팬클럽 활동과 주요 프로젝트를 시간순으로 만나보세요.','데뷔부터 RETURN까지, NIGHT의 앨범과 공연, 팬클럽 활동과 주요 프로젝트를 시간순으로 만나보세요.')
    .replace('<h2 id="history-label-2030">2030</h2><small>SOMETIME</small>','<h2 id="history-label-2030">2030</h2><small>SOMETIME / RETURN</small>')
    .replace('<div class="history-events"><div class="history-event"><span class="history-dot"></span><div><small>ALBUM · 2030.04.08</small>', '<div class="history-events"><div class="history-event"><span class="history-dot"></span><div><small>ALBUM · 2030.11.15</small><h3>RETURN</h3><p>데뷔일과 같은 11월 15일, NIGHT의 시작을 현재의 다섯 멤버로 다시 바라본 앨범 RETURN 발표. ORIGIN · AFTER DARK · REDEFINED 세 버전으로 발매됐으며 타이틀곡은 5MM. 3주차에는 DANGEROUS 스페셜 페어 무대를 선보였다. <a href="return-2030.html">아카이브 보기 →</a></p></div></div><div class="history-event"><span class="history-dot"></span><div><small>ALBUM · 2030.04.08</small>');
  return page;
};
for (const file of pages.filter(file => file.endsWith('.json')).sort()) {
  let page = JSON.parse(await readFile(join(pagesDir,file),'utf8'));
  page = normalizeSeasonGreetingsPage(page);
  page = applyLatestArchivePatches(page);
  page.contentHtml = renderCollections(page.contentHtml,collections);
  if (!/^[a-z0-9-]+\.html$/.test(page.route) || basename(page.route) !== page.route) throw Error('Invalid route: ' + page.route);
  if (routes.has(page.route)) throw Error('Duplicate route: ' + page.route);
  routes.add(page.route);
  await writeFile(join(output,page.route),PageLayout(page),'utf8');
}
const legacyMemberRedirects = {'member-taehun.html':'member-taehoon.html'};
for (const [legacyRoute, canonicalRoute] of Object.entries(legacyMemberRedirects)) {
  if (routes.has(legacyRoute)) throw Error('Legacy redirect conflicts with route: ' + legacyRoute);
  await writeFile(join(output, legacyRoute),`<!doctype html><html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>TAEHOON — NIGHT</title><link rel="canonical" href="${canonicalRoute}"/><meta http-equiv="refresh" content="0; url=${canonicalRoute}"/></head><body><p><a href="${canonicalRoute}">TAEHOON profile</a></p></body></html>`,'utf8');
}
await cp(join(root,'public'),output,{recursive:true});
const siteBase = 'https://jhmhw01-create.github.io/NIGTH-V2/';
const sitemapUrls = [...routes].sort().map(route => route === 'index.html' ? siteBase : siteBase + route);
await writeFile(join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`,'utf8');
await writeFile(join(output,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${siteBase}sitemap.xml\n`,'utf8');
await buildReactPages();
let hasOriginalAssets = false;
try { hasOriginalAssets = (await stat(join(output,'assets/css/style.css'))).isFile(); } catch {}
console.log('Built ' + routes.size + ' routes with shared Header/Footer.');
if (!hasOriginalAssets) console.log('Asset overlay build: retain original assets directory, or copy it into public/assets before building a standalone site.');
if (hasOriginalAssets) {
  const audit=await auditSite(output);
  console.log(`Site audit passed: ${audit.pages} pages, ${audit.links} local references, ${audit.files} unique targets.`);
  const legacy=await auditLegacyAssets(output,{write:process.env.UPDATE_LEGACY_ASSET_AUDIT==='1'});
  console.log(`Legacy asset audit passed: ${legacy.assets} public CSS/JS (${legacy.runtime} runtime, ${legacy.buildInput} build-input, ${legacy.unresolved} unresolved).`);
}
