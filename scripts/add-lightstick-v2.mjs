import fs from 'node:fs';

const storePath='public/assets/js/md-store.js';
let store=fs.readFileSync(storePath,'utf8');
if(store.includes("id:'moonlight-light-stick-v2'")) throw new Error('V2 product already exists');
const productInsert=`
  {id:'moonlight-light-stick-v2',name:'MOONLIGHT VER.2 — LUNA ORBIT',category:'featured collectible',price:49000,images:[
    'assets/images/md/lightstick-v2/night-lightstick-v2-11-off-on.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-01-light-modes.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-12-detail-view.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-09-package-open.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-08-package-contents.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-02-carry-case.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-10-wrist-strap.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-05-display-stand.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-06-mini-keyring.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-03-metal-pin.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-04-bag-charm.webp',
    'assets/images/md/lightstick-v2/night-lightstick-v2-07-design-evolution.webp'
  ],options:allOption,benefit:'VER.2 PACKAGE · WRIST STRAP · USER GUIDE / WARRANTY',desc:'달과 별의 궤도를 확장한 NIGHT 공식 응원봉 두 번째 버전 LUNA ORBIT. 더블 크리스털 글로브와 NIGHT STAR CORE, CRESCENT ORBIT 구조를 중심으로 VER.1의 NIGHT DNA를 이어간다.'},
  {id:'moonlight-light-stick',name:'MOONLIGHT VER.1 — ORIGINAL CELESTIAL FORM',category:'featured collectible',price:49000,images:['assets/images/night-luna.webp'],options:allOption,desc:'NIGHT와 LUNA의 첫 공식 응원봉 MOONLIGHT. 크리스털 글로브 안의 초승달과 별, 보랏빛 광원으로 NIGHT의 밤하늘 아이덴티티를 완성한 오리지널 버전.'},`;
store=store.replace('const mdProducts = [','const mdProducts = ['+productInsert);
fs.writeFileSync(storePath,store);

