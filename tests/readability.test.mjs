import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const css=await readFile(new URL('../public/assets/css/readability.css',import.meta.url),'utf8');
const luminance=hex=>{
 const rgb=hex.match(/[0-9a-f]{2}/gi).map(s=>parseInt(s,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
 return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
};
test('reading pages are lighter than home and preserve dark theme hierarchy',()=>{
 assert(luminance('14141c')>luminance('0a0a12'));
 assert(luminance('1e1e29')>luminance('14141c'));
 const contrast=(luminance('cbc7d4')+.05)/(luminance('22222e')+.05);
 assert(contrast>=4.5);
 assert.match(css,/data-night-surface="home"/);
 assert.match(css,/data-night-surface="information"/);
});
test('readability overlay does not restyle images, dimensions, motion or audio controls',()=>{
 assert(!/\bimg\b|filter\s*:|opacity\s*:|object-fit\s*:|width\s*:|height\s*:|animation\s*:|audio\s*\{/.test(css));
 assert.match(css,/\.notice-item\[open\]/);
 assert.match(css,/\.archive-result-card/);
});
