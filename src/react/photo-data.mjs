export const secondsPerScene=6;
export const vlogEpisodes=[
  {id:'night',owner:'NIGHT / TOGETHER',title:'오늘 저녁은 우리가 만들게',short:'숙소에서 저녁 만들기',description:'다섯 멤버가 함께 준비하는 숙소의 저녁.',count:13},
  {id:'doha',owner:'DOHA',title:'쉬는 날, 풋살하러 가는 도하',short:'쉬는 날 풋살',description:'도하의 쉬는 날을 따라가는 풋살 브이로그.',count:7},
  {id:'woohyun',owner:'WOOHYUN',title:'우현의 연습실 기록',short:'연습실 브이로그',description:'연습실에서 보내는 우현의 하루.',count:7},
  {id:'jiwoo',owner:'JIWOO',title:'지우의 조용한 휴식 시간',short:'휴식 시간 브이로그',description:'잠시 쉬어 가는 지우의 일상 기록.',count:10},
  {id:'ihwan',owner:'IHWAN',title:'이환의 대학생활',short:'대학생활 브이로그',description:'이환과 함께 따라가는 캠퍼스의 하루.',count:9},
  {id:'taehoon',owner:'TAEHOON',title:'태훈의 숙소 셀카 브이로그',short:'숙소 셀카 브이로그',description:'카메라 너머 LUNA에게 전하는 태훈의 숙소 이야기.',count:9}
];
export const clock=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
export const sceneAt=(elapsed,count)=>Math.max(0,Math.min(count-1,Math.floor(elapsed/secondsPerScene)));
export const clampTime=(value,duration)=>Math.max(0,Math.min(duration,Number.isFinite(value)?value:0));
export const vlogAsset=(episode,index,kind='full')=>`assets/images/vlog/${episode.id}/${kind}/scene-${String(index).padStart(2,'0')}.webp`;
export const vlogReaction=episode=>`assets/images/vlog/${episode.id}/full/reactions.webp`;
export const expandVlog=episode=>({...episode,scenes:Array.from({length:episode.count},(_,index)=>({full:vlogAsset(episode,index),thumb:vlogAsset(episode,index,'thumbs'),label:`${episode.title} — 장면 ${index+1}`})),extras:[]});
