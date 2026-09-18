import fs from 'node:fs';

const storePath='public/assets/js/md-store.js';
let store=fs.readFileSync(storePath,'utf8');

const carrierOld="  {id:'carrier-cover',name:'NIGHT Carrier Cover',category:'travel',price:39000,images:[mdPath('캐리어커버')],options:['20 INCH','24 INCH','28 INCH'],desc:'여행 캐리어를 보호하는 NIGHT 그래픽 커버.'},";
const carrierNew="  {id:'carrier-cover',name:'NIGHT Carrier Cover',category:'travel',price:39000,images:[mdPath('캐리어커버')],optionGroups:[{label:'MEMBER',values:members},{label:'SIZE',values:['20 INCH','24 INCH','28 INCH']}],options:members.flatMap(member=>['20 INCH','24 INCH','28 INCH'].map(size=>`${member} / ${size}`)),desc:'멤버별 NIGHT 그래픽을 선택할 수 있는 캐리어 보호 커버. 멤버와 캐리어 사이즈를 각각 선택한다.'},";
if(!store.includes(carrierOld)) throw new Error('Carrier cover source not found');
store=store.replace(carrierOld,carrierNew);

const phoneOld="  {id:'phone-case',name:'NIGHT Phone Case',category:'tech',price:29000,images:[mdPath('폰케이스'),mdPath('폰케이스 특전 포카')],options:['iPHONE','GALAXY'],benefit:'구매 특전 포토카드 1종 증정',desc:'NIGHT 그래픽을 적용한 투명 하드 폰케이스.'},";
const phoneNew="  {id:'phone-case',name:'NIGHT Phone Case',category:'tech',price:29000,images:[mdPath('폰케이스'),mdPath('폰케이스 특전 포카')],optionGroups:[{label:'MEMBER',values:members},{label:'DEVICE',values:['iPHONE','GALAXY']}],options:members.flatMap(member=>['iPHONE','GALAXY'].map(device=>`${member} / ${device}`)),benefit:'구매 특전 포토카드 1종 증정',desc:'멤버별 NIGHT 그래픽을 적용한 투명 하드 폰케이스. 멤버와 기기 타입을 각각 선택한다.'},";
if(!store.includes(phoneOld)) throw new Error('Phone case source not found');
store=store.replace(phoneOld,phoneNew);

const optionBlock="  const option = document.querySelector('#detailOption');\n  option.innerHTML = activeProduct.options.map((item) => `<option>${item}</option>`).join('');";
const optionReplacement="  const groups = activeProduct.optionGroups || [{label:'OPTION',values:activeProduct.options}];\n  const option = document.querySelector('#detailOption');\n  const optionLabel = document.querySelector('#detailOptionLabel');\n  const extraOptions = document.querySelector('#detailExtraOptions');\n  optionLabel.textContent = groups[0].label;\n  option.innerHTML = groups[0].values.map((item) => `<option>${item}</option>`).join('');\n  extraOptions.innerHTML = groups.slice(1).map((group,index)=>{const id=`detailOption${index+2}`;return `<label for=\"${id}\">${group.label}</label><select id=\"${id}\" data-detail-option>${group.values.map(item=>`<option>${item}</option>`).join('')}</select>`;}).join('');";
if(!store.includes(optionBlock)) throw new Error('Option render block not found');
store=store.replace(optionBlock,optionReplacement);

