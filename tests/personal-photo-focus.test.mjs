import test from 'node:test';
import assert from 'node:assert/strict';
import {managePhotoFocus} from '../src/react/PersonalPhotoFocus.mjs';

function fixture(){
  const listeners=new Map();
  const doc={activeElement:null,addEventListener:(type,handler)=>listeners.set(type,handler),removeEventListener:(type,handler)=>{if(listeners.get(type)===handler)listeners.delete(type);}};
  const button=()=>({isConnected:true,focus(){doc.activeElement=this;}});
  const opener=button(),buttons=[button(),button(),button()];
  doc.activeElement=opener;
  const dialog={querySelectorAll:()=>buttons,contains:element=>buttons.includes(element)};
  const key=(key,shiftKey=false)=>{let prevented=false;listeners.get('keydown')?.({key,shiftKey,preventDefault(){prevented=true;}});return prevented;};
  return {doc,opener,buttons,dialog,key,listeners};
}

test('personal photo modal focuses its controls, wraps Tab both ways, and restores its opener',()=>{
  const f=fixture(),close=managePhotoFocus(f.dialog,f.doc);
  assert.equal(f.doc.activeElement,f.buttons[0]);
  assert.equal(f.key('Tab',true),true);assert.equal(f.doc.activeElement,f.buttons[2]);
  assert.equal(f.key('Tab'),true);assert.equal(f.doc.activeElement,f.buttons[0]);
  f.buttons[1].focus();assert.equal(f.key('Tab'),false);
  close();assert.equal(f.doc.activeElement,f.opener);assert.equal(f.listeners.size,0);
});

test('personal photo modal recovers escaped focus, skips disabled controls, and allows existing arrow/Escape handlers',()=>{
  const f=fixture();f.buttons[2].disabled=true;
  const close=managePhotoFocus(f.dialog,f.doc);
  f.opener.focus();assert.equal(f.key('Tab',true),true);assert.equal(f.doc.activeElement,f.buttons[1]);
  assert.equal(f.key('ArrowRight'),false);assert.equal(f.key('Escape'),false);
  f.opener.isConnected=false;close();assert.equal(f.listeners.size,0);
});
