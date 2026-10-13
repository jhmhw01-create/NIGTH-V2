import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {parseFragment} from 'parse5';
import {pageTree} from '../scripts/page-tree.mjs';
import {syncHubPage} from '../scripts/hub-sync.mjs';
import {reactRoutes} from '../src/react/routes.mjs';
import {readImageDimensions} from '../scripts/image-dimensions.mjs';
const root=new URL('../',import.meta.url);
const members={doha:['193cm / 90kg','doha-play-on.html'],woohyun:['186cm / 74kg','woohyun-night-off.html'],jiwoo:['190cm / 83kg','jiwoo-acting.html'],ihwan:['179cm / 69kg','ihwan-musical.html'],taehoon:['188cm / 78kg','taehoon-camera-on-off.html']};
const nodes=(node)=>[node,...(node.childNodes||[]).flatMap(nodes)];
const attrs=node=>Object.fromEntries((node.attrs||[]).map(a=>[a.name,a.value]));
const dimensions=await readImageDimensions(new URL('public/',root).pathname);
for(const [member,[body,schedule]] of Object.entries(members))test(`${member} physical profile retains canonical profile and matched original images`,async()=>{
 const page=JSON.parse(await readFile(new URL(`src/pages/member-${member}.json`,root),'utf8'));
 assert.ok(reactRoutes.includes(page.route));assert.ok(page.contentHtml.includes(body));
 assert.ok(syncHubPage({...page}).contentHtml.includes(schedule));
 const dom=nodes(parseFragment(page.contentHtml));const section=dom.find(n=>attrs(n)['aria-labelledby']==='physical-profile');assert.ok(section);
 const cards=nodes(section).filter(n=>attrs(n).class==='member-physical-photo');assert.equal(cards.length,2);
 for(const [index,kind] of ['full-body','analysis-chart'].entries()){
  const card=cards[index],image=nodes(card).find(n=>n.tagName==='img'),properties=attrs(image),path=`assets/images/NIGHT_PHYSICAL_PROFILE/${member}-physical-profile-${kind}.webp`;
  assert.equal(card.tagName,'button');assert.equal(attrs(card).type,'button');assert.equal(attrs(card)['data-full'],path);assert.equal(properties.src,path);assert.equal(properties.loading,'lazy');assert.ok(properties.alt.startsWith(member.toUpperCase()));
  await access(new URL('public/'+path,root));assert.equal(Number(properties.width),dimensions[path].width);assert.equal(Number(properties.height),dimensions[path].height);
 }
 const tree=pageTree(page.contentHtml,dimensions);const walk=n=>typeof n==='string'?[]:[n,...n.children.flatMap(walk)];const triggers=tree.flatMap(walk).filter(n=>n.props.className==='member-physical-photo');assert.equal(triggers.length,2);assert.ok(triggers.every(n=>n.tag==='button'&&n.props['data-full']));
});
test('physical dialog retains native modal and uncropped responsive/original-size views',async()=>{
 const dialog=await readFile(new URL('src/react/CollectionPhotoDialog.jsx',root),'utf8'),css=await readFile(new URL('public/assets/css/member-physical-profile.css',root),'utf8');
 assert.match(dialog,/showModal\(\)/);assert.match(dialog,/event\.key==='Escape'/);assert.match(dialog,/opener\?\.focus\(\)/);assert.match(dialog,/aria-pressed=\{originalSize\}/);assert.match(css,/\.member-physical-photo img\{[^}]*height:auto;object-fit:contain/);assert.match(css,/\.is-original img\{max-width:none;max-height:none\}/);assert.match(css,/@media\(max-width:720px\).*grid-template-columns:1fr/);
});
