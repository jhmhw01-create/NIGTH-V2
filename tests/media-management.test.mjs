import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditMedia} from '../scripts/audit-media.mjs';

test('media delivery files match the source-management manifests',async()=>{
  const result=await auditMedia();
  assert.ok(result.media>0);
  assert.ok(result.images>0);
  assert.equal(result.conversions,72);
});

test('media policy keeps archival originals outside the deployed site',async()=>{
  const policy=await readFile(new URL('../maintenance/README.md',import.meta.url),'utf8');
  assert.match(policy,/public\/assets\/images/);
  assert.match(policy,/배포용/);
  assert.match(policy,/저장소 외부/);
  assert.match(policy,/얼굴·헤어/);
});
