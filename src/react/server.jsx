import {renderToString} from 'react-dom/server';
import {App} from './App.jsx';
export function renderPage(route) {return renderToString(<App route={route} />);}
