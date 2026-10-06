import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import {parseFragment} from 'parse5';
import {pageTree} from '../scripts/page-tree.mjs';
import {routeData,serializeRouteData} from '../scripts/route-data.mjs';

const page=JSON.parse(await readFile(new URL('../src/pages/listen.json',import.meta.url),'utf8'));
const walk=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...walk(node.children)]);
const render=node=>typeof node==='string'?node:createElement(node.tag,node.props,...node.children.map(render));
const data=routeData('listen.html',{trees:{'listen.html':pageTree(page.contentHtml)},navigation:{}});
const clientData=JSON.parse(serializeRouteData(data));

test('LISTEN iframe text survives the actual tree/data/React SSR/HTML parser round trip',()=>{
  // iframe is RAWTEXT: entities emitted by React SSR are not decoded by HTML parsing.
  // The former fallback anchor became a text string and therefore could not hydrate.
  const former=pageTree('<iframe><a href="https://suno.com/">Listen on Suno</a></iframe>')[0];
  const formerDom=parseFragment(renderToString(render(former))).childNodes[0];
  assert.notEqual(formerDom.childNodes[0].value,former.children[0]);

  assert.deepEqual(clientData,data);
  const frames=walk(clientData.nodes).filter(node=>node.tag==='iframe');
  assert.equal(frames.length,5);
  for(const frame of frames){
    const browserNode=parseFragment(renderToString(render(frame))).childNodes[0];
    assert.deepEqual(browserNode.childNodes.map(node=>node.value),frame.children);
    assert.deepEqual(frame.children,[]);
  }
});

test('LISTEN hydration fix preserves all five embed contracts and thirteen native players',()=>{
  const nodes=walk(clientData.nodes);
  const frames=nodes.filter(node=>node.tag==='iframe');
  const ids=['66cd3f9d-7855-465d-9ad7-de0e2b9a29ee','7b3f4935-2878-45b6-ab1e-0eaef110e8b9','4c66a613-c452-4a32-8b2b-49d8777a324d','20a75aa0-3bce-493f-ada4-fa08f928323c','643c4ca5-82b5-4262-b7ff-4264e6e45203'];
  const titles=['5MM','CINEMATIC','NEXT TIME','PARADISE','BLACK NIGHT'];
  frames.forEach(({props},index)=>{
    assert.equal(props.src,'https://suno.com/embed/'+ids[index]);
    assert.equal(props.title,titles[index]+' — Suno player');
    assert.equal(props.width,'100%');
    assert.equal(props.height,'240');
    assert.equal(props.frameBorder,'0');
    assert.equal(props.allow,'autoplay; encrypted-media; fullscreen');
    assert.equal(props.allowFullScreen,true);
    assert.equal(props.loading,'lazy');
    assert.equal(props.referrerPolicy,'no-referrer-when-downgrade');
  });
  const audio=nodes.filter(node=>node.tag==='audio');
  assert.equal(audio.length,13);
  assert.equal(frames.length+audio.length,18);
  for(const {props,children} of audio){
    assert.equal(props.controls,true);
    assert.equal(props.controlsList,'nodownload');
    assert.equal(props.preload,'metadata');
    assert.ok(props['aria-label']);
    assert.equal(children.find(node=>node.tag==='source').props.type,'audio/mpeg');
  }
});
