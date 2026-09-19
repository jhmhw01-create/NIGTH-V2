import {parseFragment} from 'parse5';
const walk=node=>[node,...(node.childNodes??[]).flatMap(walk)];
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
export function homeUpdates(notices){
  return notices.flatMap(item=>{
    const nodes=walk(parseFragment(item.bodyTemplateHtml));
    const time=nodes.find(node=>node.tagName==='time');if(!time)return [];
    const date=text(time).trim();const sortDate=date.match(/^\d{4}\.\d{2}\.\d{2}/)?.[0];if(!sortDate)return [];
    const href=`notice.html#${item.id}`;
    return [{id:item.id,title:item.title,date,href,sortDate}];
  }).sort((a,b)=>b.sortDate.localeCompare(a.sortDate)).slice(0,3).map(({sortDate,...item})=>item);
}
