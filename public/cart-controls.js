// MAISON AL TEEB — Shopping cart quantity controls
(function(){
  if(location.pathname!=='/' && location.pathname!=='/index.html') return;

  const css=document.createElement('style');
  css.textContent=`
    .cart-item-row{display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid var(--border-color);padding:10px 0;}
    .cart-item-main{display:flex;align-items:center;gap:10px;min-width:0;flex:1;}
    .cart-item-main img{width:58px;height:58px;border-radius:6px;object-fit:cover;flex:0 0 58px;}
    .cart-item-info{min-width:0;}
    .cart-item-name{font-weight:700;color:var(--green-deep);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:210px;}
    .cart-item-size{font-size:.78rem;color:var(--text-muted);margin-top:2px;}
    .cart-item-actions{display:flex;align-items:center;gap:7px;flex:0 0 auto;}
    .cart-qty{display:flex;align-items:center;border:1px solid var(--border-color);border-radius:7px;overflow:hidden;background:#fff;}
    .cart-qty button{width:31px;height:31px;border:0;background:#f7f4ed;color:var(--green-deep);font-size:20px;font-weight:700;cursor:pointer;line-height:1;}
    .cart-qty button:active{background:var(--gold-primary);}
    .cart-qty-value{min-width:30px;text-align:center;font-weight:700;color:var(--green-deep);}
    .cart-remove{width:31px;height:31px;border:1px solid #ead8d8;border-radius:7px;background:#fff;color:#b22222;font-size:17px;cursor:pointer;}
    .cart-remove:active{background:#f8eaea;}
    .cart-item-total{font-weight:700;color:var(--green-deep);font-size:.9rem;white-space:nowrap;}
    .cart-actions-row{display:flex;gap:8px;margin-top:10px;}
    .cart-clear-btn{flex:1;border:1px solid #d9cfc0;background:#fff;color:#8b3a3a;padding:9px;border-radius:4px;font-weight:700;cursor:pointer;}
    @media(max-width:480px){
      .cart-item-row{align-items:flex-start;}
      .cart-item-main img{width:48px;height:48px;flex-basis:48px;}
      .cart-item-name{max-width:125px;font-size:.86rem;}
      .cart-item-actions{gap:4px;}
      .cart-qty button,.cart-remove{width:28px;height:28px;}
      .cart-qty-value{min-width:25px;}
      .cart-item-total{font-size:.8rem;}
    }
  `;
  document.head.appendChild(css);

  function install(){
    if(typeof window.openCartModal!=='function') return false;
    if(window.__maisonCartControlsInstalled) return true;
    window.__maisonCartControlsInstalled=true;

    window.changeCartQty=function(productId,delta){
      const index=cart.findIndex(item=>Number(item.id)===Number(productId));
      if(index<0) return;
      cart[index].qty=Math.max(0,Number(cart[index].qty||0)+Number(delta||0));
      if(cart[index].qty<=0) cart.splice(index,1);
      saveCart();
      openCartModal();
    };

    window.removeCartItem=function(productId){
      cart=cart.filter(item=>Number(item.id)!==Number(productId));
      saveCart();
      openCartModal();
    };

    window.clearCart=function(){
      cart=[];
      saveCart();
      openCartModal();
    };

    window.openCartModal=function(){
      const subtotal=cart.reduce((acc,item)=>acc+(Number(item.price)||0)*(Number(item.qty)||0),0);
      const isFreeShipping=subtotal>=CONFIG.FREE_SHIPPING_THRESHOLD || subtotal===0;
      const shippingCost=isFreeShipping?0:CONFIG.SHIPPING_FEE;
      const total=subtotal+shippingCost;
      let html=`<h2 style="color:var(--green-deep);margin-bottom:16px;">سلة المشتريات</h2>`;

      if(!cart.length){
        html+=`<p style="text-align:center;padding:30px;color:var(--text-muted);">سلة التسوق فارغة حالياً.</p>`;
      }else{
        html+=`<div style="display:flex;flex-direction:column;margin-bottom:16px;">${cart.map(item=>`
          <div class="cart-item-row">
            <div class="cart-item-main">
              <img src="${item.image||''}" alt="${item.name||''}">
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name||''}</div>
                <div class="cart-item-size">${item.size||''}</div>
                <div class="cart-item-total">${(Number(item.price)||0)*(Number(item.qty)||0)} ${CONFIG.CURRENCY}</div>
              </div>
            </div>
            <div class="cart-item-actions">
              <div class="cart-qty">
                <button type="button" onclick="changeCartQty(${Number(item.id)},-1)" aria-label="نقص الكمية">−</button>
                <span class="cart-qty-value">${Number(item.qty)||0}</span>
                <button type="button" onclick="changeCartQty(${Number(item.id)},1)" aria-label="زد الكمية">+</button>
              </div>
              <button type="button" class="cart-remove" onclick="removeCartItem(${Number(item.id)})" aria-label="حذف المنتج">×</button>
            </div>
          </div>
        `).join('')}</div>

        <div style="border-top:1px solid var(--border-color);padding-top:14px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span>المجموع الفرعي:</span><span>${subtotal} ${CONFIG.CURRENCY}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span>التوصيل في المغرب:</span><span>${isFreeShipping?'<strong style="color:green">مجاني</strong>':`${shippingCost} ${CONFIG.CURRENCY}`}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:1.15rem;font-weight:bold;color:var(--green-deep);margin-top:10px;"><span>المجموع الكلي:</span><span>${total} ${CONFIG.CURRENCY}</span></div>
        </div>

        <div class="cart-actions-row">
          <button type="button" class="cart-clear-btn" onclick="clearCart()">إفراغ السلة</button>
          <button class="btn-primary" style="flex:2;justify-content:center;" onclick="openCheckoutModal()">إتمام الطلب</button>
        </div>`;
      }
      openModal(html);
    };
    return true;
  }

  const timer=setInterval(function(){
    if(install()) clearInterval(timer);
  },100);
  setTimeout(function(){clearInterval(timer);install();},10000);
})();
