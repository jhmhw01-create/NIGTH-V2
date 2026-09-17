import {Header, Footer} from './Layout.jsx';
import {HomePage} from './HomePage.jsx';
import {ArchivePage} from './ArchivePages.jsx';
import {SearchArchive} from './SearchArchive.jsx';
import {albumRoutes,stageRoutes,fanclubDetailRoutes,storyRoutes,playerRoutes,collectionRoutes,eventRoutes,visualRoutes} from './routes.mjs';
import {PhotoEpisodePage} from './PhotoEpisodePage.jsx';
import {CollectionPage} from './CollectionPage.jsx';
import {StorePage} from './StorePage.jsx';
import {DetailNavigation} from './DetailNavigation.jsx';
import {ErrorBoundary} from './ErrorBoundary.jsx';
const active={'index.html':'HOME','discography.html':'DISCOGRAPHY','contents.html':'CONTENTS','notice.html':'NOTICE','fanclub.html':'FANCLUB','gallery.html':'GALLERY','history.html':'HISTORY','listen.html':'LISTEN'};
const memberPortraits={
  'member-doha.html':{from:'assets/images/doha.png',to:'assets/images/member-doha.webp',width:1122,height:1402},
  'member-ihwan.html':{from:'assets/images/ihwan.png',to:'assets/images/member-ihwan.webp',width:1122,height:1402},
  'member-jiwoo.html':{from:'assets/images/jiwoo.png',to:'assets/images/member-jiwoo.webp',width:1122,height:1402},
  'member-taehun.html':{from:'assets/images/taehun.png',to:'assets/images/member-taehoon.webp',width:1122,height:1402},
  'member-woohyun.html':{from:'assets/images/woohyun.png',to:'assets/images/member-woohyun.webp',width:1122,height:1402}
};
function nodeText(node){return typeof node==='string'?node:node.children.map(nodeText).join('');}
function stripAgeRow(children){
  const out=[];
  let skipAgeValue=false;
  for(const child of children){
    if(typeof child!=='string'&&child.tag==='dt'&&nodeText(child).trim()==='AGE'){
      skipAgeValue=true;
      continue;
    }
    if(skipAgeValue){
      if(typeof child==='string'&&!child.trim())continue;
      if(typeof child!=='string'&&child.tag==='dd'){
        skipAgeValue=false;
        continue;
      }
      skipAgeValue=false;
    }
    out.push(child);
  }
  return out;
}
function withMemberProfile(nodes,route){
  const portrait=memberPortraits[route];
  if(!portrait||!Array.isArray(nodes))return nodes;
  const walk=node=>{
    if(typeof node==='string')return node;
    const props={...node.props};
    if(node.tag==='img'&&props.src===portrait.from){props.src=portrait.to;props.width=String(portrait.width);props.height=String(portrait.height);}
    let children=node.children.map(walk);
    const classes=(props.className??'').split(/\s+/);
    if(classes.includes('member-meta'))children=children.map(child=>typeof child==='string'?child.replace(/\s*·\s*\d+\s*$/,''):child);
    if(node.tag==='dl'&&classes.includes('profile-lines'))children=stripAgeRow(children);
    return {...node,props,children};
  };
  return nodes.map(walk);
}
function SiteApp({route='index.html',pageData}) {const pageNodes=withMemberProfile(pageData.nodes,route);const dimensions=pageData.imageDimensions;return <><Header activeNav={route==='store.html'?'FANCLUB':route==='highlight-medley.html'?'LISTEN':route==='press.html'?'ARCHIVE':route==='five-voices.html'?'CONTENTS':albumRoutes.includes(route)?'DISCOGRAPHY':stageRoutes.includes(route)||storyRoutes.includes(route)||playerRoutes.includes(route)||collectionRoutes.includes(route)||eventRoutes.includes(route)||visualRoutes.includes(route)?'CONTENTS':fanclubDetailRoutes.includes(route)?'FANCLUB':route==='archive.html'?'ARCHIVE':route.startsWith('member-')?'MEMBERS':active[route]} /><DetailNavigation item={pageData.navigation}/><div id="night-main-content" tabIndex={-1}>{route==='index.html'?<HomePage updates={pageData.updates}/>:route==='store.html'?<StorePage products={pageData.products} dimensions={dimensions}/>:route==='archive.html'?<SearchArchive catalog={pageData.catalog} dimensions={dimensions}/>:playerRoutes.includes(route)?<PhotoEpisodePage route={route} originalData={pageData.photos} dimensions={dimensions}/>:collectionRoutes.includes(route)?<CollectionPage route={route} data={pageData.photos} dimensions={dimensions}/>:<ArchivePage route={route} nodes={pageNodes}/>}</div><DetailNavigation item={pageData.navigation} bottom/><Footer /></>;}
export function App(props){return <><a className="skip-link" href="#night-main-content" onClick={()=>document.getElementById('night-main-content')?.focus()}>본문 바로가기</a><ErrorBoundary><SiteApp {...props}/></ErrorBoundary></>;}
