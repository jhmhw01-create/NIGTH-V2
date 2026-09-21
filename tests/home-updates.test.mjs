import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseFragment} from 'parse5';
import {homeUpdates} from '../scripts/home-updates.mjs';
const walk=node=>[node,...(node.childNodes??[]).flatMap(walk)];
const href=node=>node?.attrs?.find(attribute=>attribute.name==='href')?.value;
test('home updates reuse the three latest dated notices with authored valid destinations',async()=>{
  const notices=JSON.parse(await readFile(new URL('../src/data/notices.json',import.meta.url),'utf8'));
  const updates=homeUpdates(notices);assert.equal(updates.length,3);
  for(const update of updates){
    const original=notices.find(item=>item.id===update.id);
    assert.equal(update.title,original.title);
    assert.ok(original.bodyTemplateHtml.includes(update.date));
    const firstLink=walk(parseFragment(original.bodyTemplateHtml)).find(node=>node.tagName==='a'&&href(node));
    assert.equal(update.href,href(firstLink)??'notice.html');
  }
  assert.ok(updates.every((item,index)=>index===0||updates[index-1].date>=item.date));
  assert.equal(updates[0].date,'2029.12.01');
  assert.equal(updates[0].href,'documentary-2029.html');
});
