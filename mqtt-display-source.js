(function(){
 digitMap['-']='g';
 const priorTemperature=lcdTemperature;lcdTemperature=function(c,x,y,h){if(mqttUI.transport==='real'&&((h===120&&!mqttUI.hasTemperatureReport)||(h===64&&!mqttUI.hasTargetReport&&!mqttUI.hasTargetPreview)))return seven('--',x,y,h);return priorTemperature(c,x,y,h)};
 const priorSeven=seven;seven=function(text,x,y,h){if(mqttUI.transport==='real'&&x===316&&y===104&&!mqttUI.hasHumidityReport)return priorSeven('--',x,y,h);return priorSeven(text,x,y,h)};
 const priorLCD=renderLCD;renderLCD=function(){priorLCD();const el=document.getElementById('real-lcd');if(el&&mqttUI.transport==='real'&&!mqttUI.hasTemperatureReport)el.setAttribute('aria-label','Waiting for an actual temperature report. Controls preview locally; incoming MQTT reports update automatically.')};
 const priorRender=mqttRender;mqttRender=function(){priorRender();renderLCD();const headings=document.querySelectorAll('.integration-details .integration-demo-title');const label=headings[headings.length-1]?.querySelector('span');if(label)label.textContent=mqttUI.transport==='real'?mqText('Live MQTT · automatic updates','实时 MQTT · 自动更新'):mqText('Browser simulation','浏览器模拟')};
})();
