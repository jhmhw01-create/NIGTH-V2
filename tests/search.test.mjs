import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {archiveState,searchRecords} from '../src/react/search.mjs';
import {reactRoutes} from '../src/react/routes.mjs';
import {archiveFallback,buildSearchCatalog,searchLabels} from '../scripts/search-catalog.mjs';

const albums=JSON.parse(await readFile(new URL('../src/data/albums.json',import.meta.url),'utf8'));
const documents={};
for(const route of reactRoutes){
  const page=JSON.parse(await readFile(new URL('../src/pages/'+route.replace('.html','.json'),import.meta.url),'utf8'));
  documents[route]={headHtml:page.headHtml,markup:page.contentHtml};
}
const catalog=buildSearchCatalog({routes:reactRoutes,documents,albums});

test('search catalog is generated from every current route and album anchor',()=>{
  assert.equal(catalog.records.length,reactRoutes.length+albums.length);
  assert.deepEqual(catalog.labels,searchLabels);
  assert.equal(Object.keys(catalog.labels).length,7);
  for(const route of reactRoutes)assert.ok(catalog.records.some(record=>record.href===route),route);
  for(const album of albums)assert.ok(catalog.records.some(record=>record.href==='discography.html#'+album.id),'discography.html#'+album.id);
  assert.equal(new Set(catalog.records.map(record=>record.id)).size,catalog.records.length);
  assert.equal(new Set(catalog.records.map(record=>record.href)).size,catalog.records.length);
});

test('early album archive cards use their matching visual archive covers',()=>{
  const expected={
    'after-midnight':'assets/images/visual-archive/after-midnight.webp',
    nocturne:'assets/images/visual-archive/nocturne.webp',
    eclipse:'assets/images/visual-archive/eclipse.webp',
    'no-signal':'assets/images/visual-archive/no-signal.webp',
    'new-moon':'assets/images/visual-archive/new-moon.webp',
    lucid:'assets/images/visual-archive/lucid.webp'
  };
  for(const [id,image] of Object.entries(expected)){
    const album=albums.find(record=>record.id===id);
    const record=catalog.records.find(item=>item.id==='discography-'+id);
    assert.equal(album?.image,image);
    assert.equal(record?.image,image);
  }
});

