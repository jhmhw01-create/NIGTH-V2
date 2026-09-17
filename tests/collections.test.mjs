import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {AlbumCard,NoticeItem,MembershipCard,renderCollections} from '../src/components/collections.mjs';
test('all sixteen releases are text only',async()=>{
  const data=JSON.parse(await readFile(new URL('../src/data/albums.json',import.meta.url),'utf8'));
  assert.equal(data.length,16);
  for(const record of data){const output=AlbumCard(record);assert(!/<img\b/.test(output));assert(output.includes('id="'+record.id+'"'));}
});
test('25 notices and six membership cards render',async()=>{
  for(const [name,count,renderer] of [['notices',25,NoticeItem],['memberships',6,MembershipCard]]){
    const data=JSON.parse(await readFile(new URL('../src/data/'+name+'.json',import.meta.url),'utf8'));
    assert.equal(data.length,count);
    for(const record of data)assert(!renderer(record).includes('{{title}}'));
  }
});
test('PHANTOM notice keeps only the album release announcement',async()=>{
  const data=JSON.parse(await readFile(new URL('../src/data/notices.json',import.meta.url),'utf8'));
  const phantom=data.filter(record=>(record.title+'\n'+record.bodyTemplateHtml).includes('PHANTOM'));
  assert.deepEqual(phantom.map(record=>record.title),['PHANTOM 발매 및 ILLUSION Official M/V 공개']);
});
test('title fields are escaped; missing collection records fail the build',()=>{
  assert(AlbumCard({title:'<unsafe>',attributesHtml:'',bodyTemplateHtml:'{{title}}'}).includes('&lt;unsafe&gt;'));
  assert.throws(()=>renderCollections('{{albums:0}}',{albums:[]}));
});
