import {Header, Footer} from './Layout.jsx';
import {HomePage} from './HomePage.jsx';
import {ArchivePage} from './ArchivePages.jsx';
import {SearchArchive} from './SearchArchive.jsx';
import {albumRoutes,stageRoutes,fanclubDetailRoutes,storyRoutes,playerRoutes,collectionRoutes,eventRoutes,visualRoutes} from './routes.mjs';
import {PhotoEpisodePage} from './PhotoEpisodePage.jsx';
import {CollectionPage} from './CollectionPage.jsx';
import {StorePage} from './StorePage.jsx';
import {DetailNavigation} from './DetailNavigation.jsx';
const active={'index.html':'HOME','discography.html':'DISCOGRAPHY','contents.html':'CONTENTS','notice.html':'NOTICE','fanclub.html':'FANCLUB','gallery.html':'GALLERY','history.html':'HISTORY','listen.html':'LISTEN'};
export function App({route='index.html'}) {return <><Header activeNav={route==='store.html'?'FANCLUB':route==='highlight-medley.html'?'LISTEN':route==='press.html'?'ARCHIVE':route==='five-voices.html'?'CONTENTS':albumRoutes.includes(route)?'DISCOGRAPHY':stageRoutes.includes(route)||storyRoutes.includes(route)||playerRoutes.includes(route)||collectionRoutes.includes(route)||eventRoutes.includes(route)||visualRoutes.includes(route)?'CONTENTS':fanclubDetailRoutes.includes(route)?'FANCLUB':route==='archive.html'?'ARCHIVE':route.startsWith('member-')?'MEMBERS':active[route]} /><DetailNavigation route={route}/>{route==='index.html'?<HomePage />:route==='store.html'?<StorePage/>:route==='archive.html'?<SearchArchive />:playerRoutes.includes(route)?<PhotoEpisodePage route={route}/>:collectionRoutes.includes(route)?<CollectionPage route={route}/>:<ArchivePage route={route} />}<DetailNavigation route={route} bottom/><Footer /></>;}
