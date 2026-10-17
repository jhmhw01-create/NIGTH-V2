import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSearchCatalog} from '../scripts/search-catalog.mjs';
import {albumRoutes} from '../src/react/routes.mjs';

test('search extraction retains first metadata and nonempty image in document order', () => {
  const catalog = buildSearchCatalog({
    routes:['sample.html'],
    documents:{'sample.html':{
      headHtml:'<title>A &amp; B</title><metadata name="description" content="wrong"><META content="First &amp; only" NAME="DESCRIPTION"><meta name="description" content="Second">',
      markup:'<header>Navigation</header><main><script>hidden()</script><style>.hidden{}</style><p>Main &amp; text</p><image src="wrong.webp"><IMG src=""><img src="first.webp?a=1&amp;b=2"><img src="second.webp"></main>'
    }},
    albums:[]
  });
  assert.deepEqual(catalog.records, [{id:'sample', href:'sample.html', title:'A & B', category:'group', summary:'First & only', keywords:'A & B', searchText:'Main & text', image:'first.webp?a=1&b=2'}]);
  const missing = buildSearchCatalog({routes:['empty.html'], documents:{}, albums:[]}).records[0];
  assert.equal(missing.title, 'NIGHT');
  assert.equal(missing.summary, '');
  assert.equal(Object.hasOwn(missing, 'image'), false);
});

test('album image precedence and record order survive shared tag scanning', () => {
  const route = albumRoutes[0];
  const documents = {[route]:{headHtml:'<title>Matching Album</title>', markup:'<main><img src="archive.webp"></main>'}};
  const link = '<a class="album-detail-link" href="' + route + '">Archive</a>';
  const albums = [
    {id:'explicit', title:'Matching Album', image:'explicit.webp', bodyTemplateHtml:'<img src="own.webp">' + link},
    {id:'own', title:'Matching Album', bodyTemplateHtml:'<img src="own.webp">' + link},
    {id:'linked', title:'Unmatched', bodyTemplateHtml:'<aside href="wrong.html"></aside>' + link},
    {id:'matched', title:'Matching Album', bodyTemplateHtml:''},
    {id:'empty', title:'Nothing matches here', bodyTemplateHtml:''}
  ];
  const {records} = buildSearchCatalog({routes:[route], documents, albums});
  assert.deepEqual(records.map(record => record.id), [route.replace(/\.html$/, ''), ...albums.map(album => 'discography-' + album.id)]);
  assert.deepEqual(records.slice(1).map(record => record.image), ['explicit.webp', 'own.webp', 'archive.webp', 'archive.webp', undefined]);
});
