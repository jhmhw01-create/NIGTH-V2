import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync('src/react/StorePage.jsx','utf8');
const effect=source.split("  useEffect(()=>{\n    if(!overlay)return;")[1].split('\n  },[overlay]);')[0];
function setup(populated=false){
  const listeners=new Map(),frames=new Map();let frame=0,hidden=true,closed=false;
  const document={activeElement:null,body:{classList:{add(){},remove(){}}},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
  const control=id=>({id,isConnected:true,focus(){if(!hidden||id==='trigger')document.activeElement=this;}});
  const opener=control('trigger'),buttons=[control('close'),...(populated?[control('remove')]:[]),control('checkout')];document.activeElement=opener;
  const viewer={isConnected:true,querySelectorAll:()=>buttons,contains:element=>buttons.includes(element)};
  const cleanup=runInNewContext('(()=>{'+effect+'})()',{
    overlay:'cart',document,drawer:{current:viewer},modal:{current:null},setOverlay:()=>{closed=true;},getComputedStyle:()=>({visibility:hidden?'hidden':'visible'}),
    requestAnimationFrame:fn=>{frames.set(++frame,fn);return frame;},cancelAnimationFrame:id=>frames.delete(id)
  });
  const key=(shiftKey=false,key='Tab')=>{let prevented=false;listeners.get('keydown')({key,shiftKey,preventDefault(){prevented=true;}});return prevented;};
  return {document,buttons,opener,cleanup,key,listeners,frames,get closed(){return closed;},show(){hidden=false;const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn());}};
}
for(const populated of [false,true])test(`cart focus lifecycle with ${populated?'items':'empty cart'}`,()=>{
  const state=setup(populated);assert.equal(state.document.activeElement,state.opener);
  state.show();assert.equal(state.document.activeElement,state.buttons[0]);
  assert.equal(state.key(true),true);assert.equal(state.document.activeElement,state.buttons.at(-1));
  assert.equal(state.key(),true);assert.equal(state.document.activeElement,state.buttons[0]);
  state.document.activeElement=state.opener;state.listeners.get('focusin')();assert.equal(state.document.activeElement,state.buttons[0]);
  state.document.activeElement=state.opener;assert.equal(state.key(),true);assert.equal(state.document.activeElement,state.buttons[0]);
  state.key(false,'Escape');assert.equal(state.closed,true);state.cleanup();assert.equal(state.document.activeElement,state.opener);assert.equal(state.listeners.size,0);assert.equal(state.frames.size,0);
});
test('closing before drawer becomes visible cancels pending focus',()=>{const state=setup();state.cleanup();state.show();assert.equal(state.document.activeElement,state.opener);assert.equal(state.frames.size,0);});
