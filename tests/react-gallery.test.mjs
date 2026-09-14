import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesPhoto,nextPhotoIndex} from '../src/react/filters.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
test('gallery multi-category filtering and lightbox wraparound',()=>{
  assert(matchesPhoto('campaign group','all'));
  assert(matchesPhoto('campaign group','campaign'));
  assert(matchesPhoto('campaign doha jiwoo','jiwoo'));
  assert(!matchesPhoto('campaign doha jiwoo','ihwan'));
  assert.equal(nextPhotoIndex(0,-1,5),4);
  assert.equal(nextPhotoIndex(4,1,5),0);
  assert.equal(nextPhotoIndex(0,1,0),-1);
});
test('fanclub colors and image sizing survive React style conversion',()=>{
  const [node]=pageTree('<div style="background:#7A5CFF;object-fit:contain"></div>');
  assert.deepEqual(node.props.style,{background:'#7A5CFF',objectFit:'contain'});
});
