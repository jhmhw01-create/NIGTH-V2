import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pageTree} from '../scripts/page-tree.mjs';
const walk=nodes=>nodes.flatMap(n=>typeof n==='string'?[]:[n,...walk(n.children)]);
test('Listen retains thirteen native players and neutral availability notice',async()=>{
  const page=JSON.parse(await readFile(new URL('../src/pages/listen.json',import.meta.url),'utf8'));
  const nodes=walk(pageTree(page.contentHtml));
  const players=nodes.filter(n=>n.tag==='audio');
  assert.equal(players.length,13);
  assert(players.every(n=>n.props.controls===true && n.props.preload==='metadata' && !n.props.autoPlay));
  const paths=nodes.filter(n=>n.tag==='source').map(n=>n.props.src);
  assert.equal(new Set(paths).size,13);
  assert(paths.includes('assets/audio/take-it-back.mp3'));
  assert(paths.includes('assets/audio/after-midnight.mp3'));
  const unavailable=nodes.find(n=>n.props.id==='black-night');
  assert.equal(walk(unavailable.children).filter(n=>n.tag==='audio').length,0);
  assert(page.contentHtml.includes('이 곡은 공식 사이트 내 스트리밍을 지원하지 않습니다.'));
});
