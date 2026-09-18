import fs from 'node:fs';

const storePath='public/assets/js/md-store.js';
let store=fs.readFileSync(storePath,'utf8');

const v2Block=/\s*\{id:'moonlight-light-stick-v2'[\s\S]*?\},\n\s*\{id:'moonlight-light-stick',/;
if(!v2Block.test(store)) throw new Error('Current V2 bundle block not found');

const separated=`
  {id:'moonlight-light-stick-v2',name:'MOONLIGHT VER.2 — LUNA ORBIT',category:'featured collectible',price:59000,images:[
    'assets/images/md/lightstick-v2/night-lightstick-v2-11-off-on.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-01-light-modes.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-12-detail-view.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-07-design-evolution.webp'
  ],options:allOption,desc:'달과 별의 궤도를 확장한 NIGHT 공식 응원봉 두 번째 버전 LUNA ORBIT. 더블 크리스털 글로브와 NIGHT STAR CORE, CRESCENT ORBIT 구조를 중심으로 VER.1의 NIGHT DNA를 이어간다. 전용 액세서리는 별도 판매된다.'},
  {id:'moonlight-v2-carry-case',name:'MOONLIGHT VER.2 Carry Case',category:'featured collectible travel',price:29000,images:['assets/images/md/lightstick-v2/night-lightstick-v2-02-carry-case.webp'],options:allOption,desc:'MOONLIGHT VER.2를 보관하고 휴대하기 위한 LUNA ORBIT 전용 캐리 케이스. 응원봉 본품과 별도 판매.'},
  {id:'moonlight-v2-wrist-strap',name:'MOONLIGHT VER.2 Wrist Strap',category:'collectible fashion',price:12000,images:['assets/images/md/lightstick-v2/night-lightstick-v2-10-wrist-strap.webp'],options:allOption,desc:'NIGHT 로고와 LUNA ORBIT 엠블럼을 적용한 MOONLIGHT VER.2 전용 손목 스트랩. 응원봉 본품과 별도 판매.'},
  {id:'moonlight-v2-display-stand',name:'MOONLIGHT VER.2 Display Stand',category:'featured collectible',price:19000,images:['assets/images/md/lightstick-v2/night-lightstick-v2-05-display-stand.webp'],options:allOption,desc:'MOONLIGHT VER.2를 세워 전시할 수 있는 LUNA ORBIT 전용 디스플레이 스탠드. 응원봉 본품과 별도 판매.'},
  {id:'moonlight-v2-mini-keyring',name:'MOONLIGHT VER.2 Mini Keyring',category:'collectible',price:18000,images:['assets/images/md/lightstick-v2/night-lightstick-v2-06-mini-keyring.webp'],options:allOption,desc:'MOONLIGHT VER.2의 디자인을 미니 사이즈로 재현한 라이트 온·오프 키링. 응원봉 본품과 별도 판매.'},
  {id:'moonlight-v2-metal-pin',name:'LUNA ORBIT Metal Pin',category:'collectible',price:13000,images:['assets/images/md/lightstick-v2/night-lightstick-v2-03-metal-pin.webp'],options:allOption,desc:'초승달과 NIGHT STAR, 궤도 모티프를 결합한 LUNA ORBIT 메탈 핀. 응원봉 본품과 별도 판매.'},
  {id:'moonlight-v2-bag-charm',name:'LUNA ORBIT Bag Charm',category:'collectible fashion',price:22000,images:['assets/images/md/lightstick-v2/night-lightstick-v2-04-bag-charm.webp'],options:allOption,desc:'LUNA ORBIT의 초승달과 별 궤도 디자인을 활용한 공식 백 참. 응원봉 본품과 별도 판매.'},
  {id:'moonlight-light-stick',`;
store=store.replace(v2Block,separated);
store=store.replace("document.querySelector('#checkoutButton').addEventListener('click',()=>showToast('가상 MD 스토어로 실제 구매 및 결제는 진행되지 않습니다.'));","document.querySelector('#checkoutButton').addEventListener('click',()=>showToast('이 페이지에서는 실제 구매 및 결제가 진행되지 않습니다.'));");
fs.writeFileSync(storePath,store);

const fanPath='src/pages/fanclub.json';
const fan=JSON.parse(fs.readFileSync(fanPath,'utf8'));
const anchor='<a class="btn secondary" href="store.html">VIEW MOONLIGHT VER.2 →</a>';
if(!fan.contentHtml.includes(anchor)) throw new Error('Fanclub V2 CTA not found');
fan.contentHtml=fan.contentHtml.replace(anchor,'<p class="section-desc lightstick-accessory-note"><strong>ACCESSORIES SOLD SEPARATELY.</strong> Carry Case, Wrist Strap, Display Stand, Mini Keyring, Metal Pin, Bag Charm은 MOONLIGHT VER.2 본품과 별도 판매됩니다.</p>\n'+anchor);
fan.headHtml=fan.headHtml.replace('.lightstick-mode-list{display:flex;','.lightstick-accessory-note{font-size:12px;margin-top:18px}.lightstick-accessory-note strong{display:block;color:var(--text);font-size:10px;letter-spacing:.12em;margin-bottom:6px}.lightstick-mode-list{display:flex;');
fs.writeFileSync(fanPath,JSON.stringify(fan,null,2)+'\n');

const testPath='tests/store-medley.test.mjs';
let test=fs.readFileSync(testPath,'utf8');
test=test.replace("test('all 38 products and their full/thumbnail images survive catalog conversion',async()=>{\n  assert.equal(products.length,38);assert.equal(productList(products,'all').length,38);","test('all 44 products and their full/thumbnail images survive catalog conversion',async()=>{\n  assert.equal(products.length,44);assert.equal(productList(products,'all').length,44);");
const marker="  assert.throws(()=>parseStoreProducts('unknown'),/boundary/);\n});";
const assertions=`  const v2=products.find(product=>product.id==='moonlight-light-stick-v2');assert.ok(v2);assert.equal(v2.price,59000);assert.equal(v2.images.length,4);\n  const prices=new Map([['moonlight-v2-carry-case',29000],['moonlight-v2-wrist-strap',12000],['moonlight-v2-display-stand',19000],['moonlight-v2-mini-keyring',18000],['moonlight-v2-metal-pin',13000],['moonlight-v2-bag-charm',22000]]);\n  for(const [id,price] of prices){const accessory=products.find(product=>product.id===id);assert.ok(accessory);assert.equal(accessory.price,price);}\n  assert.throws(()=>parseStoreProducts('unknown'),/boundary/);\n});`;
if(!test.includes(marker)) throw new Error('Store test marker not found');
test=test.replace(marker,assertions);
fs.writeFileSync(testPath,test);

console.log('Separated MOONLIGHT VER.2 and six accessories with finalized store prices.');
