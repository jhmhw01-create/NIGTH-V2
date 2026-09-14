import {renderToString} from 'react-dom/server';
import {App} from './App.jsx';
export function renderPage(route,pageData) {return renderToString(<App route={route} pageData={pageData} />);}
