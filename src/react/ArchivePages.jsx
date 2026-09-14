import {createElement,useEffect,useState} from 'react';
import trees from '../../.react-build/page-trees.json';
import {matchesContents,matchesNotice} from './filters.mjs';
const classes=node => new Set((node.props?.className ?? '').split(/\s+/));
function descendants(node,predicate) {
  if (typeof node==='string') return [];
  return [...(predicate(node)?[node]:[]),...node.children.flatMap(child=>descendants(child,predicate))];
}
function nodeText(node) {return typeof node==='string' ? node : node.children.map(nodeText).join('');}

export function ArchivePage({route}) {
  const nodes=trees[route];
  const [category,setCategory]=useState('all');
  const [year,setYear]=useState('all');
  const [ready,setReady]=useState(false);
  const contents=route==='contents.html';
  const notice=route==='notice.html';
  const contentCards=contents ? nodes.flatMap(n=>descendants(n,n=>classes(n).has('content-card'))) : [];
  const notices=notice ? nodes.flatMap(n=>descendants(n,n=>classes(n).has('notice-item'))) : [];
  const noticeRecord=node => ({category:node.props['data-notice-category'],year:nodeText(descendants(node,n=>n.tag==='time')[0]).slice(0,4)});
  const visibleNotice=node => matchesNotice(noticeRecord(node),category,year);
  const count=contents ? contentCards.filter(n=>matchesContents({category:n.props['data-category']},category)).length : notices.filter(visibleNotice).length;
  const filterKey=contents ? 'data-content-filter' : 'data-notice-filter';
  const buttons=nodes.flatMap(n=>descendants(n,n=>n.props[filterKey]!==undefined));
  const selected=buttons.find(n=>n.props[filterKey]===category);
  const label=selected ? nodeText(selected).replace(/\d+\s*$/,'').trim() : '전체';
  useEffect(()=>setReady(true),[]);
  useEffect(()=>{
    const elements=document.querySelectorAll('#night-react-root .reveal');
    if (!('IntersectionObserver' in window)) {elements.forEach(el=>el.classList.add('is-visible'));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:0.12});
    elements.forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[category,year]);
  useEffect(()=>{
    const reveal=()=>{
      let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
      const target=document.getElementById(id);
      if(!target)return;
      if(contents && target.matches('.content-card'))setCategory('all');
      requestAnimationFrame(()=>target.scrollIntoView({block:'center'}));
    };
    reveal();window.addEventListener('hashchange',reveal);
    return ()=>window.removeEventListener('hashchange',reveal);
  },[contents]);
  function render(node,key) {
    if(typeof node==='string')return node;
    const props={...node.props,key};
    const cls=classes(node);
    let children=node.children.map((child,i)=>render(child,i));
    if(node.tag==='option')delete props.selected;
    if(props[filterKey]!==undefined) {
      props['aria-pressed']=props[filterKey]===category;
      props.disabled=!ready;
      props.onClick=()=>setCategory(props[filterKey]);
    }
    if(contents) {
      if(cls.has('contents-filter-panel'))props.hidden=!ready;
      if(cls.has('content-card'))props.hidden=!matchesContents({category:props['data-category']},category);
      if(cls.has('contents-grid'))props.className='contents-grid'+(category==='all'?'':' is-filtered');
      if(cls.has('contents-filter-status'))children=`${label} · ${count}개 기록`;
    }
    if(notice) {
      if(props.id==='notice-year-filter') {props.value=year;props.disabled=!ready;props.onChange=event=>setYear(event.target.value);}
      if(cls.has('notice-item'))props.hidden=!visibleNotice(node);
      if(cls.has('notice-year-group'))props.hidden=!descendants(node,n=>classes(n).has('notice-item')).some(visibleNotice);
      if(cls.has('notice-results'))children=`${label} · ${year==='all'?'전체 연도':year} · 공지 ${count}건`;
      if(cls.has('notice-empty'))props.hidden=count!==0;
    }
    return createElement(node.tag,props,...(Array.isArray(children)?children:[children]));
  }
  return <>{nodes.map((node,i)=>render(node,i))}</>;
}
