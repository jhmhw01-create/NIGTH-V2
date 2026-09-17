import fs from 'node:fs';

const names=['doha','woohyun','jiwoo','ihwan','taehoon'];
const records=Object.fromEntries(names.map(name=>{const path=`src/pages/member-${name}.json`;return [name,{path,page:JSON.parse(fs.readFileSync(path,'utf8'))}];}));
const req=(text,oldText,newText,label)=>{if(!text.includes(oldText))throw new Error(`Missing target: ${label}`);return text.replace(oldText,newText);};
const save=({path,page})=>fs.writeFileSync(path,JSON.stringify(page,null,2)+'\n');

for(const name of names){
  let h=records[name].page.contentHtml;
  h=h.replace(/(<div class="member-meta">[^<]*?) · \d+(<\/div>)/,'$1$2');
  h=h.replace(/\n  <dt>AGE<\/dt><dd>\d+세<\/dd>/,'');
  records[name].page.contentHtml=h;
}

records.doha.page.contentHtml=req(records.doha.page.contentHtml,'<span class="highlight-label">KEYWORD 02</span><p>통제</p>','<span class="highlight-label">KEYWORD 02</span><p>중심</p>','DOHA keyword');

let w=records.woohyun.page.contentHtml;
w=req(w,'<p>때문에 팬들 사이에서는 우현의 무대를 두고 ‘야하다’, ‘위험하다’는 반응이 자주 나온다.</p>\n<p>이러한 평가는 단순히 노출이 많은 의상이나 직접적으로 선정적인 동작 때문에 생기는 것이 아니다.</p>\n<p>우현이 자신의 표정과 시선을 포함한 모든 움직임을 의도적으로 사용할 줄 알기 때문에 만들어지는 인상에 가깝다.</p>','<p>때문에 팬들 사이에서는 우현의 무대를 두고 ‘야하다’, ‘위험하다’는 반응이 자주 나온다.</p>\n<p>팬들이 말하는 그 분위기는 자극적인 연출 자체보다, 표정과 시선, 움직임의 작은 디테일까지 의도적으로 사용하는 우현의 퍼포먼스에서 만들어진다.</p>','WOOHYUN fan reaction');
records.woohyun.page.contentHtml=w;

let j=records.jiwoo.page.contentHtml;
j=req(j,'<p>특히 과거, ANGELO가 일부 사생들의 도를 넘은 사생활 침해로 힘들어하는 모습을 가까이에서 지켜본 경험은 지우의 이러한 기준을 더욱 분명하게 만들었다.</p>\n<p>그 경험 이후 지우에게 팬과 아티스트 사이에서 지켜야 할 경계, 개인의 사생활, 상대방의 의사와 동의는 쉽게 타협할 수 있는 문제가 아니다.</p>','<p>지우에게 팬과 아티스트 사이의 경계와 개인의 사생활, 상대방의 의사와 동의는 쉽게 타협할 수 없는 기준이다.</p>','JIWOO boundaries detail');
j=req(j,'<p>과거 ANGELO가 사생활 침해로 힘들어하는 모습을 지켜봤던 만큼, 멤버들을 향한 과도한 접근이나 사적인 영역의 침범에는 특히 민감하다.</p>','<p>멤버들을 향한 과도한 접근이나 사적인 영역의 침범에는 자신의 일이 아니더라도 분명한 태도를 보인다.</p>','JIWOO repeated detail');
records.jiwoo.page.contentHtml=j;

let i=records.ihwan.page.contentHtml;
const beforeNight=/<section class="section-tight member-about-section">\n<div class="container member-about-grid">\n<div class="section-label reveal">BEFORE NIGHT<\/div>[\s\S]*?<\/section>/;
if(!beforeNight.test(i))throw new Error('Missing target: IHWAN BEFORE NIGHT');
i=i.replace(beforeNight,`<section class="section-tight member-about-section">
<div class="container member-about-grid">
<div class="section-label reveal">BEFORE NIGHT</div>
<article class="member-intro reveal">
<h2>Before NIGHT</h2>
<p>이환은 성악가인 부모님의 영향으로 어린 시절부터 성악을 배우며 전문적인 음악 교육을 받았다.</p>
<p>재능과 실력을 인정받았지만, 오랜 시간 경쟁과 평가가 일상이었던 환경 속에서 자신이 어떤 음악을 하고 싶은지 고민하게 됐다.</p>
<p>결국 정해진 성악가의 길을 그대로 따르기보다 새로운 무대와 표현 방식을 선택했고, 그 선택의 끝에서 NIGHT의 멤버가 됐다.</p>
<p>클래식에서 쌓은 기본기는 지금도 이환의 가장 단단한 기반이지만, NIGHT 이후에는 음악을 평가의 대상보다 자유롭게 탐색하고 즐기는 영역으로 받아들이고 있다.</p>
</article>
</div>
</section>`);
records.ihwan.page.contentHtml=i;

let t=records.taehoon.page.contentHtml;
t=req(t,'<dt>FAMILY</dt><dd>부모님 · 외동 (어릴 때부터 옆집 누나와 함께 자람)</dd>','<dt>FAMILY</dt><dd>부모님 · 외동</dd>','TAEHOON family summary');
const desire=/<section class="section-tight member-about-section">\n<div class="container member-about-grid">\n<div class="section-label reveal">DESIRE<\/div>[\s\S]*?<\/section>/;
if(!desire.test(t))throw new Error('Missing target: TAEHOON DESIRE');
t=t.replace(desire,`<section class="section-tight member-about-section">
<div class="container member-about-grid">
<div class="section-label reveal">DRIVE</div>
<article class="member-intro reveal">
<h2>Drive</h2>
<p>태훈은 좋아하는 것이 생기면 멀리서 바라보기보다 먼저 다가가는 사람이다.</p>
<p>사람과 애정, 새로운 경험과 재미, 좋은 무대와 기회에 솔직하게 마음을 열고 적극적으로 움직인다.</p>
<p>즐거웠던 경험은 다시 하고 싶어 하고, 좋은 무대를 만들었다면 다음에는 더 잘하고 싶어 한다.</p>
<p>이러한 적극성은 타인의 몫을 빼앗기보다 자신이 원하는 방향으로 한 걸음 더 움직이는 태훈의 추진력에 가깝다.</p>
<p class="quote">좋은 건 많으면 더 좋은 거 아니야?</p>
</article>
</div>
</section>`);
records.taehoon.page.contentHtml=t;

for(const name of names)save(records[name]);
