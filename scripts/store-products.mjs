import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
export function parseStoreProducts(source){
  const end=source.indexOf('\nconst grid = ');
  if(end<0)throw Error('Missing MD product data boundary');
  // Evaluate only the original static catalog, not its DOM/storage event code.
  const products=JSON.parse(runInNewContext(source.slice(0,end)+'\nJSON.stringify(mdProducts)',{}, {timeout:100}));
  if(!products.some(product=>product.id==='moonlight-light-stick')){
    products.unshift({
      id:'moonlight-light-stick',
      name:'MOONLIGHT',
      category:'featured collectible',
      price:49000,
      images:['assets/images/night-luna.png'],
      options:['ONE SIZE'],
      desc:'NIGHT와 LUNA의 밤을 밝히는 공식 응원봉 MOONLIGHT. 투명한 구형 헤드 안의 초승달과 별, 보랏빛 광원이 NIGHT의 밤하늘 아이덴티티를 표현한다.'
    });
  }
  if(!Array.isArray(products)||!products.length)throw Error('Missing MD products');
  for(const product of products)if(!product.id||!product.name||!product.category||!Number.isSafeInteger(product.price)||product.price<0||!product.images?.length||!product.options?.length)throw Error('Invalid MD product');
  if(new Set(products.map(product=>product.id)).size!==products.length)throw Error('Duplicate MD products');
  return products;
}
export async function readStoreProducts(root){return parseStoreProducts(await readFile(new URL('public/assets/js/md-store.js',root),'utf8'));}
