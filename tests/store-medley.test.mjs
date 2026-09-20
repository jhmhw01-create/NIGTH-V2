import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {readStoreProducts,parseStoreProducts} from '../scripts/store-products.mjs';
import {addCartItem,readCart,quantityValue,productList,cartKey} from '../src/react/store.mjs';
import {reactRoutes} from '../src/react/routes.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
import {medleyClassName} from '../src/react/medley.mjs';
const root=new URL('../',import.meta.url);
const products=await readStoreProducts(root);
test('medley cards remain visible through play, pause and track changes',()=>{
  for(const playing of [false,true,false,true,false]){
    const classes=medleyClassName('medley-track reveal',playing).split(' ');
    assert.ok(classes.includes('is-visible'));
    assert.equal(classes.includes('is-playing'),playing);
  }
  assert.equal(medleyClassName('medley-master',false),'medley-master');
});
test('all 61 existing routes are covered exactly once by React',async()=>{
  const pages=await readdir(new URL('src/pages/',root));
  assert.equal(reactRoutes.length,61);assert.equal(new Set(reactRoutes).size,61);
  assert.deepEqual([...reactRoutes].sort(),pages.filter(file=>file.endsWith('.json')).map(file=>file.replace('.json','.html')).sort());
});
test('all 43 products and their full/thumbnail images survive catalog conversion',async()=>{
  assert.equal(products.length,43);assert.equal(productList(products,'all').length,43);
  for(const filter of ['featured','collectible','fashion','travel','tech'])assert.ok(productList(products,filter).every(product=>product.category.split(' ').includes(filter)));
  await Promise.all(products.flatMap(product=>product.images.flatMap(path=>[path,path.replace('/full/','/thumbs/')])).map(path=>access(new URL('public/'+path,root))));
  const v2=products.find(product=>product.id==='moonlight-light-stick-v2');assert.ok(v2);assert.equal(v2.price,59000);assert.equal(v2.images.length,5);assert.equal(v2.benefit,'INCLUDED · WRIST STRAP');
  const prices=new Map([['moonlight-v2-carry-case',29000],['moonlight-v2-display-stand',19000],['moonlight-v2-mini-keyring',18000],['moonlight-v2-metal-pin',13000],['moonlight-v2-bag-charm',22000]]);
  for(const [id,price] of prices){const accessory=products.find(product=>product.id===id);assert.ok(accessory);assert.equal(accessory.price,price);}
  const carrier=products.find(product=>product.id==='carrier-cover');assert.deepEqual(carrier.optionGroups,[{label:'MEMBER',values:['DOHA','WOOHYUN','JIWOO','IHWAN','TAEHOON']},{label:'SIZE',values:['20 INCH','24 INCH','28 INCH']}]);assert.equal(carrier.options.length,15);assert.ok(carrier.options.includes('TAEHOON / 24 INCH'));
  const phone=products.find(product=>product.id==='phone-case');assert.deepEqual(phone.optionGroups,[{label:'MEMBER',values:['DOHA','WOOHYUN','JIWOO','IHWAN','TAEHOON']},{label:'DEVICE',values:['iPHONE','GALAXY']}]);assert.equal(phone.options.length,10);assert.ok(phone.options.includes('JIWOO / GALAXY'));
  const sleepMask=products.find(product=>product.id==='sleep-mask');assert.deepEqual(sleepMask.options,['DOHA','WOOHYUN','JIWOO','IHWAN','TAEHOON']);assert.equal(sleepMask.price,24000);assert.match(sleepMask.desc,/멤버별 디자인/);assert.match(sleepMask.desc,/1개 기준/);
  assert.throws(()=>parseStoreProducts('unknown'),/boundary/);
});
test('existing cart key, option merging, subtotal and invalid-storage handling',()=>{
  assert.equal(cartKey,'nightMdCart');const product=products.find(item=>item.id==='night-cushion');assert.ok(product);
  const first=addCartItem([],product,product.options[0],2);const merged=addCartItem(first,product,product.options[0],9);
  assert.equal(first[0].quantity,2);assert.equal(merged[0].quantity,11);assert.equal(merged[0].price*merged[0].quantity,product.price*11);
  const separate=addCartItem(merged,product,product.options[1],1);assert.equal(separate.length,2);assert.deepEqual(readCart(JSON.stringify(separate),products),separate);
  const carrier=products.find(item=>item.id==='carrier-cover');const configured=addCartItem([],carrier,'TAEHOON / 24 INCH',1);assert.equal(configured.length,1);assert.equal(configured[0].option,'TAEHOON / 24 INCH');assert.deepEqual(readCart(JSON.stringify(configured),products),configured);
  assert.deepEqual(readCart('broken JSON',products),[]);assert.deepEqual(readCart('{}',products),[]);assert.deepEqual(readCart('[null,{"id":"unknown"}]',products),[]);
  assert.equal(quantityValue(0),1);assert.equal(quantityValue(20),9);assert.equal(quantityValue(''),1);
});
test('medley preserves seven native players and all source audio files',async()=>{
  const page=JSON.parse(await readFile(new URL('src/pages/highlight-medley.json',root),'utf8'));
  const walk=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...walk(node.children)]);const nodes=walk(pageTree(page.contentHtml));
  const players=nodes.filter(node=>node.tag==='audio');assert.equal(players.length,7);assert.ok(players.every(node=>node.props.controls&&node.props.preload==='metadata'&&!node.props.autoPlay));
  await Promise.all(nodes.filter(node=>node.tag==='source').map(node=>access(new URL('public/'+node.props.src,root))));
});
