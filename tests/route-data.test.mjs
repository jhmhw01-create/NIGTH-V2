import test from 'node:test';
import assert from 'node:assert/strict';
import {routeData,serializeRouteData} from '../scripts/route-data.mjs';
const source={trees:{'complete-2027.html':['album'],'listen.html':['audio']},navigation:{},catalog:{records:['record']},photos:{originals:['episode'],flowers:['flower'],luna:['luna'],gallery:['theme']},products:['product']};
test('each route receives only its own data and home receives no archive payload',()=>{
  assert.deepEqual(routeData('index.html',source),{navigation:null,updates:[]});
  assert.deepEqual(routeData('complete-2027.html',source),{navigation:null,nodes:['album']});
  assert.deepEqual(routeData('archive.html',source),{navigation:null,catalog:source.catalog});
  assert.deepEqual(routeData('store.html',source),{navigation:null,products:source.products});
  assert.deepEqual(routeData('with-luna.html',source).photos,{luna:['luna']});
  assert.deepEqual(routeData('if-night.html',source).photos,{gallery:['theme']});
  assert.deepEqual(routeData('night-originals.html',source).photos,{originals:['episode'],flowers:['flower']});
  assert.equal(routeData('vlog.html',source).photos.vlogs.length,6);
});
test('inline JSON cannot close its script element and round-trips Unicode',()=>{
  const data={text:'</script><script>alert(1)</script>한글\u2028\u2029'};
  const encoded=serializeRouteData(data);assert.ok(!encoded.includes('<'));assert.deepEqual(JSON.parse(encoded),data);
});
test('dynamic routes receive dimensions only for referenced full and thumbnail images',()=>{
  const dimensions={
    'assets/store/full/item.webp':{width:1200,height:1500},
    'assets/store/thumbs/item.webp':{width:480,height:600},
    'assets/store/full/unused.webp':{width:1200,height:1500}
  };
  const data=routeData('store.html',{...source,products:[{images:['assets/store/full/item.webp']}],imageDimensions:dimensions});
  assert.deepEqual(data.imageDimensions,{
    'assets/store/full/item.webp':dimensions['assets/store/full/item.webp'],
    'assets/store/thumbs/item.webp':dimensions['assets/store/thumbs/item.webp']
  });
});
