import {Header, Footer} from './Layout.jsx';
import {HomePage} from './HomePage.jsx';
import {ArchivePage} from './ArchivePages.jsx';
const active={'index.html':'HOME','discography.html':'DISCOGRAPHY','contents.html':'CONTENTS','notice.html':'NOTICE','fanclub.html':'FANCLUB','gallery.html':'GALLERY'};
export function App({route='index.html'}) {return <><Header activeNav={active[route]} />{route==='index.html'?<HomePage />:<ArchivePage route={route} />}<Footer /></>;}
