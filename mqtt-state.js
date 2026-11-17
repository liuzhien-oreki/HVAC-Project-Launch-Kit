(function(){
 let connecting=false,lastReport=null;
 function markup(){
  const live=mqttUI.transport==='real',state=connecting?'connecting':live?(mqttUI.connected?'connected':'disconnected'):'simulation';
  const title={connecting:mqText('MQTT · Connecting…','MQTT · 连接中…'),connected:mqText('MQTT · Connected','MQTT · 已连接'),disconnected:mqText('MQTT · Disconnected','MQTT · 已断开'),simulation:mqText('Simulation','模拟模式')}[state];
  const detail=state==='connected'?(lastReport?mqText('Last device report: ','最近设备上报：')+lastReport.toLocaleTimeString():mqText('Subscribed · waiting for device report','已订阅 · 等待设备上报')):state==='disconnected'?mqText('Reconnect to receive reports and send commands','重新连接后可接收上报和下发指令'):state==='connecting'?mqText('Connecting to broker and subscribing','正在连接服务器并订阅'):mqText('Real MQTT is off','真实 MQTT 未开启');
  return '<span id="mqtt-connection-state" class="mqtt-connection-state '+state+'" role="status" aria-live="polite" title="'+mqEsc(detail)+'"><span class="mqtt-state-dot" aria-hidden="true"></span>'+title+'</span>';
 }
 function update(){const el=document.getElementById('mqtt-connection-state');if(el)el.outerHTML=markup()}
 const priorMarkup=mqttConsoleMarkup;mqttConsoleMarkup=function(){return priorMarkup().replace('<button onclick="openMqttConnection()">','<div class="mqtt-head-actions">'+markup()+'<button onclick="openMqttConnection()">').replace('</button></div><div class="mqtt-console-tabs">','</button></div></div><div class="mqtt-console-tabs">')};
 const priorConnect=mqttConnectReal;mqttConnectReal=async function(){connecting=true;lastReport=null;update();try{return await priorConnect()}finally{connecting=false;update()}};
 const priorDisconnect=HVACMQTT.onDisconnected;HVACMQTT.onDisconnected=function(){connecting=false;priorDisconnect();update()};
 const priorSimulation=mqttReturnSimulation;mqttReturnSimulation=async function(){try{return await priorSimulation()}finally{connecting=false;lastReport=null;update()}};
 const priorIngest=mqttIngestUplink;mqttIngestUplink=function(topic,message){const previous=mqttUI.decoded;priorIngest(topic,message);if(mqttUI.connected&&mqttUI.transport==='real'&&mqttUI.decoded!==previous){lastReport=new Date();update()}};
 mqttUI.adapter.onMessage(mqttIngestUplink);HVACMQTT.receive=mqttIngestUplink;
 const storageKey='hvac-mqtt-connection-v1';
 function save(){try{const username=document.getElementById('mqtt-username')?.value||'';const u=new URL(mqttUI.connection.url);u.username='';u.password='';localStorage.setItem(storageKey,JSON.stringify({...mqttUI.connection,url:u.toString(),username}))}catch(e){}}
 try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved&&typeof saved.url==='string'&&/^[a-f\d]{16}$/i.test(saved.devEUI)){for(const key of ['url','devEUI','upTopic','downTopic','qos','fport','portKey'])if(saved[key]!==undefined)mqttUI.connection[key]=saved[key]}}catch(e){}
 const openPrevious=openMqttConnection;openMqttConnection=function(){openPrevious();try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved?.username)document.getElementById('mqtt-username').value=saved.username}catch(e){}};
 const savePrevious=mqttSaveConnection;mqttSaveConnection=function(){const previous=mqttUI.connection;savePrevious();if(mqttUI.connection!==previous)save()};
 const connectPrevious=mqttConnectReal;mqttConnectReal=async function(){const result=await connectPrevious();if(mqttUI.connected)save();return result};
 const modalPrevious=mqttConnectionModal;mqttConnectionModal=function(){return modalPrevious().replace('Credentials are not saved in browser storage.','Connection settings are saved in this browser. Passwords are session-only.').replace('Username (session only)','Username (remembered)').replace('页面不将凭证写入浏览器存储。','连接配置保存在当前浏览器，密码仅用于当前会话。')};
 const style=document.createElement('style');style.textContent='.mqtt-head-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:flex-end}.mqtt-connection-state{display:inline-flex;align-items:center;gap:7px;color:#718592;font-size:14px;white-space:nowrap}.mqtt-state-dot{width:8px;height:8px;border-radius:50%;background:#8b9ba5;flex-shrink:0}.mqtt-connection-state.connected{color:#234d81}.mqtt-connection-state.connected .mqtt-state-dot{background:#235fa5}.mqtt-connection-state.disconnected{color:#b45240}.mqtt-connection-state.disconnected .mqtt-state-dot{background:#d16a54}.mqtt-connection-state.connecting .mqtt-state-dot{background:#e3a129;animation:mqtt-state-pulse 1.5s ease-in-out infinite}@keyframes mqtt-state-pulse{50%{opacity:.35}}@media(prefers-reduced-motion:reduce){.mqtt-state-dot{animation:none!important}}';document.head.append(style);
})();
