import {Header, Footer} from './Layout.jsx';
import {HomePage} from './HomePage.jsx';
import {ArchivePage} from './ArchivePages.jsx';
import {SearchArchive} from './SearchArchive.jsx';
import {albumRoutes,stageRoutes,fanclubDetailRoutes} from './routes.mjs';
const active={'index.html':'HOME','discography.html':'DISCOGRAPHY','contents.html':'CONTENTS','notice.html':'NOTICE','fanclub.html':'FANCLUB','gallery.html':'GALLERY','history.html':'HISTORY','listen.html':'LISTEN'};
export function App({route='index.html'}) {return <><Header activeNav={albumRoutes.includes(route)?'DISCOGRAPHY':stageRoutes.includes(route)?'CONTENTS':fanclubDetailRoutes.includes(route)?'FANCLUB':route==='archive.html'?'ARCHIVE':route.startsWith('member-')?'MEMBERS':active[route]} />{route==='index.html'?<HomePage />:route==='archive.html'?<SearchArchive />:<ArchivePage route={route} />}<Footer /></>;}
