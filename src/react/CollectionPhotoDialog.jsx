import {useEffect,useRef,useState} from 'react';
import {imageProps} from './image-props.mjs';
export function CollectionPhotoDialog({photo,onClose,variant='collection',dimensions={}}){
  const viewer=useRef(null),callback=useRef(onClose);callback.current=onClose;
  const open=Boolean(photo);
  const editorial=variant==='editorial',physical=variant==='physical';
  const [originalSize,setOriginalSize]=useState(false);
  useEffect(()=>setOriginalSize(false),[photo?.full]);
  useEffect(()=>{
    if(!open)return;
    const element=viewer.current,opener=document.activeElement;
    if(editorial)document.body.classList.add('fv-lock');
    if(typeof element.showModal==='function')element.showModal();else element.setAttribute('open','');
    const button=element.querySelector('button');button.focus();
    const keydown=event=>{if(event.key==='Escape'){event.preventDefault();callback.current();}if(event.key==='Tab'){if(physical){const controls=[...element.querySelectorAll('button,[tabindex="0"]')],first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}else{event.preventDefault();button.focus();}}};
    document.addEventListener('keydown',keydown);
    return ()=>{document.removeEventListener('keydown',keydown);if(editorial)document.body.classList.remove('fv-lock');if(element.open){if(typeof element.close==='function')element.close();else element.removeAttribute('open');}opener?.focus();};
  },[open,editorial,physical]);
  if(physical)return <dialog ref={viewer} className="member-physical-dialog" id="memberPhysicalDialog" aria-label="공식 신체 프로필 이미지 확대 보기" onCancel={event=>{event.preventDefault();onClose();}} onClose={onClose} onClick={event=>{if(event.target!==event.currentTarget)return;const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}><div className="member-physical-dialog-top"><p>{photo?.label??''}</p><button type="button" aria-label="신체 프로필 이미지 닫기" onClick={onClose}>닫기 ×</button><button type="button" aria-pressed={originalSize} onClick={()=>setOriginalSize(value=>!value)}>{originalSize?'전체 보기':'원본 크기 보기'}</button></div><div className={'member-physical-image-view'+(originalSize?' is-original':'')} tabIndex={originalSize?0:-1} role="region" aria-label="원본 이미지 보기"><img src={photo?.full} alt={photo?.label??''} width={photo?.width} height={photo?.height} decoding="async" {...imageProps(dimensions,photo?.full)}/></div></dialog>;
  if(editorial)return <dialog ref={viewer} id="fv-viewer" aria-label="FIVE VOICES 이미지 확대 보기" onCancel={event=>{event.preventDefault();onClose();}} onClose={onClose} onClick={event=>{if(event.target===event.currentTarget)onClose();}}><div><button className="fv-close" type="button" aria-label="닫기" onClick={onClose}>×</button><img className="fv-full" src={photo?.full} alt={photo?.label??''} decoding="async" {...imageProps(dimensions,photo?.full)}/><p className="fv-caption">{photo?.label??''}</p></div></dialog>;
  return <dialog ref={viewer} className="nc-lightbox" id="photoDialog" aria-label="사진 크게 보기" onCancel={event=>{event.preventDefault();onClose();}} onClose={onClose} onClick={event=>{if(event.target!==event.currentTarget)return;const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}><div className="nc-lightbox-top"><p id="dialogCaption">{photo?.label??''}</p><button type="button" id="closePhoto" aria-label="사진 닫기" onClick={onClose}>닫기 ×</button></div><img id="dialogImage" src={photo?.full} alt={photo?.label??''} decoding="async" {...imageProps(dimensions,photo?.full)}/></dialog>;
}
