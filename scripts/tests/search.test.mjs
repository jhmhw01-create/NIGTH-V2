import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {archiveState,searchRecords} from '../src/react/search.mjs';
const catalog=JSON.parse(await readFile(new URL('../src/data/archive.json',import.meta.url),'utf8'));
test('archive retains all 69 records and seven categories',()=>{
  assert.equal(catalog.records.length,69);assert.equal(Object.keys(catalog.labels).length,7);
  assert.equal(searchRecords(catalog,{}).length,69);
  for(const category of Object.keys(catalog.labels))assert.ok(searchRecords(catalog,{category}).every(record=>record.category===category));
});
test('archive normalizes query and matches every term',()=>{
  assert.deepEqual(searchRecords(catalog,{query:'ＮＩＧＨＴ'}),searchRecords(catalog,{query:'night'}));
  assert.ok(searchRecords(catalog,{query:'after hours'}).some(record=>record.id==='after-hours'));
  assert.ok(searchRecords(catalog,{query:'night off summer'}).some(record=>record.id==='night-off-summer'));
  assert.equal(searchRecords(catalog,{query:'impossible-query-99999'}).length,0);
});
test('archive URL state validates category and sort',()=>{
  assert.deepEqual(archiveState('?q=DOHA&category=group&sort=title',catalog.labels),{query:'DOHA',category:'group',sort:'title'});
  assert.deepEqual(archiveState('?category=invalid&sort=invalid',catalog.labels),{query:'',category:'all',sort:'category'});
  const sorted=searchRecords(catalog,{sort:'title'});
  assert.ok(sorted.slice(1).every((record,index)=>sorted[index].title.localeCompare(record.title,'ko')<=0));
});
