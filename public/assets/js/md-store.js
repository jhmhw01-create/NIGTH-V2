const mdPath = (name) => `assets/images/md/full/${name}.webp`;
const members = ['DOHA', 'WOOHYUN', 'JIWOO', 'IHWAN', 'TAEHOON'];
const allOption = ['ONE SIZE'];

const mdProducts = [
  {id:'moonlight-lamp',name:'MOONLIGHT Mood Lamp',category:'featured',price:49000,images:[mdPath('응원봉 무드등'),mdPath('무드등 구매 특전 멤버 손글씨카드')],options:allOption,benefit:'멤버 손글씨 카드 1종 랜덤 증정',desc:'MOONLIGHT 응원봉의 보랏빛을 일상 공간에서 즐기는 무드등.'},
  {id:'night-cushion',name:'NIGHT Character Cushion',category:'featured',price:39000,images:[mdPath('NIGHT 쿠션')],options:members,desc:'NIGHT 멤버 비주얼을 담은 포근한 캐릭터 쿠션.'},
  {id:'charging-mat',name:'Desk Mat + Wireless Charger',category:'featured tech',price:45000,images:[mdPath('데스크매트+무선충전')],options:allOption,desc:'데스크매트와 무선 충전 기능을 결합한 NIGHT 데스크 아이템.'},
  {id:'plush-keyring',name:'Plush Doll Keyring',category:'featured collectible',price:22000,images:[mdPath('봉제인형 키링')],options:members,desc:'가방에 달 수 있는 멤버별 미니 봉제인형 키링.'},
  {id:'character-plush',name:'NIGHT Character Plush',category:'featured collectible',price:42000,images:[mdPath('캐릭터 봉제인형 버전')],options:members,desc:'NIGHT 멤버의 특징을 담은 공식 캐릭터 봉제인형.'},
  {id:'sticker-set',name:'NIGHT Sticker Set',category:'collectible',price:12000,images:[mdPath('스티커/스티커'),mdPath('스티커/스티커1'),mdPath('스티커/스티커-도하'),mdPath('스티커/스티커-우현'),mdPath('스티커/스티커-지우'),mdPath('스티커/스티커-이환'),mdPath('스티커/스티커-태훈')],options:['GROUP SET',...members],desc:'그룹 버전과 멤버별 디자인으로 구성된 데코레이션 스티커.'},
  {id:'chibi-sticker',name:'Chibi Sticker Set',category:'collectible',price:12000,images:[mdPath('스티커/치비스티커'),mdPath('스티커/치비스티커-도하'),mdPath('스티커/치비스티커-우현'),mdPath('스티커/치비스티커-지우'),mdPath('스티커/치비스티커-이환'),mdPath('스티커/치비스티커-태훈')],options:['GROUP SET',...members],desc:'작고 귀여운 NIGHT 캐릭터를 담은 멤버별 치비 스티커.'},
  {id:'coloring-postcard',name:'Coloring Postcard Set',category:'collectible',price:15000,images:[mdPath('컬러링 엽서/컬러링 엽서-도하'),mdPath('컬러링 엽서/컬러링 엽서-도하-색칠 버전'),mdPath('컬러링 엽서/컬러링 엽서-우현'),mdPath('컬러링 엽서/컬러링 엽서-우현-색칠 버전'),mdPath('컬러링 엽서/컬러링 엽서-지우'),mdPath('컬러링 엽서/컬러링 엽서-지우-색칠버전'),mdPath('컬러링 엽서/컬러링 엽서-이환'),mdPath('컬러링 엽서/컬러링 엽서-이환-색칠버전'),mdPath('컬러링 엽서/컬러링 엽서-태훈'),mdPath('컬러링 엽서/컬러링 엽서-태훈-색칠버전')],options:members,desc:'직접 색칠할 수 있는 멤버별 컬러링 엽서와 완성 예시.'},
  {id:'mini-standee',name:'Mini Standee Set',category:'collectible',price:18000,images:[mdPath('미니등신대')],options:['5 MEMBER SET'],desc:'책상 위에 세워 두는 NIGHT 미니 등신대 세트.'},
  {id:'squishy-ball',name:'NIGHT Squishy Ball',category:'collectible',price:15000,images:[mdPath('스쿼시볼'),mdPath('스쿼시볼1')],options:members,desc:'누르고 늘리며 즐기는 말랑한 멤버별 스쿼시볼.'},
  {id:'acrylic-stand',name:'Acrylic Stand',category:'collectible',price:20000,images:[mdPath('아크릴 스탠드')],options:members,desc:'NIGHT 멤버별 비주얼을 담은 아크릴 스탠드.'},
  {id:'acrylic-keyring',name:'Acrylic Keyring',category:'collectible',price:13000,images:[mdPath('아크릴 키링')],options:members,desc:'멤버별 디자인의 투명 아크릴 키링.'},
  {id:'smart-tok',name:'Smart Tok Set',category:'collectible tech',price:18000,images:[mdPath('스마트톡 셋트')],options:['5 MEMBER SET'],desc:'휴대폰에 부착하는 NIGHT 멤버별 스마트톡 세트.'},
  {id:'pin-badge',name:'Pin Badge Set',category:'collectible',price:20000,images:[mdPath('핀 뱃지 셋트')],options:['5 MEMBER SET'],desc:'가방과 파우치에 포인트를 더하는 NIGHT 핀 배지 세트.'},
  {id:'face-towel',name:'Member Face Towel',category:'fashion',price:25000,images:[mdPath('도하 페이스타월'),mdPath('우현 페이스타월'),mdPath('지우 페이스타월'),mdPath('이환 페이스타월'),mdPath('태훈 페이스타월')],options:members,desc:'공연장에서 존재감을 확실하게 보여주는 멤버별 페이스타월.'},
  {id:'ball-cap',name:'NIGHT Ball Cap',category:'fashion',price:35000,images:[mdPath('모자'),mdPath('모자 특전 포카')],options:['BLACK / FREE'],benefit:'구매 특전 포토카드 1종 증정',desc:'NIGHT 로고 디테일을 담은 데일리 볼캡.'},
  {id:'pajama',name:'NIGHT Pajama Set',category:'featured fashion',price:69000,images:[mdPath('잠옷'),mdPath('잠옷 특전 포카')],options:['M','L','XL'],benefit:'구매 특전 포토카드 1종 증정',desc:'편안한 소재와 NIGHT 모티프를 적용한 홈웨어 세트.'},
  {id:'socks',name:'NIGHT Socks Set',category:'fashion',price:15000,images:[mdPath('양말')],options:['M','L'],desc:'NIGHT 컬러를 활용한 데일리 양말 세트.'},
  {id:'sleep-mask',name:'NIGHT Sleep Mask',category:'fashion',price:24000,images:[mdPath('수면안대'),mdPath('수면안대 특전 포카')],options:allOption,benefit:'구매 특전 포토카드 1종 증정',desc:'밤의 휴식을 위한 부드러운 NIGHT 수면안대.'},
  {id:'wash-band',name:'Character Wash Band',category:'fashion',price:19000,images:[mdPath('세안밴드')],options:members,desc:'멤버별 캐릭터 포인트를 더한 세안용 헤어밴드.'},
  {id:'pouch',name:'NIGHT Multi Pouch',category:'fashion travel',price:24000,images:[mdPath('파우치')],options:allOption,desc:'여행과 일상에서 활용하기 좋은 NIGHT 멀티 파우치.'},
  {id:'luggage-tag',name:'NIGHT Luggage Tag',category:'travel',price:16000,images:[mdPath('러기지 택')],options:allOption,desc:'캐리어에 NIGHT의 흔적을 남기는 NIGHT 러기지 태그.'},
  {id:'mini-fan',name:'Portable Mini Fan',category:'travel tech',price:29000,images:[mdPath('미니선풍기')],options:allOption,desc:'공연 대기와 여름 외출에 활용하는 휴대용 미니선풍기.'},
  {id:'hand-fan',name:'Member Hand Fan',category:'travel',price:9000,images:[mdPath('부채')],options:members,desc:'공연장과 여름 외출에 가볍게 챙기는 멤버별 휴대용 부채.'},
  {id:'lunch-set',name:'Thermal Lunch Box Set',category:'travel',price:46000,images:[mdPath('보온도시락+수저세트'),mdPath('보온도시락+수저세트 특전 포카')],options:allOption,benefit:'구매 특전 포토카드 1종 증정',desc:'보온 도시락과 전용 수저로 구성된 NIGHT 런치 세트.'},
  {id:'umbrella-raincoat',name:'Umbrella + Raincoat Set',category:'featured travel',price:59000,images:[mdPath('양우산+우비'),mdPath('양우산 구매 특전 포카'),mdPath('우비 구매 특전 포카')],options:['BLACK / FREE'],benefit:'양우산·우비 구매 특전 포토카드 각 1종 증정',desc:'비 오는 밤을 위한 양우산과 우비 구성의 트래블 세트.'},
  {id:'passport-case',name:'NIGHT Passport Case',category:'travel',price:23000,images:[mdPath('여권케이스')],options:allOption,desc:'여권과 탑승권을 정리하는 NIGHT 트래블 케이스.'},
  {id:'carrier-cover',name:'NIGHT Carrier Cover',category:'travel',price:39000,images:[mdPath('캐리어커버')],options:['20 INCH','24 INCH','28 INCH'],desc:'여행 캐리어를 보호하는 NIGHT 그래픽 커버.'},
  {id:'tumbler',name:'NIGHT Tumbler',category:'travel',price:34000,images:[mdPath('텀블러'),mdPath('텀블러 구매 특전 포카')],options:allOption,benefit:'구매 특전 포토카드 1종 증정',desc:'일상과 여행에 함께하는 보온·보냉 텀블러.'},
  {id:'toothbrush-sterilizer',name:'Portable Toothbrush Sterilizer',category:'travel tech',price:32000,images:[mdPath('휴대용 칫솔 살균기')],options:allOption,desc:'출장과 여행에 유용한 휴대용 칫솔 살균기.'},
  {id:'earbuds-case',name:'Earbuds Case',category:'tech',price:22000,images:[mdPath('버즈, 에어팟 케이스')],options:['AIRPODS','BUDS'],desc:'NIGHT 심볼을 담은 무선 이어폰 보호 케이스.'},
  {id:'mug',name:'NIGHT Mug',category:'tech',price:26000,images:[mdPath('머그컵'),mdPath('머그컵 특전 포카')],options:allOption,benefit:'구매 특전 포토카드 1종 증정',desc:'보랏빛 밤을 담은 NIGHT 세라믹 머그.'},
  {id:'phone-case',name:'NIGHT Phone Case',category:'tech',price:29000,images:[mdPath('폰케이스'),mdPath('폰케이스 특전 포카')],options:['iPHONE','GALAXY'],benefit:'구매 특전 포토카드 1종 증정',desc:'NIGHT 그래픽을 적용한 투명 하드 폰케이스.'},
  {id:'collect-book',name:'Photocard Collect Book',category:'collectible tech',price:28000,images:[mdPath('콜렉트북'),mdPath('콜렉트북 특전 포카')],options:allOption,benefit:'구매 특전 포토카드 1종 증정',desc:'NIGHT 포토카드를 보관하는 전용 콜렉트북.'},
  {id:'ticket-holder',name:'Ticket Holder',category:'tech',price:16000,images:[mdPath('티켓홀더')],options:allOption,desc:'공연 티켓과 추억을 함께 보관하는 NIGHT 티켓홀더.'},
  {id:'file-holder',name:'File Holder Set',category:'tech',price:12000,images:[mdPath('파일홀더')],options:['5 MEMBER SET'],desc:'멤버별 비주얼로 구성된 A4 파일홀더 세트.'}
];