test('REST search record uses its explicit release image',()=>{
  const album=albums.find(record=>record.id==='rest');
  const record=catalog.records.find(item=>item.id==='discography-rest');
  assert.equal(album?.image,'assets/images/2029/rest/release.webp');
  assert.equal(record?.href,'discography.html#rest');
  assert.equal(record?.image,'assets/images/2029/rest/release.webp');
  assert.doesNotMatch(record?.image||'',/^assets\/images\/2027\/infinity\//);
});

test('archive search normalizes query and matches generated current content',()=>{
  assert.deepEqual(searchRecords(catalog,{query:'ＮＩＧＨＴ'}),searchRecords(catalog,{query:'night'}));
  assert.ok(searchRecords(catalog,{query:'after hours'}).some(record=>record.href==='discography.html#after-hours'||record.href==='after-hours.html'));
  assert.ok(searchRecords(catalog,{query:'night off summer'}).some(record=>record.href==='night-off-summer.html'));
  assert.ok(searchRecords(catalog,{query:'RETURN 5MM'}).some(record=>record.href==='return-2030.html'));
  assert.ok(searchRecords(catalog,{query:'NIGHT IN THE HOUSE'}).some(record=>record.href==='night-in-the-house-2030.html'));
  assert.ok(searchRecords(catalog,{query:'DOHA PLAY ON'}).some(record=>record.href==='doha-play-on.html'));
  assert.ok(searchRecords(catalog,{query:'윤도하 VARIETY'}).some(record=>record.href==='doha-play-on.html'));
  assert.ok(searchRecords(catalog,{query:'SOMETIME CINEMATIC'}).some(record=>record.href==='sometime.html'));
  assert.deepEqual(searchRecords(catalog,{query:'INCHEON MARINERS'}).filter(record=>record.href.includes('mariners-2030.html')).map(record=>record.href).sort(),['doha-taehoon-mariners-2030.html','ihwan-mariners-2030.html','jiwoo-woohyun-mariners-2030.html']);
  assert.ok(searchRecords(catalog,{query:'박이환 애국가'}).some(record=>record.href==='ihwan-mariners-2030.html'));
  assert.ok(searchRecords(catalog,{query:'천지우 시구'}).some(record=>record.href==='jiwoo-woohyun-mariners-2030.html'));
  assert.ok(searchRecords(catalog,{query:"NIGHTS CLOSET WARDROBE 윤도하"}).some(record=>record.href==='nights-closet.html'));
  assert.ok(searchRecords(catalog,{query:'NIGHT FILES 인생네컷 천지우'}).some(record=>record.href==='night-files.html'));
  for(const route of ['nights-closet.html','night-files.html'])assert.equal(catalog.records.find(record=>record.href===route)?.category,'stories');
  for(const route of ['doha-taehoon-mariners-2030.html','ihwan-mariners-2030.html','jiwoo-woohyun-mariners-2030.html'])assert.equal(catalog.records.find(record=>record.href===route)?.category,'stage');
  assert.equal(catalog.records.find(record=>record.href==='doha-play-on.html')?.category,'stories');
  assert.equal(searchRecords(catalog,{query:'impossible-query-99999'}).length,0);
});

test('current archives are searchable at their canonical routes',()=>{
  const expected={
    'PARADOX':'paradox-2029.html','REST':'discography.html#rest','SOMETIME':'sometime.html','RETURN 5MM':'return-2030.html',
    'MOONLIGHT CLUB':'moonlight-club-2029.html','COACHELLA':'coachella-2029.html','NIGHT IN THE HOUSE':'night-in-the-house-2030.html',
    'MOMENTS OF THE NIGHT':'documentary-2029.html','SO GOOD':'so-good-2028.html','LUNA 7':'luna7.html','2029 SEASON':'season-greetings-2029.html',
    'JIWOO ACTING':'jiwoo-acting.html','IHWAN MUSICAL':'ihwan-musical.html',"WOOHYUN'S NIGHT OFF":'woohyun-night-off.html',
    'LUNA 8 SHINE':'luna8.html','오늘의 풍경':'taehoon-todays-scenery.html','IHWAN GRADUATION':'ihwan-graduation.html','2030 FASHION WEEK':'fashion-week-2030.html','BED SELFIE':'night-selfie-archive.html','OUD WOOD':'member-fragrance-match.html','SAINT LAURENT':'luxury-brand-ambassador-2030.html','AFTER HOURS PHOTOBOOK':'after-hours-photobook.html',"NIGHT'S CLOSET":'nights-closet.html','PROFILE PHOTO HISTORY':'night-files.html','CAMERA ROLL':'night-files.html','CAMERAROLL':'night-files.html','카메라 롤':'night-files.html','카메라롤':'night-files.html'
  };
  for(const [query,href] of Object.entries(expected))assert.ok(searchRecords(catalog,{query}).some(record=>record.href===href),query+' → '+href);
  for(const route of ['debut-archive.html','out-of-frame.html','social-archive.html'])assert.ok(catalog.records.some(record=>record.href===route),route);
});

test('noscript fallback is generated from the same complete catalog',()=>{
  const fallback=archiveFallback(catalog);
  assert.equal((fallback.match(/<li>/g)||[]).length,catalog.records.length);
  for(const record of catalog.records)assert.ok(fallback.includes('href="'+record.href+'"'),record.href);
});

test('search summaries use authored content without layout or template residue',()=>{
  const sample=buildSearchCatalog({
    routes:['sample.html'],
    documents:{'sample.html':{headHtml:'<title>Sample</title>',markup:'<header>COMMON NAVIGATION</header><main><h1>Page heading</h1><p>Useful page summary.</p></main><footer>COMMON FOOTER</footer>'}},
    albums:[{id:'sample-album',title:'SAMPLE ALBUM',bodyTemplateHtml:'<h2>{{title}}</h2><p>Album summary.</p>'}]
  });
  const page=sample.records.find(record=>record.id==='sample');
  const album=sample.records.find(record=>record.id==='discography-sample-album');
  assert.match(page.summary,/Page heading Useful page summary/);
  assert.doesNotMatch(page.searchText,/COMMON NAVIGATION|COMMON FOOTER/);
  assert.match(album.summary,/SAMPLE ALBUM Album summary/);
  assert.doesNotMatch(album.summary,/\{\{title\}\}/);
  for(const record of catalog.records)assert.doesNotMatch(record.summary,/\{\{title\}\}/);
});

test('member search records are derived from the current canonical profile pages',()=>{
  const members=['member-doha','member-woohyun','member-jiwoo','member-ihwan','member-taehoon'];
  const records=Object.fromEntries(catalog.records.filter(record=>members.includes(record.id)).map(record=>[record.id,record]));
  assert.equal(Object.keys(records).length,5);
  assert.match(records['member-doha'].searchText,/3남 2녀의 장남/);
  assert.match(records['member-woohyun'].searchText,/‘야하다’, ‘위험하다’/);
  assert.match(records['member-jiwoo'].searchText,/가까워지는 것과 선을 넘는 것은 전혀 다른 일이다/);
  assert.match(records['member-taehoon'].searchText,/친구가 많은 편이며/);
  for(const record of Object.values(records))assert.doesNotMatch(record.searchText,/\bAGE\d+\b|옆집 누나|소꿉친구|짝사랑/);
  assert.ok(!catalog.records.some(record=>record.id==='member-taehun'));
});

test('archive URL state validates category and sort',()=>{
  assert.deepEqual(archiveState('?q=DOHA&category=group&sort=title',catalog.labels),{query:'DOHA',category:'group',sort:'title'});
  assert.deepEqual(archiveState('?category=invalid&sort=invalid',catalog.labels),{query:'',category:'all',sort:'category'});
  const sorted=searchRecords(catalog,{sort:'title'});
  assert.ok(sorted.slice(1).every((record,index)=>sorted[index].title.localeCompare(record.title,'ko')<=0));
});

test('React build no longer reads a hand-maintained archive catalog',async()=>{
  const buildSource=await readFile(new URL('../scripts/build-react.mjs',import.meta.url),'utf8');
  assert.doesNotMatch(buildSource,/src\/data\/archive\.json|archive\.json/);
  assert.match(buildSource,/buildSearchCatalog/);
});
