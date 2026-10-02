import {usePersonalPhotoFocus} from './PersonalPhotoFocus.mjs';
import {useEffect,useState} from 'react';
import {jiwooFilmography,jiwooDramaOsts} from '../data/jiwooFilmography.mjs';
import {imageProps} from './image-props.mjs';

const workFromHash=()=>{
  const slug=window.location.hash.replace(/^#work-/,'');
  return jiwooFilmography.find(work=>work.slug===slug)||null;
};

export function JiwooActingPage({dimensions}){
  const [selected,setSelected]=useState(null);
  const [activePhoto,setActivePhoto]=useState(null);
  const photoDialog=usePersonalPhotoFocus(Boolean(selected&&activePhoto!==null));

  useEffect(()=>{
    const sync=()=>setSelected(workFromHash());
    sync();
    window.addEventListener('hashchange',sync);
    return()=>window.removeEventListener('hashchange',sync);
  },[]);

  useEffect(()=>{
    if(activePhoto===null)return;
    const onKey=event=>{
      if(event.key==='Escape')setActivePhoto(null);
      if(event.key==='ArrowLeft')setActivePhoto(index=>(index-1+selected.images.length)%selected.images.length);
      if(event.key==='ArrowRight')setActivePhoto(index=>(index+1)%selected.images.length);
    };
    document.addEventListener('keydown',onKey);
    return()=>document.removeEventListener('keydown',onKey);
  },[activePhoto,selected]);

  const choose=work=>{
    setSelected(work);
    setActivePhoto(null);
    window.history.replaceState(null,'',`#work-${work.slug}`);
    window.requestAnimationFrame(()=>document.getElementById('work-detail')?.scrollIntoView({behavior:'smooth',block:'start'}));
  };
  const back=()=>{
    setSelected(null);
    setActivePhoto(null);
    window.history.replaceState(null,'','#filmography');
    window.requestAnimationFrame(()=>document.getElementById('filmography')?.scrollIntoView({behavior:'smooth',block:'start'}));
  };

  return <main className="acting-archive">
    <section className="acting-hero"><div className="container">
      <p className="acting-member">JIWOO</p><p className="acting-kicker">PERSONAL SCHEDULE</p>
      <h1>ACTING ARCHIVE</h1><div className="acting-hero-meta"><span>DRAMA · FILM</span><span>2026 — 2031</span></div>
    </div></section>
    <section className="acting-filmography" id="filmography"><div className="container">
      <header className="acting-section-head"><div><span>JIWOO FILMOGRAPHY</span><h2>FILMOGRAPHY</h2></div><small>7 WORKS · 70 PHOTOS</small></header>
      <div className="acting-grid">{jiwooFilmography.map(work=><a className="acting-card" id={`work-${work.slug}`} href={`#work-${work.slug}`} key={work.slug} onClick={event=>{event.preventDefault();choose(work);}}>
        <img src={work.images[0]} alt={`${work.title} ${work.role}`} loading="lazy" decoding="async" {...imageProps(dimensions,work.images[0])}/>
        <div className="acting-card-copy"><span>{work.year} · {work.type}</span><h3>{work.title}</h3><p><strong>{work.role}</strong><em>{work.roleType}</em></p><small>{work.period}</small><b>VIEW PHOTO ARCHIVE →</b></div>
      </a>)}</div>
    </div></section>
    {selected?<section className="acting-work" id="work-detail"><div className="container">
      <button className="acting-back" type="button" onClick={back}>← BACK TO FILMOGRAPHY</button>
      <header className="acting-work-head"><div><span>{selected.year} · {selected.type}</span><h2>{selected.title}</h2></div><div><strong>{selected.role}</strong><p>{selected.roleType}</p><small>{selected.period}</small></div></header>
      {jiwooDramaOsts[selected.slug]?<section className="acting-ost" aria-labelledby={`ost-${selected.slug}`}><img src={jiwooDramaOsts[selected.slug].image} alt={`${selected.title} OST ${jiwooDramaOsts[selected.slug].title} 커버`} loading="lazy" decoding="async" {...imageProps(dimensions,jiwooDramaOsts[selected.slug].image)}/><div><span>ORIGINAL SOUNDTRACK</span><h3 id={`ost-${selected.slug}`}>{jiwooDramaOsts[selected.slug].title}</h3><p>{selected.title} OST</p><strong>{jiwooDramaOsts[selected.slug].credit}</strong></div></section>:null}
      <div className="acting-photo-head"><h3>PHOTO ARCHIVE</h3><span>{selected.images.length} PHOTOS</span></div>
      <div className="acting-gallery">{selected.images.map((src,index)=><button className="acting-photo" type="button" key={src} onClick={()=>setActivePhoto(index)} aria-label={`${selected.title} 사진 ${String(index+1).padStart(2,'0')} 크게 보기`}><img src={src} alt={`${selected.title} ${selected.role} 사진 ${String(index+1).padStart(2,'0')}`} loading="lazy" decoding="async" {...imageProps(dimensions,src)}/><span>{String(index+1).padStart(2,'0')}</span></button>)}</div>
    </div></section>:null}
    {selected&&activePhoto!==null?<div ref={photoDialog} className="acting-lightbox" role="dialog" aria-modal="true" aria-label={`${selected.title} 사진 크게 보기`} onClick={event=>{if(event.target===event.currentTarget)setActivePhoto(null);}}><button className="acting-lightbox-close" type="button" onClick={()=>setActivePhoto(null)} aria-label="닫기">×</button><button className="acting-lightbox-prev" type="button" onClick={()=>setActivePhoto(index=>(index-1+selected.images.length)%selected.images.length)} aria-label="이전 사진">‹</button><figure><img src={selected.images[activePhoto]} alt={`${selected.title} ${selected.role} 사진 ${String(activePhoto+1).padStart(2,'0')}`}/><figcaption>{selected.title} · {String(activePhoto+1).padStart(2,'0')} / {selected.images.length}</figcaption></figure><button className="acting-lightbox-next" type="button" onClick={()=>setActivePhoto(index=>(index+1)%selected.images.length)} aria-label="다음 사진">›</button></div>:null}
  </main>;
}