const cartOld="document.querySelector('#addToCart').addEventListener('click',()=>{if(!activeProduct)return;const option=document.querySelector('#detailOption').value;const quantity=Math.max(1,Math.min(9,Number(document.querySelector('#detailQuantity').value)||1));const found=cart.find((item)=>item.id===activeProduct.id&&item.option===option);if(found)found.quantity+=quantity;else cart.push({id:activeProduct.id,name:activeProduct.name,option,quantity,price:activeProduct.price,image:activeProduct.images[0]});saveCart();closeOverlays();showToast(`${activeProduct.name} · CART에 담았습니다.`);});";
const cartNew="document.querySelector('#addToCart').addEventListener('click',()=>{if(!activeProduct)return;const option=[document.querySelector('#detailOption').value,...[...document.querySelectorAll('[data-detail-option]')].map(select=>select.value)].join(' / ');const quantity=Math.max(1,Math.min(9,Number(document.querySelector('#detailQuantity').value)||1));const found=cart.find((item)=>item.id===activeProduct.id&&item.option===option);if(found)found.quantity+=quantity;else cart.push({id:activeProduct.id,name:activeProduct.name,option,quantity,price:activeProduct.price,image:activeProduct.images[0]});saveCart();closeOverlays();showToast(`${activeProduct.name} · CART에 담았습니다.`);});";
if(!store.includes(cartOld)) throw new Error('Cart option block not found');
store=store.replace(cartOld,cartNew);
fs.writeFileSync(storePath,store);

const pagePath='src/pages/store.json';
const page=JSON.parse(fs.readFileSync(pagePath,'utf8'));
const htmlOld='<label for="detailOption">OPTION</label><select id="detailOption"></select><label for="detailQuantity">QUANTITY</label>';
const htmlNew='<label id="detailOptionLabel" for="detailOption">OPTION</label><select id="detailOption"></select><div id="detailExtraOptions" class="store-extra-options"></div><label for="detailQuantity">QUANTITY</label>';
if(!page.contentHtml.includes(htmlOld)) throw new Error('Store option markup not found');
page.contentHtml=page.contentHtml.replace(htmlOld,htmlNew);
page.headHtml=page.headHtml.replace('</style>','.store-page .store-extra-options{display:contents}</style>');
fs.writeFileSync(pagePath,JSON.stringify(page,null,2)+'\n');

const testPath='tests/store-medley.test.mjs';
let test=fs.readFileSync(testPath,'utf8');
const marker="  for(const [id,price] of prices){const accessory=products.find(product=>product.id===id);assert.ok(accessory);assert.equal(accessory.price,price);}\n  assert.throws(()=>parseStoreProducts('unknown'),/boundary/);";
const replacement="  for(const [id,price] of prices){const accessory=products.find(product=>product.id===id);assert.ok(accessory);assert.equal(accessory.price,price);}\n  const carrier=products.find(product=>product.id==='carrier-cover');assert.deepEqual(carrier.optionGroups,[{label:'MEMBER',values:['DOHA','WOOHYUN','JIWOO','IHWAN','TAEHOON']},{label:'SIZE',values:['20 INCH','24 INCH','28 INCH']}]);assert.equal(carrier.options.length,15);assert.ok(carrier.options.includes('TAEHOON / 24 INCH'));\n  const phone=products.find(product=>product.id==='phone-case');assert.deepEqual(phone.optionGroups,[{label:'MEMBER',values:['DOHA','WOOHYUN','JIWOO','IHWAN','TAEHOON']},{label:'DEVICE',values:['iPHONE','GALAXY']}]);assert.equal(phone.options.length,10);assert.ok(phone.options.includes('JIWOO / GALAXY'));\n  assert.throws(()=>parseStoreProducts('unknown'),/boundary/);";
if(!test.includes(marker)) throw new Error('Store test marker not found');
test=test.replace(marker,replacement);
const cartMarker="  const separate=addCartItem(merged,product,product.options[1],1);assert.equal(separate.length,2);assert.deepEqual(readCart(JSON.stringify(separate),products),separate);";
const cartReplacement="  const separate=addCartItem(merged,product,product.options[1],1);assert.equal(separate.length,2);assert.deepEqual(readCart(JSON.stringify(separate),products),separate);\n  const carrier=products.find(item=>item.id==='carrier-cover');const configured=addCartItem([],carrier,'TAEHOON / 24 INCH',1);assert.equal(configured.length,1);assert.equal(configured[0].option,'TAEHOON / 24 INCH');assert.deepEqual(readCart(JSON.stringify(configured),products),configured);";
if(!test.includes(cartMarker)) throw new Error('Cart test marker not found');
test=test.replace(cartMarker,cartReplacement);
fs.writeFileSync(testPath,test);

console.log('Normalized multi-axis store options for carrier cover and phone case.');
