import {albumRoutes,stageRoutes,fanclubDetailRoutes,storyRoutes,playerRoutes,collectionRoutes,editorialRoutes,eventRoutes,personalRoutes,visualRoutes,memberContentRoutes} from '../src/react/routes.mjs';

export const searchLabels={
  group:'그룹 · 연혁',
  music:'음악 · 앨범',
  stage:'공연 · 방송 · 수상',
  luna:'LUNA · 이벤트 · MD',
  stories:'일상 · 자체 콘텐츠',
  visual:'화보 · 전시 · SNS',
  news:'공지 · PRESS'
};

const routeKeywords={
  'taehoon-camera-on-off.html':'TAEHOON 태훈 유태훈 태훈의 카메라 ON-OFF PERSONAL SCHEDULE',
  'doha-play-on.html':'DOHA 윤도하 PLAY ON PERSONAL SCHEDULE VARIETY SPORTS',
  'jiwoo-acting.html':'JIWOO 천지우 ACTING PERSONAL SCHEDULE DRAMA FILM FILMOGRAPHY',
  'ihwan-musical.html':'IHWAN 박이환 MUSICAL PERSONAL SCHEDULE STAGE PHOTO ARCHIVE',
  'woohyun-night-off.html':"WOOHYUN 성우현 RADIO PERSONAL SCHEDULE WOOHYUN'S NIGHT OFF 우현의 나이트 오프",
  'night-in-the-house-2030.html':'NIGHT IN THE HOUSE FANMEETING LUNA 2030',
  'return-2030.html':'RETURN 5MM 2030',
  'sometime.html':'SOMETIME CINEMATIC 2030'
  ,'luna8.html':'LUNA 8TH SHINE AND DAWN MEMBERSHIP KIT'
  ,'taehoon-todays-scenery.html':'TAEHOON 유태훈 오늘의 풍경 SOLO SINGLE 아무 데도 다녀왔어'
  ,'ihwan-graduation.html':'IHWAN 박이환 GRADUATION 졸업 PERSONAL ARCHIVE'
  ,'fashion-week-2030.html':'NIGHT 2030 FASHION WEEK DOHA WOOHYUN JIWOO IHWAN TAEHOON'
  ,'night-selfie-archive.html':'NIGHT SELFIE ARCHIVE BED POST WORKOUT SHOWER BACKSTAGE SNOWMAN DOHA WOOHYUN JIWOO IHWAN TAEHOON'
  ,'member-fragrance-match.html':'NIGHT MEMBER FRAGRANCE MATCH TOM FORD OUD WOOD MAISON MARGIELA REPLICA JAZZ CLUB MFK GENTLE FLUIDITY SILVER BYREDO MOJAVE GHOST JO MALONE LONDON CYPRESS GRAPEVINE'
  ,'luxury-brand-ambassador-2030.html':'2030 NIGHT LUXURY BRAND AMBASSADOR SAINT LAURENT PRADA DIOR VALENTINO LOEWE DOHA WOOHYUN JIWOO IHWAN TAEHOON'
  ,'after-hours-photobook.html':'NIGHT AFTER HOURS PHOTOBOOK VISUAL ALLURE PROVOCATION DANGER BEHIND THE SCENES DOHA WOOHYUN JIWOO IHWAN TAEHOON 독립 화보'
  ,'doha-taehoon-mariners-2030.html':'INCHEON MARINERS MARINERS 2030 BASEBALL HOME GAME DOHA TAEHOON 윤도하 유태훈 FIRST PITCH CEREMONIAL BATTING 시구 시타'
  ,'ihwan-mariners-2030.html':'INCHEON MARINERS MARINERS 2030 BASEBALL HOME GAME IHWAN 박이환 NATIONAL ANTHEM 애국가 애국가 제창'
  ,'jiwoo-woohyun-mariners-2030.html':'INCHEON MARINERS MARINERS 2030 BASEBALL HOME GAME JIWOO WOOHYUN 천지우 성우현 FIRST PITCH CEREMONIAL BATTING 시구 시타'
  ,'nights-closet.html':"NIGHT'S CLOSET NIGHTS CLOSET WARDROBE WARDROBE SHEET DOHA WOOHYUN JIWOO IHWAN TAEHOON 윤도하 성우현 천지우 박이환 유태훈"
  ,'night-files.html':'NIGHT FILES SELFIE SEQUENCE OUTFIT MATCH FOUR CUT PROFILE PHOTO HISTORY CAMERA ROLL CAMERAROLL 카메라 롤 카메라롤 셀카 의상 인생네컷 프로필 사진 DOHA WOOHYUN JIWOO IHWAN TAEHOON 윤도하 성우현 천지우 박이환 유태훈'
};

const escape=value=>String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

export function archiveFallback(catalog){
  return '<noscript><p>검색 기능은 JavaScript가 필요합니다. 아래 목록에서 바로 이동할 수 있습니다.</p><ul>'+catalog.records.map(record=>'<li><a href="'+escape(record.href)+'">'+escape(record.title)+'</a></li>').join('')+'</ul></noscript>';
}

