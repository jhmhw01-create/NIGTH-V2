import {useRef,useState} from 'react';
export function NativeAudio({children,ref:externalRef,onError,onLoadedMetadata,...props}){
  const player=useRef(null),[failed,setFailed]=useState(false);
  return <><audio {...props} ref={element=>{player.current=element;if(typeof externalRef==='function')externalRef(element);else if(externalRef)externalRef.current=element;}}
    onErrorCapture={event=>{setFailed(true);onError?.(event);}}
    onLoadedMetadata={event=>{setFailed(false);onLoadedMetadata?.(event);}}>{children}</audio>
    {failed&&<div className="media-error" role="status"><p>음원을 불러오지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해 주세요.</p><button type="button" onClick={()=>{setFailed(false);player.current?.load();}}>다시 불러오기</button></div>}
  </>;
}
