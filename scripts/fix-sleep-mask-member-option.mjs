import fs from 'node:fs';

const storePath='public/assets/js/md-store.js';
let store=fs.readFileSync(storePath,'utf8');
const before="{id:'sleep-mask',name:'NIGHT Sleep Mask',category:'fashion',price:24000,images:[mdPath('수면안대'),mdPath('수면안대 특전 포카')],options:allOption,benefit:'구매 특전 포토카드 1종 증정',desc:'밤의 휴식을 위한 부드러운 NIGHT 수면안대.'}";
const after="{id:'sleep-mask',name:'NIGHT Sleep Mask',category:'fashion',price:24000,images:[mdPath('수면안대'),mdPath('수면안대 특전 포카')],options:members,benefit:'구매 특전 포토카드 1종 증정',desc:'멤버별 디자인 중 하나를 선택하는 부드러운 NIGHT 수면안대 단품. 가격은 1개 기준이며 ONE SIZE로 구성된다.'}";
if(store.includes(before)){
  store=store.replace(before,after);
  fs.writeFileSync(storePath,store);
  console.log('Updated NIGHT Sleep Mask to member-select single item.');
}else if(store.includes("id:'sleep-mask'")&&store.includes('options:members')){
  console.log('Sleep Mask already uses member options.');
}else{
  console.log('Sleep Mask source shape changed; no modification made.');
}

const testPath='tests/store-medley.test.mjs';
let test=fs.readFileSync(testPath,'utf8');
if(!test.includes("const sleepMask=products.find(product=>product.id==='sleep-mask')")){
  const marker="  const phone=products.find(product=>product.id==='phone-case');assert.deepEqual(phone.optionGroups,[{label:'MEMBER',values:['DOHA','WOOHYUN','JIWOO','IHWAN','TAEHOON']},{label:'DEVICE',values:['iPHONE','GALAXY']}]);assert.equal(phone.options.length,10);assert.ok(phone.options.includes('JIWOO / GALAXY'));\n";
  const addition=marker+"  const sleepMask=products.find(product=>product.id==='sleep-mask');assert.deepEqual(sleepMask.options,['DOHA','WOOHYUN','JIWOO','IHWAN','TAEHOON']);assert.equal(sleepMask.price,24000);assert.match(sleepMask.desc,/멤버별 디자인/);assert.match(sleepMask.desc,/1개 기준/);\n";
  if(test.includes(marker)){
    test=test.replace(marker,addition);
    fs.writeFileSync(testPath,test);
    console.log('Added sleep mask regression coverage.');
  }
}
