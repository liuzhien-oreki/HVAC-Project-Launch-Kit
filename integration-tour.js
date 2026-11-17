(function(){
 const key='hvac-integrate-driver-seen-v1';let tour=null,pending=false,closing=false,timer;
 const t=(en,zh)=>installCopy(en,zh);
 function seen(){try{return localStorage.getItem(key)==='1'}catch(e){return false}}
 function remember(){try{localStorage.setItem(key,'1')}catch(e){}}
 function stop(keepPending=false){closing=true;if(tour)tour.destroy();tour=null;closing=false;if(!keepPending)pending=false}
 function step(element,title,description){return {element,popover:{title,description,side:'bottom',align:'start'}}}
 function run(steps,selection=false){stop(true);if(page!==3||!window.driver?.js?.driver)return;steps=steps.filter(s=>document.querySelector(s.element));if(!steps.length)return;
 tour=window.driver.js.driver({animate:true,overlayOpacity:.4,stagePadding:7,stageRadius:12,popoverClass:'hvac-guide-popover',showProgress:true,progressText:'{{current}} / {{total}}',nextBtnText:t('Next','下一步'),prevBtnText:t('Back','上一步'),doneBtnText:selection?t('Choose a route','选择集成方式'):t('Done','完成'),allowClose:true,disableActiveInteraction:true,steps,
 onPopoverRender(popover){const skip=document.createElement('button');skip.className='hvac-guide-skip';skip.textContent=t('Skip step','跳过此步');skip.onclick=()=>{if(tour.hasNextStep())tour.moveNext();else{pending=selection;stop(selection)}};popover.footerButtons.prepend(skip)},
 onNextClick(){if(tour.hasNextStep())tour.moveNext();else{pending=selection;stop(selection)}},
 onDestroyed(){tour=null;if(!closing)pending=false}
 });tour.drive();}
 function initial(){remember();pending=true;run([
 step('.gateway-setup-entry',t('1. Configure your gateway','1. 配置网关'),t('Open Gateway setup for illustrated UG65 access, network and LoRaWAN configuration. You can return to it at any time.','点击网关配置，查看 UG65 登录、网络和 LoRaWAN 的图文配置步骤，可随时返回查看。')),
 step('.integration-selection',t('2. Choose an integration','2. 选择集成方式'),t('Choose MQTT, HTTP(S), BACnet, MDP or a third-party NS. Close this introduction with “Choose a route”, then click your route. The guide will continue at its setup card.','点击“选择集成方式”结束本段，再选择 MQTT、HTTP(S)、BACnet、MDP 或第三方 NS，随后引导将从对应配置卡片继续。'))
 ],true)}
 function selected(demoOnly=false){pending=false;const mqtt=integrationSetupRoute()==='MQTT',mdp=integrationSetupRoute()==='MDP',bac=integrationSetupRoute()==='BACnet';run([
 step('.integration-setup-entry',t('1. Gateway & device setup','1. 网关与设备配置'),t('Open this card for the complete illustrated setup: gateway connection, WT201 ToolBox settings, joining, your selected protocol and verification.','点击卡片查看完整图文步骤，包括网关关联、WT201 ToolBox 配置、入网、当前集成方式和验证。')),
 step('.mqtt-device-column',t('2. Try the thermostat','2. 操作恒温器演示'),t('The side buttons and LCD controls are interactive. Try power, setpoint, mode and fan. In live mode, controls may send real commands; check permissions and device readback.','侧边按钮和屏幕均可交互，可操作电源、设定温度、模式和风机。真实连接模式下可能下发实际命令，请核对权限及设备回读。')),
 step(mqtt?'.mqtt-console-head':'.pl-header',t('3. Simulation or real connection','3. 模拟或真实连接'),t(mqtt?'Check MQTT status here. Connect real device opens broker, topics and device settings. Stay in Simulation when exploring.':'Check the connection mode here. Open the connection settings below to enter your gateway or platform endpoint and device mapping. Stay in Simulation when exploring.','查看连接状态，通过连接配置填写服务地址、设备及参数映射。仅体验时保持模拟模式。')),
 step(mqtt?'.mqtt-console-tabs':'.pl-tabs',t('4. Choose your workspace','4. 选择操作区域'),t(mdp?'Control adjusts common settings; Reports shows platform data and recent events.':bac?'Quick control covers common actions. Objects browses BACnet mappings and read/write access. Readback checks returned values.':'Quick control sends System, Control mode, Target and Fan separately. Parameters browses categorized commands. Uplink reports shows decoded data and the latest messages.','常用控制用于独立调整系统、模式、温度和风机；参数或对象页按分类查询配置；上报或回读页查看数据与最近消息。')),
 step(mqtt?'.mqtt-code-section':'.pl-code',t('5. Copy integration examples','5. 复制集成示例'),t(mqtt?'Command JSON is the encoder input. Encoder & bytes shows the payload. MQTT publish is the broker message body; topic is separate. Client example shows how to publish from code. Use Copy for the selected format.':'Switch between command/object data, request body and client examples. Check endpoint, units and read/write access, then copy the selected example into your integration.','切换命令或对象数据、请求内容及客户端示例，核对地址、单位和读写权限后，复制当前格式用于集成。')),
 step('#integration-guide-launcher',t('Replay whenever you need','随时重新查看'),t('Use Guide to replay this introduction. Skip step advances one tip; × or Escape exits the tour.','点击 Guide 可重播引导。Skip step 跳过当前提示，× 或 Escape 退出引导。'))
 ].slice(demoOnly?1:0).map((item,index)=>{item.popover.title=item.popover.title.replace(/^\d+\. /,(index+1)+'. ');return item}))}
 function launcher(){let button=document.getElementById('integration-guide-launcher');if(!button){button=document.createElement('button');button.id='integration-guide-launcher';button.type='button';button.textContent='?  Guide';button.onclick=()=>{const demo=document.querySelector('.integration-details .split');if(integrationSetupRoute()&&demo&&demo.getBoundingClientRect().top<window.innerHeight*.75)selected(true);else initial()};document.body.append(button)}button.hidden=page!==3||localStorage.getItem('kit-product')==='UC701'}
 const previousGo=go;go=function(n){if(n!==3){clearTimeout(timer);stop()}previousGo(n);launcher();if(n===3&&localStorage.getItem('kit-product')!=='UC701'&&!seen()&&!tour){clearTimeout(timer);timer=setTimeout(()=>{if(page===3){if(integrationSetupRoute()){remember();selected()}else initial()}},450)}};
 const previousChoose=chooseIntegrationRoute;chooseIntegrationRoute=function(route){const resume=pending||!!tour;stop(true);previousChoose(route);if(resume&&integrationSetupRoute()){clearTimeout(timer);timer=setTimeout(()=>{if(page===3)selected()},750)}};
 launcher();if(page===3&&!seen())timer=setTimeout(initial,450);
})();
