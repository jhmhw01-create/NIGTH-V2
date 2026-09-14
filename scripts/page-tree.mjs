import {parseFragment} from 'parse5';
const names={class:'className',for:'htmlFor',tabindex:'tabIndex',readonly:'readOnly',colspan:'colSpan',rowspan:'rowSpan',srcset:'srcSet',crossorigin:'crossOrigin'};
const booleans=new Set(['hidden','open','disabled','checked','multiple','required','autofocus','selected']);
export function pageTree(markup) {
  const convert=node => {
    if (node.nodeName === '#text') return node.value;
    if (!node.tagName) return null;
    if (node.tagName === 'script' || node.tagName === 'style') throw Error('Executable content is not allowed in page trees');
    const props={};
    for (const {name,value} of node.attrs ?? []) {
      if (/^on/i.test(name)) throw Error('Inline events are not allowed');
      if (name==='style') throw Error('Inline styles require explicit React conversion');
      props[names[name] ?? name]=booleans.has(name) ? true : value;
    }
    return {tag:node.tagName,props,children:(node.childNodes ?? []).map(convert).filter(node=>node!==null)};
  };
  return parseFragment(markup).childNodes.map(convert).filter(node=>node!==null);
}
