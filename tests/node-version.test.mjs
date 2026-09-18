import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');

test('local, package and CI Node versions stay aligned on Node 22',async()=>{
  const [nvmrc,nodeVersion,packageText,workflow]=await Promise.all([
    read('.nvmrc'),
    read('.node-version'),
    read('package.json'),
    read('.github/workflows/deploy-pages.yml')
  ]);
  const pkg=JSON.parse(packageText);
  assert.equal(nvmrc.trim(),'22');
  assert.equal(nodeVersion.trim(),'22');
  assert.equal(pkg.engines.node,'>=22 <23');
  assert.match(workflow,/node-version-file:\s*['"]?\.nvmrc['"]?/);
  assert.doesNotMatch(workflow,/node-version:\s*['"]?\d+/);
});
