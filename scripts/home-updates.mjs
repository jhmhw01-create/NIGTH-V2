import {parseFragment} from 'parse5';
const walk=node=>[node,...(node.childNodes??[]).flatMap(walk)];
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
export function homeUpdates(notices){
  return notices.filter(item=>!item.attributesHtml.includes('data-notice-category="music"')).flatMap(item=>{
    const nodes=walk(parseFragment(item.bodyTemplateHtml));
    const time=nodes.find(node=>node.tagName==='time');if(!time)return [];
    const date=text(time).trim();const sortDate=date.match(/^\d{4}\.\d{2}\.\d{2}/)?.[0];if(!sortDate)return [];
    const href=nodes.find(node=>node.tagName==='a'&&node.attrs?.some(attr=>attr.name==='href'))?.attrs.find(attr=>attr.name==='href').value??'notice.html';
    return [{id:item.id,title:item.title,date,href,sortDate}];
  }).sort((a,b)=>b.sortDate.localeCompare(a.sortDate)).slice(0,3).map(({sortDate,...item})=>item);
}
