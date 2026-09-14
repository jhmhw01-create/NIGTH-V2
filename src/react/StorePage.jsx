import {useEffect,useRef,useState} from 'react';
import {addCartItem,cartKey,money,productList,quantityValue,readCart,thumbPath} from './store.mjs';
const filters=[['all','ALL'],['featured','FEATURED'],['collectible','COLLECTIBLE'],['fashion','FASHION'],['travel','TRAVEL'],['tech','TECH & DESK']];
export function StorePage({products}){
  const [ready,setReady]=useState(false),[filter,setFilter]=useState('all'),[cart,setCart]=useState([]),[overlay,setOverlay]=useState(null);
  const [product,setProduct]=useState(null),[picture,setPicture]=useState(0),[option,setOption]=useState(''),[quantity,setQuantity]=useState(1),[toast,setToast]=useState('');
  const modal=useRef(null),drawer=useRef(null),timer=useRef(null);
  const notify=message=>{setToast(message);clearTimeout(timer.current);timer.current=setTimeout(()=>setToast(''),2600);};
  useEffect(()=>{
    try{setCart(readCart(window.localStorage.getItem(cartKey),products));}catch{notify('장바구니 저장을 사용할 수 없어 현재 페이지에서만 유지됩니다.');}
    setReady(true);return ()=>clearTimeout(timer.current);
  },[]);
  useEffect(()=>{
    if(!overlay)return;
    const opener=document.activeElement,viewer=overlay==='product'?modal.current:drawer.current;
    const controls=()=>[...viewer.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled)')];
    document.body.classList.add('store-overlay-open');controls()[0]?.focus();
    const keydown=event=>{
      if(event.key==='Escape'){event.preventDefault();setOverlay(null);}
      if(event.key==='Tab'){
        const buttons=controls(),first=buttons[0],last=buttons.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    };
    document.addEventListener('keydown',keydown);
    return ()=>{document.removeEventListener('keydown',keydown);document.body.classList.remove('store-overlay-open');opener?.focus();};
  },[overlay]);
  useEffect(()=>{if(overlay==='cart'&&!drawer.current.contains(document.activeElement))drawer.current.querySelector('#closeCart')?.focus();},[cart,overlay]);
  const openProduct=id=>{const selected=products.find(item=>item.id===id);setProduct(selected);setPicture(0);setOption(selected.options[0]);setQuantity(1);setOverlay('product');};
  const commitCart=next=>{setCart(next);try{window.localStorage.setItem(cartKey,JSON.stringify(next));return true;}catch{notify('장바구니 저장을 사용할 수 없어 현재 페이지에서만 유지됩니다.');return false;}};
  const add=()=>{if(!product)return;const saved=commitCart(addCartItem(cart,product,option,quantity));setOverlay(null);if(saved)notify(`${product.name} · CART에 담았습니다.`);};
  const list=productList(products,filter),count=cart.reduce((sum,item)=>sum+item.quantity,0),total=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  return <><main>
    <section className="store-head"><div className="container store-head-inner"><div><span>NIGHT OFFICIAL MERCHANDISE</span><h1>MD STORE</h1><p>COLLECT A PIECE OF THE NIGHT.</p></div><button className="store-cart-button" id="openCart" type="button" aria-label="장바구니 열기" disabled={!ready} onClick={()=>setOverlay('cart')}>CART <b id="cartCount">{count}</b></button></div></section>
    <section className="store-section section-tight"><div className="container"><div className="store-toolbar"><div aria-label="상품 카테고리" className="store-filters" role="group">{filters.map(([key,label])=><button key={key} className={'store-filter'+(key===filter?' is-active':'')} data-filter={key} type="button" disabled={!ready} aria-pressed={key===filter} onClick={()=>setFilter(key)}>{label}</button>)}</div><span className="store-product-count" id="productCount">{list.length} PRODUCTS</span></div><div className="store-grid" id="storeGrid" aria-live="polite">{list.map(item=><article key={item.id} className="store-card"><button type="button" data-product={item.id} aria-label={`${item.name} 상품 상세 보기`} disabled={!ready} onClick={()=>openProduct(item.id)}><span className="store-card-image"><img src={thumbPath(item.images[0])} alt={item.name} loading="lazy"/></span><span className="store-card-meta">{item.category.split(' ')[0].toUpperCase()}</span><h2>{item.name}</h2><strong>{money(item.price)}</strong><small>VIEW DETAILS →</small></button></article>)}</div></div></section>
    <section className="store-notice section-tight"><div className="container"><span>STORE INFORMATION</span><p>이 페이지는 NIGHT 프로젝트의 공식 MD 아카이브를 판매 페이지 형식으로 구성한 가상 스토어입니다. 표시된 가격과 장바구니 기능은 연출용이며 실제 구매 및 결제는 이루어지지 않습니다.</p></div></section>
  </main>
  <div ref={modal} className={'store-modal'+(overlay==='product'?' is-open':'')} id="productModal" aria-hidden={overlay!=='product'} role="dialog" aria-modal="true" aria-label="상품 상세 정보"><div className="store-modal-panel"><button className="store-modal-close" type="button" aria-label="상품 상세 닫기" onClick={()=>setOverlay(null)}>×</button><div className="store-detail-gallery"><img id="detailImage" src={overlay==='product'?product?.images[picture]:undefined} alt={product?.name??''}/><div className="store-detail-thumbs" id="detailThumbs">{product?.images.map((src,index)=><button key={src} type="button" className={index===picture?'is-active':''} data-image={src} aria-label={`상품 이미지 ${index+1} 보기`} onClick={()=>setPicture(index)}><img src={thumbPath(src)} alt=""/></button>)}</div></div><div className="store-detail-copy"><span id="detailCategory">{product?.category.split(' ')[0].toUpperCase()??''}</span><h2 id="detailName">{product?.name??''}</h2><strong id="detailPrice">{product?money(product.price):''}</strong><p id="detailDescription">{product?.desc??''}</p><div className="store-benefit" id="detailBenefit" hidden={!product?.benefit}>{product?.benefit??''}</div><label htmlFor="detailOption">OPTION</label><select id="detailOption" value={option} onChange={event=>setOption(event.target.value)}>{product?.options.map(value=><option key={value}>{value}</option>)}</select><label htmlFor="detailQuantity">QUANTITY</label><div className="store-quantity"><button id="quantityDown" type="button" aria-label="수량 줄이기" onClick={()=>setQuantity(value=>quantityValue(value-1))}>−</button><input id="detailQuantity" type="number" value={quantity} min="1" max="9" onChange={event=>setQuantity(quantityValue(event.target.value))}/><button id="quantityUp" type="button" aria-label="수량 늘리기" onClick={()=>setQuantity(value=>quantityValue(value+1))}>+</button></div><button className="store-add-button" id="addToCart" type="button" onClick={add}>ADD TO CART</button></div></div></div>
  <aside ref={drawer} className={'store-cart'+(overlay==='cart'?' is-open':'')} id="cartDrawer" aria-hidden={overlay!=='cart'} aria-label="장바구니" role="dialog" aria-modal="true"><div className="store-cart-head"><h2>YOUR CART</h2><button id="closeCart" type="button" aria-label="장바구니 닫기" onClick={()=>setOverlay(null)}>×</button></div><div className="store-cart-items" id="cartItems">{cart.length?cart.map((item,index)=><article key={item.id+':'+item.option} className="store-cart-item"><img src={thumbPath(item.image)} alt=""/><div><h3>{item.name}</h3><p>{item.option} · {item.quantity}EA</p><strong>{money(item.price*item.quantity)}</strong></div><button type="button" data-remove={index} aria-label={`${item.name} 장바구니에서 삭제`} onClick={()=>commitCart(cart.filter((_,row)=>row!==index))}>×</button></article>):<p className="store-cart-empty">YOUR CART IS EMPTY.</p>}</div><div className="store-cart-foot"><div><span>SUBTOTAL</span><strong id="cartTotal">{money(total)}</strong></div><button id="checkoutButton" type="button" onClick={()=>notify('가상 MD 스토어로 실제 구매 및 결제는 진행되지 않습니다.')}>CHECKOUT</button><small>실제 판매 및 결제가 이루어지지 않는 가상 스토어입니다.</small></div></aside><div className={'store-backdrop'+(overlay?' is-open':'')} id="storeBackdrop" onClick={()=>setOverlay(null)}></div><div className={'store-toast'+(toast?' is-open':'')} id="storeToast" role="status" aria-live="polite">{toast}</div>
  </>;
}
