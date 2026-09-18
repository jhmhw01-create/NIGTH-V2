import fs from 'node:fs';

const storePath='public/assets/js/md-store.js';
let store=fs.readFileSync(storePath,'utf8');
store=store.replace(
"    'assets/images/md/lightstick-v2/night-lightstick-v2-07-design-evolution.webp'\n  ],options:allOption,desc:'달과 별의 궤도를 확장한 NIGHT 공식 응원봉 두 번째 버전 LUNA ORBIT. 더블 크리스털 글로브와 NIGHT STAR CORE, CRESCENT ORBIT 구조를 중심으로 VER.1의 NIGHT DNA를 이어간다. 전용 액세서리는 별도 판매된다.'},",
"    'assets/images/md/lightstick-v2/night-lightstick-v2-07-design-evolution.webp',\n    'assets/images/md/lightstick-v2/night-lightstick-v2-10-wrist-strap.webp'\n  ],options:allOption,benefit:'INCLUDED · WRIST STRAP',desc:'달과 별의 궤도를 확장한 NIGHT 공식 응원봉 두 번째 버전 LUNA ORBIT. 더블 크리스털 글로브와 NIGHT STAR CORE, CRESCENT ORBIT 구조를 중심으로 VER.1의 NIGHT DNA를 이어간다. Wrist Strap은 본품 구성에 포함되며, 그 외 전용 액세서리는 별도 판매된다.'},"
);
store=store.replace(/\n\s*\{id:'moonlight-v2-wrist-strap'[\s\S]*?\},/,'');
if(store.includes("id:'moonlight-v2-wrist-strap'")) throw new Error('Wrist strap product still present');
fs.writeFileSync(storePath,store);

const fanPath='src/pages/fanclub.json';
const fan=JSON.parse(fs.readFileSync(fanPath,'utf8'));
fan.contentHtml=fan.contentHtml.replace(
'<p class="section-desc lightstick-accessory-note"><strong>ACCESSORIES SOLD SEPARATELY.</strong> Carry Case, Wrist Strap, Display Stand, Mini Keyring, Metal Pin, Bag Charm은 MOONLIGHT VER.2 본품과 별도 판매됩니다.</p>',
'<p class="section-desc lightstick-accessory-note"><strong>WRIST STRAP INCLUDED.</strong> Wrist Strap은 MOONLIGHT VER.2 본품 구성에 포함됩니다. Carry Case, Display Stand, Mini Keyring, Metal Pin, Bag Charm은 별도 판매됩니다.</p>'
);
fs.writeFileSync(fanPath,JSON.stringify(fan,null,2)+'\n');

const testPath='tests/store-medley.test.mjs';
let test=fs.readFileSync(testPath,'utf8');
test=test.replace(/all 44 products/g,'all 43 products').replace(/products\.length,44/g,'products.length,43').replace(/productList\(products,'all'\)\.length,44/g,"productList(products,'all').length,43");
test=test.replace("assert.equal(v2.images.length,4);","assert.equal(v2.images.length,5);assert.equal(v2.benefit,'INCLUDED · WRIST STRAP');");
test=test.replace("['moonlight-v2-carry-case',29000],['moonlight-v2-wrist-strap',12000],['moonlight-v2-display-stand',19000]","['moonlight-v2-carry-case',29000],['moonlight-v2-display-stand',19000]");
fs.writeFileSync(testPath,test);

console.log('Wrist strap moved into MOONLIGHT VER.2 package; separate accessory products retained.');
