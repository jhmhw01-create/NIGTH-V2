import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
export function parseStoreProducts(source){
  const end=source.indexOf('\nconst grid = ');
  if(end<0)throw Error('Missing MD product data boundary');
  // Evaluate only the original static catalog, not its DOM/storage event code.
  const products=JSON.parse(runInNewContext(source.slice(0,end)+'\nJSON.stringify(mdProducts)',{}, {timeout:100}));
  if(!Array.isArray(products)||!products.length)throw Error('Missing MD products');
  for(const product of products)if(!product.id||!product.name||!product.category||!Number.isSafeInteger(product.price)||product.price<0||!product.images?.length||!product.options?.length)throw Error('Invalid MD product');
  if(new Set(products.map(product=>product.id)).size!==products.length)throw Error('Duplicate MD products');
  return products;
}
export async function readStoreProducts(root){return parseStoreProducts(await readFile(new URL('public/assets/js/md-store.js',root),'utf8'));}
