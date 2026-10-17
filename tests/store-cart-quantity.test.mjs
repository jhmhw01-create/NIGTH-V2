import test from 'node:test';
import assert from 'node:assert/strict';
import {addCartItem, changeCartQuantity, readCart} from '../src/react/store.mjs';

const product = {id:'cushion', name:'Cushion', price:39000, images:['assets/images/cushion.webp'], options:['DOHA', 'TAEHOON']};

test('cart quantity changes isolate product and option, update totals, and survive storage', () => {
  const other = {...product, id:'other', price:10000};
  let cart = addCartItem([], product, 'DOHA', 2);
  cart = addCartItem(cart, product, 'TAEHOON', 1);
  cart = addCartItem(cart, other, 'DOHA', 1);
  const original = structuredClone(cart);
  const increased = changeCartQuantity(cart, 'cushion', 'DOHA', 1);
  assert.deepEqual(cart, original);
  assert.deepEqual(increased.map(item => item.quantity), [3, 1, 1]);
  assert.equal(increased[0].quantity * increased[0].price, 117000);
  assert.equal(increased.reduce((sum, item) => sum + item.quantity * item.price, 0), 166000);
  const decreased = changeCartQuantity(increased, 'cushion', 'DOHA', -1);
  assert.deepEqual(decreased, cart);
  assert.deepEqual(readCart(JSON.stringify(increased), [product, other]), increased);
});

test('cart quantity preserves the minimum and existing merged quantities above nine', () => {
  let cart = addCartItem([], product, 'DOHA', 9);
  cart = addCartItem(cart, product, 'DOHA', 2);
  assert.equal(changeCartQuantity(cart, 'cushion', 'DOHA', 1)[0].quantity, 12);
  assert.equal(changeCartQuantity(cart, 'cushion', 'DOHA', -1)[0].quantity, 10);
  const minimum = [{...cart[0], quantity:1}];
  assert.deepEqual(changeCartQuantity(minimum, 'cushion', 'DOHA', -1), minimum);
  const maximum = [{...cart[0], quantity:Number.MAX_SAFE_INTEGER}];
  assert.deepEqual(changeCartQuantity(maximum, 'cushion', 'DOHA', 1), maximum);
  assert.deepEqual(changeCartQuantity(cart, 'missing', 'DOHA', 1), cart);
  assert.deepEqual(changeCartQuantity(cart, 'cushion', 'missing', 1), cart);
  for (const delta of [0, 2, NaN, '1']) assert.deepEqual(changeCartQuantity(cart, 'cushion', 'DOHA', delta), cart);
});
