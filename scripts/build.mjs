import {readFile, writeFile, mkdir, readdir, cp, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, join, basename} from 'node:path';
import {PageLayout} from '../src/components/layout.mjs';
import {renderCollections} from '../src/components/collections.mjs';
import {buildReactHome} from './build-react.mjs';
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
  const page = JSON.parse(await readFile(join(pagesDir,file),'utf8'));
  page.contentHtml = renderCollections(page.contentHtml,collections);
  if (!/^[a-z0-9-]+\.html$/.test(page.route) || basename(page.route) !== page.route) throw Error('Invalid route: ' + page.route);
  if (routes.has(page.route)) throw Error('Duplicate route: ' + page.route);
  routes.add(page.route);
  await writeFile(join(output,page.route),PageLayout(page),'utf8');
}
await cp(join(root,'public'),output,{recursive:true});
const catalog = JSON.parse(await readFile(join(root,'src/data/archive.json'),'utf8'));
await mkdir(join(output,'assets/data'),{recursive:true});
await writeFile(join(output,'assets/data/archive-catalog.js'),'window.NightArchiveCatalog = ' + JSON.stringify(catalog) + ';\n');
await buildReactHome();
let hasOriginalAssets = false;
try { hasOriginalAssets = (await stat(join(output,'assets/css/style.css'))).isFile(); } catch {}
console.log('Built ' + routes.size + ' routes with shared Header/Footer.');
if (!hasOriginalAssets) console.log('Asset overlay build: retain original assets directory, or copy it into public/assets before building a standalone site.');
