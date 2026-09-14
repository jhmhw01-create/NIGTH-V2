import {useEffect,useRef} from 'react';
export function StageLightbox({variant,photo,index,total,label,onClose,onMove}) {
  const viewer=useRef(null);
  const callbacks=useRef({onClose,onMove});
  callbacks.current={onClose,onMove};
  const open=Boolean(photo);
  const native=variant==='sg';
  const prefix=variant+'-lightbox';
  useEffect(()=>{
    if(!open)return;
    const element=viewer.current;
    const previouslyFocused=document.activeElement;
    const lock=native?'sg-lock':prefix+'-open';
    document.body.classList.add(lock);
    if(native){if(typeof element.showModal==='function')element.showModal();else element.setAttribute('open','');}
    element.querySelector('button').focus();
    const keydown=event=>{
      if(event.key==='Escape'){event.preventDefault();callbacks.current.onClose();}
      if(event.key==='ArrowLeft'){event.preventDefault();callbacks.current.onMove(-1);}
      if(event.key==='ArrowRight'){event.preventDefault();callbacks.current.onMove(1);}
      if(event.key==='Tab'){
        const buttons=[...element.querySelectorAll('button')];
        if(event.shiftKey&&document.activeElement===buttons[0]){event.preventDefault();buttons.at(-1).focus();}
        else if(!event.shiftKey&&document.activeElement===buttons.at(-1)){event.preventDefault();buttons[0].focus();}
      }
    };
    document.addEventListener('keydown',keydown);
    return ()=>{
      document.removeEventListener('keydown',keydown);document.body.classList.remove(lock);
      if(native&&element.open){if(typeof element.close==='function')element.close();else element.removeAttribute('open');}
      previouslyFocused?.focus();
    };
  },[open,native,prefix]);
  const imageError=event=>{if(photo?.thumb&&!event.currentTarget.dataset.fallback){event.currentTarget.dataset.fallback='true';event.currentTarget.src=photo.thumb;}};
  const backdrop=event=>{if(event.target===event.currentTarget)onClose();};
  if(native)return <dialog ref={viewer} id="sg-viewer" aria-label={label} onCancel={event=>{event.preventDefault();onClose();}} onClose={onClose} onClick={backdrop}>
    <div className="sg-dialog"><button type="button" className="sg-close" aria-label="닫기" onClick={onClose}>×</button><img key={photo?.full??'empty'} className="sg-full" src={photo?.full} alt={photo?.alt??''} onError={imageError}/><div className="sg-caption"><span>{photo?.title??''}</span><small>{open?`${index+1} / ${total}`:''}</small></div><div className="sg-controls"><button type="button" className="sg-prev" aria-label="이전 이미지" onClick={()=>onMove(-1)}>← PREVIOUS</button><button type="button" className="sg-next" aria-label="다음 이미지" onClick={()=>onMove(1)}>NEXT →</button></div></div>
  </dialog>;
  return <div ref={viewer} id={variant+'Lightbox'} className={prefix+(open?' is-open':'')} role="dialog" aria-modal="true" aria-label={label} aria-hidden={!open} onClick={backdrop}>
    <button className={prefix+'-close'} type="button" aria-label="닫기" onClick={onClose}>×</button><button className={prefix+'-nav '+prefix+'-prev'} type="button" aria-label="이전 이미지" onClick={()=>onMove(-1)}>‹</button><div className={prefix+'-stage'}><img key={photo?.full??'empty'} className={prefix+'-image'} src={photo?.full} alt={photo?.alt??''} onError={imageError}/><div className={prefix+'-meta'}><span className={prefix+'-title'}>{photo?.title??''}</span><span className={prefix+'-index'}>{open?`${index+1} / ${total}`:''}</span></div></div><button className={prefix+'-nav '+prefix+'-next'} type="button" aria-label="다음 이미지" onClick={()=>onMove(1)}>›</button>
  </div>;
}
