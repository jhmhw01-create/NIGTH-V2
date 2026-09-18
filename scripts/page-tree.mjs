import {parseFragment} from 'parse5';
const names={class:'className',for:'htmlFor',tabindex:'tabIndex',readonly:'readOnly',colspan:'colSpan',rowspan:'rowSpan',srcset:'srcSet',crossorigin:'crossOrigin',datetime:'dateTime',autoplay:'autoPlay',autofocus:'autoFocus',fetchpriority:'fetchPriority',controlslist:'controlsList'};
const booleans=new Set(['hidden','open','disabled','checked','multiple','required','autofocus','selected','controls','loop','muted','autoplay']);
export function pageTree(markup,imageDimensions={}) {
  let imageCount=0;
  const convert=node => {
    if (node.nodeName === '#text') return node.value;
    if (!node.tagName) return null;
    if (node.tagName === 'script' || node.tagName === 'style') throw Error('Executable content is not allowed in page trees');
    const props={};
    for (const {name,value} of node.attrs ?? []) {
      if (/^on/i.test(name)) throw Error('Inline events are not allowed');
      if (name==='style') {
        props.style=Object.fromEntries(value.split(';').filter(s=>s.trim()).map(declaration=>{
          const colon=declaration.indexOf(':');
          if(colon<0)throw Error('Invalid authored CSS declaration');
          const property=declaration.slice(0,colon).trim();
          const reactProperty=property.startsWith('--')?property:property.replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());
          return [reactProperty,declaration.slice(colon+1).trim()];
        }));
        continue;
      }
      props[names[name] ?? name]=booleans.has(name) ? true : value;
    }
    if (node.tagName === 'img') {
      if (props.decoding === undefined) props.decoding='async';
      if (imageCount === 0 && props.loading !== 'lazy' && props.fetchPriority === undefined) props.fetchPriority='high';
      if (imageCount > 0 && props.loading === undefined && props.fetchPriority !== 'high') props.loading='lazy';
      const source=props.src?.split(/[?#]/,1)[0] ?? '';
      if (!/^(?:[a-z]+:|\/\/)/i.test(source)) {
        let key=source.replace(/^\.\//,'').replace(/^\/+/,'').replace(/^NIGTH-V2\//,'');
        try{key=decodeURIComponent(key);}catch{}
        const dimensions=imageDimensions[key];
        if (dimensions) {
          if (props.width === undefined) props.width=String(dimensions.width);
          if (props.height === undefined) props.height=String(dimensions.height);
        }
      }
      imageCount+=1;
    }
    return {tag:node.tagName,props,children:(node.childNodes ?? []).map(convert).filter(node=>node!==null)};
  };
  return parseFragment(markup).childNodes.map(convert).filter(node=>node!==null);
}
