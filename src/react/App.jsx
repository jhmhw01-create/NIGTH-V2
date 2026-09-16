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
  'member-doha.html':{from:'assets/images/doha.png',to:'assets/images/member-doha.webp'},
  'member-ihwan.html':{from:'assets/images/ihwan.png',to:'assets/images/member-ihwan.webp'},
  'member-jiwoo.html':{from:'assets/images/jiwoo.png',to:'assets/images/member-jiwoo.webp'},
  'member-taehun.html':{from:'assets/images/taehun.png',to:'assets/images/member-taehoon.webp'},
  'member-woohyun.html':{from:'assets/images/woohyun.png',to:'assets/images/member-woohyun.webp'}
};
function withMemberPortrait(nodes,route){
  const portrait=memberPortraits[route];
  if(!portrait||!Array.isArray(nodes))return nodes;
  const walk=node=>{
    if(typeof node==='string')return node;
    const props={...node.props};
    if(node.tag==='img'&&props.src===portrait.from)props.src=portrait.to;
    return {...node,props,children:node.children.map(walk)};
  };
  return nodes.map(walk);
}
function SiteApp({route='index.html',pageData}) {const pageNodes=withMemberPortrait(pageData.nodes,route);return <><Header activeNav={route==='store.html'?'FANCLUB':route==='highlight-medley.html'?'LISTEN':route==='press.html'?'ARCHIVE':route==='five-voices.html'?'CONTENTS':albumRoutes.includes(route)?'DISCOGRAPHY':stageRoutes.includes(route)||storyRoutes.includes(route)||playerRoutes.includes(route)||collectionRoutes.includes(route)||eventRoutes.includes(route)||visualRoutes.includes(route)?'CONTENTS':fanclubDetailRoutes.includes(route)?'FANCLUB':route==='archive.html'?'ARCHIVE':route.startsWith('member-')?'MEMBERS':active[route]} /><DetailNavigation item={pageData.navigation}/><div id="night-main-content" tabIndex={-1}>{route==='index.html'?<HomePage updates={pageData.updates}/>:route==='store.html'?<StorePage products={pageData.products}/>:route==='archive.html'?<SearchArchive catalog={pageData.catalog}/>:playerRoutes.includes(route)?<PhotoEpisodePage route={route} originalData={pageData.photos}/>:collectionRoutes.includes(route)?<CollectionPage route={route} data={pageData.photos}/>:<ArchivePage route={route} nodes={pageNodes}/>}</div><DetailNavigation item={pageData.navigation} bottom/><Footer /></>;}
export function App(props){return <><a className="skip-link" href="#night-main-content" onClick={()=>document.getElementById('night-main-content')?.focus()}>본문 바로가기</a><ErrorBoundary><SiteApp {...props}/></ErrorBoundary></>;}
