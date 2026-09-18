import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const members={
  'member-doha.json':['member-doha.webp','윤도하'],
  'member-woohyun.json':['member-woohyun.webp','성우현'],
  'member-jiwoo.json':['member-jiwoo.webp','천지우'],
  'member-ihwan.json':['member-ihwan.webp','박이환'],
  'member-taehoon.json':['member-taehoon.webp','유태훈']
};

test('member profile sources are canonical without runtime normalization',async()=>{
  for(const [file,[image,alt]] of Object.entries(members)){
    const page=JSON.parse(await readFile(new URL('src/pages/'+file,root),'utf8'));
    assert.match(page.contentHtml,new RegExp('<img alt="'+alt+'" src="assets/images/'+image.replaceAll('.','\\.')+'" width="1122" height="1402"\\/>'));
    assert.doesNotMatch(page.contentHtml,/<dt>AGE<\/dt>|class="member-meta">[^<]* · \d+/);
  }
});

test('legacy member portrait paths are absent from canonical sources',async()=>{
  const source=await Promise.all(Object.keys(members).map(file=>readFile(new URL('src/pages/'+file,root),'utf8')));
  const joined=source.join('\n');
  for(const legacy of ['assets/images/doha.webp','assets/images/woohyun.webp','assets/images/jiwoo.webp','assets/images/ihwan.webp'])assert(!joined.includes(legacy));
});

test('TAEHOON public profile excludes private setting while preserving public traits',async()=>{
  const source=JSON.parse(await readFile(new URL('src/pages/member-taehoon.json',root),'utf8')).contentHtml;
  assert.match(source,/<dt>FAMILY<\/dt><dd>부모님 · 외동<\/dd>/);
  assert.match(source,/친구가 많은 편이며/);
  assert.doesNotMatch(source,/옆집 누나|소꿉친구|짝사랑|연상의 여성/);
});

test('home authored fallback does not duplicate the React home',async()=>{
  const source=JSON.parse(await readFile(new URL('src/pages/index.json',root),'utf8'));
  assert.equal(source.contentHtml,'');
});

test('React build has no dependency on removed member normalization',async()=>{
  const source=await readFile(new URL('scripts/build-react.mjs',root),'utf8');
  assert.doesNotMatch(source,/member-page-normalization|normalizeMemberPage/);
});

test('stale nested source snapshots stay removed',async()=>{
  for(const path of [
    'scripts/src/data/archive.json',
    'scripts/src/data/contentsEntries.json',
    'scripts/src/pages/contents.json',
    'scripts/src/pages/night-off-summer.json',
    'scripts/src/react/routes.mjs'
  ])await assert.rejects(access(new URL(path,root)));
});
