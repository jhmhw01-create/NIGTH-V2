import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {readStoreProducts,parseStoreProducts} from '../scripts/store-products.mjs';
import {addCartItem,readCart,quantityValue,productList,cartKey} from '../src/react/store.mjs';
import {reactRoutes} from '../src/react/routes.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
const root=new URL('../',import.meta.url);
const products=await readStoreProducts(root);
test('all 52 existing routes are covered exactly once by React',async()=>{
  const pages=await readdir(new URL('src/pages/',root));
  assert.equal(reactRoutes.length,52);assert.equal(new Set(reactRoutes).size,52);
  assert.deepEqual([...reactRoutes].sort(),pages.filter(file=>file.endsWith('.json')).map(file=>file.replace('.json','.html')).sort());
});
test('all 36 original products and their full/thumbnail images survive catalog conversion',async()=>{
  assert.equal(products.length,36);assert.equal(productList(products,'all').length,36);
  for(const filter of ['featured','collectible','fashion','travel','tech'])assert.ok(productList(products,filter).every(product=>product.category.split(' ').includes(filter)));
  await Promise.all(products.flatMap(product=>product.images.flatMap(path=>[path,path.replace('/full/','/thumbs/')])).map(path=>access(new URL('public/'+path,root))));
  assert.throws(()=>parseStoreProducts('unknown'),/boundary/);
});
test('existing cart key, option merging, subtotal and invalid-storage handling',()=>{
  assert.equal(cartKey,'nightMdCart');const product=products[1];
  const first=addCartItem([],product,product.options[0],2);const merged=addCartItem(first,product,product.options[0],9);
  assert.equal(first[0].quantity,2);assert.equal(merged[0].quantity,11);assert.equal(merged[0].price*merged[0].quantity,product.price*11);
  const separate=addCartItem(merged,product,product.options[1],1);assert.equal(separate.length,2);assert.deepEqual(readCart(JSON.stringify(separate),products),separate);
  assert.deepEqual(readCart('broken JSON',products),[]);assert.deepEqual(readCart('{}',products),[]);assert.deepEqual(readCart('[null,{"id":"unknown"}]',products),[]);
  assert.equal(quantityValue(0),1);assert.equal(quantityValue(20),9);assert.equal(quantityValue(''),1);
});
test('medley preserves seven native players and all source audio files',async()=>{
  const page=JSON.parse(await readFile(new URL('src/pages/highlight-medley.json',root),'utf8'));
  const walk=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...walk(node.children)]);const nodes=walk(pageTree(page.contentHtml));
  const players=nodes.filter(node=>node.tag==='audio');assert.equal(players.length,7);assert.ok(players.every(node=>node.props.controls&&node.props.preload==='metadata'&&!node.props.autoPlay));
  await Promise.all(nodes.filter(node=>node.tag==='source').map(node=>access(new URL('public/'+node.props.src,root))));
});
