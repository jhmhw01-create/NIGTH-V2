import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const readJson=async path=>JSON.parse(await readFile(new URL(path,import.meta.url),'utf8'));

test('legacy CSS/JS audit has a complete partition',async()=>{
  const audit=await readJson('../maintenance/legacy-asset-audit.json');
  assert.equal(audit.schemaVersion,1);
  assert.equal(audit.summary.assets,audit.summary.css+audit.summary.js);
  assert.equal(audit.summary.assets,audit.summary.runtime+audit.summary.buildInput+audit.summary.unresolved);
  assert.equal(audit.groups.runtime.length,audit.summary.runtime);
  assert.equal(audit.groups.buildInput.length,audit.summary.buildInput);
  assert.equal(audit.groups.unresolved.length,audit.summary.unresolved);
});

test('all deployed CSS is runtime-referenced and no public legacy JS is runtime-loaded',async()=>{
  const audit=await readJson('../maintenance/legacy-asset-audit.json');
  const records=audit.records;
  assert.equal(records.filter(item=>item.type==='css'&&item.status!=='runtime').length,0);
  assert.equal(records.filter(item=>item.type==='js'&&item.status==='runtime').length,0);
});

test('reviewed unused legacy candidates exactly match unresolved assets',async()=>{
  const audit=await readJson('../maintenance/legacy-asset-audit.json');
  const candidates=await readJson('../maintenance/unused-legacy-assets.json');
  assert.deepEqual([...audit.groups.unresolved].sort(),[...candidates.paths].sort());
  assert.ok(candidates.paths.every(path=>path.endsWith('.js')));
});

test('known build-only legacy data sources remain protected',async()=>{
  const audit=await readJson('../maintenance/legacy-asset-audit.json');
  assert.deepEqual(audit.groups.buildInput,[
    'assets/js/md-store.js',
    'assets/js/night-collections-data.js'
  ]);
});
