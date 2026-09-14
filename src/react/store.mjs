export const cartKey='nightMdCart';
export const money=value=>`₩${value.toLocaleString('ko-KR')}`;
export const thumbPath=path=>path.replace('/full/','/thumbs/');
export const quantityValue=value=>Math.max(1,Math.min(9,Math.floor(Number(value)||1)));
export function productList(products,filter){return filter==='all'?products:products.filter(product=>product.category.split(' ').includes(filter));}
export function readCart(raw,products){
  let rows;try{rows=JSON.parse(raw||'[]');}catch{return [];}
  if(!Array.isArray(rows))return [];
  const cart=[];
  for(const row of rows){
    if(!row||typeof row!=='object')continue;
    const product=products.find(item=>item.id===row.id);
    if(!product||!product.options.includes(row.option)||!Number.isSafeInteger(row.quantity)||row.quantity<1)continue;
    const item={id:product.id,name:product.name,option:row.option,quantity:row.quantity,price:product.price,image:product.images[0]};
    const previous=cart.find(entry=>entry.id===item.id&&entry.option===item.option);
    if(previous){if(Number.isSafeInteger(previous.quantity+item.quantity))previous.quantity+=item.quantity;}else cart.push(item);
  }
  return cart;
}
export function addCartItem(cart,product,option,quantity){
  if(!product.options.includes(option))return cart;
  const amount=quantityValue(quantity),found=cart.some(item=>item.id===product.id&&item.option===option);
  return found?cart.map(item=>item.id===product.id&&item.option===option?{...item,quantity:item.quantity+amount}:item):[...cart,{id:product.id,name:product.name,option,quantity:amount,price:product.price,image:product.images[0]}];
}
