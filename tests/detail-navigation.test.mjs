import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {detailNavigation} from '../scripts/detail-navigation.mjs';
import {reactRoutes} from '../src/react/routes.mjs';
test('detail navigation preserves existing anchors and uses deterministic list destinations',async()=>{
  const items=[];
  for(const route of reactRoutes){const page=JSON.parse(await readFile(new URL('../src/pages/'+route.replace('.html','.json'),import.meta.url),'utf8'));const result=detailNavigation(page);if(!result)continue;items.push(result);assert.ok(result.title);assert.ok(reactRoutes.includes(result.parent.href.split('#')[0]));assert.equal(new Set(result.sections.map(s=>s.id)).size,result.sections.length);for(const section of result.sections){assert.ok(section.label);assert.ok(page.contentHtml.includes('id="'+section.id+'"'));}}
  assert.equal(items.length,55);
});
test('hub pages do not get duplicate detail navigation',()=>assert.equal(detailNavigation({route:'index.html'}),null));
