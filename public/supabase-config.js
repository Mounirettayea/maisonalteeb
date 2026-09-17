// Public Supabase settings.
// Replace these two values with your Supabase project values.
// The anon key is safe to expose in the browser when Row Level Security is enabled.
window.MAISON_SUPABASE = {
  url: "https://mbjgirwuqzcjrllnokzj.supabase.co",
  anonKey: "sb_publishable_gEivTgSBsntxUkkJc3h9AA_-cmDpszh"
};

// Admin product editor: load the camera barcode scanner and inactivity logout only on admin.html.
if(location.pathname==='/admin.html'){
  const s=document.createElement('script');
  s.src='/admin-scanner.js?v=3';
  s.async=false;
  document.head.appendChild(s);

  const timeoutScript=document.createElement('script');
  timeoutScript.src='/admin-timeout.js?v=1';
  timeoutScript.async=false;
  document.head.appendChild(timeoutScript);
}

// Mobile navigation + compact responsive layout for the public homepage.
if(location.pathname==='/' || location.pathname==='/index.html'){
  const style=document.createElement('style');
  style.textContent=`
    @media (max-width:768px){
      .nav-links.mobile-open{
        display:flex!important;
        position:absolute;
        top:100%;
        right:10px;
        left:10px;
        z-index:1500;
        flex-direction:column;
        gap:0;
        padding:8px;
        margin:0;
        list-style:none;
        background:rgba(250,248,245,.98);
        border:1px solid #e5dec9;
        border-radius:12px;
        box-shadow:0 12px 30px rgba(14,41,27,.15);
      }
      .nav-links.mobile-open li{width:100%;}
      .nav-links.mobile-open a{display:block;width:100%;padding:10px 12px;border-bottom:1px solid #eee7d8;font-size:14px;}
      .nav-links.mobile-open li:last-child a{border-bottom:0;}
      .mobile-menu-btn{position:relative;z-index:1600;}

      /* Make the whole storefront compact and thumb-friendly. */
      .announcement-bar{padding:6px 10px!important;font-size:11px!important;line-height:1.4!important;}
      .header-container{padding:9px 12px!important;min-height:54px!important;}
      .logo{font-size:1.25rem!important;letter-spacing:.5px!important;gap:5px!important;}
      .logo span{font-size:.68rem!important;}
      .header-actions{gap:9px!important;}
      .header-actions .lang-select{font-size:11px!important;padding:3px 5px!important;}
      .action-icon svg{width:19px!important;height:19px!important;}
      .badge-count{width:15px!important;height:15px!important;font-size:9px!important;top:-5px!important;left:-5px!important;}

      .hero-section{min-height:58vh!important;padding:30px 14px!important;}
      .hero-content{grid-template-columns:1fr!important;gap:18px!important;text-align:center!important;}
      .hero-text h1{font-size:1.8rem!important;line-height:1.25!important;margin-bottom:10px!important;}
      .hero-text h1 span{font-size:1.2rem!important;margin-top:5px!important;}
      .hero-text p{font-size:.9rem!important;line-height:1.55!important;margin:0 auto 18px!important;max-width:330px!important;}
      .hero-buttons{justify-content:center!important;gap:8px!important;}
      .btn-primary,.btn-secondary{padding:9px 15px!important;font-size:13px!important;gap:5px!important;}
      .hero-image-wrapper img{max-width:62%!important;}

      .section-header{margin:32px 0 20px!important;padding:0 12px!important;}
      .section-title{font-size:1.45rem!important;padding-bottom:7px!important;}
      .section-title::after{width:42px!important;}
      .section-subtitle{font-size:.78rem!important;margin-top:5px!important;}

      .categories-grid{grid-template-columns:repeat(2,1fr)!important;gap:9px!important;padding:0 12px!important;}
      .category-card{height:145px!important;border-radius:7px!important;}
      .category-overlay{padding:10px!important;}
      .category-title{font-size:.9rem!important;gap:4px!important;margin-bottom:2px!important;}
      .category-btn{font-size:.68rem!important;}

      .products-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;padding:0 12px 30px!important;}
      .product-card{border-radius:7px!important;}
      .product-badge,.discount-badge{top:7px!important;font-size:10px!important;padding:3px 6px!important;}
      .product-wishlist-btn{top:34px!important;left:7px!important;width:27px!important;height:27px!important;}
      .product-image{height:165px!important;}
      .product-info{padding:9px!important;}
      .product-name{font-size:.84rem!important;line-height:1.35!important;}
      .product-category,.product-meta{font-size:.68rem!important;}
      .product-price{font-size:.9rem!important;}
      .product-card .btn,.product-card button{font-size:11px!important;padding:7px 8px!important;}

      .container,.section-container,.content-container{width:100%!important;max-width:100%!important;padding-left:12px!important;padding-right:12px!important;}
      img{max-width:100%;height:auto;}
      input,select,textarea,button{max-width:100%;}
    }

    @media (max-width:380px){
      .hero-section{min-height:52vh!important;padding:24px 11px!important;}
      .hero-text h1{font-size:1.55rem!important;}
      .hero-text h1 span{font-size:1.05rem!important;}
      .hero-text p{font-size:.82rem!important;}
      .category-card{height:130px!important;}
      .product-image{height:145px!important;}
      .products-grid,.categories-grid{gap:7px!important;padding-left:9px!important;padding-right:9px!important;}
    }
  `;
  document.head.appendChild(style);

  window.toggleMobileNav=function(){
    const nav=document.querySelector('.nav-links');
    if(!nav)return;
    nav.classList.toggle('mobile-open');
  };

  document.addEventListener('click',function(e){
    const nav=document.querySelector('.nav-links');
    const btn=document.querySelector('.mobile-menu-btn');
    if(!nav || !nav.classList.contains('mobile-open'))return;
    if(nav.contains(e.target) || (btn && btn.contains(e.target)))return;
    nav.classList.remove('mobile-open');
  });

  document.addEventListener('click',function(e){
    const link=e.target.closest('.nav-links a');
    if(link){
      const nav=document.querySelector('.nav-links');
      if(nav)nav.classList.remove('mobile-open');
    }
  });
}
