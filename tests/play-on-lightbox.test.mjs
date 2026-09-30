import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';

test('PLAY ON loads the shared lightbox stylesheet before its editorial overrides',async()=>{
  const page=JSON.parse(await readFile(new URL('../src/pages/doha-play-on.json',import.meta.url),'utf8'));
  const links=[];
  function walk(node){if(node.tagName==='link')links.push(Object.fromEntries(node.attrs.map(a=>[a.name,a.value])));for(const child of node.childNodes??[])walk(child);}
  walk(parse(page.headHtml));
  assert(links.some(link=>link.rel==='stylesheet'&&link.href==='assets/css/fansign.css'));
  const css=await readFile(new URL('../public/assets/css/fansign.css',import.meta.url),'utf8');
  assert.match(css,/\.fansign-lightbox\{[^}]*position:fixed;[^}]*display:none/);
  assert.match(css,/\.fansign-lightbox\.is-open\{display:grid\}/);
  assert.match(page.contentHtml,/id="fansignLightbox"[^>]*aria-hidden="true"/);
});


test('page entrance releases its transform so photo dialogs stay fixed to the viewport',async()=>{
  const app=await readFile(new URL('../src/react/App.jsx',import.meta.url),'utf8');
  const rootRule=app.match(/#night-react-root\{animation:night-page-in[^}]+\}/)?.[0];
  assert(rootRule);
  assert.match(rootRule,/ backwards\}/);
  assert.doesNotMatch(rootRule,/both|forwards/);
});
