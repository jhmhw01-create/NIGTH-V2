import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {parse} from 'parse5';

export function documentReferences(html) {
  const ids=new Set(),duplicates=[],references=[];
  function walk(node) {
    const attrs=Object.fromEntries((node.attrs??[]).map(a=>[a.name,a.value]));
    if(attrs.id){if(ids.has(attrs.id))duplicates.push(attrs.id);ids.add(attrs.id);}
    for(const name of ['href','src','poster','data-full'])if(attrs[name])references.push(attrs[name]);
    for(const child of node.childNodes??[])walk(child);
  }
  walk(parse(html));return {ids,duplicates,references};
}

export async function auditSite(directory) {
  const root=resolve(directory),pages=(await readdir(root)).filter(name=>name.endsWith('.html'));
  const documents=new Map();
  for(const page of pages)documents.set(page,documentReferences(await readFile(resolve(root,page),'utf8')));
  const failures=[],checked=new Set();let links=0;
  for(const [page,document] of documents){
    for(const id of document.duplicates)failures.push(`${page}: duplicate id ${id}`);
    for(const value of document.references){
      if(/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value))continue;
      const url=new URL(value,'https://night.invalid/NIGTH-V2/'+page);
      if(!url.pathname.startsWith('/NIGTH-V2/')){failures.push(`${page}: outside project base ${value}`);continue;}
      let path,fragment;try{path=decodeURIComponent(url.pathname.slice('/NIGTH-V2/'.length))||'index.html';fragment=decodeURIComponent(url.hash.slice(1));}catch{failures.push(`${page}: malformed URL ${value}`);continue;}
      links++;
      if(!checked.has(path)){
        checked.add(path);
        try{if(!(await stat(resolve(root,path))).isFile())throw Error();}catch{failures.push(`${page}: missing file ${value}`);}
      }
      if(fragment&&documents.has(path)&&!documents.get(path).ids.has(fragment))failures.push(`${page}: missing anchor ${value}`);
    }
  }
  if(failures.length)throw Error('Site audit failed:\n'+failures.join('\n'));
  return {pages:pages.length,links,files:checked.size};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const result=await auditSite(process.argv[2]??new URL('../dist/',import.meta.url).pathname);
  console.log(`Site audit passed: ${result.pages} pages, ${result.links} local references, ${result.files} unique targets. External URLs and browser rendering are not checked.`);
}
