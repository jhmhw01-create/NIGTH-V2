import {renderToString} from 'react-dom/server';
import {App} from './App.jsx';
export function renderHome() {return renderToString(<App />);}
