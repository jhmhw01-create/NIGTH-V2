import {usePersonalPhotoFocus} from './PersonalPhotoFocus.mjs';
import {useEffect,useMemo,useState} from 'react';
import {ihwanMusicalFilmography,ihwanMusicalImages} from '../data/ihwanMusical.mjs';

const numberLabel=number=>String(number).padStart(2,'0');

function Photo({work,entry,onOpen,priority=false}){
  const label=`${work.koreanTitle} ${entry.type}`;
  return <button className={`musical-entry${entry.interview?' musical-entry-interview':''}`} type="button" onClick={()=>onOpen(entry.number-1)} aria-label={`${label} 사진 크게 보기`}>
    <span className="musical-entry-image"><img src={entry.image} alt={`${work.koreanTitle} ${entry.type}`} loading={priority?'eager':'lazy'} decoding="async"/></span>
    <span className="musical-entry-copy"><small>{numberLabel(entry.number)}</small><strong>{entry.type}</strong>{entry.caption?<em>{entry.caption}</em>:null}</span>
  </button>;
}

function Interview({work,entry,onOpen,priority}){
  return <div className="musical-editorial">
    <Photo work={work} entry={entry} onOpen={onOpen} priority={priority}/>
    <article className="musical-interview" aria-label={`${work.koreanTitle} ${entry.type}`}><span>EDITORIAL · {entry.type}</span>{entry.interview.map((item,index)=><div key={item.question}><small>Q{index+1}</small><h4>{item.question}</h4><p><b>A.</b> {item.answer}</p></div>)}</article>
  </div>;
}

export function IhwanMusicalPage(){
  const [activePhoto,setActivePhoto]=useState(null);
  const photoDialog=usePersonalPhotoFocus(Boolean(activePhoto!==null));
  const years=useMemo(()=>[...new Set(ihwanMusicalFilmography.map(work=>work.year))],[]);
  useEffect(()=>{if(activePhoto===null)return;const onKey=event=>{if(event.key==='Escape')setActivePhoto(null);if(event.key==='ArrowLeft')setActivePhoto(index=>(index-1+ihwanMusicalImages.length)%ihwanMusicalImages.length);if(event.key==='ArrowRight')setActivePhoto(index=>(index+1)%ihwanMusicalImages.length);};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey);},[activePhoto]);
  return <main className="musical-archive">
    <section className="musical-hero"><div className="container"><p className="musical-member">IHWAN</p><p className="musical-kicker">PERSONAL SCHEDULE</p><h1>MUSICAL<br/>ARCHIVE</h1><div className="musical-hero-meta"><span>FILMOGRAPHY · CONTENT</span><span>2025 — 2030</span><span>8 WORKS · 34 PHOTOS</span></div></div></section>
    <nav className="musical-year-nav" aria-label="뮤지컬 필모그래피 연도"><div className="container">{years.map(year=><a href={`#year-${year}`} key={year}>{year}</a>)}</div></nav>
    <section className="musical-filmography" aria-labelledby="musical-filmography-title"><div className="container"><header className="musical-section-head"><div><span>IHWAN MUSICAL</span><h2 id="musical-filmography-title">FILMOGRAPHY</h2></div><small>YEAR → WORK → CONTENT</small></header></div>
      {years.map(year=><section className="musical-year" id={`year-${year}`} key={year}><div className="container"><div className="musical-year-head"><span>{year}</span><small>{ihwanMusicalFilmography.filter(work=>work.year===year).length} {ihwanMusicalFilmography.filter(work=>work.year===year).length===1?'WORK':'WORKS'}</small></div>
        {ihwanMusicalFilmography.filter(work=>work.year===year).map(work=><article className="musical-work" id={work.slug} key={work.slug}><header className="musical-work-head"><div><span>{work.year} · MUSICAL</span><h3>{work.title}</h3><p>《{work.koreanTitle}》</p></div>{work.role?<strong>{work.role}</strong>:null}</header>
          <div className="musical-content-label"><span>CONTENT</span><small>{work.entries.length} {work.entries.length===1?'ITEM':'ITEMS'}</small></div>
          <div className="musical-work-content">{work.entries.map(entry=>entry.interview?<Interview work={work} entry={entry} onOpen={setActivePhoto} priority={entry.number===1} key={entry.image}/>:<Photo work={work} entry={entry} onOpen={setActivePhoto} priority={entry.number===1} key={entry.image}/>)}</div>
        </article>)}</div></section>)}
    </section>
    {activePhoto!==null?<div ref={photoDialog} className="musical-lightbox" role="dialog" aria-modal="true" aria-label="IHWAN 뮤지컬 사진 크게 보기" onClick={event=>{if(event.target===event.currentTarget)setActivePhoto(null);}}><button className="musical-lightbox-close" type="button" onClick={()=>setActivePhoto(null)} aria-label="닫기">×</button><button className="musical-lightbox-prev" type="button" onClick={()=>setActivePhoto(index=>(index-1+ihwanMusicalImages.length)%ihwanMusicalImages.length)} aria-label="이전 사진">‹</button><figure><img src={ihwanMusicalImages[activePhoto]} alt={`IHWAN 뮤지컬 아카이브 ${numberLabel(activePhoto+1)}`}/><figcaption>{numberLabel(activePhoto+1)} / {ihwanMusicalImages.length}</figcaption></figure><button className="musical-lightbox-next" type="button" onClick={()=>setActivePhoto(index=>(index+1)%ihwanMusicalImages.length)} aria-label="다음 사진">›</button></div>:null}
  </main>;
}
