/* Home: HVAC portfolio overview. Existing guide routes stay intact. */
homePage=function(){
 const en=language==='en';
 const labels=en?['Select','Introduce','Install','Integrate','Deploy','Optimize','Resources']:['产品选型','产品介绍','安装配置','平台集成','网络部署','进阶应用','资料支持'];
 const order=[0,6,2,3,1,4,5];
 const systems=[
 {key:'RTU',label:en?'RTU / Rooftop':'屋顶式机组',x:26,y:28},
 {key:'VRF',label:en?'VRF':'多联机',x:74,y:27},
 {key:'HP',label:en?'Heat pump':'热泵',x:16,y:58},
 {key:'TRV',label:en?'Hydronic radiator':'水暖散热器',x:67,y:55},
 {key:'ELECTRIC',label:en?'Electric radiator':'电暖散热器',x:86,y:64,pending:true},
 {key:'FCU',label:en?'Fan coil':'风机盘管',x:37,y:80},
 {key:'AC',label:en?'Split AC / Cassette':'分体空调 / 天花机',x:67,y:82}
 ];
 return `<section class="hvac-home" aria-labelledby="hvac-home-title"><div class="hvac-home-copy"><div class="hvac-home-kicker">HVAC PROJECT LAUNCH KIT</div><h1 id="hvac-home-title">${en?'Connected comfort.<br>Across your building.':'每一处空间，舒适尽在掌控。'}</h1><p>${en?'Choose your equipment. Discover your control solution.':'连接全系列 HVAC 控制，从产品选型到项目落地。'}</p><div class="hvac-home-actions"><button class="hvac-home-primary" onclick="go(0)">${en?'Find your solution':'探索产品系列'} <span aria-hidden="true">↗</span></button><button class="hvac-home-secondary" onclick="go(3)">${en?'Explore integration':'体验平台集成'} <span aria-hidden="true">→</span></button></div></div><div class="hvac-scene"><div class="hvac-scene-frame"><img src="assets/hvac-equipment-scene-v2.png" alt="${en?'HVAC equipment: rooftop unit, VRF, US split heat pump, hydronic and electric radiators, fan coil and split air conditioner':'屋顶机组、多联机、热泵、散热器、风机盘管和分体空调设备示意'}">${systems.map(item=>`<button class="hvac-scene-hotspot" style="--x:${item.x}%;--y:${item.y}%" ${item.pending?'aria-disabled="true" title="'+(en?'Electric heating guide coming soon':'电暖集成指南即将上线')+'"':'onclick="homeExploreSystem(\''+item.key+'\')"'} aria-label="${en?'Explore ':'探索'}${item.label}"><span aria-hidden="true"></span>${item.label}<i aria-hidden="true">${item.pending?'':'↗'}</i></button>`).join('')}</div></div></section><section class="hvac-home-journey" aria-label="${en?'Your project journey':'项目落地路径'}"><div class="hvac-home-journey-label">${en?'YOUR PROJECT JOURNEY':'项目落地路径'}</div><div class="hvac-home-stages">${labels.map((label,i)=>`<button onclick="go(${order[i]})"><span>0${i+1}</span><strong>${label}</strong><i aria-hidden="true">${i<6?'›':'↗'}</i></button>`).join('')}</div></section>`;
};
function homeExploreSystem(key){filter=key;go(0)}
if(typeof page!=='undefined'&&page===-1)go(-1);
