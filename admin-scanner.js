(function(){
  if(location.pathname!=='/admin.html') return;
  const boot=()=>{
    const input=document.getElementById('barcode');
    if(!input){setTimeout(boot,200);return;}
    if(document.getElementById('adminScanBtn')) return;
    const btn=document.createElement('button');
    btn.id='adminScanBtn'; btn.type='button'; btn.className='btn gold'; btn.textContent='📷 سكان الباركود';
    input.parentElement.appendChild(btn);

    const modal=document.createElement('div');
    modal.id='adminScannerModal';
    modal.style.cssText='position:fixed;inset:0;background:#000b;z-index:9999;display:none;align-items:center;justify-content:center;padding:15px;';
    modal.innerHTML=`<div style="width:min(520px,100%);background:#fff;border-radius:18px;padding:16px;box-shadow:0 20px 60px #0008;direction:rtl"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h3 style="margin:0">📷 سكان الباركود</h3><button id="closeAdminScanner" class="btn muted" type="button">✕ إغلاق</button></div><p id="adminScannerMsg" style="color:#666;font-size:13px">وجه الكاميرا نحو الباركود...</p><video id="adminScannerVideo" playsinline style="width:100%;aspect-ratio:4/3;object-fit:cover;background:#111;border-radius:14px"></video><div style="margin-top:10px;text-align:center"><button id="stopAdminScanner" class="btn danger" type="button">⏹ إيقاف الكاميرا</button></div></div>`;
    document.body.appendChild(modal);
    let controls=null;
    const msg=t=>{document.getElementById('adminScannerMsg').textContent=t};
    const loadZX=()=>new Promise((resolve,reject)=>{if(window.ZXingBrowser)return resolve();const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@zxing/browser@0.1.5/umd/index.min.js';s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
    const stop=()=>{try{if(controls)controls.stop()}catch(e){}controls=null;const v=document.getElementById('adminScannerVideo');if(v&&v.srcObject){v.srcObject.getTracks().forEach(t=>t.stop());v.srcObject=null}modal.style.display='none'};
    btn.onclick=async()=>{modal.style.display='flex';msg('جاري تشغيل الكاميرا...');try{await loadZX();const reader=new ZXingBrowser.BrowserMultiFormatReader();const devices=await ZXingBrowser.BrowserCodeReader.listVideoInputDevices();if(!devices.length)throw new Error('لم يتم العثور على كاميرا');const deviceId=devices.length>1?(devices.find(d=>/back|rear|environment|خلف/i.test(d.label))||devices[devices.length-1]).deviceId:devices[0].deviceId;controls=await reader.decodeFromVideoDevice(deviceId,'adminScannerVideo',(result,error)=>{if(result){const code=result.getText().trim();if(code){input.value=code;input.dispatchEvent(new Event('input',{bubbles:true}));stop()}}});msg('وجه الكاميرا نحو الباركود...')}catch(e){msg('تعذر تشغيل الكاميرا: '+(e.message||e));}};
    document.getElementById('closeAdminScanner').onclick=stop;
    document.getElementById('stopAdminScanner').onclick=stop;
    modal.addEventListener('click',e=>{if(e.target===modal)stop()});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
