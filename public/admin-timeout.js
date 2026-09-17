/* MAISON AL TEEB — automatic admin logout after inactivity */
(function(){
  const TIMEOUT_MS = 20000;
  let timer = null;
  let busy = false;

  function resetTimer(){
    clearTimeout(timer);
    timer = setTimeout(async function(){
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
      sessionStorage.setItem('maisonAdminTimeout','1');
      location.replace('/admin.html');
    }, TIMEOUT_MS);
  }

  ['click','touchstart','touchmove','keydown','scroll','pointerdown','pointermove'].forEach(function(eventName){
    window.addEventListener(eventName, resetTimer, {passive:true});
  });

  resetTimer();
})();
