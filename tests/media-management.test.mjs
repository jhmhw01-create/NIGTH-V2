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
  assert.equal(audit.summary.knownDynamic,audit.dynamicReferences.known.length);
  assert.equal(audit.summary.dynamicReviewRequired,audit.dynamicReferences.unresolved.length);
  assert.equal(audit.summary.literalReferenceFound+audit.summary.knownDynamic+audit.summary.dynamicReviewRequired,audit.summary.images);
});

test('media policy keeps archival originals outside the deployed site',async()=>{
  const policy=await readFile(new URL('../maintenance/README.md',import.meta.url),'utf8');
  assert.match(policy,/public\/assets\/images/);
  assert.match(policy,/배포용/);
  assert.match(policy,/저장소 외부/);
  assert.match(policy,/얼굴·헤어/);
  assert.match(policy,/known-dynamic/);
  assert.match(policy,/unresolved/);
});
