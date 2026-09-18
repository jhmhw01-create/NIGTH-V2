import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {reactRoutes} from '../src/react/routes.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const changed=[];
for(const route of reactRoutes){
  const path=join(root,'src/pages',route.replace('.html','.json'));
  const page=JSON.parse(await readFile(path,'utf8'));
  if(typeof page.afterFooterHtml==='string'&&page.afterFooterHtml.trim()){
    changed.push({route,before:page.afterFooterHtml.trim()});
    page.afterFooterHtml='';
    await writeFile(path,JSON.stringify(page,null,2)+'\n','utf8');
  }
}
console.log(`Cleared dead afterFooterHtml from ${changed.length} React routes.`);
for(const item of changed) console.log(`- ${item.route}: ${item.before.replace(/\s+/g,' ').slice(0,140)}`);
