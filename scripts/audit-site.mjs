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

const attributes=node=>Object.fromEntries((node.attrs??[]).map(attribute=>[attribute.name,attribute.value]));
const hasClass=(node,className)=>(attributes(node).class??'').split(/\s+/).includes(className);
const elementChildren=node=>(node?.childNodes??[]).filter(child=>child.tagName);
const findElement=(node,predicate)=>{
  if(predicate(node))return node;
  for(const child of node.childNodes??[]){const match=findElement(child,predicate);if(match)return match;}
  return null;
};

export function jiwooActingPlacement(html){
  const document=parse(html);
  const main=findElement(document,node=>node.tagName==='main');
  const sections=elementChildren(main).filter(node=>node.tagName==='section');
  const keywordIndex=sections.findIndex(node=>hasClass(node,'member-highlights-section'));
  const actingIndex=sections.findIndex(node=>attributes(node)['aria-labelledby']==='jiwoo-personal-schedule');
  const switchIndex=sections.findIndex(node=>hasClass(node,'member-switch-section'));
  const acting=sections[actingIndex];
  const link=findElement(acting??{},node=>node.tagName==='a'&&attributes(node).href==='jiwoo-acting.html');
  return {keywordIndex,actingIndex,switchIndex,linked:Boolean(link),valid:keywordIndex>=0&&actingIndex===keywordIndex+1&&switchIndex===actingIndex+1&&Boolean(link)};
}

export async function auditSite(directory) {
  const root=resolve(directory),pages=(await readdir(root)).filter(name=>name.endsWith('.html'));
  const documents=new Map();
  for(const page of pages){
    const html=await readFile(resolve(root,page),'utf8');
    documents.set(page,documentReferences(html));
    if(page==='member-jiwoo.html'&&!jiwooActingPlacement(html).valid)throw Error('Site audit failed:\nmember-jiwoo.html: ACTING archive must appear directly after KEYWORDS and link to jiwoo-acting.html');
  }
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
