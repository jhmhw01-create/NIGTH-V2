import {useEffect,useRef} from 'react';
export function GalleryLightbox({photo,index,total,onClose,onMove}) {
  const dialog=useRef(null);
  const callbacks=useRef({onClose,onMove});
  callbacks.current={onClose,onMove};
  const open=Boolean(photo);
  useEffect(()=>{
    if(!open)return;
    const previouslyFocused=document.activeElement;
    document.body.classList.add('lightbox-open');
    dialog.current.querySelector('.lightbox-close').focus();
    const keydown=event=>{
      if(event.key==='Escape'){event.preventDefault();callbacks.current.onClose();}
      if(event.key==='ArrowLeft'){event.preventDefault();callbacks.current.onMove(-1);}
      if(event.key==='ArrowRight'){event.preventDefault();callbacks.current.onMove(1);}
      if(event.key==='Tab') {
        const controls=[...dialog.current.querySelectorAll('button')];
        const first=controls[0],last=controls.at(-1);
        if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
      }
    };
    document.addEventListener('keydown',keydown);
    return ()=>{document.body.classList.remove('lightbox-open');document.removeEventListener('keydown',keydown);previouslyFocused?.focus();};
  },[open]);
  return <div ref={dialog} aria-hidden={!open} aria-label="갤러리 이미지 확대 보기" aria-modal="true" className={'gallery-lightbox'+(open?' is-open':'')} id="galleryLightbox" role="dialog" onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
    <button aria-label="닫기" className="lightbox-close" type="button" onClick={onClose}>×</button>
    <button aria-label="이전 이미지" className="lightbox-nav lightbox-prev" type="button" onClick={()=>onMove(-1)}>‹</button>
    <div className="lightbox-stage">
      <img key={photo?.full ?? 'empty'} alt={photo?.alt ?? ''} className="lightbox-image" src={photo?.full} onError={event=>{const image=event.currentTarget;if(photo?.thumb && !image.dataset.fallback){image.dataset.fallback='true';image.src=photo.thumb;}}} />
      <div className="lightbox-meta"><span className="lightbox-title">{photo?.title ?? ''}</span><span className="lightbox-index">{open?`${index+1} / ${total}`:''}</span></div>
    </div>
    <button aria-label="다음 이미지" className="lightbox-nav lightbox-next" type="button" onClick={()=>onMove(1)}>›</button>
  </div>;
}
