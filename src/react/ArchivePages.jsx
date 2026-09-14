import {createElement,useEffect,useRef,useState} from 'react';
import {medleyClassName} from './medley.mjs';
import {NativeAudio} from './NativeAudio.jsx';
import {matchesContents,matchesNotice,matchesPhoto,nextPhotoIndex} from './filters.mjs';
import {GalleryLightbox} from './GalleryLightbox.jsx';
import {AlbumLightbox} from './AlbumLightbox.jsx';
import {albumRoutes,stageRoutes,fanclubDetailRoutes,storyRoutes,eventRoutes,visualRoutes} from './routes.mjs';
import {StageLightbox} from './StageLightbox.jsx';
import {CollectionPhotoDialog} from './CollectionPhotoDialog.jsx';
const classes=node => new Set((node.props?.className ?? '').split(/\s+/));
function descendants(node,predicate) {
  if (typeof node==='string') return [];
  return [...(predicate(node)?[node]:[]),...node.children.flatMap(child=>descendants(child,predicate))];
}
function nodeText(node) {return typeof node==='string' ? node : node.children.map(nodeText).join('');}

export function ArchivePage({route,nodes}) {
  const [category,setCategory]=useState('all');
  const [year,setYear]=useState('all');
  const [ready,setReady]=useState(false);
  const [collectionFilter,setCollectionFilter]=useState('all');
  const [photoFilter,setPhotoFilter]=useState('all');
  const [activePhoto,setActivePhoto]=useState(null);
  const [playingTrack,setPlayingTrack]=useState(null);
  const medleyPlayers=useRef(new Map());
  const medley=route==='highlight-medley.html';
  const contents=route==='contents.html';
  const notice=route==='notice.html';
  const gallery=route==='gallery.html';
  const editorial=route==='five-voices.html';
  const portrait=editorial?nodes.flatMap(n=>descendants(n,n=>classes(n).has('fv-photo'))).find(n=>n.props['data-full']===activePhoto):null;
  const portraitPhoto=portrait?{full:portrait.props['data-full'],label:portrait.props['data-caption']}:null;
  const imageArchive=stageRoutes.includes(route)||fanclubDetailRoutes.includes(route)||storyRoutes.includes(route)||eventRoutes.includes(route)||visualRoutes.includes(route);
  const album=albumRoutes.includes(route)||stageRoutes.includes(route)||storyRoutes.includes(route)||eventRoutes.includes(route);
  const albumItems=album?nodes.flatMap(n=>descendants(n,n=>classes(n).has('archive26-photo')&&n.props['data-full'])):[];
  const albumIndex=albumItems.findIndex(n=>n.props['data-full']===activePhoto);
  const albumItem=albumItems[albumIndex];
  const albumImage=albumItem?descendants(albumItem,n=>n.tag==='img')[0]:null;
  const albumPhoto=albumItem?{full:albumItem.props['data-full'],thumb:albumImage?.props.src,alt:albumImage?.props.alt??'',title:albumItem.props['data-title']??''}:null;
  const moveAlbum=step=>{const next=nextPhotoIndex(albumIndex,step,albumItems.length);if(next>=0)setActivePhoto(albumItems[next].props['data-full']);};
  const isStoryPhoto=node=>['fm-photo','sg-photo','behind-photo','travel-photo','fansign-photo'].some(cls=>classes(node).has(cls));
  const stageItems=imageArchive?nodes.flatMap(n=>descendants(n,n=>isStoryPhoto(n)&&n.props['data-full'])):[];
  const stageIndex=stageItems.findIndex(n=>n.props['data-full']===activePhoto);
  const stageItem=stageItems[stageIndex];
  const stageImage=stageItem?descendants(stageItem,n=>n.tag==='img')[0]:null;
  const stageTitle=stageItem?.props['data-caption']??stageItem?.props['data-title']??'';
  const stagePhoto=stageItem?{full:stageItem.props['data-full'],thumb:stageImage?.props.src,alt:classes(stageItem).has('fansign-photo')?(stageImage?.props.alt??''):stageTitle,title:stageTitle}:null;
  const moveStage=step=>{const next=nextPhotoIndex(stageIndex,step,stageItems.length);if(next>=0)setActivePhoto(stageItems[next].props['data-full']);};
  const galleryItems=gallery ? nodes.flatMap(n=>descendants(n,n=>classes(n).has('gallery-item'))) : [];
  const filteredItems=galleryItems.filter(n=>matchesPhoto(n.props['data-category'] ?? '',photoFilter));
  const lightboxItems=filteredItems.filter(n=>n.props['data-full']);
  const photoIndex=lightboxItems.findIndex(n=>n.props['data-full']===activePhoto);
  const activeItem=lightboxItems[photoIndex];
  const photo=activeItem ? {full:activeItem.props['data-full'],thumb:descendants(activeItem,n=>n.tag==='img')[0]?.props.src,alt:activeItem.props['aria-label'],title:activeItem.props['data-title']} : null;
  const movePhoto=step=>{const next=nextPhotoIndex(photoIndex,step,lightboxItems.length);if(next>=0)setActivePhoto(lightboxItems[next].props['data-full']);};
  const collectionGroups=gallery ? nodes.flatMap(n=>descendants(n,n=>n.props['data-collection-group'])) : [];
  const collectionCount=collectionGroups.filter(n=>collectionFilter==='all'||n.props['data-collection-group']===collectionFilter).reduce((sum,n)=>sum+descendants(n,item=>classes(item).has('gallery-archive-entry')).length,0);
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
  },[category,year,collectionFilter,photoFilter]);
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
    if(editorial&&node.props.id==='fv-viewer')return <CollectionPhotoDialog key={key} variant="editorial" photo={portraitPhoto} onClose={()=>setActivePhoto(null)}/>;
    if(gallery && node.props.id==='galleryLightbox')return <GalleryLightbox key={key} photo={photo} index={photoIndex} total={lightboxItems.length} onClose={()=>setActivePhoto(null)} onMove={movePhoto} />;
    if(album && node.props.id==='archive26Lightbox')return <AlbumLightbox key={key} photo={albumPhoto} index={albumIndex} total={albumItems.length} label={node.props['aria-label']} onClose={()=>setActivePhoto(null)} onMove={moveAlbum} />;
    if(imageArchive&&['fmLightbox','behindLightbox','travelLightbox','fansignLightbox','sg-viewer'].includes(node.props.id))return <StageLightbox key={key} variant={node.props.id==='sg-viewer'?'sg':node.props.id.replace('Lightbox','')} photo={stagePhoto} index={stageIndex} total={stageItems.length} label={node.props['aria-label']} onClose={()=>setActivePhoto(null)} onMove={moveStage}/>;
    const props={...node.props,key};
    const cls=classes(node);
    let children=node.children.map((child,i)=>render(child,i));
    if(node.tag==='option')delete props.selected;
    if(medley&&node.tag==='audio'){
      const source=descendants(node,n=>n.tag==='source')[0].props.src;
      props.ref=element=>{if(element)medleyPlayers.current.set(source,element);else medleyPlayers.current.delete(source);};
      props.onPlay=event=>{medleyPlayers.current.forEach(other=>{if(other!==event.currentTarget&&!other.paused)other.pause();});setPlayingTrack(source);};
      props.onPause=event=>{if(event.currentTarget.currentTime!==event.currentTarget.duration)setPlayingTrack(current=>current===source?null:current);};
      props.onEnded=()=>setPlayingTrack(current=>current===source?null:current);
    }
    if(medley&&(cls.has('medley-master')||cls.has('medley-track'))){const source=descendants(node,n=>n.tag==='source')[0].props.src;props.className=medleyClassName(props.className,playingTrack===source);}
    if(editorial&&cls.has('fv-photo')){props.type='button';props.onClick=()=>setActivePhoto(props['data-full']);}
    if(album && cls.has('archive26-photo') && props['data-full']){props.type='button';props.onClick=()=>setActivePhoto(props['data-full']);}
    if(imageArchive&&isStoryPhoto(node)&&props['data-full']){props.type='button';props.onClick=()=>setActivePhoto(props['data-full']);}
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
    if(gallery) {
      if(props['data-collection-filter']!==undefined){props.disabled=!ready;props['aria-pressed']=props['data-collection-filter']===collectionFilter;props.onClick=()=>setCollectionFilter(props['data-collection-filter']);}
      if(props['data-collection-group'])props.hidden=collectionFilter!=='all'&&props['data-collection-group']!==collectionFilter;
      if(cls.has('gallery-collection-status'))children=`${collectionFilter==='all'?'전체':nodeText(descendants(collectionGroups.find(n=>n.props['data-collection-group']===collectionFilter),n=>n.tag==='h2')[0])} · ${collectionCount}개 아카이브`;
      if(cls.has('gallery-filter')){props.disabled=!ready;props['aria-pressed']=props['data-filter']===photoFilter;props.className='gallery-filter'+(props['data-filter']===photoFilter?' is-active':'');props.onClick=()=>{setActivePhoto(null);setPhotoFilter(props['data-filter']);};}
      if(cls.has('gallery-item')){props.hidden=!matchesPhoto(props['data-category'] ?? '',photoFilter);if(props['data-full'])props.onClick=()=>setActivePhoto(props['data-full']);}
      if(cls.has('gallery-count'))children=`${filteredItems.length} PHOTOS`;
    }
    return createElement(node.tag==='audio'?NativeAudio:node.tag,props,...(Array.isArray(children)?children:[children]));
  }
  return <>{nodes.map((node,i)=>render(node,i))}</>;
}
