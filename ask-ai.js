/* Official Kapa widget; questions remain subject to its enabled-domain policy. */
(function(){
 // Kapa uses randomUUID; getRandomValues remains available on this LAN HTTP origin.
 if(window.crypto&&!window.crypto.randomUUID&&typeof window.crypto.getRandomValues==='function'){
  window.crypto.randomUUID=function(){const bytes=new Uint8Array(16);window.crypto.getRandomValues(bytes);bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;const hex=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');return hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20)};
 }

 const demo='https://demo.kapa.ai/demo/milesight';
 const launch=document.createElement('button');launch.id='kit-ask-ai';launch.type='button';launch.setAttribute('aria-label','Ask Milesight AI');launch.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16 3-9 4 6 8-9M14 16l2 5 2-5 5-2-5-2-2-5-2 5-5 2Z"/></svg><span>Ask AI</span>';
 const fallback=document.createElement('div');fallback.id='kit-ask-ai-fallback';fallback.hidden=true;fallback.innerHTML='<button type="button" aria-label="Close AI help">×</button><strong>Ask Milesight AI</strong><p>The AI assistant is not available here yet. You can use the original demo.</p><a href="'+demo+'" target="_blank" rel="noopener noreferrer">Open Ask AI demo ↗</a>';
 fallback.querySelector('button').onclick=()=>{fallback.hidden=true};document.body.append(launch,fallback);
 let state='idle',timer;
 launch.addEventListener('click',()=>{
  if(state==='error'){fallback.hidden=false;return}
  if(state!=='idle')return;
  state='loading';launch.setAttribute('aria-busy','true');
  const script=document.createElement('script');script.id='kit-kapa-widget';script.src='https://widget.kapa.ai/kapa-widget.bundle.js';script.async=true;
  const config={'data-website-id':'84591d5c-4a8c-4fb7-b7dc-76e3fed9ee64','data-project-name':'Milesight','data-project-color':'#235FA5','data-button-hide':'true','data-modal-override-selector':'#kit-ask-ai','data-modal-open-by-default':'true','data-modal-title':'Milesight IoT Documentation AI Agent','data-modal-description':'Having trouble connecting? [Open the original Milesight AI demo](https://demo.kapa.ai/demo/milesight).','data-language':typeof language!=='undefined'&&language==='zh'?'zh':'en'};
  Object.entries(config).forEach(([key,value])=>script.setAttribute(key,value));
  const fail=()=>{clearTimeout(timer);state='error';launch.removeAttribute('aria-busy');fallback.hidden=false};script.onerror=fail;script.onload=()=>{clearTimeout(timer);state='ready';launch.removeAttribute('aria-busy')};timer=setTimeout(fail,20000);document.head.append(script);
 });
 // SPA navigation keeps the launcher out of Home without reloading the assistant.
 new MutationObserver(()=>{if(document.body.classList.contains('is-home'))fallback.hidden=true}).observe(document.body,{attributes:true,attributeFilter:['class']});
})();
