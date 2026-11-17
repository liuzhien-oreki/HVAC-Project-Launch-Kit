(function(){
function badge(){const nav=document.getElementById('nav'),model=localStorage.getItem('kit-product');document.getElementById('selected-product-badge')?.remove();if(!nav||!['WT201','UC701'].includes(model))return;const select=document.createElement('select');select.id='selected-product-badge';select.setAttribute('aria-label',language==='en'?'Switch product':'切换产品型号');select.title=language==='en'?'Switch product · open its introduction':'切换产品 · 进入对应产品介绍';for(const name of ['WT201','UC701']){const option=document.createElement('option');option.value=name;option.textContent=name;option.selected=name===model;select.append(option)}select.onchange=()=>chooseProduct(select.value);nav.prepend(select)}
const previous=go;go=function(n){previous(n);badge()};badge();
})();
