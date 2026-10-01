import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as parse5 from 'parse5';

const pages=path.resolve('src/pages');
const walk=(node,visit)=>{visit(node);for(const child of node.childNodes||[])walk(child,visit);};
const attributes=node=>Object.fromEntries((node.attrs||[]).map(attribute=>[attribute.name,attribute.value]));

test('authored page images and embedded media keep accessible text alternatives',()=>{
  const issues=[];
  for(const file of fs.readdirSync(pages).filter(name=>name.endsWith('.json'))){
    const page=JSON.parse(fs.readFileSync(path.join(pages,file),'utf8'));
    const document=parse5.parseFragment(page.contentHtml||'');
    walk(document,node=>{
      const attrs=attributes(node);
      if(node.tagName==='img'&&!Object.hasOwn(attrs,'alt'))issues.push(`${file}: image ${attrs.src||'(no source)'}`);
      if(node.tagName==='iframe'&&!attrs.title)issues.push(`${file}: iframe ${attrs.src||'(no source)'}`);
      if(attrs.tabindex&&Number(attrs.tabindex)>0)issues.push(`${file}: positive tabindex ${attrs.tabindex}`);
    });
  }
  assert.deepEqual(issues,[]);
});

test('shared shell keeps skip navigation and modal mobile-menu behavior',()=>{
  const app=fs.readFileSync('src/react/App.jsx','utf8');
  const home=fs.readFileSync('src/react/HomePage.jsx','utf8');
  const layout=fs.readFileSync('src/react/Layout.jsx','utf8');
  assert.match(app,/className="skip-link" href="#night-main-content"/);
  assert.match(home,/return <main>/);
  assert.match(layout,/aria-expanded=\{open\}/);
  assert.match(layout,/element\.inert=true/);
  assert.match(layout,/event\.key\s*===\s*'Escape'/);
  assert.match(layout,/event\.key!=='Tab'/);
});
