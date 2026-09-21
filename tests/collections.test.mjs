import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {AlbumCard,NoticeItem,MembershipCard,renderCollections} from '../src/components/collections.mjs';
test('all seventeen releases are text only',async()=>{
  const data=JSON.parse(await readFile(new URL('../src/data/albums.json',import.meta.url),'utf8'));
  assert.equal(data.length,17);
  for(const record of data){const output=AlbumCard(record);assert(!/<img\b/.test(output));assert(output.includes('id="'+record.id+'"'));}
});
test('29 notices and seven membership cards render',async()=>{
  for(const [name,count,renderer] of [['notices',29,NoticeItem],['memberships',7,MembershipCard]]){
    const data=JSON.parse(await readFile(new URL('../src/data/'+name+'.json',import.meta.url),'utf8'));
    assert.equal(data.length,count);
    for(const record of data)assert(!renderer(record).includes('{{title}}'));
  }
});
// Campaign NOTICE policy: PHANTOM and AFTER HOURS keep only their album release announcements.
test('PHANTOM notice keeps only the album release announcement',async()=>{
  const data=JSON.parse(await readFile(new URL('../src/data/notices.json',import.meta.url),'utf8'));
  const phantom=data.filter(record=>(record.title+'\n'+record.bodyTemplateHtml).includes('PHANTOM'));
  assert.deepEqual(phantom.map(record=>record.title),['PHANTOM 발매 및 ILLUSION Official M/V 공개']);
});
test('AFTER HOURS notice keeps only the album release announcement',async()=>{
  const data=JSON.parse(await readFile(new URL('../src/data/notices.json',import.meta.url),'utf8'));
  const afterHours=data.filter(record=>(record.title+'\n'+record.bodyTemplateHtml).includes('AFTER HOURS'));
  assert.deepEqual(afterHours.map(record=>record.title),['AFTER HOURS 발매 및 NO SUNRISE 공개']);
});
test('title fields are escaped; missing collection records fail the build',()=>{
  const escaped=AlbumCard({id:'x',title:'<script>alert(1)</script>',bodyTemplateHtml:'<h3>{{title}}</h3>',attributesHtml:' id="x"'});
  assert(!escaped.includes('<script>'));assert(escaped.includes('&lt;script&gt;'));
  assert.throws(()=>renderCollections('<main>{{albums:99}}</main>',{albums:[],notices:[],memberships:[]}),/Unknown record: albums:99/);
});
