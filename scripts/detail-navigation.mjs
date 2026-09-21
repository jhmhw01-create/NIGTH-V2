import {parseFragment} from 'parse5';
import {albumRoutes,fanclubDetailRoutes,playerRoutes,collectionRoutes,listenDetailRoutes} from '../src/react/routes.mjs';
const hubs=new Set(['index.html','discography.html','contents.html','notice.html','fanclub.html','gallery.html','history.html','listen.html','archive.html']);
const text=node=>(node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join(' ')).replace(/\s+/g,' ').trim();
const descendants=node=>[node,...(node.childNodes??[]).flatMap(descendants)];
export function detailNavigation(page){
  if(hubs.has(page.route))return null;
  const nodes=descendants(parseFragment(page.contentHtml));
  const titleNode=descendants(parseFragment(page.headHtml)).find(n=>n.tagName==='title');
  const title=text(titleNode??{childNodes:[]}).replace(/\s*[—–|]\s*NIGHT\s*$/i,'')||text(nodes.find(n=>n.tagName==='h1')??{childNodes:[]})||'NIGHT';
  const parent=page.route.startsWith('member-')?{label:'MEMBERS',href:'index.html#members',back:'멤버 목록으로'}:albumRoutes.includes(page.route)?{label:'DISCOGRAPHY',href:'discography.html',back:'앨범 목록으로'}:fanclubDetailRoutes.includes(page.route)||page.route==='store.html'?{label:'FANCLUB',href:'fanclub.html',back:'팬클럽 목록으로'}:listenDetailRoutes.includes(page.route)||page.route==='highlight-medley.html'?{label:'LISTEN',href:'listen.html',back:'음원 목록으로'}:page.route==='press.html'?{label:'ARCHIVE',href:'archive.html',back:'전체 아카이브로'}:{label:'CONTENTS',href:'contents.html',back:'콘텐츠 목록으로'};
  const seen=new Set();
  const sections=playerRoutes.includes(page.route)||collectionRoutes.includes(page.route)||page.route==='store.html'?[]:nodes.flatMap(node=>{
    const id=node.attrs?.find(a=>a.name==='id')?.value;
    if(!id||seen.has(id)||!['section','article'].includes(node.tagName))return [];
    const heading=descendants(node).find(n=>n.tagName==='h2');
    if(!heading)return [];seen.add(id);return [{id,label:text(heading)}];
  });
  const related=page.route==='moonlight-club-2029.html'?[{label:'MD ARCHIVE ↗',href:'moonlight-club-md-2029.html'}]:page.route==='moonlight-club-md-2029.html'?[{label:'MOONLIGHT CLUB ↗',href:'moonlight-club-2029.html'}]:[];
  return {title,parent,sections,related};
}
