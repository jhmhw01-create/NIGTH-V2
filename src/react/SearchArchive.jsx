import {useEffect,useMemo,useRef,useState} from 'react';
import {archiveState,searchRecords} from './search.mjs';

export function SearchArchive({catalog}) {
  const [state,setState]=useState({query:'',category:'all',sort:'category'});
  const [limit,setLimit]=useState(18);
  const [ready,setReady]=useState(false);
  const grid=useRef(null);
  const focusIndex=useRef(null);
  useEffect(()=>{
    const restore=()=>{setState(archiveState(window.location.search,catalog.labels));setLimit(18);};
    restore();setReady(true);
    window.addEventListener('popstate',restore);
    return ()=>window.removeEventListener('popstate',restore);
  },[]);
  useEffect(()=>{
    if(!ready)return;
    const params=new URLSearchParams();
    if(state.category!=='all')params.set('category',state.category);
    if(state.query.trim())params.set('q',state.query.trim());
    if(state.sort==='title')params.set('sort','title');
    window.history.replaceState(null,'',window.location.pathname+(params.size?'?'+params.toString():'')+window.location.hash);
  },[state,ready]);
  useEffect(()=>{
    if(focusIndex.current!==null){grid.current?.children[focusIndex.current]?.focus();focusIndex.current=null;}
  },[limit]);
  const results=useMemo(()=>searchRecords(catalog,state),[state]);
  const visible=results.slice(0,limit);
  const change=patch=>{focusIndex.current=null;setState(previous=>({...previous,...patch}));setLimit(18);};
  return <main>
    <section className="section archive-intro"><div className="container">
      <span className="section-kicker">The Complete NIGHT Archive</span>
      <h1 className="section-title">Find your NIGHT.</h1>
      <p className="search-scope">앨범·공연·멤버·콘텐츠 등 {catalog.records.length}개 아카이브 항목을 검색합니다. 개별 사진 검색은 제공하지 않습니다.</p>
      <p className="section-desc">앨범과 무대, 다섯 멤버의 이야기와 LUNA의 기록. 찾고 싶은 밤을 선택하세요.</p>
      <div className="archive-shortcuts"><a href="discography.html">DISCOGRAPHY ↗</a><a href="listen.html">LISTEN ↗</a><a href="fanclub.html">LUNA ↗</a><a href="notice.html">NOTICE ↗</a></div>
    </div></section>
    <section className="section-tight"><div className="container">
      <form id="archive-search-form" role="search" onSubmit={event=>event.preventDefault()} onReset={event=>{event.preventDefault();change({query:'',category:'all',sort:'category'});}}>
        <label htmlFor="archive-query">전체 아카이브 검색</label>
        <div className="archive-search-row"><input id="archive-query" type="search" placeholder="앨범, 멤버 이름 또는 콘텐츠" autoComplete="off" value={state.query} disabled={!ready} onChange={event=>change({query:event.target.value})}/><button type="reset" disabled={!ready}>초기화</button></div>
      </form>
      <div className="search-suggestions" role="group" aria-label="바로 검색"><span>바로 검색</span>{['LUNA','BEHIND','DOHA','WOOHYUN','JIWOO','IHWAN','TAEHOON'].map(query=><button key={query} type="button" disabled={!ready} onClick={()=>change({query,category:'all'})}>{query}</button>)}</div>
      {(state.query.trim()||state.category!=='all')&&<div className="search-conditions" aria-label="선택한 검색 조건"><span>검색어: {state.query.trim()||'없음'}</span><span>분류: {state.category==='all'?'전체':catalog.labels[state.category]}</span><button type="button" onClick={()=>change({query:'',category:'all',sort:'category'})}>조건 모두 해제</button></div>}
      <div id="archive-filters" role="group" aria-label="아카이브 분류">{['all',...Object.keys(catalog.labels)].map(category=><button key={category} type="button" data-category={category} aria-pressed={state.category===category} disabled={!ready} onClick={()=>change({category})}>{category==='all'?'전체':catalog.labels[category]} · {catalog.records.filter(record=>category==='all'||record.category===category).length}</button>)}</div>
      <div className="archive-results-head"><p id="archive-status" role="status" aria-live="polite">{state.category==='all'?'전체':catalog.labels[state.category]} · {results.length}개 기록 · {visible.length}개 표시</p><label>정렬<select id="archive-sort" value={state.sort} disabled={!ready} onChange={event=>change({sort:event.target.value})}><option value="category">분류순</option><option value="title">이름순</option></select></label></div>
      <div id="archive-grid" ref={grid}>{visible.map(record=><a key={record.id} className="archive-result-card" href={record.href}><div className="archive-result-image">{record.image?<img src={record.image} alt={record.title} loading="lazy" decoding="async"/>:<span className="archive-result-placeholder">NIGHT</span>}</div><div className="archive-result-copy"><small>{catalog.labels[record.category]}</small><h2>{record.title}</h2><p>{record.summary}</p><span>OPEN ARCHIVE →</span></div></a>)}</div>
      <button id="archive-more" type="button" hidden={visible.length===results.length} disabled={!ready} onClick={()=>{focusIndex.current=visible.length;setLimit(previous=>previous+18);}}>더 보기 · 남은 {results.length-visible.length}개</button>
      <p id="archive-empty" hidden={results.length!==0}>검색 결과가 없습니다. 다른 검색어나 분류를 선택해 주세요.</p>
      {results.length===0&&<div className="search-empty-actions">{state.category!=='all'&&<button type="button" onClick={()=>change({category:'all'})}>전체 분류에서 검색</button>}<button type="button" onClick={()=>change({query:'',category:'all',sort:'category'})}>전체 기록 보기</button></div>}
    </div></section>
  </main>;
}
