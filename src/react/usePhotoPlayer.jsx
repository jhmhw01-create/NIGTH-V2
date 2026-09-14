import {useEffect,useRef,useState} from 'react';
import {clampTime,sceneAt,secondsPerScene} from './photo-data.mjs';
const failedMessage='이미지를 불러오지 못했어요. 재생을 눌러 다시 시도하거나 다음 장면으로 이동해 주세요.';
export function usePhotoPlayer(episode){
  const duration=episode.scenes.length*secondsPerScene;
  const [elapsed,setElapsed]=useState(0),[playing,setPlaying]=useState(false),[hydrated,setHydrated]=useState(false);
  const [status,setStatus]=useState(''),[attempt,setAttempt]=useState(0);
  const [frame,setFrame]=useState(episode.scenes[0]);
  const elapsedRef=useRef(0),ready=useRef(false),failed=useRef(false),last=useRef(null),frameRef=useRef(null);
  const index=sceneAt(elapsed,episode.scenes.length);
  const photo=episode.scenes[index];
  useEffect(()=>setHydrated(true),[]);
  useEffect(()=>{
    let alive=true;
    ready.current=false;failed.current=false;last.current=null;setStatus('장면을 불러오는 중…');
    const image=new Image();
    image.onload=()=>{
      if(!alive)return;
      setFrame(photo);ready.current=true;last.current=null;setStatus('');
      if(index+1<episode.scenes.length){const next=new Image();next.src=episode.scenes[index+1].full;}
    };
    image.onerror=()=>{if(alive){failed.current=true;ready.current=false;setPlaying(false);setStatus(failedMessage);}};
    image.src=photo.full;
    return ()=>{alive=false;image.onload=null;image.onerror=null;};
  },[photo,index,attempt,episode]);
  useEffect(()=>{
    const image=frameRef.current;
    if(!image?.animate||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
    image.getAnimations?.().forEach(animation=>animation.cancel());
    const animation=image.animate([{opacity:.25},{opacity:1}],{duration:350,easing:'ease-out'});
    return ()=>animation.cancel();
  },[frame]);
  useEffect(()=>{
    if(!playing)return;
    let raf;last.current=null;
    const tick=now=>{
      if(ready.current&&last.current!==null){
        const previous=elapsedRef.current;
        const next=clampTime(previous+(now-last.current)/1000,duration);
        if(sceneAt(previous,episode.scenes.length)!==sceneAt(next,episode.scenes.length))ready.current=false;
        elapsedRef.current=next;setElapsed(next);
      }
      last.current=ready.current?now:null;
      if(elapsedRef.current>=duration){setPlaying(false);return;}
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return ()=>{cancelAnimationFrame(raf);last.current=null;};
  },[playing,duration,episode]);
  useEffect(()=>{
    const hide=()=>{if(document.hidden)setPlaying(false);};
    document.addEventListener('visibilitychange',hide);
    return ()=>document.removeEventListener('visibilitychange',hide);
  },[]);
  const jump=value=>{
    const next=clampTime(value,duration);
    if(sceneAt(next,episode.scenes.length)!==sceneAt(elapsedRef.current,episode.scenes.length))ready.current=false;
    elapsedRef.current=next;last.current=null;setElapsed(next);
    if(next>=duration)setPlaying(false);
  };
  const toggle=()=>{
    if(!playing){if(elapsedRef.current>=duration)jump(0);if(failed.current)setAttempt(value=>value+1);}
    setPlaying(value=>!value);
  };
  return {elapsed,index,duration,playing,hydrated,status,frame,frameRef,jump,toggle,pause:()=>setPlaying(false)};
}
