import {useEffect,useState} from 'react';
import data from '../../.react-build/photo-episodes.json';
import {CollectionPhotoCard} from './CollectionPhotoCard.jsx';
import {CollectionPhotoDialog} from './CollectionPhotoDialog.jsx';
const lunaCopy=['함께 걷고, 마주 앉아 이야기를 나누는 시간.','조금 더 같이 있고 싶은 하루의 마지막.','헤어진 뒤에도 계속되는 둘만의 안부.'];
export function CollectionPage({route}){
  const luna=route==='with-luna.html';
  const items=luna?data.luna:data.gallery;
  const [selected,setSelected]=useState(items[0].id),[expanded,setExpanded]=useState(null),[ready,setReady]=useState(false);
  useEffect(()=>setReady(true),[]);
  const item=items.find(record=>record.id===selected);
  const select=id=>{setExpanded(null);setSelected(id);};
  return <><main className="container nc-main">
    <div className="nc-heading"><p className="nc-kicker">{luna?'A DAY WITH YOU':'SPECIAL CONCEPT ARCHIVE'}</p><h1>{luna?'WITH LUNA':'IF : NIGHT'}</h1><p>{luna?'데이트부터 집에 도착한 뒤의 안부까지, LUNA와 함께하는 세 장면.':'만약 다른 모습으로 만났다면. 실제 활동 설정과 별개로 즐기는 IF 콘셉트 화보.'}</p></div>
    <div className={'nc-tabs'+(luna?'':' nc-theme-tabs')} id={luna?'memberTabs':'themeTabs'} role="group" aria-label={luna?'멤버 선택':'IF 테마 선택'}>{items.map(record=><button key={record.id} type="button" data-key={record.id} aria-pressed={record.id===selected} disabled={!ready} onClick={()=>select(record.id)}>{luna?record.name:record.title}</button>)}</div>
    {luna?<><section id="lunaStory" className="nc-story" aria-label="멤버별 데이트 기록">{item.scenes.map((photo,index)=><article key={photo.full} className="nc-story-row"><CollectionPhotoCard photo={photo} full onOpen={setExpanded}/><div><span className="nc-story-index">{String(index+1).padStart(2,'0')}</span><p className="nc-kicker">{item.name} / WITH LUNA</p><h2>{photo.label}</h2><p>{lunaCopy[index]}</p></div></article>)}</section><a className="nc-banner" href="night-originals.html#for-luna"><span>SPECIAL PHOTO</span><h2>꽃다발을 든 NIGHT</h2><p>일일 꽃집 알바가 끝난 뒤, LUNA에게 전하는 꽃다발.</p><strong>FOR LUNA ↗</strong></a></>:<section aria-labelledby="themeTitle"><div className="nc-section-head"><div><p className="nc-kicker" id="themeCounter">CONCEPT {String(items.indexOf(item)+1).padStart(2,'0')} / {items.length}</p><h2 id="themeTitle">{item.title}</h2><p id="themeDescription">{item.description}</p></div><span>5 MEMBERS</span></div><div id="ifPhotos" className="nc-photo-grid">{item.images.map(photo=><CollectionPhotoCard key={photo.full} photo={{...photo,label:photo.label+' · '+item.title}} onOpen={setExpanded}/>)}</div></section>}
  </main><CollectionPhotoDialog photo={expanded} onClose={()=>setExpanded(null)}/></>;
}
