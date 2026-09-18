import fs from 'node:fs';

const edits={
  'tests/detail-navigation.test.mjs':[
    ['assert.equal(items.length,46);','assert.equal(items.length,47);']
  ],
  'tests/layout.test.mjs':[
    ["test('shared navigation has ten unique entries and one active item'","test('shared navigation has eleven unique entries and one active item'"],
    ['size,10);','size,11);'],
    ['.length,55);','.length,56);'],
    ['catalog.records.length,69);','catalog.records.length,70);'],
    ['new Set(catalog.records.map(x=>x.id)).size,69);','new Set(catalog.records.map(x=>x.id)).size,70);']
  ],
  'tests/search.test.mjs':[
    ["test('archive retains all 69 records and seven categories'","test('archive retains all 70 records and seven categories'"],
    ['catalog.records.length,69);','catalog.records.length,70);'],
    ['searchRecords(catalog,{}).length,69);','searchRecords(catalog,{}).length,70);']
  ],
  'tests/store-medley.test.mjs':[
    ["test('all 55 existing routes are covered exactly once by React'","test('all 56 existing routes are covered exactly once by React'"],
    ['reactRoutes.length,55);assert.equal(new Set(reactRoutes).size,55);','reactRoutes.length,56);assert.equal(new Set(reactRoutes).size,56);']
  ],
  'tests/subpage-fashion.test.mjs':[
    ['.length,46);','.length,47);']
  ]
};

for(const [path,replacements] of Object.entries(edits)){
  let text=fs.readFileSync(path,'utf8');
  for(const [from,to] of replacements){
    if(!text.includes(from)) throw new Error(`Missing test target in ${path}: ${from}`);
    text=text.replace(from,to);
  }
  fs.writeFileSync(path,text);
}
console.log('ABOUT NIGHT regression counts updated.');
