import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {reactRoutes} from '../src/react/routes.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const changed=[];
for(const route of reactRoutes){
  const path=join(root,'src/pages',route.replace('.html','.json'));
  const page=JSON.parse(await readFile(path,'utf8'));
  if(typeof page.afterFooterHtml!=='string'||!page.afterFooterHtml.trim()) continue;
  const before=page.afterFooterHtml;
  const after=before.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').trim();
  if(after!==before.trim()){
    page.afterFooterHtml=after ? `\n${after}\n` : '';
    changed.push({route,keptMarkup:Boolean(after)});
    await writeFile(path,JSON.stringify(page,null,2)+'\n','utf8');
  }
}
console.log(`Removed dead footer scripts from ${changed.length} React routes.`);
for(const item of changed) console.log(`- ${item.route}${item.keptMarkup?' (authored footer markup preserved)':''}`);