const fanPath='src/pages/fanclub.json';
const page=JSON.parse(fs.readFileSync(fanPath,'utf8'));
const oldStart=`<section class="section-tight">
<div class="container lightstick-grid">
<div class="reveal">
<img alt="NIGHT 공식 응원봉 MOONLIGHT" src="assets/images/night-luna.webp"/>
</div>
<div class="reveal">
<span class="section-kicker">Official Light Stick</span>
<h2 class="section-title">MOONLIGHT</h2>
<p class="section-desc">LUNA가 NIGHT를 비추는 달이라면, MOONLIGHT는 공연장을 가득 채우는 그 달빛이다. 투명한 구형 헤드 안의 초승달과 별, 보랏빛 광원이 NIGHT의 밤하늘 아이덴티티를 표현한다.</p>
<div class="color-row">
<div class="color-chip"><div class="swatch" style="background:#0B0B12"></div><strong>Nightfall Black</strong><small>#0B0B12</small></div>
<div class="color-chip"><div class="swatch" style="background:#7A5CFF"></div><strong>Moonlit Amethyst</strong><small>#7A5CFF</small></div>
<div class="color-chip"><div class="swatch" style="background:#DBDAE6"></div><strong>Starlight Silver</strong><small>#DBDAE6</small></div>
</div>
</div>
</div>
</section>
<section class="section-tight">
<div class="container bio-grid">
<article class="bio-card reveal">
<h3>FANCLUB NAME</h3>
<p><strong>LUNA</strong> — NIGHT의 밤을 비추는 달이라는 의미를 담은 공식 팬클럽명.</p>
</article>
<article class="bio-card reveal">
<h3>LIGHT STICK</h3>
<p><strong>MOONLIGHT</strong> — LUNA가 만들어 내는 달빛이 공연장을 채운다는 의미의 공식 응원봉명.</p>
</article>
<article class="bio-card reveal">
<h3>LIGHT MODES</h3>
<p>Night Purple, Amethyst Wave, Moon Silver, Star Glitter, Night Breath의 다섯 가지 라이트 모드.</p>
</article>
<article class="bio-card reveal">
<h3>OFFICIAL COLORS</h3>
<p>Nightfall Black, Moonlit Amethyst, Starlight Silver. NIGHT의 어둠과 달빛, 무대의 반짝임을 상징한다.</p>
</article>
</div>
</section>`;
const replacement=`<section class="section-tight lightstick-v2-feature">
<div class="container lightstick-v2-grid">
<div class="reveal"><img alt="NIGHT 공식 응원봉 MOONLIGHT VER.2 LUNA ORBIT" src="assets/images/md/lightstick-v2/night-lightstick-v2-11-off-on.webp" loading="lazy"/></div>
<div class="reveal">
<span class="section-kicker">Official Light Stick · Ver.2</span>
<h2 class="section-title">MOONLIGHT VER.2<br/>LUNA ORBIT</h2>
<p class="section-desc">NIGHT와 LUNA의 밤을 하나의 궤도로 잇는 두 번째 공식 응원봉. 더블 크리스털 글로브 안의 NIGHT STAR CORE와 CRESCENT ORBIT가 기존 MOONLIGHT의 달과 별을 더욱 입체적인 형태로 확장한다.</p>
<div class="lightstick-mode-list"><span>NIGHT PURPLE</span><span>AMETHYST WAVE</span><span>MOON SILVER</span><span>STAR GLITTER</span><span>LUNA ORBIT</span></div>
<a class="btn secondary" href="store.html">VIEW MOONLIGHT VER.2 →</a>
</div>
</div>
</section>
<section class="section-tight lightstick-evolution">
<div class="container">
<div class="section-head reveal"><div><span class="section-kicker">Design Evolution</span><h2 class="section-title">From a moon held in the night<br/>to a night set into orbit.</h2></div><p class="section-desc">MOONLIGHT의 첫 형태에서 LUNA ORBIT까지. NIGHT의 달, 별, 크리스털과 블랙 핸들 아이덴티티는 유지하고 구조와 빛의 깊이를 확장했다.</p></div>
<img class="lightstick-evolution-image reveal" src="assets/images/md/lightstick-v2/night-lightstick-v2-07-design-evolution.webp" alt="MOONLIGHT VER.1과 VER.2 디자인 비교" loading="lazy"/>
<div class="lightstick-version-grid">
<article class="bio-card reveal"><span class="section-kicker">VER.1</span><h3>ORIGINAL CELESTIAL FORM</h3><p>크리스털 글로브와 초승달, 별을 중심으로 완성된 MOONLIGHT의 오리지널 디자인.</p></article>
<article class="bio-card reveal"><span class="section-kicker">VER.2</span><h3>LUNA ORBIT</h3><p>DOUBLE CRYSTAL GLOBE, NIGHT STAR CORE, CRESCENT ORBIT와 LUNA ORBIT SYSTEM으로 확장된 두 번째 디자인.</p></article>
</div>
</div>
</section>
<section class="section-tight">
<div class="container bio-grid">
<article class="bio-card reveal"><h3>FANCLUB NAME</h3><p><strong>LUNA</strong> — NIGHT의 밤을 비추는 달이라는 의미를 담은 공식 팬클럽명.</p></article>
<article class="bio-card reveal"><h3>LIGHT STICK</h3><p><strong>MOONLIGHT</strong> — LUNA가 만들어 내는 달빛이 공연장을 채운다는 의미의 공식 응원봉명.</p></article>
<article class="bio-card reveal"><h3>VER.2 LIGHT MODES</h3><p>Night Purple, Amethyst Wave, Moon Silver, Star Glitter, Luna Orbit의 다섯 가지 라이트 모드.</p></article>
<article class="bio-card reveal"><h3>OFFICIAL COLORS</h3><p>Nightfall Black, Moonlit Amethyst, Starlight Silver. NIGHT의 어둠과 달빛, 무대의 반짝임을 상징한다.</p></article>
</div>
</section>`;
if(!page.contentHtml.includes(oldStart)) throw new Error('Fanclub light stick block target not found');
page.contentHtml=page.contentHtml.replace(oldStart,replacement);
const css=`
<style>
.lightstick-v2-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:48px;align-items:center}.lightstick-v2-grid img,.lightstick-evolution-image{width:100%;height:auto;display:block}.lightstick-v2-grid img{border:1px solid rgba(255,255,255,.1)}.lightstick-mode-list{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0}.lightstick-mode-list span{border:1px solid rgba(255,255,255,.14);padding:9px 11px;font-size:10px;letter-spacing:.1em}.lightstick-evolution-image{margin:18px 0 24px;border:1px solid rgba(255,255,255,.1)}.lightstick-version-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.lightstick-version-grid .bio-card{height:100%}@media(max-width:800px){.lightstick-v2-grid,.lightstick-version-grid{grid-template-columns:1fr}.lightstick-v2-grid{gap:28px}}
</style>`;
page.headHtml += css;
fs.writeFileSync(fanPath,JSON.stringify(page,null,2)+'\n');

const testPath='tests/store-medley.test.mjs';
let test=fs.readFileSync(testPath,'utf8');
test=test.replace("test('all 37 products and their full/thumbnail images survive catalog conversion',async()=>{\n  assert.equal(products.length,37);assert.equal(productList(products,'all').length,37);","test('all 38 products and their full/thumbnail images survive catalog conversion',async()=>{\n  assert.equal(products.length,38);assert.equal(productList(products,'all').length,38);");
fs.writeFileSync(testPath,test);

console.log('MOONLIGHT VER.1 / VER.2 integrated into STORE and FANCLUB.');
