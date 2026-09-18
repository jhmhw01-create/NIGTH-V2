import fs from 'node:fs';
const path='src/data/archive.json';
const data=JSON.parse(fs.readFileSync(path,'utf8'));
for(const record of data.records){
  if(record.href?.startsWith('member-') && typeof record.keywords==='string'){
    record.keywords=record.keywords.replace(/\bKEYWORDS\s+KEYWORDS\b/g,'KEYWORDS');
  }
}
fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
console.log('Member archive keyword labels deduplicated.');
