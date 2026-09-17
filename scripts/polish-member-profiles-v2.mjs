import fs from 'node:fs';

const keywordUpdates={
  woohyun:['<p>쾌락</p>','<p>감각</p>'],
  jiwoo:['<p>나르시즘</p>','<p>자기확신</p>'],
  ihwan:['<p>기만</p>','<p>여유</p>'],
  taehoon:['<p>탐욕</p>','<p>추진력</p>']
};
for(const [name,[from,to]] of Object.entries(keywordUpdates)){
  const path=`src/pages/member-${name}.json`;
  const page=JSON.parse(fs.readFileSync(path,'utf8'));
  if(!page.contentHtml.includes(from))throw new Error(`Missing NIGHTMARE keyword on ${name}`);
  page.contentHtml=page.contentHtml.replace(from,to);
  fs.writeFileSync(path,JSON.stringify(page,null,2)+'\n');
}

const testPath='tests/member-page-normalization.test.mjs';
let test=fs.readFileSync(testPath,'utf8');
const oldLine="  assert.match(source.contentHtml, /외동 \\(어릴 때부터 옆집 누나와 함께 자람\\)/);";
const newLine="  assert.match(source.contentHtml, /<dt>FAMILY<\\/dt><dd>부모님 · 외동<\\/dd>/);";
if(!test.includes(oldLine))throw new Error('Missing TAEHOON legacy family assertion');
test=test.replace(oldLine,newLine);
fs.writeFileSync(testPath,test);
