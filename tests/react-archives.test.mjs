import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesContents,matchesNotice} from '../src/react/filters.mjs';
import {pageTree} from '../scripts/page-tree.mjs';
test('React archive filters combine category and year',()=>{
  assert(matchesContents({category:'luna'},'all'));
  assert(matchesContents({category:'luna'},'luna'));
  assert(!matchesContents({category:'luna'},'album'));
  const record={category:'event',year:'2027'};
  assert(matchesNotice(record,'event','2027'));
  assert(matchesNotice(record,'all','all'));
  assert(!matchesNotice(record,'music','2027'));
  assert(!matchesNotice(record,'event','2028'));
});
test('authored page conversion keeps links, text and boolean attributes',()=>{
  const [node]=pageTree('<a class="content-card" href="season-2027.html" hidden>2027 &amp; LUNA</a>');
  assert.equal(node.props.href,'season-2027.html');
  assert.equal(node.props.className,'content-card');
  assert.equal(node.props.hidden,true);
  assert.equal(node.children[0],'2027 & LUNA');
  assert.throws(()=>pageTree('<script>alert(1)</script>'));
  assert.throws(()=>pageTree('<a onclick="alert(1)">test</a>'));
});
test('authored iframe attributes use React property names',()=>{
  const [node]=pageTree('<iframe frameborder="0" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>');
  assert.equal(node.props.frameBorder,'0');
  assert.equal(node.props.allowFullScreen,true);
  assert.equal(node.props.referrerPolicy,'no-referrer-when-downgrade');
  assert.equal(node.props.frameborder,undefined);
  assert.equal(node.props.allowfullscreen,undefined);
  assert.equal(node.props.referrerpolicy,undefined);
});
