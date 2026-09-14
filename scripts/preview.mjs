import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.mp3':'audio/mpeg','.woff2':'font/woff2'};
await stat(resolve(root, 'index.html')).catch(() => {throw Error('Run npm run build first.');});
createServer(async (request, response) => {
  try {
    if (!['GET','HEAD'].includes(request.method)) {response.writeHead(405); response.end(); return;}
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const path = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!path.startsWith(resolve(root) + sep)) {response.writeHead(403); response.end(); return;}
    const data = await readFile(path);
    response.writeHead(200, {'Content-Type':types[extname(path)] || 'application/octet-stream','Content-Length':data.length});
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch {response.writeHead(404); response.end('Not found');}
}).listen(4173,'127.0.0.1',() => console.log('NIGHT V2 preview: http://localhost:4173'));
