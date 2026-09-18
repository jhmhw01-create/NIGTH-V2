import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditMedia} from '../scripts/audit-media.mjs';

test('media delivery files match the source-management manifests',async()=>{
  const result=await auditMedia();
  assert.ok(result.media>0);
  assert.ok(result.images>0);
  assert.equal(result.conversions,71);
  assert.ok(result.knownDynamic>=0);
  assert.ok(result.unresolved>=0);
});

test('image audit separates known dynamic references from unresolved review candidates',async()=>{
  const audit=JSON.parse(await readFile(new URL('../maintenance/image-audit.json',import.meta.url),'utf8'));
  assert.equal(audit.schemaVersion,3);
  assert.ok(Array.isArray(audit.dynamicReferences.known));
  assert.ok(Array.isArray(audit.dynamicReferences.unresolved));
  assert.ok(audit.dynamicReferences.unresolvedGroups&&typeof audit.dynamicReferences.unresolvedGroups==='object');
  assert.equal(audit.summary.knownDynamic,audit.dynamicReferences.known.length);
  assert.equal(audit.summary.dynamicReviewRequired,audit.dynamicReferences.unresolved.length);
  assert.equal(audit.summary.literalReferenceFound+audit.summary.knownDynamic+audit.summary.dynamicReviewRequired,audit.summary.images);
});

test('MD store generated full and thumbnail images are classified as known dynamic',async()=>{
  const audit=JSON.parse(await readFile(new URL('../maintenance/image-audit.json',import.meta.url),'utf8'));
  const reasons=new Map(audit.dynamicReferences.known.map(item=>[item.path,item.reason]));
  assert.equal(reasons.get('assets/images/md/full/NIGHT 쿠션.webp'),'md-store-generator');
  assert.equal(reasons.get('assets/images/md/thumbs/NIGHT 쿠션.webp'),'md-store-thumbnail-generator');
});

test('HTML-escaped ampersands still count as literal media references',async()=>{
  const audit=JSON.parse(await readFile(new URL('../maintenance/image-audit.json',import.meta.url),'utf8'));
  assert.ok(!audit.dynamicReferences.unresolved.includes('assets/images/night-off-summer/NIGHT OFF SUMMER-DAY 1-TAEHOON&WOOHYUN.webp'));
  assert.ok(!Object.hasOwn(audit.dynamicReferences.unresolvedGroups,'night-off-summer'));
  assert.equal(audit.summary.dynamicReviewRequired,19);
});

test('reviewed unused-media candidates exactly match current unresolved media',async()=>{
  const audit=JSON.parse(await readFile(new URL('../maintenance/image-audit.json',import.meta.url),'utf8'));
  const candidates=JSON.parse(await readFile(new URL('../maintenance/unused-media-candidates.json',import.meta.url),'utf8'));
  const listed=Object.values(candidates.groups).flatMap(group=>group.paths).sort();
  const unresolved=[...audit.dynamicReferences.unresolved].sort();
  assert.deepEqual(listed,unresolved);
  assert.equal(listed.length,19);
});

test('media policy keeps archival originals outside the deployed site',async()=>{
  const policy=await readFile(new URL('../maintenance/README.md',import.meta.url),'utf8');
  assert.match(policy,/public\/assets\/images/);
  assert.match(policy,/배포용/);
  assert.match(policy,/저장소 외부/);
  assert.match(policy,/얼굴·헤어/);
  assert.match(policy,/known-dynamic/);
  assert.match(policy,/unresolved/);
  assert.match(policy,/mdPath/);
});
