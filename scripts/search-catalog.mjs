import {albumRoutes,stageRoutes,fanclubDetailRoutes,storyRoutes,playerRoutes,collectionRoutes,editorialRoutes,eventRoutes,visualRoutes} from '../src/react/routes.mjs';

export const searchLabels={
  group:'그룹 · 연혁',
  music:'음악 · 앨범',
  stage:'공연 · 방송 · 수상',
  luna:'LUNA · 이벤트 · MD',
  stories:'일상 · 자체 콘텐츠',
  visual:'화보 · 전시 · SNS',
  news:'공지 · PRESS'
};

const sets={
  music:new Set([...albumRoutes,'discography.html','listen.html','highlight-medley.html']),
  stage:new Set(stageRoutes),
  luna:new Set(['fanclub.html','store.html','with-luna.html',...fanclubDetailRoutes,...eventRoutes]),
  stories:new Set(['contents.html','if-night.html',...storyRoutes,...playerRoutes]),
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
    const src=tagAttribute(tag,'src');
    if(src)return src;
  }
  return '';
};
const summarize=(description,text)=>{
  const base=cleanText(description)||text;
  if(base.length<=180)return base;
  return base.slice(0,177).replace(/\s+\S*$/,'').trim()+'…';
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
    const text=cleanText(markup);
    const summary=summarize(headDescription(head),text);
    const image=firstImage(markup);
    const id=route==='index.html'?'index':route.replace(/\.html$/,'');
    const record={id,href:route,title,category:categoryForRoute(route),summary,keywords:title,searchText:text};
    if(image)record.image=image;
    return record;
  });

  for(const album of albums){
    const text=cleanText(album.bodyTemplateHtml||'');
    records.push({
      id:'discography-'+album.id,
      href:'discography.html#'+album.id,
      title:album.title,
      category:'music',
      summary:summarize('',text),
      keywords:[album.title,album.id].join(' '),
      searchText:text
    });
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
