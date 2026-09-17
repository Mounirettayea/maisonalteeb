// Public Supabase settings.
// Replace these two values with your Supabase project values.
// The anon key is safe to expose in the browser when Row Level Security is enabled.
window.MAISON_SUPABASE = {
  url: "https://mbjgirwuqzcjrllnokzj.supabase.co",
  anonKey: "sb_publishable_gEivTgSBsntxUkkJc3h9AA_-cmDpszh"
};

// Admin product editor: load the camera barcode scanner only on admin.html.
if(location.pathname==='/admin.html'){
  const s=document.createElement('script');
  s.src='/admin-scanner.js?v=1';
  s.defer=true;
  document.head.appendChild(s);
}
