import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';

test('archive galleries share the canonical stylesheet without the retired duplicate',async()=>{
  for(const route of ['season-greetings-2027','season-greetings-2028','season-greetings-2029','special-mc','daesang-moments','social-archive']){
    const page=JSON.parse(await readFile(new URL(`../src/pages/${route}.json`,import.meta.url),'utf8'));
    assert.equal((page.headHtml.match(/assets\/css\/final-additions\.css/g)||[]).length,1,route);
    assert.ok(!page.headHtml.includes('assets/css/season-2027.css'),route);
  }
  await access(new URL('../public/assets/css/final-additions.css',import.meta.url));
  await assert.rejects(access(new URL('../public/assets/css/season-2027.css',import.meta.url)),{code:'ENOENT'});
});
