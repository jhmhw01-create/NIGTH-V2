import fs from 'node:fs';

function readJson(path){return JSON.parse(fs.readFileSync(path,'utf8'));}
function writeJson(path,data){fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');}
function replaceRequired(text,from,to,label){
  if(!text.includes(from)) throw new Error(`Missing target: ${label}`);
  return text.replace(from,to);
}

// 1) TAEHOON: keep private growth detail out of the public profile, restore the approved DESIRE section label.
{
  const path='src/pages/member-taehoon.json';
  const page=readJson(path);
  if(page.contentHtml.includes('옆집 누나')) throw new Error('Private TAEHOON setting is still exposed');
  page.contentHtml=replaceRequired(page.contentHtml,'<div class="section-label reveal">DRIVE</div>','<div class="section-label reveal">DESIRE</div>','TAEHOON DRIVE label');
  page.contentHtml=replaceRequired(page.contentHtml,'<h2>Drive</h2>','<h2>Desire</h2>','TAEHOON Drive heading');
  writeJson(path,page);
}

// 2) Search archive: keep the TAEHOON record synchronized with the public profile.
{
  const path='src/data/archive.json';
  const archive=readJson(path);
  const record=archive.records.find(item=>item.id==='member-taehun' || item.href==='member-taehoon.html');
  if(!record) throw new Error('TAEHOON archive record not found');
  if(record.keywords) record.keywords=record.keywords.replace(/\bDRIVE\b/g,'DESIRE');
  if(record.searchText) record.searchText=record.searchText.replace(/\bDRIVE\b/g,'DESIRE').replace(/\bDrive\b/g,'Desire');
  writeJson(path,archive);
}

// 3) HOME source: remove unused PHANTOM mood-teaser CSS only; keep the active anniversary/comeback styles.
{
  const path='src/pages/index.json';
  const page=readJson(path);
  const removeRules=[
    '/* PHANTOM 08.26 mood teaser inline */\n',
    '.phantom-mood-teaser-home{position:relative;overflow:hidden}\n',
    '.phantom-mood-teaser-grid{display:grid;grid-template-columns:minmax(280px,.78fr) minmax(0,1.22fr);gap:46px;align-items:center}\n',
    '.phantom-mood-poster{max-width:470px;border:1px solid rgba(184,168,255,.18);background:#05050b;overflow:hidden}\n',
    '.phantom-mood-poster a{display:block}\n',
    '.phantom-mood-poster img{display:block;width:100%;height:auto;filter:saturate(.92) brightness(.96);transition:transform .35s ease,filter .35s ease}\n',
    '.phantom-mood-poster:hover img{transform:scale(1.01);filter:saturate(1) brightness(1)}\n',
    '.phantom-mood-copy{max-width:620px}\n',
    '.phantom-mood-tagline{margin:8px 0 18px;color:#d9d2ee;font-family:Georgia,"Times New Roman",serif;font-size:15px;font-style:italic;letter-spacing:.02em}\n',
    '.phantom-mood-desc{margin:0 0 24px;color:var(--muted);font-size:12px;line-height:1.85}\n'
  ];
  for(const rule of removeRules){
    if(!page.headHtml.includes(rule)) throw new Error('Missing HOME obsolete PHANTOM mood CSS rule: '+rule.slice(0,45));
    page.headHtml=page.headHtml.replace(rule,'');
  }
  const oldMedia='@media(max-width:860px){.phantom-mood-teaser-grid,.phantom-comeback-grid{grid-template-columns:1fr}.phantom-mood-poster{max-width:520px}.phantom-scheduler-card{justify-self:start;max-width:520px}}';
  const newMedia='@media(max-width:860px){.phantom-comeback-grid{grid-template-columns:1fr}.phantom-scheduler-card{justify-self:start;max-width:520px}}';
  page.headHtml=replaceRequired(page.headHtml,oldMedia,newMedia,'HOME responsive PHANTOM mood CSS');
  if(page.headHtml.includes('phantom-mood-')) throw new Error('Unused phantom-mood CSS remains');
  writeJson(path,page);
}

// 4) HOME About: declared intrinsic size should match the actual 512×341 WebP currently deployed.
{
  const path='src/react/HomePage.jsx';
  let text=fs.readFileSync(path,'utf8');
  const old='src={"assets/images/home-about-night.webp"} width={"1536"} height={"1024"}';
  const next='src={"assets/images/home-about-night.webp"} width={"512"} height={"341"}';
  text=replaceRequired(text,old,next,'HOME About intrinsic dimensions');
  fs.writeFileSync(path,text);
}