const grid = document.querySelector('#storeGrid');
const filters = [...document.querySelectorAll('.store-filter')];
const productCount = document.querySelector('#productCount');
const modal = document.querySelector('#productModal');
const backdrop = document.querySelector('#storeBackdrop');
const drawer = document.querySelector('#cartDrawer');
let activeProduct = null;
let cart = JSON.parse(localStorage.getItem('nightMdCart') || '[]');

const money = (value) => `₩${value.toLocaleString('ko-KR')}`;
const thumbPath = (path) => path.replace('/full/', '/thumbs/');
const showToast = (message) => { const toast=document.querySelector('#storeToast'); toast.textContent=message; toast.classList.add('is-open'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove('is-open'),2600); };

const renderProducts = (filter='all') => {
  const list = filter === 'all' ? mdProducts : mdProducts.filter((product) => product.category.split(' ').includes(filter));
  productCount.textContent = `${list.length} PRODUCTS`;
  grid.innerHTML = list.map((product) => `<article class="store-card"><button type="button" data-product="${product.id}" aria-label="${product.name} 상품 상세 보기"><span class="store-card-image"><img src="${thumbPath(product.images[0])}" alt="${product.name}" loading="lazy"/></span><span class="store-card-meta">${product.category.split(' ')[0].toUpperCase()}</span><h2>${product.name}</h2><strong>${money(product.price)}</strong><small>VIEW DETAILS →</small></button></article>`).join('');
  grid.querySelectorAll('[data-product]').forEach((button) => button.addEventListener('click', () => openProduct(button.dataset.product)));
};

