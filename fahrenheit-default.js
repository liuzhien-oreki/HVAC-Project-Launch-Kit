// Simulation values stay in Celsius internally; presentation defaults to Fahrenheit.
function kitTemperatureF(c){return Number((Number(c)*1.8+32).toFixed(1))}
function kitDeltaF(c){return Number((Number(c)*1.8).toFixed(1))}
function kitFahrenheitText(text){return text.replace(/(-?\d+(?:\.\d+)?)\s*([–−-])\s*(-?\d+(?:\.\d+)?)°C/g,(_,a,d,b)=>{const f=Math.max(Math.abs(+a),Math.abs(+b))<=10?kitDeltaF:kitTemperatureF;return f(a)+d+f(b)+'°F'}).replace(/(-?\d+(?:\.\d+)?)°C/g,(_,n)=>(Math.abs(+n)<=10?kitDeltaF(n):kitTemperatureF(n))+'°F')}
function kitFahrenheitMarkup(html){const tpl=document.createElement('template');tpl.innerHTML=html;const walk=document.createTreeWalker(tpl.content,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){if(n.parentElement?.closest('script,style,pre,code'))continue;n.textContent=kitFahrenheitText(n.textContent)}return tpl.innerHTML}
const activeStoryBeforeFahrenheit=activeControlStory;
activeControlStory=function(){const c=JSON.parse(JSON.stringify(activeStoryBeforeFahrenheit()));const convert=v=>typeof v==='string'?kitFahrenheitText(v):Array.isArray(v)?v.map(convert):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,convert(x)])):v;const result=convert(c);result.lines=result.lines.map(l=>[l[0],l[1].replace(/(\d+(?:\.\d+)?) ([−+]) (\d+(?:\.\d+)?)(?: ([−+]) (\d+(?:\.\d+)?))?/g,(_,base,op,a,op2,b)=>kitTemperatureF(base)+' '+op+' '+kitDeltaF(a)+(op2?' '+op2+' '+kitDeltaF(b):'')+'°F'),l[2]]);return result};
const chartBeforeFahrenheit=storyChart;
storyChart=function(c){let svg=chartBeforeFahrenheit(c);svg=kitFahrenheitMarkup(svg);return svg.replace(/(<text x="16"[^>]*>)(-?\d+(?:\.\d+)?)°(<\/text>)/g,(_,a,n,b)=>a+kitTemperatureF(n)+'°F'+b)};
views.forEach((view,i)=>{views[i]=function(){return kitFahrenheitMarkup(view())}});
const homeBeforeFahrenheit=homePage;
homePage=function(){return kitFahrenheitMarkup(homeBeforeFahrenheit())};
unitState.unit='F';
go(page);
