import {useEffect,useRef} from 'react';
export function AlbumLightbox({photo,index,total,label,onClose,onMove}) {
  const dialog=useRef(null);
  const callbacks=useRef({onClose,onMove});
  callbacks.current={onClose,onMove};
  const open=Boolean(photo);
  useEffect(()=>{
    if(!open)return;
    const previouslyFocused=document.activeElement;
    document.body.classList.add('archive26-lock');
    dialog.current.querySelector('.archive26-close').focus();
    const keydown=event=>{
      if(event.key==='Escape'){event.preventDefault();callbacks.current.onClose();}
      if(event.key==='ArrowLeft'){event.preventDefault();callbacks.current.onMove(-1);}
      if(event.key==='ArrowRight'){event.preventDefault();callbacks.current.onMove(1);}
      if(event.key==='Tab'){
        const controls=[...dialog.current.querySelectorAll('button')];
        const first=controls[0],last=controls.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
      }
    };
    document.addEventListener('keydown',keydown);
    return ()=>{document.body.classList.remove('archive26-lock');document.removeEventListener('keydown',keydown);previouslyFocused?.focus();};
  },[open]);
  return <div ref={dialog} id="archive26Lightbox" className={'archive26-lightbox'+(open?' is-open':'')} role="dialog" aria-modal="true" aria-label={label} aria-hidden={!open} onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
    <button className="archive26-close" type="button" aria-label="닫기" onClick={onClose}>×</button>
    <button className="archive26-nav archive26-prev" type="button" aria-label="이전 이미지" onClick={()=>onMove(-1)}>‹</button>
    <div className="archive26-stage"><img key={photo?.full??'empty'} className="archive26-image" src={photo?.full} alt={photo?.alt??''} onError={event=>{if(photo?.thumb&&!event.currentTarget.dataset.fallback){event.currentTarget.dataset.fallback='true';event.currentTarget.src=photo.thumb;}}}/><div><span className="archive26-title">{photo?.title??''}</span><span className="archive26-index">{open?`${index+1} / ${total}`:''}</span></div></div>
    <button className="archive26-nav archive26-next" type="button" aria-label="다음 이미지" onClick={()=>onMove(1)}>›</button>
  </div>;
}
