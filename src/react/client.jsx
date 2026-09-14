import {hydrateRoot} from 'react-dom/client';
import {App} from './App.jsx';
const route=window.location.pathname.split('/').pop() || 'index.html';
hydrateRoot(document.getElementById('night-react-root'), <App route={route} />);
