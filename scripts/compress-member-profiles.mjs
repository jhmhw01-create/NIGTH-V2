import {readFile,writeFile} from 'node:fs/promises';

const profiles={
  doha:`
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">ABOUT</div><article class="member-intro reveal">
<h2>About DOHA</h2>
<p>도하는 NIGHT의 리더이자 서브래퍼로, 팀의 중심을 차분하게 잡아주는 멤버다. 말수가 많은 편은 아니지만 주변을 세심하게 살피고 필요한 순간에는 먼저 움직인다.</p>
<p>3남 2녀의 장남으로 자라 책임지는 일에 익숙하며, 겉으로는 무심해 보여도 가까운 사람에게는 자연스럽게 다정함을 드러낸다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">BEFORE NIGHT</div><article class="member-intro reveal">
<h2>Before NIGHT</h2>
<p>아이돌이 되기 전에는 유소년 축구선수로 활동했다. 선수 생활을 통해 체력과 자기관리, 집중력을 익혔고 부상 이후 새로운 길을 선택해 NIGHT의 멤버가 됐다.</p>
<p>지금도 운동과 축구를 좋아하며, 게임이나 스포츠가 시작되면 평소보다 승부욕이 강해지는 편이다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">LEADER &amp; PERSONALITY</div><article class="member-intro reveal">
<h2>Leader &amp; Personality</h2>
<p>도하는 앞에서 크게 지시하기보다 상황을 먼저 살피고 필요한 순간에 중심을 잡는 리더다. 멤버들의 성격과 판단을 존중하면서도 팀에 책임이 필요한 순간에는 물러서지 않는다.</p>
<p>차분하고 현실적인 성격이지만 가까워지면 장난도 잘 받아주며, 자신이 편하거나 마음에 든다고 판단한 일에는 의외로 거리낌이 없다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">WITH NIGHT</div><article class="member-intro reveal">
<h2>With NIGHT</h2>
<p>멤버마다 필요한 거리와 방식이 다르다는 것을 알고 있어 누구에게나 같은 방식으로 대하지 않는다. 애정을 크게 표현하기보다 행동으로 챙기는 편이다.</p>
<p>무대 밖에서는 잘 쉬고, 잘 먹고, 운동하며 편안하게 시간을 보낸다. 리더라는 역할에서 조금 벗어나 멤버들과 자연스럽게 어울리는 모습도 자주 보인다.</p>
</article></div></section>
`,
  woohyun:`
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">ABOUT</div><article class="member-intro reveal">
<h2>About WOOHYUN</h2>
<p>우현은 NIGHT의 메인댄서로, 음악의 분위기와 리듬을 빠르게 읽어 몸과 표정으로 표현하는 멤버다. 평소에는 웃음이 많고 사람들과 어울리는 것을 좋아하지만 연습과 무대에서는 완성도에 높은 기준을 둔다.</p>
<p>즐기는 감각과 집요한 집중력이 함께 있는 점이 우현의 가장 큰 특징이다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">DANCE &amp; PERFORMANCE</div><article class="member-intro reveal">
<h2>Dance &amp; Performance</h2>
<p>안무를 정확하게 수행하는 데 그치지 않고 멤버별 동선, 시선, 표정과 에너지의 흐름까지 함께 본다. 안무 창작과 퍼포먼스 디렉팅에도 능하며 NIGHT의 무대를 전체적인 그림으로 바라보는 편이다.</p>
<p>감각과 직감을 중요하게 여기지만 작은 타이밍과 힘의 방향까지 놓치지 않아, 무대 준비에서는 의외로 집요한 모습을 보인다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">ON STAGE</div><article class="member-intro reveal">
<h2>On Stage</h2>
<p>무대 위에서는 평소보다 훨씬 강렬하다. 시선과 표정, 호흡과 동작 사이의 여유까지 퍼포먼스의 일부로 사용하며 같은 안무에서도 매번 조금씩 다른 장면을 만든다.</p>
<p>때문에 팬들 사이에서는 우현의 무대를 두고 ‘야하다’, ‘위험하다’는 반응이 자주 나온다.</p>
<p>팬들이 말하는 그 분위기는 자극적인 연출 자체보다, 표정과 시선, 움직임의 작은 디테일까지 의도적으로 사용하는 우현의 퍼포먼스에서 만들어진다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">PERSONALITY</div><article class="member-intro reveal">
<h2>Personality</h2>
<p>새로운 경험과 재미있는 제안을 좋아하고 감정을 솔직하게 표현한다. 사람들과 장난치는 것도 좋아해 NIGHT 안에서 분위기를 자연스럽게 밝히는 역할을 한다.</p>
<p>다만 중요하다고 생각하는 일에는 쉽게 타협하지 않으며, 특히 춤과 무대에서는 집중력이 빠르게 높아진다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">WITH NIGHT</div><article class="member-intro reveal">
<h2>With NIGHT</h2>
<p>멤버들과 있을 때는 먼저 웃고 장난에 빠르게 끼어드는 편이지만, 누군가 혼자 있을 시간이 필요하면 자연스럽게 물러날 줄도 안다.</p>
<p>연습실에서는 친한 멤버에게도 필요한 말을 바로 할 만큼 분명하고, 연습이 끝나면 다시 평소의 편안한 분위기로 돌아온다.</p>
</article></div></section>
`,
  jiwoo:`
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">ABOUT</div><article class="member-intro reveal">
<h2>About JIWOO</h2>
<p>지우는 NIGHT의 센터이자 메인래퍼다. 과장된 표현 없이도 시선이 모이는 존재감과 낮고 독특한 음색을 가지고 있다.</p>
<p>말수와 감정 표현은 크지 않지만 자기 기준이 분명하며, 자신의 장점과 단점을 비교적 정확하게 알고 있다. 가까운 사람에게는 첫인상보다 훨씬 편안하고 다정한 편이다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">VOICE &amp; RAP</div><article class="member-intro reveal">
<h2>Voice &amp; Rap</h2>
<p>낮고 독특한 목소리는 짧은 파트에서도 존재감을 남긴다. 힘으로 밀어붙이기보다 음색과 리듬을 활용하며 곡에 따라 건조하거나 여유로운 톤을 자연스럽게 오간다.</p>
<p>글쓰기에 익숙해 가사에서는 단어와 문장의 뉘앙스를 중요하게 보고, 자신이 직접 말했을 때 자연스러운 표현을 선호한다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">CENTER &amp; STAGE</div><article class="member-intro reveal">
<h2>Center &amp; Stage</h2>
<p>지우의 센터는 적극적으로 시선을 빼앗기보다 절제된 움직임과 표정으로 장면의 분위기를 잡는 방식에 가깝다. 나른한 눈빛과 차분한 에너지가 NIGHT의 무대에서 고유한 인상을 만든다.</p>
<p>자신이 어떻게 보이는지를 잘 알고 있어 더 움직여야 할 순간과 오히려 힘을 빼야 할 순간을 정확하게 구분한다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">PERSONALITY &amp; BOUNDARIES</div><article class="member-intro reveal">
<h2>Personality &amp; Boundaries</h2>
<p>주변의 평가에 쉽게 흔들리지 않고 자신의 판단을 중요하게 여긴다. 감정 표현은 절제되어 있지만 가까운 사람에게는 행동으로 먼저 챙기는 경우가 많다.</p>
<p>팬과 아티스트 사이의 경계, 개인의 사생활, 상대방의 의사와 동의를 중요하게 생각하며 이를 침범하는 행동에는 분명한 태도를 보인다.</p>
<p class="quote">가까워지는 것과 선을 넘는 것은 전혀 다른 일이다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">WITH NIGHT</div><article class="member-intro reveal">
<h2>With NIGHT</h2>
<p>NIGHT 멤버들과 있을 때는 평소보다 경계가 자연스럽게 낮아진다. 자신의 공간과 시간을 편하게 나누고, 장난에도 큰 반응 대신 정확한 한마디를 얹는 편이다.</p>
<p>멤버들의 의사나 사적인 영역이 침해되는 상황에서는 자신의 일이 아니더라도 쉽게 넘어가지 않는다.</p>
</article></div></section>
`,
  ihwan:`
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">ABOUT</div><article class="member-intro reveal">
<h2>About IHWAN</h2>
<p>이환은 NIGHT의 메인보컬로, 맑은 미성과 풍부한 성량을 함께 지닌 멤버다. 성악을 바탕으로 안정적인 보컬을 보여주며 피아노를 비롯한 여러 악기도 다룬다.</p>
<p>평소에는 서글서글한 인상과 능글맞은 말투로 사람을 편하게 만들지만, 자신의 감정을 모두 드러내지는 않는 편이다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">VOICE &amp; MUSIC</div><article class="member-intro reveal">
<h2>Voice &amp; Music</h2>
<p>성악에서 익힌 탄탄한 발성과 넓은 표현 범위를 바탕으로, 힘이 필요한 구간과 섬세한 감정이 필요한 구간을 자연스럽게 오간다. 팬들 사이에서는 ‘마성의 보이스’라는 표현도 사용된다.</p>
<p>피아노를 중심으로 여러 악기를 다루고 악보와 음악 구조를 읽는 데 익숙하다. 정석을 알고 있기 때문에 장르와 발성을 새롭게 변형해보는 과정도 즐긴다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">BEFORE NIGHT</div><article class="member-intro reveal">
<h2>Before NIGHT</h2>
<p>성악가인 부모님의 영향으로 어린 시절부터 전문적인 음악 교육을 받았다. 오랜 경쟁과 평가 속에서 자신이 원하는 음악을 고민했고, 정해진 성악가의 길 대신 새로운 무대와 표현 방식을 선택해 NIGHT의 멤버가 됐다.</p>
<p>NIGHT 이후에는 음악을 평가의 대상보다 자유롭게 시도하고 즐길 수 있는 영역으로 받아들이고 있다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">PERSONALITY</div><article class="member-intro reveal">
<h2>Personality</h2>
<p>상대의 분위기를 빠르게 읽고 자연스럽게 대화를 이어가는 데 능하다. 장난을 받아치거나 분위기를 풀어주는 모습도 많다.</p>
<p>다만 무엇을 보여주고 무엇을 자신 안에 남길지 분명히 선택하는 편이다. 웃는 얼굴이 항상 속마음과 같은 것은 아니며, 자신의 감정을 천천히 보여준다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">WITH NIGHT</div><article class="member-intro reveal">
<h2>With NIGHT</h2>
<p>멤버들과 있을 때는 여유롭게 장난을 받아주거나 먼저 분위기를 풀어주는 경우가 많다. 음악에 관한 이야기가 시작되면 자연스럽게 전문적인 면이 드러나고, 자신이 아는 것을 팀 안에서 유연하게 나누는 편이다.</p>
</article></div></section>
`,
  taehoon:`
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">ABOUT</div><article class="member-intro reveal">
<h2>About TAEHOON</h2>
<p>태훈은 NIGHT의 리드보컬이자 막내다. 밝은 에너지와 뛰어난 친화력을 가지고 있어 새로운 사람이나 환경에도 자연스럽게 다가가는 편이다.</p>
<p>감정 표현이 솔직하고 좋아하는 일에는 적극적이다. 무대에 오르면 평소의 친근한 분위기와 달리 강한 집중력과 선명한 표정을 보여준다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">JOIN NIGHT</div><article class="member-intro reveal">
<h2>Join NIGHT</h2>
<p>ANGELO의 활동 종료 이후 NIGHT 데뷔 3년 차에 합류했다. 이미 관계가 형성된 팀에 들어가는 부담 속에서도 먼저 말을 걸고 함께할 수 있는 일에 적극적으로 참여했다.</p>
<p>기존 멤버를 대신하는 사람이 아니라 TAEHOON이라는 새로운 멤버로 자리 잡았고, 현재는 다섯 멤버 중 한 사람으로 자연스럽게 활동하고 있다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">VOICE &amp; STAGE</div><article class="member-intro reveal">
<h2>Voice &amp; Stage</h2>
<p>밝고 선명한 에너지를 가진 리드보컬로, 곡의 분위기에 따라 힘을 자연스럽게 조절한다. 강한 곡에서는 눈빛과 표정이 빠르게 달라져 평소와 뚜렷한 온도차를 만든다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">PERSONALITY &amp; FANS</div><article class="member-intro reveal">
<h2>Personality &amp; Fans</h2>
<p>사람을 좋아하고 자신이 원하는 것에도 솔직하다. 재미있는 경험이나 좋은 기회가 생기면 멀리서 바라보기보다 먼저 움직이는 적극성이 있다.</p>
<p>팬들과의 소통과 팬서비스도 즐기는 편이며, 사진과 영상을 통해 자신이 본 장면이나 재미있는 순간을 공유하는 것을 좋아한다. 팬들의 애정을 기쁘게 받아들이고 자신의 반응도 적극적으로 표현한다.</p>
</article></div></section>
<section class="section-tight member-about-section">
<div class="container member-about-grid"><div class="section-label reveal">WITH NIGHT</div><article class="member-intro reveal">
<h2>With NIGHT</h2>
<p>가장 늦게 합류했지만 먼저 다가가는 성격 덕분에 현재는 멤버들과 자연스럽게 어울린다. 함께 놀거나 장난치는 것을 좋아하고, 팀 안에서도 자신의 생각과 애정을 비교적 솔직하게 표현한다.</p>
</article></div></section>
`
};

