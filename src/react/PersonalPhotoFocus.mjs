import {useEffect,useRef} from 'react';

export function managePhotoFocus(dialog,doc=document){
  const opener=doc.activeElement;
  const controls=()=>[...dialog.querySelectorAll('button')].filter(button=>!button.disabled);
  controls()[0]?.focus();
  const keydown=event=>{
    if(event.key!=='Tab')return;
    const buttons=controls(),first=buttons[0],last=buttons.at(-1);
    if(!first)return;
    if(!dialog.contains(doc.activeElement)){
      event.preventDefault();(event.shiftKey?last:first).focus();
    }else if(event.shiftKey&&doc.activeElement===first){
      event.preventDefault();last.focus();
    }else if(!event.shiftKey&&doc.activeElement===last){
      event.preventDefault();first.focus();
    }
  };
  doc.addEventListener('keydown',keydown);
  return()=>{doc.removeEventListener('keydown',keydown);if(opener?.isConnected)opener.focus();};
}

export function usePersonalPhotoFocus(open){
  const dialog=useRef(null);
  useEffect(()=>{if(open&&dialog.current)return managePhotoFocus(dialog.current);},[open]);
  return dialog;
}
