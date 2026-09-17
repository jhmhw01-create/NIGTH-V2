const season2029Entry = `
<div class="container nc-entry reveal" id="season-2029"><div class="sg-2029-cover" role="img" aria-label="2029 SUNDAY CLUB 시즌그리팅 타이틀 카드" style="aspect-ratio:4/3;display:grid;place-items:center;border:1px solid rgba(255,255,255,.16);background:linear-gradient(145deg,#f4efe6,#d8c9ae);color:#16130f;text-align:center;padding:2rem"><div><small style="display:block;letter-spacing:.18em;margin-bottom:.7rem">2029 SEASON’S GREETINGS</small><strong style="display:block;font-size:clamp(2rem,5vw,4.5rem);letter-spacing:.04em">SUNDAY CLUB</strong><span style="display:block;margin-top:.7rem;letter-spacing:.12em">22 IMAGE ARCHIVE</span></div></div><div><span>2029 SEASON’S GREETINGS</span><h2>SUNDAY CLUB</h2><p>NIGHT의 느긋한 일요일을 담은 2029 시즌그리팅. 메인 비주얼부터 브런치, 음악, 보드게임, 멤버별 휴식 장면과 패키지 구성까지 총 22개 항목을 기록한다.</p><a href="season-greetings-2029.html">ENTER SUNDAY CLUB ↗</a></div></div>
`;

export function normalizeSeasonGreetingsPage(page){
  if(page?.route!=='fanclub.html'||typeof page.contentHtml!=='string'||page.contentHtml.includes('season-greetings-2029.html'))return page;
  const marker='<div class="container nc-entry reveal"><img src="assets/images/final-additions/season/season-06.webp"';
  if(!page.contentHtml.includes(marker))throw Error('2028 season greetings marker not found in fanclub page');
  return {...page,contentHtml:page.contentHtml.replace(marker,season2029Entry+marker)};
}