const openProduct = (id) => {
  activeProduct = mdProducts.find((product) => product.id === id);
  if (!activeProduct) return;
  document.querySelector('#detailCategory').textContent = activeProduct.category.split(' ')[0].toUpperCase();
  document.querySelector('#detailName').textContent = activeProduct.name;
  document.querySelector('#detailPrice').textContent = money(activeProduct.price);
  document.querySelector('#detailDescription').textContent = activeProduct.desc;
  const benefit = document.querySelector('#detailBenefit');
  benefit.textContent = activeProduct.benefit || '';
  benefit.hidden = !activeProduct.benefit;
  const option = document.querySelector('#detailOption');
  option.innerHTML = activeProduct.options.map((item) => `<option>${item}</option>`).join('');
  document.querySelector('#detailQuantity').value = 1;
  const image = document.querySelector('#detailImage');
  image.src = activeProduct.images[0]; image.alt = activeProduct.name;
  const thumbs = document.querySelector('#detailThumbs');
  thumbs.innerHTML = activeProduct.images.map((src,index) => `<button type="button" class="${index===0?'is-active':''}" data-image="${src}" aria-label="상품 이미지 ${index+1} 보기"><img src="${thumbPath(src)}" alt=""/></button>`).join('');
  thumbs.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => { image.src=button.dataset.image; thumbs.querySelectorAll('button').forEach((item)=>item.classList.toggle('is-active',item===button)); }));
  modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); backdrop.classList.add('is-open'); document.body.classList.add('store-overlay-open'); modal.querySelector('.store-modal-close').focus();
};

