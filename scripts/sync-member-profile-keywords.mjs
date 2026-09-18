import fs from 'node:fs';

const desired={
  doha:['책임감','중심','다정함'],
  woohyun:['감각','본능','몰입'],
  jiwoo:['자기확신','관찰','절제'],
  ihwan:['여유','이면','유희'],
  taehoon:['솔직함','친화력','적극성']
};

const pageInfo={
  doha:{href:'member-doha.html',stage:'DOHA',name:'윤도하',position:'리더 서브래퍼'},
  woohyun:{href:'member-woohyun.html',stage:'WOOHYUN',name:'성우현',position:'메인댄서'},
  jiwoo:{href:'member-jiwoo.html',stage:'JIWOO',name:'천지우',position:'센터 메인래퍼'},
  ihwan:{href:'member-ihwan.html',stage:'IHWAN',name:'박이환',position:'메인보컬'},
  taehoon:{href:'member-taehoon.html',stage:'TAEHOON',name:'유태훈',position:'리드보컬 막내'}
};

function readJson(path){return JSON.parse(fs.readFileSync(path,'utf8'));}
function writeJson(path,data){fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');}
function stripHtml(html){return html.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}

const pages={};
for(const [key,words] of Object.entries(desired)){
  const path=`src/pages/member-${key}.json`;
  const page=readJson(path);
  const grid=`<div class="member-highlight-grid"><article class="profile-highlight reveal"><span class="highlight-label">KEYWORD 01</span><p>${words[0]}</p></article><article class="profile-highlight reveal"><span class="highlight-label">KEYWORD 02</span><p>${words[1]}</p></article><article class="profile-highlight reveal"><span class="highlight-label">KEYWORD 03</span><p>${words[2]}</p></article></div>`;
  const pattern=/<div class="member-highlight-grid"><article class="profile-highlight reveal"><span class="highlight-label">KEYWORD 01<\/span><p>[^<]*<\/p><\/article><article class="profile-highlight reveal"><span class="highlight-label">KEYWORD 02<\/span><p>[^<]*<\/p><\/article><article class="profile-highlight reveal"><span class="highlight-label">KEYWORD 03<\/span><p>[^<]*<\/p><\/article><\/div>/;
  if(!pattern.test(page.contentHtml)) throw new Error(`Keyword grid not found: ${key}`);
  page.contentHtml=page.contentHtml.replace(pattern,grid);
  writeJson(path,page);
  pages[key]=page;
}

const archivePath='src/data/archive.json';
const archive=readJson(archivePath);
const banned=['통제','쾌락','나르시즘','기만','열등감','추진력','애정','DRIVE','Drive'];
for(const [key,words] of Object.entries(desired)){
  const info=pageInfo[key];
  const record=archive.records.find(item=>item.href===info.href || (key==='taehoon' && item.id==='member-taehun'));
  if(!record) throw new Error(`Archive member record not found: ${key}`);
  const page=pages[key];
  const sections=[...page.contentHtml.matchAll(/<div class="section-label reveal">([^<]+)<\/div>/g)].map(m=>m[1]);
  record.keywords=[info.stage,info.name,info.position,...sections,'KEYWORDS',...words].join(' ');
  record.searchText=stripHtml(page.contentHtml);
  for(const bad of banned){
    if(record.keywords.includes(bad)) throw new Error(`Banned keyword remains in archive keywords for ${key}: ${bad}`);
  }
  for(const word of words){
    if(!record.keywords.includes(word) || !record.searchText.includes(word)) throw new Error(`Missing synced keyword for ${key}: ${word}`);
  }
}
writeJson(archivePath,archive);

console.log('Member profile keywords synchronized.');
