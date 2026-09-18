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
function SiteApp({route='index.html',pageData}) {const dimensions=pageData.imageDimensions;return <><Header activeNav={route==='store.html'?'FANCLUB':route==='highlight-medley.html'?'LISTEN':route==='press.html'?'ARCHIVE':route==='five-voices.html'?'CONTENTS':albumRoutes.includes(route)?'DISCOGRAPHY':stageRoutes.includes(route)||storyRoutes.includes(route)||playerRoutes.includes(route)||collectionRoutes.includes(route)||eventRoutes.includes(route)||visualRoutes.includes(route)?'CONTENTS':fanclubDetailRoutes.includes(route)?'FANCLUB':route==='archive.html'?'ARCHIVE':route.startsWith('member-')?'MEMBERS':active[route]} /><DetailNavigation item={pageData.navigation}/><div id="night-main-content" tabIndex={-1}>{route==='index.html'?<HomePage updates={pageData.updates}/>:route==='store.html'?<StorePage products={pageData.products} dimensions={dimensions}/>:route==='archive.html'?<SearchArchive catalog={pageData.catalog} dimensions={dimensions}/>:playerRoutes.includes(route)?<PhotoEpisodePage route={route} originalData={pageData.photos} dimensions={dimensions}/>:collectionRoutes.includes(route)?<CollectionPage route={route} data={pageData.photos} dimensions={dimensions}/>:<ArchivePage route={route} nodes={pageData.nodes}/>}</div><DetailNavigation item={pageData.navigation} bottom/><Footer /></>;}
export function App(props){return <><a className="skip-link" href="#night-main-content" onClick={()=>document.getElementById('night-main-content')?.focus()}>본문 바로가기</a><ErrorBoundary><SiteApp {...props}/></ErrorBoundary></>;}
