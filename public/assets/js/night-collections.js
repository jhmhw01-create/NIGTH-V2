(() => {
 'use strict';
 const data=window.NightCollections;
 const $=id=>document.getElementById(id);
 const mode=document.body.dataset.collection;
 const dialog=$('photoDialog');
 let pausePlayer=()=>{};
 function el(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;}
 function openPhoto(photo){pausePlayer();$('dialogImage').src=photo.full;$('dialogImage').alt=photo.label;$('dialogCaption').textContent=photo.label;dialog.showModal();}
 $('closePhoto').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 function photoCard(photo){
  const button=el('button',undefined,'nc-photo');button.type='button';button.setAttribute('aria-label',photo.label+' 크게 보기');
  const img=el('img');img.src=photo.thumb;img.alt=photo.label;img.loading='lazy';
  const caption=el('span');caption.append(el('b',photo.label),el('small','확대 ↗'));
  button.append(img,caption);button.addEventListener('click',()=>openPhoto(photo));return button;
 }
 function tabs(container,items,label,onSelect){
  items.forEach(item=>{const button=el('button',label(item));button.type='button';button.dataset.key=item.id;button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>{activate(container,item.id);onSelect(item);});container.append(button);});
  activate(container,items[0].id);onSelect(items[0]);
 }
 function activate(container,id){container.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.key===id)));}

 if(mode==='luna') {
  const copy=['함께 걷고, 마주 앉아 이야기를 나누는 시간.','조금 더 같이 있고 싶은 하루의 마지막.','헤어진 뒤에도 계속되는 둘만의 안부.'];
  tabs($('memberTabs'),data.luna,item=>item.name,member=>{
   $('lunaStory').replaceChildren();
   member.scenes.forEach((photo,index)=>{
    const row=el('article',undefined,'nc-story-row');
    const card=photoCard(photo);card.querySelector('img').src=photo.full;
    const text=el('div');text.append(el('span',String(index+1).padStart(2,'0'),'nc-story-index'),el('p',member.name+' / WITH LUNA','nc-kicker'),el('h2',photo.label),el('p',copy[index]));
    row.append(card,text);$('lunaStory').append(row);
   });
  });
 }
 if(mode==='if') {
  tabs($('themeTabs'),data.gallery,item=>item.title,theme=>{
   $('themeCounter').textContent=`CONCEPT ${String(data.gallery.indexOf(theme)+1).padStart(2,'0')} / ${data.gallery.length}`;
   $('themeTitle').textContent=theme.title;$('themeDescription').textContent=theme.description;
   $('ifPhotos').replaceChildren(...theme.images.map(photo=>photoCard({...photo,label:photo.label+' · '+theme.title})));
  });
 }
 if(mode==='originals') {
  const durationPerScene=6,frame=$('originalFrame'),seek=$('originalSeek'),play=$('originalPlay');
  let episode=data.originals[0],elapsed=0,current=-1,playing=false,ready=false,failed=false,version=0,raf=0,last=null;
  const duration=()=>episode.scenes.length*durationPerScene;
  const sceneIndex=()=>Math.min(episode.scenes.length-1,Math.floor(elapsed/durationPerScene));
  const clock=value=>String(Math.floor(value/60)).padStart(2,'0')+':'+String(Math.floor(value%60)).padStart(2,'0');
  function status(message=''){$('loadStatus').hidden=!message;$('loadStatus').textContent=message;}
  function sync(){
   seek.value=elapsed;seek.setAttribute('aria-valuetext',clock(elapsed)+' / '+clock(duration()));
   $('originalTime').textContent=clock(elapsed)+' / '+clock(duration());
   play.textContent=playing?'Ⅱ 일시정지':elapsed>=duration()?'↻ 다시 재생':'▶ 재생';
   $('originalPrev').disabled=sceneIndex()===0;$('originalNext').disabled=sceneIndex()===episode.scenes.length-1;
  }
  function show(force=false){
   const index=sceneIndex();if(index===current&&!force)return;
   current=index;ready=false;failed=false;const ticket=++version,photo=episode.scenes[index];status('장면을 불러오는 중…');
   $('originalCaption').textContent=String(index+1).padStart(2,'0')+' / '+photo.label;
   $('originalScenes').querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-current',String(i===index)));
   const image=new Image();
   image.onload=()=>{
    if(ticket!==version)return;
    frame.src=photo.full;frame.alt=photo.label;ready=true;last=null;status();
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&frame.animate){frame.getAnimations().forEach(a=>a.cancel());frame.animate([{opacity:.25},{opacity:1}],{duration:350});}
    if(index+1<episode.scenes.length){const preload=new Image();preload.src=episode.scenes[index+1].full;}
   };
   image.onerror=()=>{if(ticket!==version)return;failed=true;setPlaying(false);status('이미지를 불러오지 못했어요. 재생을 눌러 다시 시도하거나 다음 장면으로 이동해 주세요.');};image.src=photo.full;
  }
  function tick(now){
   if(!playing)return;
   if(ready&&last!==null)elapsed=Math.min(duration(),elapsed+(now-last)/1000);
   last=ready?now:null;show();sync();
   if(elapsed>=duration()){setPlaying(false);return;}raf=requestAnimationFrame(tick);
  }
  function setPlaying(value){cancelAnimationFrame(raf);last=null;playing=value;if(playing){if(elapsed>=duration()){elapsed=0;show();}if(failed)show(true);raf=requestAnimationFrame(tick);}sync();}
  function jump(value){elapsed=Math.max(0,Math.min(duration(),value));last=null;show();if(elapsed>=duration())setPlaying(false);sync();}
  pausePlayer=()=>setPlaying(false);
  tabs($('episodeTabs'),data.originals,item=>item.title,item=>{
   setPlaying(false);episode=item;elapsed=0;current=-1;seek.max=duration();$('originalTitle').textContent=item.title;
   $('originalScenes').replaceChildren();
   item.scenes.forEach((photo,index)=>{
    const button=el('button');button.type='button';button.setAttribute('aria-label',`장면 ${index+1} ${photo.label}`);
    const img=el('img');img.src=photo.thumb;img.alt='';img.loading='lazy';
    const copy=el('span',photo.label);copy.append(el('small',clock(index*durationPerScene)));
    button.append(img,copy);button.addEventListener('click',()=>jump(index*durationPerScene));$('originalScenes').append(button);
   });
   $('originalScenes').scrollTop=0;$('originalScenes').scrollLeft=0;
   $('originalExtras').replaceChildren();
   if(item.extras.length){$('originalExtras').append(el('h2','AFTER THE EPISODE'),...item.extras.map(photoCard));}
   if(item.id==='flowers'){const link=el('a','LUNA에게 전하는 꽃다발 · SPECIAL PHOTO ↗','nc-text-link');link.href='#for-luna';$('originalExtras').append(link);}
   show();sync();
  });
  play.addEventListener('click',()=>setPlaying(!playing));
  $('originalPrev').addEventListener('click',()=>jump((sceneIndex()-1)*durationPerScene));
  $('originalNext').addEventListener('click',()=>jump((sceneIndex()+1)*durationPerScene));
  seek.addEventListener('input',()=>jump(Number(seek.value)));
  $('originalExpand').addEventListener('click',()=>openPhoto(episode.scenes[sceneIndex()]));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)setPlaying(false);});
  $('flowerPhotos').append(...data.flowers.map(photoCard));
  if(location.hash==='#for-luna')requestAnimationFrame(()=>$('for-luna').scrollIntoView());
 }
})();
