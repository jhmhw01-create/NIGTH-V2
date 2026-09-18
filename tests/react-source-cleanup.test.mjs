import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {reactRoutes} from '../src/react/routes.mjs';

const root=new URL('../',import.meta.url);

test('React routes do not keep dead afterFooterHtml scripts',async()=>{
  for(const route of reactRoutes){
    const page=JSON.parse(await readFile(new URL(`src/pages/${route.replace('.html','.json')}`,root),'utf8'));
    assert.equal((page.afterFooterHtml??'').trim(),'','Expected '+route+' afterFooterHtml to be empty');
  }
});
