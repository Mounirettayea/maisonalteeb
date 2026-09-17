(function(){
  'use strict';
  if(location.pathname!=='/admin.html') return;

  let input=null, modal=null, video=null, stream=null, scanning=false;
  const getInput=()=>document.getElementById('barcode');
  const setMsg=t=>{const el=document.getElementById('adminScannerMsg');if(el)el.textContent=t};
  const stop=()=>{
    scanning=false;
    if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
    if(video){video.pause();video.srcObject=null;}
    if(modal)modal.style.display='none';
  };
  const accept=code=>{
    code=String(code||'').trim();
    if(!code) return;
    input=getInput();
    if(!input) return;
    input.value=code;
    input.dispatchEvent(new Event('input',{bubbles:true}));
    input.dispatchEvent(new Event('change',{bubbles:true}));
    stop();
  };
  const makeModal=()=>{
    if(modal) return;
    modal=document.createElement('div');
    modal.id='adminScannerModal';
    modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:99999;display:none;align-items:center;justify-content:center;padding:14px;direction:rtl';
    modal.innerHTML='<div style="width:min(520px,100%);background:#fff;border-radius:20px;padding:15px;box-shadow:0 20px 70px #000;overflow:hidden"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px"><strong style="font-size:18px">📷 سكان الباركود</strong><button id="closeAdminScanner" type="button" style="border:0;border-radius:10px;padding:9px 12px;background:#eee">✕ إغلاق</button></div><div id="adminScannerMsg" style="font-size:13px;color:#555;margin:8px 0">وجه الكاميرا نحو الباركود...</div><video id="adminScannerVideo" playsinline autoplay muted style="display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:#111;border-radius:14px"></video><div style="margin-top:10px;text-align:center"><button id="stopAdminScanner" type="button" style="border:0;border-radius:10px;padding:10px 14px;background:#b33b3b;color:#fff">⏹ إيقاف الكاميرا</button></div></div>';
    document.body.appendChild(modal);
    video=document.getElementById('adminScannerVideo');
    document.getElementById('closeAdminScanner').onclick=stop;
    document.getElementById('stopAdminScanner').onclick=stop;
    modal.addEventListener('click',e=>{if(e.target===modal)stop()});
  };
  const ensureButton=()=>{
    input=getInput();
    if(!input) return false;
    makeModal();
    if(document.getElementById('adminScanBtn')) return true;
    const btn=document.createElement('button');
    btn.id='adminScanBtn';btn.type='button';btn.className='btn gold';btn.textContent='📷 سكان الباركود';
    input.parentElement.appendChild(btn);
    btn.addEventListener('click',start);
    return true;
  };
  async function start(){
    input=getInput();
    if(!input) return;
    makeModal();
    modal.style.display='flex';
    setMsg('جاري تشغيل الكاميرا...');
    try{
      if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia) throw new Error('المتصفح لا يدعم الكاميرا');
      stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});
      video.srcObject=stream;
      await video.play();
      scanning=true;
      setMsg('وجه الكاميرا نحو الباركود...');
      if('BarcodeDetector' in window){
        let formats=['ean_13','ean_8','upc_a','upc_e','code_128','code_39','itf','codabar','qr_code'];
        try{
          const supported=await BarcodeDetector.getSupportedFormats();
          formats=formats.filter(f=>supported.includes(f));
        }catch(e){}
        const detector=new BarcodeDetector({formats:formats.length?formats:['ean_13','ean_8','code_128']});
        const loop=async()=>{
          if(!scanning)return;
          try{
            const codes=await detector.detect(video);
            if(codes&&codes.length){accept(codes[0].rawValue);return;}
          }catch(e){}
          setTimeout(loop,180);
        };
        loop();
        return;
      }
      setMsg('هذا المتصفح لا يدعم قارئ الباركود المدمج. استعمل Chrome حديثاً على Android.');
    }catch(e){
      setMsg('تعذر تشغيل الكاميرا: '+(e.message||e));
    }
  }
  const boot=()=>{
    if(ensureButton()) return;
    setTimeout(boot,250);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  new MutationObserver(()=>{if(!document.getElementById('adminScanBtn'))ensureButton()}).observe(document.documentElement,{childList:true,subtree:true});
})();
