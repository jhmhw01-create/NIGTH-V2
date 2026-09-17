import {useEffect,useRef} from 'react';
import {imageProps} from './image-props.mjs';
export function CollectionPhotoDialog({photo,onClose,variant='collection',dimensions={}}){
  const viewer=useRef(null),callback=useRef(onClose);callback.current=onClose;
  const open=Boolean(photo);
  const editorial=variant==='editorial';
  useEffect(()=>{
    if(!open)return;
    const element=viewer.current,opener=document.activeElement;
    if(editorial)document.body.classList.add('fv-lock');
    if(typeof element.showModal==='function')element.showModal();else element.setAttribute('open','');
    const button=element.querySelector('button');button.focus();
    const keydown=event=>{if(event.key==='Escape'){event.preventDefault();callback.current();}if(event.key==='Tab'){event.preventDefault();button.focus();}};
    document.addEventListener('keydown',keydown);
    return ()=>{document.removeEventListener('keydown',keydown);if(editorial)document.body.classList.remove('fv-lock');if(element.open){if(typeof element.close==='function')element.close();else element.removeAttribute('open');}opener?.focus();};
  },[open,editorial]);
  if(editorial)return <dialog ref={viewer} id="fv-viewer" aria-label="FIVE VOICES 이미지 확대 보기" onCancel={event=>{event.preventDefault();onClose();}} onClose={onClose} onClick={event=>{if(event.target===event.currentTarget)onClose();}}><div><button className="fv-close" type="button" aria-label="닫기" onClick={onClose}>×</button><img className="fv-full" src={photo?.full} alt={photo?.label??''} decoding="async" {...imageProps(dimensions,photo?.full)}/><p className="fv-caption">{photo?.label??''}</p></div></dialog>;
  return <dialog ref={viewer} className="nc-lightbox" id="photoDialog" aria-label="사진 크게 보기" onCancel={event=>{event.preventDefault();onClose();}} onClose={onClose} onClick={event=>{if(event.target!==event.currentTarget)return;const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}><div className="nc-lightbox-top"><p id="dialogCaption">{photo?.label??''}</p><button type="button" id="closePhoto" aria-label="사진 닫기" onClick={onClose}>닫기 ×</button></div><img id="dialogImage" src={photo?.full} alt={photo?.label??''} decoding="async" {...imageProps(dimensions,photo?.full)}/></dialog>;
}
