import {useEffect,useRef} from 'react';
export function CollectionPhotoDialog({photo,onClose}){
  const viewer=useRef(null),callback=useRef(onClose);callback.current=onClose;
  const open=Boolean(photo);
  useEffect(()=>{
    if(!open)return;
    const element=viewer.current,opener=document.activeElement;
    if(typeof element.showModal==='function')element.showModal();else element.setAttribute('open','');
    const button=element.querySelector('button');button.focus();
    const keydown=event=>{if(event.key==='Escape'){event.preventDefault();callback.current();}if(event.key==='Tab'){event.preventDefault();button.focus();}};
    document.addEventListener('keydown',keydown);
    return ()=>{document.removeEventListener('keydown',keydown);if(element.open){if(typeof element.close==='function')element.close();else element.removeAttribute('open');}opener?.focus();};
  },[open]);
  return <dialog ref={viewer} className="nc-lightbox" id="photoDialog" aria-label="사진 크게 보기" onCancel={event=>{event.preventDefault();onClose();}} onClose={onClose} onClick={event=>{if(event.target!==event.currentTarget)return;const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}><div className="nc-lightbox-top"><p id="dialogCaption">{photo?.label??''}</p><button type="button" id="closePhoto" aria-label="사진 닫기" onClick={onClose}>닫기 ×</button></div><img id="dialogImage" src={photo?.full} alt={photo?.label??''}/></dialog>;
}