for(const [slug,replacement] of Object.entries(profiles)){
  const path=`src/pages/member-${slug}.json`;
  const page=JSON.parse(await readFile(path,'utf8'));
  const before=page.contentHtml;
  const pattern=/<section class="section-tight member-about-section">[\s\S]*?(?=<section class="section-tight member-highlights-section">)/;
  if(!pattern.test(before)) throw new Error(`Profile sections not found for ${slug}`);
  page.contentHtml=before.replace(pattern,replacement);
  if(!page.contentHtml.includes('member-highlights-section')) throw new Error(`Keywords section lost for ${slug}`);
  if(!page.contentHtml.includes('member-switch-section')) throw new Error(`Member switcher lost for ${slug}`);
  await writeFile(path,JSON.stringify(page,null,2)+'\n','utf8');
}

const woohyun=JSON.parse(await readFile('src/pages/member-woohyun.json','utf8')).contentHtml;
if(!woohyun.includes('‘야하다’, ‘위험하다’')) throw new Error('WOOHYUN fan reaction was lost');
if(!woohyun.includes('팬들이 말하는 그 분위기는 자극적인 연출 자체보다')) throw new Error('WOOHYUN performance explanation was lost');
const jiwoo=JSON.parse(await readFile('src/pages/member-jiwoo.json','utf8')).contentHtml;
for(const text of ['사생활','의사와 동의','가까워지는 것과 선을 넘는 것은 전혀 다른 일이다.']) if(!jiwoo.includes(text)) throw new Error(`JIWOO boundary copy lost: ${text}`);
const taehoon=JSON.parse(await readFile('src/pages/member-taehoon.json','utf8')).contentHtml;
if(taehoon.includes('옆집 누나')||taehoon.includes('GREED')||taehoon.includes('탐욕')) throw new Error('Private or NIGHTMARE-only TAEHOON setting reintroduced');

console.log('Compressed five member profiles.');