const closeOverlays = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden','true'); backdrop.classList.remove('is-open'); document.body.classList.remove('store-overlay-open'); };
const saveCart = () => { localStorage.setItem('nightMdCart',JSON.stringify(cart)); renderCart(); };
const renderCart = () => {
  const totalCount = cart.reduce((sum,item)=>sum+item.quantity,0);
  document.querySelector('#cartCount').textContent = totalCount;
  document.querySelector('#cartTotal').textContent = money(cart.reduce((sum,item)=>sum+item.price*item.quantity,0));
  const items = document.querySelector('#cartItems');
  items.innerHTML = cart.length ? cart.map((item,index)=>`<article class="store-cart-item"><img src="${thumbPath(item.image)}" alt=""/><div><h3>${item.name}</h3><p>${item.option} · ${item.quantity}EA</p><strong>${money(item.price*item.quantity)}</strong></div><button type="button" data-remove="${index}" aria-label="${item.name} 장바구니에서 삭제">×</button></article>`).join('') : '<p class="store-cart-empty">YOUR CART IS EMPTY.</p>';
  items.querySelectorAll('[data-remove]').forEach((button)=>button.addEventListener('click',()=>{cart.splice(Number(button.dataset.remove),1);saveCart();}));
};

filters.forEach((button)=>button.addEventListener('click',()=>{filters.forEach((item)=>item.classList.toggle('is-active',item===button));renderProducts(button.dataset.filter);}));
document.querySelector('.store-modal-close').addEventListener('click',closeOverlays);
backdrop.addEventListener('click',closeOverlays);
document.querySelector('#openCart').addEventListener('click',()=>{drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');backdrop.classList.add('is-open');document.body.classList.add('store-overlay-open');});
document.querySelector('#closeCart').addEventListener('click',closeOverlays);
document.querySelector('#quantityDown').addEventListener('click',()=>{const input=document.querySelector('#detailQuantity');input.value=Math.max(1,Number(input.value)-1);});
document.querySelector('#quantityUp').addEventListener('click',()=>{const input=document.querySelector('#detailQuantity');input.value=Math.min(9,Number(input.value)+1);});
document.querySelector('#addToCart').addEventListener('click',()=>{if(!activeProduct)return;const option=document.querySelector('#detailOption').value;const quantity=Math.max(1,Math.min(9,Number(document.querySelector('#detailQuantity').value)||1));const found=cart.find((item)=>item.id===activeProduct.id&&item.option===option);if(found)found.quantity+=quantity;else cart.push({id:activeProduct.id,name:activeProduct.name,option,quantity,price:activeProduct.price,image:activeProduct.images[0]});saveCart();closeOverlays();showToast(`${activeProduct.name} · CART에 담았습니다.`);});
document.querySelector('#checkoutButton').addEventListener('click',()=>showToast('가상 MD 스토어로 실제 구매 및 결제는 진행되지 않습니다.'));
document.addEventListener('keydown',(event)=>{if(event.key==='Escape')closeOverlays();});
renderProducts(); renderCart();
