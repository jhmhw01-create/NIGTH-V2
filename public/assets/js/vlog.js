(() => {
  'use strict';
  const episodes = [
    {id:'night',owner:'NIGHT / TOGETHER',title:'오늘 저녁은 우리가 만들게',short:'숙소에서 저녁 만들기',description:'다섯 멤버가 함께 준비하는 숙소의 저녁.',count:13},
    {id:'doha',owner:'DOHA',title:'쉬는 날, 풋살하러 가는 도하',short:'쉬는 날 풋살',description:'도하의 쉬는 날을 따라가는 풋살 브이로그.',count:7},
    {id:'woohyun',owner:'WOOHYUN',title:'우현의 연습실 기록',short:'연습실 브이로그',description:'연습실에서 보내는 우현의 하루.',count:7},
    {id:'jiwoo',owner:'JIWOO',title:'지우의 조용한 휴식 시간',short:'휴식 시간 브이로그',description:'잠시 쉬어 가는 지우의 일상 기록.',count:10},
    {id:'ihwan',owner:'IHWAN',title:'이환의 대학생활',short:'대학생활 브이로그',description:'이환과 함께 따라가는 캠퍼스의 하루.',count:9},
    {id:'taehoon',owner:'TAEHOON',title:'태훈의 숙소 셀카 브이로그',short:'숙소 셀카 브이로그',description:'카메라 너머 LUNA에게 전하는 태훈의 숙소 이야기.',count:9}
  ];
  const secondsPerScene = 6;
  const $ = (id) => document.getElementById(id);
  const player=$('vlogPlayer'), frame=$('vlogFrame'), seek=$('vlogSeek');
  const play=$('vlogPlay'), prev=$('vlogPrev'), next=$('vlogNext');
  let episode=episodes[0], elapsed=0, playing=false, ready=false, failed=false;
  let currentScene=-1, loadVersion=0, raf=0, lastTick=0;
  const asset=(ep,number,kind='full') => `assets/images/vlog/${ep.id}/${kind}/scene-${String(number).padStart(2,'0')}.webp`;
  const reaction=(ep) => `assets/images/vlog/${ep.id}/full/reactions.webp`;
  const duration=() => episode.count*secondsPerScene;
  const clock=(seconds) => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
  const sceneAt=() => Math.min(episode.count-1,Math.floor(elapsed/secondsPerScene));
  const status=(message='') => { $('vlogStatus').textContent=message; $('vlogStatus').hidden=!message; };

  function updateControls() {
    seek.value=elapsed;
    seek.setAttribute('aria-valuetext',`${clock(elapsed)} / ${clock(duration())}`);
    $('vlogTime').textContent=`${clock(elapsed)} / ${clock(duration())}`;
    $('vlogScene').textContent=`${String(sceneAt()+1).padStart(2,'0')} / ${episode.count}`;
    play.textContent=playing?'Ⅱ 일시정지':elapsed>=duration()?'↻ 다시 재생':'▶ 재생';
    play.setAttribute('aria-label',playing?'일시정지':elapsed>=duration()?'처음부터 다시 재생':'재생');
    prev.disabled=sceneAt()===0;
    next.disabled=sceneAt()===episode.count-1;
  }

  function showScene(force=false) {
    const scene=sceneAt();
    if (scene===currentScene&&!force) return;
    currentScene=scene; ready=false; failed=false;
    const version=++loadVersion, selected=episode;
    status('장면을 불러오는 중…');
    const incoming=new Image();
    incoming.onload=() => {
      if(version!==loadVersion) return;
      frame.src=incoming.src;
      frame.alt=`${selected.title} — 장면 ${scene+1}`;
      ready=true; lastTick=0; status();
      if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches && frame.animate) {
        frame.getAnimations().forEach(animation=>animation.cancel());
        frame.animate([{opacity:0.25},{opacity:1}],{duration:350,easing:'ease-out'});
      }
      if(scene+1<selected.count) { const preload=new Image(); preload.src=asset(selected,scene+1); }
    };
    incoming.onerror=() => {
      if(version!==loadVersion) return;
      failed=true; setPlaying(false);
      status('이미지를 불러오지 못했어요. 재생을 눌러 다시 시도하거나 다음 장면으로 이동해 주세요.');
    };
    incoming.src=asset(selected,scene);
    $('vlogScenes').querySelectorAll('button').forEach((button,index)=>button.setAttribute('aria-current',String(index===scene)));
  }

  function tick(now) {
    if(!playing) return;
    if(ready && lastTick) elapsed=Math.min(duration(),elapsed+(now-lastTick)/1000);
    lastTick=ready?now:0;
    showScene(); updateControls();
    if(elapsed>=duration()) { setPlaying(false); return; }
    raf=requestAnimationFrame(tick);
  }

  function setPlaying(value) {
    cancelAnimationFrame(raf); lastTick=0;
    playing=value;
    if(playing) {
      if(elapsed>=duration()) { elapsed=0; showScene(); }
      if(failed) showScene(true);
      raf=requestAnimationFrame(tick);
    }
    updateControls();
  }

  function jump(seconds) {
    elapsed=Math.max(0,Math.min(duration(),seconds)); lastTick=0;
    showScene();
    if(elapsed>=duration()) setPlaying(false);
    updateControls();
  }

  function selectEpisode(id) {
    const selected=episodes.find(item=>item.id===id);
    if(!selected) return;
    setPlaying(false); episode=selected; elapsed=0; currentScene=-1;
    seek.max=duration();
    $('vlogOwner').textContent=episode.owner;
    $('vlogTitle').textContent=episode.title;
    $('vlogDescription').textContent=episode.description;
    $('vlogReaction').src=reaction(episode);
    $('vlogReaction').alt=`${episode.title} 팬 반응 이미지`;
    $('vlogReactionLink').href=reaction(episode);
    $('vlogEpisodes').querySelectorAll('button').forEach(button=>button.setAttribute('aria-current',String(button.dataset.episode===id)));
    $('vlogScenes').replaceChildren();
    for(let i=0;i<episode.count;i++) {
      const button=document.createElement('button'); button.type='button';
      button.setAttribute('aria-label',`장면 ${i+1}, ${clock(i*secondsPerScene)}로 이동`);
      const img=document.createElement('img'); img.src=asset(episode,i,'thumbs'); img.alt=''; img.loading='lazy';
      const label=document.createElement('span'); label.textContent=`${String(i+1).padStart(2,'0')} · ${clock(i*secondsPerScene)}`;
      button.append(img,label); button.addEventListener('click',()=>jump(i*secondsPerScene));
      $('vlogScenes').append(button);
    }
    $('vlogScenes').scrollLeft=0;
    showScene(); updateControls();
  }

  episodes.forEach(ep=>{
    const button=document.createElement('button'); button.type='button'; button.className='vlog-episode'; button.dataset.episode=ep.id;
    button.setAttribute('aria-label',`${ep.owner}, ${ep.short} 선택`);
    const img=document.createElement('img'); img.src=asset(ep,0,'thumbs'); img.alt=''; img.loading='lazy';
    const copy=document.createElement('span');
    const owner=document.createElement('small'); owner.textContent=ep.owner;
    const title=document.createElement('strong'); title.textContent=ep.short;
    const info=document.createElement('em'); info.textContent=`${ep.count} SCENES · ${clock(ep.count*secondsPerScene)}`;
    copy.append(owner,title,info); button.append(img,copy);
    button.addEventListener('click',()=>selectEpisode(ep.id)); $('vlogEpisodes').append(button);
  });
  play.addEventListener('click',()=>setPlaying(!playing));
  prev.addEventListener('click',()=>jump((sceneAt()-1)*secondsPerScene));
  next.addEventListener('click',()=>jump((sceneAt()+1)*secondsPerScene));
  seek.addEventListener('input',()=>jump(Number(seek.value)));
  player.addEventListener('keydown',event=>{
    if(event.target!==player || event.altKey || event.ctrlKey || event.metaKey) return;
    if(event.key===' ') { event.preventDefault(); setPlaying(!playing); }
    if(event.key==='ArrowLeft') { event.preventDefault(); jump((sceneAt()-1)*secondsPerScene); }
    if(event.key==='ArrowRight') { event.preventDefault(); jump((sceneAt()+1)*secondsPerScene); }
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden) setPlaying(false);});
  selectEpisode('night');
})();
