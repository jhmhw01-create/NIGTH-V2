import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {vlogEpisodes,expandVlog,sceneAt,clampTime,clock} from '../src/react/photo-data.mjs';
import {parsePhotoEpisodes,readPhotoEpisodes} from '../scripts/photo-episodes.mjs';
import {playerRoutes,reactRoutes} from '../src/react/routes.mjs';
const root=new URL('../',import.meta.url);
test('both player routes remain in unique React routes',()=>{
  assert.deepEqual(playerRoutes,['vlog.html','night-originals.html']);assert.equal(new Set(reactRoutes).size,reactRoutes.length);assert.ok(playerRoutes.every(route=>reactRoutes.includes(route)));
});
test('VLOG metadata remains the canonical six-episode set',()=>{
  assert.deepEqual(vlogEpisodes,[
    {id:'night',owner:'NIGHT / TOGETHER',title:'오늘 저녁은 우리가 만들게',short:'숙소에서 저녁 만들기',description:'다섯 멤버가 함께 준비하는 숙소의 저녁.',count:13},
    {id:'doha',owner:'DOHA',title:'쉬는 날, 풋살하러 가는 도하',short:'쉬는 날 풋살',description:'도하의 쉬는 날을 따라가는 풋살 브이로그.',count:7},
    {id:'woohyun',owner:'WOOHYUN',title:'우현의 연습실 기록',short:'연습실 브이로그',description:'연습실에서 보내는 우현의 하루.',count:7},
    {id:'jiwoo',owner:'JIWOO',title:'지우의 조용한 휴식 시간',short:'휴식 시간 브이로그',description:'잠시 쉬어 가는 지우의 일상 기록.',count:10},
    {id:'ihwan',owner:'IHWAN',title:'이환의 대학생활',short:'대학생활 브이로그',description:'이환과 함께 따라가는 캠퍼스의 하루.',count:9},
    {id:'taehoon',owner:'TAEHOON',title:'태훈의 숙소 셀카 브이로그',short:'숙소 셀카 브이로그',description:'카메라 너머 LUNA에게 전하는 태훈의 숙소 이야기.',count:9}
  ]);
  assert.equal(vlogEpisodes.reduce((sum,item)=>sum+item.count,0),55);
});
test('all photo episodes and thumbnail paths exist without media changes',async()=>{
  const data=await readPhotoEpisodes(root);assert.equal(data.originals.length,5);assert.equal(data.originals.reduce((sum,item)=>sum+item.scenes.length,0),34);assert.equal(data.flowers.length,6);
  const photos=[...vlogEpisodes.map(expandVlog).flatMap(item=>item.scenes),...data.originals.flatMap(item=>[...item.scenes,...item.extras]),...data.flowers];
  await Promise.all(photos.flatMap(photo=>[photo.full,photo.thumb]).map(path=>access(new URL('public/'+path,root))));
  assert.throws(()=>parsePhotoEpisodes('window.NightCollections = {};'),/Missing/);
});
test('six-second scene boundaries and seeking clamp correctly',()=>{
  assert.equal(sceneAt(5.9,6),0);assert.equal(sceneAt(6,6),1);assert.equal(sceneAt(36,6),5);assert.equal(sceneAt(-1,6),0);
  assert.equal(clampTime(99,36),36);assert.equal(clampTime(-1,36),0);assert.equal(clampTime(NaN,36),0);assert.equal(clock(78),'01:18');
});
