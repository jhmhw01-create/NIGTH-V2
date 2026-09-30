import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {ihwanMusicalImages} from '../src/data/ihwanMusical.mjs';
import {personalRoutes,reactRoutes} from '../src/react/routes.mjs';
import {syncHubPage} from '../scripts/hub-sync.mjs';
import {ihwanMusicalPlacement} from '../scripts/audit-site.mjs';
import {PageLayout} from '../src/components/layout.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));

test('IHWAN musical archive uses all 34 uploaded images in filename order',async()=>{assert.equal(ihwanMusicalImages.length,34);assert.equal(new Set(ihwanMusicalImages).size,34);assert.equal(ihwanMusicalImages[0],'assets/images/ihwan/musical/ihwan-musical-01.webp');assert.equal(ihwanMusicalImages.at(-1),'assets/images/ihwan/musical/ihwan-musical-34.webp');await Promise.all(ihwanMusicalImages.map(image=>access(join(root,'public',image))));});
test('IHWAN musical archive participates in React rendering and member navigation',async()=>{assert.ok(personalRoutes.includes('ihwan-musical.html'));assert.ok(reactRoutes.includes('ihwan-musical.html'));const page=JSON.parse(await readFile(join(root,'src/pages/member-ihwan.json'),'utf8'));const synced=syncHubPage(page);assert.match(synced.contentHtml,/PERSONAL SCHEDULE/);assert.match(synced.contentHtml,/href="ihwan-musical\.html"/);assert.match(synced.contentHtml,/VIEW ARCHIVE →/);const placement=ihwanMusicalPlacement(PageLayout(synced));assert.equal(placement.valid,true);assert.equal(placement.musicalIndex,placement.keywordIndex+1);assert.equal(placement.switchIndex,placement.musicalIndex+1);});
test('IHWAN musical styles preserve image ratios and responsive grids',async()=>{const css=await readFile(join(root,'public/assets/css/ihwan-musical.css'),'utf8');assert.match(css,/\.musical-photo img\{[^}]*height:auto/);assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);assert.match(css,/@media\(max-width:820px\)\{\.musical-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);assert.match(css,/@media\(max-width:520px\)[\s\S]*\.musical-grid\{grid-template-columns:1fr/);assert.doesNotMatch(css,/object-fit\s*:\s*cover/);});
test('IHWAN musical source does not invent production metadata',async()=>{const source=await readFile(join(root,'src/react/IhwanMusicalPage.jsx'),'utf8');assert.doesNotMatch(source,/ROLE|THEATER|AWARD|YEAR|CAST/);assert.match(source,/34 PHOTOS/);});
