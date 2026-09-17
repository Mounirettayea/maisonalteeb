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

// Mobile navigation for the public homepage.
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
        padding:10px;
        margin:0;
        list-style:none;
        background:rgba(250,248,245,.98);
        border:1px solid #e5dec9;
        border-radius:12px;
        box-shadow:0 12px 30px rgba(14,41,27,.15);
      }
      .nav-links.mobile-open li{width:100%;}
      .nav-links.mobile-open a{
        display:block;
        width:100%;
        padding:12px 14px;
        border-bottom:1px solid #eee7d8;
      }
      .nav-links.mobile-open li:last-child a{border-bottom:0;}
      .mobile-menu-btn{position:relative;z-index:1600;}
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
