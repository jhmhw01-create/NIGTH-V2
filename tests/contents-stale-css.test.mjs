import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseFragment} from 'parse5';
import {reactRoutes} from '../src/react/routes.mjs';
import {renderCollections} from '../src/components/collections.mjs';

const retired=new Set(['content-card-feature','content-card-wide','content-shade','content-number','content-copy']);
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');

test('canonical authored collection markup does not recreate retired Contents card classes',async()=>{
  const collections={};
  for(const name of ['albums','notices','contentsEntries','memberships','galleryCards'])collections[name]=JSON.parse(await read('src/data/'+name+'.json'));
  for(const route of reactRoutes){
    const page=JSON.parse(await read('src/pages/'+route.replace('.html','.json')));
    const fragment=parseFragment(renderCollections(page.contentHtml,collections));
    const visit=node=>{
      for(const attr of node.attrs||[])if(attr.name==='class')for(const cls of attr.value.split(/\s+/))assert(!retired.has(cls),route+': '+cls);
      for(const child of node.childNodes||[])visit(child);
      if(node.content)visit(node.content);
    };
    visit(fragment);
  }
});

test('retired Contents styles stay removed while the active mobile card rule is preserved',async()=>{
  const css=await read('public/assets/css/contents.css');
  const filters=await read('public/assets/css/contents-categories.css');
  for(const cls of retired)assert(!new RegExp('\\.'+cls+'\\b').test(css+filters),cls);
  assert.match(css,/@media\(max-width:760px\)\{[\s\S]*?\.content-card\{grid-column:auto;min-height:410px\}/);
});
