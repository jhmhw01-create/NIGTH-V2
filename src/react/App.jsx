import {useEffect} from 'react';
import {Header, Footer} from './Layout.jsx';
import {HomePage} from './HomePage.jsx';
import {ArchivePage} from './ArchivePages.jsx';
import {SearchArchive} from './SearchArchive.jsx';
import {albumRoutes,stageRoutes,fanclubDetailRoutes,storyRoutes,playerRoutes,collectionRoutes,eventRoutes,visualRoutes,listenDetailRoutes} from './routes.mjs';
import {PhotoEpisodePage} from './PhotoEpisodePage.jsx';
import {CollectionPage} from './CollectionPage.jsx';
import {StorePage} from './StorePage.jsx';
import {DetailNavigation} from './DetailNavigation.jsx';
import {ErrorBoundary} from './ErrorBoundary.jsx';
const active={'index.html':'HOME','about-night.html':'ABOUT','discography.html':'DISCOGRAPHY','contents.html':'CONTENTS','notice.html':'NOTICE','fanclub.html':'FANCLUB','gallery.html':'GALLERY','history.html':'HISTORY','listen.html':'LISTEN'};

const motionCss=`
#night-react-root{animation:night-page-in .52s cubic-bezier(.22,.61,.36,1) both}
body.night-page-leaving #night-react-root{opacity:0;transform:translateY(4px);transition:opacity .16s ease,transform .16s ease}
@keyframes night-page-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
body[data-night-surface="home"] .hero{overflow:hidden}
body[data-night-surface="home"] .hero-image{animation:night-hero-cinematic 13s cubic-bezier(.2,.55,.25,1) both;transform-origin:50% 48%;will-change:transform}
body[data-night-surface="home"] .hero-content>*{opacity:0;transform:translateY(12px);animation:night-hero-copy .72s cubic-bezier(.22,.61,.36,1) forwards}
body[data-night-surface="home"] .hero-content .eyebrow{animation-delay:.12s}
body[data-night-surface="home"] .hero-content .hero-title{animation-delay:.2s}
body[data-night-surface="home"] .hero-content .hero-debut{animation-delay:.3s}
body[data-night-surface="home"] .hero-content .hero-copy{animation-delay:.38s}
body[data-night-surface="home"] .hero-content .hero-slogan{animation-delay:.46s}
body[data-night-surface="home"] .hero-content .cta-row{animation-delay:.54s}
body[data-night-surface="home"] .reveal{opacity:0;transform:translateY(22px);transition:opacity .82s cubic-bezier(.22,.61,.36,1),transform .82s cubic-bezier(.22,.61,.36,1)}
body[data-night-surface="home"] .reveal.is-visible{opacity:1;transform:none}
@keyframes night-hero-cinematic{from{transform:scale(1.018)}to{transform:scale(1.052)}}
@keyframes night-hero-copy{to{opacity:1;transform:none}}
@media(max-width:600px){body[data-night-surface="home"] .hero-image{animation-duration:10s}}
@media(prefers-reduced-motion:reduce){
  #night-react-root,body[data-night-surface="home"] .hero-image,body[data-night-surface="home"] .hero-content>*{animation:none!important;opacity:1!important;transform:none!important}
  body.night-page-leaving #night-react-root{transition:none!important;opacity:1!important;transform:none!important}
  body[data-night-surface="home"] .reveal{transition:none!important}
}
`;

function PageMotion(){
  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onClick=event=>{
      if(reduced||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const link=event.target.closest('a[href]');
      if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
      const href=link.getAttribute('href');
      if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('javascript:'))return;
      const url=new URL(link.href,window.location.href);
      if(url.origin!==window.location.origin||url.pathname===window.location.pathname&&url.search===window.location.search&&url.hash)return;
      event.preventDefault();
      document.body.classList.add('night-page-leaving');
      window.setTimeout(()=>{window.location.href=url.href;},160);
    };
    document.addEventListener('click',onClick);
    return()=>document.removeEventListener('click',onClick);
  },[]);
  return <style>{motionCss}</style>;
}

function ListenUnitLink(){return <section className="section listen-section"><div className="container"><article className="listen-card reveal is-visible"><div className="listen-number">UNIT</div><div className="listen-info"><div className="listen-meta"><span>WOOHYUN × JIWOO</span><span>2028.06.16 · UNIT ALBUM</span></div><h2>SO GOOD</h2><p>무대 밖에서 시작된 약속을 자유로운 록 사운드와 페스티벌의 에너지로 펼친 유닛 앨범.</p><a className="listen-album-link" href="so-good-2028.html">VIEW SO GOOD ARCHIVE →</a></div></article><article className="listen-card reveal is-visible"><div className="listen-number">UNIT</div><div className="listen-info"><div className="listen-meta"><span>WOOHYUN × JIWOO</span><span>2024 · UNIT TRACK</span></div><h2>MIRROR</h2><p>NO SIGNAL 이후, TAEHOON 합류 전 두 멤버가 함께한 유닛 트랙.</p><a className="listen-album-link" href="mirror-2024.html">LISTEN TO MIRROR →</a></div></article></div></section>}

function SiteApp({route='index.html',pageData}) {const dimensions=pageData.imageDimensions;const activeNav=listenDetailRoutes.includes(route)?'LISTEN':route==='store.html'?'FANCLUB':route==='highlight-medley.html'?'LISTEN':route==='press.html'?'ARCHIVE':route==='five-voices.html'?'CONTENTS':albumRoutes.includes(route)?'DISCOGRAPHY':stageRoutes.includes(route)||storyRoutes.includes(route)||playerRoutes.includes(route)||collectionRoutes.includes(route)||eventRoutes.includes(route)||visualRoutes.includes(route)?'CONTENTS':fanclubDetailRoutes.includes(route)?'FANCLUB':route==='archive.html'?'ARCHIVE':route.startsWith('member-')?'MEMBERS':active[route];return <><PageMotion/><Header activeNav={activeNav}/><DetailNavigation item={pageData.navigation}/><div id="night-main-content" tabIndex={-1}>{route==='index.html'?<HomePage updates={pageData.updates}/>:route==='store.html'?<StorePage products={pageData.products} dimensions={dimensions}/>:route==='archive.html'?<SearchArchive catalog={pageData.catalog} dimensions={dimensions}/>:playerRoutes.includes(route)?<PhotoEpisodePage route={route} originalData={pageData.photos} dimensions={dimensions}/>:collectionRoutes.includes(route)?<CollectionPage route={route} data={pageData.photos} dimensions={dimensions}/>:<><ArchivePage route={route} nodes={pageData.nodes}/>{route==='listen.html'?<ListenUnitLink/>:null}</>}</div><DetailNavigation item={pageData.navigation} bottom/><Footer /></>;}
export function App(props){return <><a className="skip-link" href="#night-main-content" onClick={()=>document.getElementById('night-main-content')?.focus()}>본문 바로가기</a><ErrorBoundary><SiteApp {...props}/></ErrorBoundary></>;}
