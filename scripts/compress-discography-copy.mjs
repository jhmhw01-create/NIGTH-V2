import {readFile,writeFile} from 'node:fs/promises';

const pagePath='src/pages/discography.json';
const albumsPath='src/data/albums.json';

const page=JSON.parse(await readFile(pagePath,'utf8'));
page.headHtml=page.headHtml.replace('NIGHT official discography archive.','NIGHT의 앨범, 발매일, 타이틀곡과 트랙리스트를 발매 순서대로 소개합니다.');
page.contentHtml=page.contentHtml.replace('도시의 심야에서 시작해 꿈과 현실의 경계까지. NIGHT가 지나온 앨범과 음악의 변화를 기록한다.','NIGHT의 앨범과 타이틀곡, 트랙리스트를 발매 순서대로 만나보세요.');
page.contentHtml=page.contentHtml.replace('EXPLORE ERA ARCHIVE →','VIEW ERA TIMELINE →');
await writeFile(pagePath,JSON.stringify(page,null,2)+'\n','utf8');

const albums=JSON.parse(await readFile(albumsPath,'utf8'));
const specific={
  nightmare:{
    fromTag:'탈출하려던 악몽의 끝에서 NIGHT 자신들이 악몽이었음을 마주하는 가장 어두운 장.',
    toTag:'어둡고 긴장감 있는 사운드와 비주얼을 선보인 앨범.',
    fromCopy:'CONTROL · PLEASURE · NARCISSISM · DECEPTION · GREED. 다섯 속성과 BLACK NIGHT의 공식 기록.',
    toCopy:'타이틀곡 BLACK NIGHT와 NIGHTMARE의 공식 비주얼을 만나보세요.'
  },
  persona:{
    fromTag:'DAY와 NIGHT, 두 얼굴로 이어지는 PERSONA의 콘셉트와 앨범, 뮤직비디오 스틸 및 무대 기록.',
    toTag:'DAY와 NIGHT, 두 가지 무드로 전개한 미니앨범.',
    fromCopy:'DAY와 NIGHT, 두 얼굴로 이어지는 PERSONA의 콘셉트와 앨범, 뮤직비디오 스틸 및 무대 기록.',
    toCopy:'앨범 비주얼과 뮤직비디오 스틸, 무대 사진을 확인하세요.'
  },
  wings:{
    fromTag:'ANGEL과 FALLEN, 빛과 상흔 사이의 경계를 따라가는 WINGS의 공식 기록.',
    toTag:'ANGEL과 FALLEN, 두 가지 무드로 선보인 미니앨범.',
    fromCopy:'ANGEL과 FALLEN, 빛과 상흔 사이의 경계를 따라가는 WINGS의 공식 기록.',
    toCopy:'WINGS의 콘셉트 포토와 앨범, 활동 사진을 확인하세요.'
  }
};

for(const album of albums){
  let html=album.bodyTemplateHtml;
  html=html.replace(/\s*<div[^>]*class="[^"]*era-note[^"]*"[^>]*>[\s\S]*?<\/div>/g,'');
  html=html.replace(/OFFICIAL ARCHIVE · (?:\d+ IMAGES|2029)/g,'ALBUM ARCHIVE');
  const edit=specific[album.id];
  if(edit){
    if(!html.includes(edit.fromTag)) throw new Error(`Missing tagline source for ${album.id}`);
    html=html.replace(edit.fromTag,edit.toTag);
    if(!html.includes(edit.fromCopy)) throw new Error(`Missing archive copy source for ${album.id}`);
    html=html.replace(edit.fromCopy,edit.toCopy);
  }
  album.bodyTemplateHtml=html;
}

const all=albums.map(x=>x.bodyTemplateHtml).join('\n');
if(all.includes('ERA NOTE')) throw new Error('ERA NOTE remains');
if(/OFFICIAL ARCHIVE · \d+ IMAGES/.test(all)) throw new Error('Image-count archive label remains');
if(all.includes('CONTROL · PLEASURE · NARCISSISM · DECEPTION · GREED')) throw new Error('NIGHTMARE internal attribute list remains');

await writeFile(albumsPath,JSON.stringify(albums,null,2)+'\n','utf8');
console.log(`Compressed discography copy for ${albums.length} releases.`);