const sets={
  music:new Set([...albumRoutes,'discography.html','listen.html','highlight-medley.html']),
  stage:new Set(stageRoutes),
  luna:new Set(['fanclub.html','store.html','with-luna.html',...fanclubDetailRoutes,...eventRoutes.filter(route=>route!=='doha-play-on.html')]),
  stories:new Set(['contents.html','if-night.html','doha-play-on.html',...personalRoutes,...storyRoutes,...playerRoutes,...memberContentRoutes]),
  visual:new Set(['gallery.html','five-voices.html',...visualRoutes]),
  news:new Set(['notice.html','press.html'])
};

const decode=value=>String(value||'')
  .replace(/&nbsp;/gi,' ')
  .replace(/&amp;/gi,'&')
  .replace(/&quot;/gi,'"')
  .replace(/&#39;|&apos;/gi,"'")
  .replace(/&lt;/gi,'<')
  .replace(/&gt;/gi,'>');
const cleanText=value=>decode(String(value||'')
  .replace(/<script\b[\s\S]*?<\/script>/gi,' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi,' ')
  .replace(/<[^>]+>/g,' '))
  .replace(/\s+/g,' ')
  .trim();
const mainMarkup=markup=>String(markup||'').match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||String(markup||'');
const tagAttribute=(tag,name)=>tag.match(new RegExp('\\b'+name+'=["\\\']([^"\\\']*)["\\\']','i'))?.[1]||'';
const headTitle=head=>cleanText(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'NIGHT');
const headDescription=head=>{
  for(const tag of head.match(/<meta\b[^>]*>/gi)||[]){
    if(tagAttribute(tag,'name').toLowerCase()==='description')return decode(tagAttribute(tag,'content'));
  }
  return '';
};
const firstImage=markup=>{
  for(const tag of markup.match(/<img\b[^>]*>/gi)||[]){
    const src=decode(tagAttribute(tag,'src'));
    if(src)return src;
  }
  return '';
};
const summarize=(description,text)=>{
  const base=cleanText(description)||text;
  if(base.length<=180)return base;
  return base.slice(0,177).replace(/\s+\S*$/,'').trim()+'…';
};
const albumArchiveRoute=album=>{
  for(const tag of String(album.bodyTemplateHtml||'').match(/<a\b[^>]*>/gi)||[]){
    if(!/album-detail-link/i.test(tagAttribute(tag,'class')))continue;
    const href=tagAttribute(tag,'href');
    if(/^[a-z0-9-]+\.html$/i.test(href))return href;
  }
  return '';
};
const albumVisual=(album,documents)=>{
  if(album.image)return album.image;
  const ownImage=firstImage(album.bodyTemplateHtml||'');
  if(ownImage)return ownImage;
  const archiveRoute=albumArchiveRoute(album);
  if(archiveRoute&&documents[archiveRoute]){
    const image=firstImage(documents[archiveRoute].markup||'');
    if(image)return image;
  }
  const needle=String(album.title||'').toLowerCase();
  for(const route of albumRoutes){
    const document=documents[route];
    if(!document)continue;
    const title=headTitle(document.headHtml||'').toLowerCase();
    const text=cleanText(document.markup||'').toLowerCase();
    if(!title.includes(needle)&&!text.includes(needle))continue;
    const image=firstImage(document.markup||'');
    if(image)return image;
  }
  return '';
};

export function categoryForRoute(route){
  for(const [category,routes] of Object.entries(sets))if(routes.has(route))return category;
  return 'group';
}

export function buildSearchCatalog({routes,documents,albums}){
  const records=routes.map(route=>{
    const document=documents[route]||{};
    const head=document.headHtml||'';
    const markup=document.markup||'';
    const title=headTitle(head);
    const text=cleanText(mainMarkup(markup));
    const summary=summarize(headDescription(head),text);
    const image=firstImage(markup);
    const id=route==='index.html'?'index':route.replace(/\.html$/,'');
    const record={id,href:route,title,category:categoryForRoute(route),summary,keywords:[title,routeKeywords[route]||''].join(' ').trim(),searchText:text};
    if(image)record.image=image;
    return record;
  });

  for(const album of albums){
    const text=cleanText(String(album.bodyTemplateHtml||'').replaceAll('{{title}}',album.title));
    const image=albumVisual(album,documents);
    const record={
      id:'discography-'+album.id,
      href:'discography.html#'+album.id,
      title:album.title,
      category:'music',
      summary:summarize('',text),
      keywords:[album.title,album.id].join(' '),
      searchText:text
    };
    if(image)record.image=image;
    records.push(record);
  }

  const ids=new Set();
  const hrefs=new Set();
  for(const record of records){
    if(ids.has(record.id))throw new Error('Duplicate search record id: '+record.id);
    ids.add(record.id);
    if(hrefs.has(record.href))throw new Error('Duplicate search record href: '+record.href);
    hrefs.add(record.href);
    if(!Object.hasOwn(searchLabels,record.category))throw new Error('Unknown search category: '+record.category);
  }
  return {labels:searchLabels,records};
}
