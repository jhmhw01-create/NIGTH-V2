import {hydrateRoot} from 'react-dom/client';
import {App} from './App.jsx';
const route=window.location.pathname.split('/').pop() || 'index.html';
let pageData;
try {pageData=JSON.parse(document.getElementById('night-page-data')?.textContent??'null');}catch {pageData=null;}
hydrateRoot(document.getElementById('night-react-root'), <App route={route} pageData={pageData} />);
