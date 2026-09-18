import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {archiveState,searchRecords} from '../src/react/search.mjs';
const catalog=JSON.parse(await readFile(new URL('../src/data/archive.json',import.meta.url),'utf8'));
test('archive retains all 70 records and seven categories',()=>{
  assert.equal(catalog.records.length,70);assert.equal(Object.keys(catalog.labels).length,7);
  assert.equal(searchRecords(catalog,{}).length,70);
  for(const category of Object.keys(catalog.labels))assert.ok(searchRecords(catalog,{category}).every(record=>record.category===category));
});
test('archive normalizes query and matches every term',()=>{
  assert.deepEqual(searchRecords(catalog,{query:'ＮＩＧＨＴ'}),searchRecords(catalog,{query:'night'}));
  assert.ok(searchRecords(catalog,{query:'after hours'}).some(record=>record.id==='after-hours'));
  assert.ok(searchRecords(catalog,{query:'night off summer'}).some(record=>record.id==='night-off-summer'));
  assert.equal(searchRecords(catalog,{query:'impossible-query-99999'}).length,0);
});
test('home and member search records use current profile sources',()=>{
  const records=Object.fromEntries(catalog.records.filter(record=>record.id==='index'||record.id.startsWith('member-')).map(record=>[record.id,record]));
  assert.equal(records.index.image,'assets/images/home-hero-night.webp');
  assert.match(records.index.searchText,/데뷔 초반 섹시 콘셉트와 강렬한 무대 장악력을 앞세워/);
  assert.match(records.index.searchText,/윤도하 DOHA 성우현 WOOHYUN 천지우 JIWOO 박이환 IHWAN 유태훈 TAEHOON/);
  const portraits={
    'member-doha':'member-doha.webp',
    'member-woohyun':'member-woohyun.webp',
    'member-jiwoo':'member-jiwoo.webp',
    'member-ihwan':'member-ihwan.webp',
    'member-taehun':'member-taehoon.webp'
  };
  for(const [id,image] of Object.entries(portraits)){
    assert.equal(records[id].image,'assets/images/'+image);
    assert.doesNotMatch(records[id].searchText,/\bAGE\d+\b|강아지 같은 막내|친화력과 에너지로 빠르게 넘어섰다|옆집 누나|소꿉친구|짝사랑/);
  }
  assert.match(records['member-doha'].searchText,/3남 2녀의 장남/);
  assert.match(records['member-woohyun'].searchText,/‘야하다’, ‘위험하다’/);
  assert.match(records['member-jiwoo'].searchText,/가까워지는 것과 선을 넘는 것은 전혀 다른 일이다/);
  assert.match(records['member-ihwan'].searchText,/어린 시절의 음악은 좋아해서 하는 것이 아니었다/);
  assert.match(records['member-ihwan'].searchText,/지금은 누구보다 음악을 재미있어한다/);
  assert.match(records['member-taehun'].searchText,/NIGHT 안에서 자신의 자리를 만들고 싶었다/);
});
test('archive URL state validates category and sort',()=>{
  assert.deepEqual(archiveState('?q=DOHA&category=group&sort=title',catalog.labels),{query:'DOHA',category:'group',sort:'title'});
  assert.deepEqual(archiveState('?category=invalid&sort=invalid',catalog.labels),{query:'',category:'all',sort:'category'});
  const sorted=searchRecords(catalog,{sort:'title'});
  assert.ok(sorted.slice(1).every((record,index)=>sorted[index].title.localeCompare(record.title,'ko')<=0));
});
