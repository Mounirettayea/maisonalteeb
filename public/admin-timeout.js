/* MAISON AL TEEB — automatic admin logout after inactivity + logout when leaving admin for homepage */
(function(){
  const TIMEOUT_MS = 20000;
  let timer = null;
  let busy = false;

  async function signOut(){
    if(busy) return;
    busy = true;
    try{
      if(window.supabase && window.MAISON_SUPABASE){
        const db = window.supabase.createClient(
          window.MAISON_SUPABASE.url,
          window.MAISON_SUPABASE.anonKey,
          {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}
        );
        await db.auth.signOut();
      }
    }catch(e){}
  }

  function resetTimer(){
    clearTimeout(timer);
    timer = setTimeout(async function(){
      await signOut();
      sessionStorage.setItem('maisonAdminTimeout','1');
      location.replace('/admin.html');
    }, TIMEOUT_MS);
  }

  // Leaving the admin through the "الرئيسية" button logs out first.
  document.addEventListener('click', function(e){
    const link = e.target.closest('.home');
    if(!link || busy) return;
    e.preventDefault();
    signOut().finally(function(){ location.replace('/'); });
  });

  ['click','touchstart','touchmove','keydown','scroll','pointerdown','pointermove'].forEach(function(eventName){
    window.addEventListener(eventName, resetTimer, {passive:true});
  });

  resetTimer();
})();
