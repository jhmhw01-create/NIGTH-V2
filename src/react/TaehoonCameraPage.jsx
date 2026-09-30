import {useState} from 'react';
import {taehoonCameraTitle,taehoonCameraEpisodes,taehoonCameraPhotoCount} from '../data/taehoonCamera.mjs';
import {StageLightbox} from './StageLightbox.jsx';
import {nextPhotoIndex} from './filters.mjs';

const number=value=>String(value).padStart(2,'0');
const photoAlt=(episode,image)=>`${taehoonCameraTitle} EP.${number(episode.number)} ${image.number===episode.pick?"TAEHOON'S PICK":`이미지 ${number(image.number)}`}`;

export function TaehoonCameraPage(){
  const [viewer,setViewer]=useState(null);
  const episode=viewer?taehoonCameraEpisodes.find(item=>item.id===viewer.episode):null;
  const image=episode?.images[viewer.index];
  const open=(episode,image)=>setViewer({episode:episode.id,index:episode.images.findIndex(item=>item.number===image.number)});
  const move=step=>setViewer(current=>({...current,index:nextPhotoIndex(current.index,step,episode.images.length)}));
  const photo=(episode,image,pick=false)=><button type="button" className={`camera-photo${pick?' camera-pick-photo':''}`} key={image.src} onClick={()=>open(episode,image)} aria-label={`${photoAlt(episode,image)} 크게 보기`} data-photo-number={image.number}>
    <img src={image.src} alt={photoAlt(episode,image)} width="1536" height="1024" loading={episode.number===1&&image.number===1?'eager':'lazy'} decoding="async"/>
    {!pick?<span>{number(image.number)}</span>:null}
  </button>;
  return <main className="camera-archive">
    <section className="camera-hero"><div className="container"><p className="camera-member">TAEHOON</p><p className="camera-kicker">PERSONAL SCHEDULE</p><h1>태훈의 카메라 <span>ON-OFF</span></h1><div className="camera-meta"><span>EPISODE · 01—06</span><span>{taehoonCameraPhotoCount} PHOTOS</span></div></div></section>
    <nav className="camera-index" aria-label="에피소드 바로가기"><div className="container">{taehoonCameraEpisodes.map(episode=><a href={`#${episode.id}`} key={episode.id}>EP.{number(episode.number)}</a>)}</div></nav>
    {taehoonCameraEpisodes.map(episode=><section className="camera-episode" id={episode.id} aria-labelledby={`${episode.id}-title`} key={episode.id}><div className="container">
      <header className="camera-episode-head"><h2 id={`${episode.id}-title`}>EPISODE {number(episode.number)}</h2><small>{episode.images.length} PHOTOS</small></header>
      <div className="camera-grid">{episode.images.filter(image=>image.number!==episode.pick).map(image=>photo(episode,image))}</div>
      <aside className="camera-pick" aria-labelledby={`${episode.id}-pick`}><header><span>EP.{number(episode.number)}</span><h3 id={`${episode.id}-pick`}>TAEHOON'S PICK</h3></header>{photo(episode,episode.images.find(image=>image.number===episode.pick),true)}</aside>
    </div></section>)}
    <div className="container camera-member-return"><a className="btn secondary" href="member-taehoon.html">← TAEHOON</a></div>
    {viewer?<StageLightbox variant="fansign" photo={{full:image.src,thumb:image.src,alt:photoAlt(episode,image),title:photoAlt(episode,image)}} index={viewer.index} total={episode.images.length} label={`${taehoonCameraTitle} EP.${number(episode.number)} 사진 크게 보기`} onClose={()=>setViewer(null)} onMove={move}/>:null}
  </main>;
}
