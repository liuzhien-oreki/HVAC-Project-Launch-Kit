(function(){
 const history=[];let sequence=0,expanded=false;
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 function parse(value){return typeof value==='string'?JSON.parse(value):value}
 function normalize(message){
  const msg=parse(message);if(!object(msg))throw Error('Expected a JSON object');
  let decoded=msg.object??msg.objectJSON??msg.decoded?.payload??(object(msg.decoded)?msg.decoded:undefined)??(object(msg.data)?msg.data:undefined)??(object(msg.payload)?msg.payload:undefined);
  let raw='';
  if(decoded!==undefined)decoded=parse(decoded);
  else if(typeof msg.data==='string'){
   const bytes=msg.encoding==='hex'||msg.data_encoding==='hex'?msg.data.replace(/\s/g,'').match(/.{2}/g)?.map(v=>parseInt(v,16)):Array.from(atob(msg.data),c=>c.charCodeAt(0));
   if(!bytes?.length||bytes.some(v=>!Number.isInteger(v)||v<0||v>255))throw Error('Invalid encoded payload');
   raw=bytes.map(b=>b.toString(16).padStart(2,'0')).join(' ');decoded=WT201Decode(bytes);
  }else decoded=msg;
  if(!object(decoded)||!Object.keys(decoded).length)throw Error('No decoded device fields found');
  const data={...decoded};
  if(typeof data.plan_type==='number')data.plan_type=({0:'wake',1:'away',2:'home',3:'sleep',4:'occupied',5:'vacant',6:'eco',255:'not executed'})[data.plan_type]||'not executed';
  if(typeof data.system_status==='number')data.system_status=data.system_status===1?'on':'off';
  if(typeof data.temperature_control_mode==='number')data.temperature_control_mode=({0:'heat',1:'em heat',2:'cool',3:'auto'})[data.temperature_control_mode];
  if(data.temperature_control_mode==='em_heat')data.temperature_control_mode='em heat';
  if(typeof data.temperature_control_status==='number')data.temperature_control_status=({0:'standby',1:'stage-1 heat',2:'stage-2 heat',3:'stage-3 heat',4:'stage-4 heat',5:'em heat',6:'stage-1 cool',7:'stage-2 cool'})[data.temperature_control_status]||'unknown';
  if(typeof data.fan_mode==='number')data.fan_mode=({0:'auto',1:'always on',2:'circulate',3:'disable'})[data.fan_mode];
  if(typeof data.fan_status==='number')data.fan_status=({0:'standby',1:'high speed',2:'low speed',3:'on'})[data.fan_status]||'unknown';
  if(data.ambient_temperature===undefined&&typeof data.temperature==='number')data.ambient_temperature=data.temperature;
  if(data.current_temperature_control_mode===undefined&&typeof data.temperature_control_mode==='string')data.current_temperature_control_mode={mode:data.temperature_control_mode,status:data.temperature_control_status};
  if(data.fan_mode_setting===undefined&&typeof data.fan_mode==='string')data.fan_mode_setting={mode:data.fan_mode==='on'?'always on':data.fan_mode,status:data.fan_status};
  if(data.fahrenheit_ambient_temperature===undefined&&typeof data.ambient_temperature==='number')data.fahrenheit_ambient_temperature=Math.round((data.ambient_temperature*1.8+32)*10)/10;
  const eui=msg.devEUI||msg.devEui||msg.deveui||msg.deviceInfo?.devEui;
  return {message:{...(eui?{devEUI:eui}:{}),object:data},decoded,raw};
 }
 function markup(){return '<details class="mqtt-recent-uplinks" '+(expanded||mqttUI.tab==='uplink'?'open':'')+' ontoggle="mqttHistoryExpanded(this.open)"><summary>'+mqText('Recent uplinks','最近上行')+' · '+history.length+'/10 <span>'+mqText('Newest first','最新优先')+'</span></summary><div class="mqtt-history-list">'+(history.length?history.map(entry=>'<details class="mqtt-history-entry"><summary><time>'+entry.time+'</time><strong class="'+(entry.status==='Updated'?'ok':'')+'">'+mqEsc(entry.status)+'</strong><code>'+mqEsc(entry.topic)+'</code></summary><div class="mqtt-history-body">'+(entry.reason?'<p>'+mqEsc(entry.reason)+'</p>':'')+'<button onclick="mqttCopyUplink('+entry.id+')">'+mqText('Copy raw JSON','复制原始 JSON')+'</button><h4>Raw message</h4><pre>'+mqEsc(entry.raw)+'</pre>'+(entry.decoded?'<h4>Decoded fields</h4><pre>'+mqEsc(JSON.stringify(entry.decoded,null,2))+'</pre>':'')+'</div></details>').join(''):'<p>'+mqText('No MQTT messages received in this session. Check the connection and uplink topic.','当前会话尚未收到 MQTT 消息，请检查连接和上行 Topic。')+'</p>')+'</div></details>'}
 window.mqttHistoryExpanded=value=>{expanded=value};
 window.mqttCopyUplink=async id=>{const row=history.find(r=>r.id===id);if(!row)return;try{await navigator.clipboard.writeText(row.raw);toast(mqText('Copied','已复制'))}catch(e){toast(mqText('Select and copy the raw message below.','请选中下方原始内容进行复制。'))}};
 const previousUplink=mqttUplinkMarkup;mqttUplinkMarkup=function(){let html=previousUplink();if(mqttUI.transport!=='real')return markup()+html;html=html.replace(/<div class="mqtt-uplink-entry">[\s\S]*?<div class="mqtt-uplink-table">/,'<div class="mqtt-uplink-table">');const source=mqEsc((mqttUI.subscribedTopics||[mqttUI.subscribedTopic||mqttUI.connection.upTopic]).join(' \n'));return '<div class="mqtt-live-source"><strong>'+(mqttUI.connected?mqText('Live subscription','实时订阅'):mqText('Configured subscription · disconnected','订阅配置 · 未连接'))+'</strong><code>'+source+'</code><span>'+mqEsc(mqttUI.subscribedBroker||mqttUI.connection.url)+' · '+mqText('Received','已收到')+' '+(mqttUI.receivedCount||0)+' · '+(mqttUI.lastMessageAt||mqText('Waiting for first message','等待首条消息'))+'</span></div>'+markup()+(!mqttUI.decoded?'<p>'+mqText('Waiting for a real MQTT message. No sample data is shown in live mode.','等待真实 MQTT 消息，真实模式不显示样例数据。')+'</p>':'')+html};
 const codeBeforeLive=mqttCodeValue;mqttCodeValue=function(){if(mqttUI.transport==='real'&&mqttUI.tab==='uplink'&&mqttUI.lastRawUplink){if(mqttUI.code==='mqtt')return mqttUI.lastRawUplink;if(mqttUI.code==='codec'&&!mqttUI.raw)return '// Gateway-decoded JSON: no raw bytes were supplied.\n'+mqttUI.lastRawUplink+'\n\n// Normalized fields\n'+JSON.stringify(mqttUI.decoded,null,2)}return codeBeforeLive()};
 const connectBeforeHistory=mqttConnectReal;mqttConnectReal=async function(){history.length=0;sequence=0;mqttUI.lastRawUplink='';mqttUI.lastRawUplinkTopic='';return connectBeforeHistory()};
 const saveBeforeReconnect=mqttSaveConnection;mqttSaveConnection=function(){if(mqttUI.connected){const next=mqttReadConnectionForm(),changed=['url','devEUI','upTopic','downTopic','qos','fport','portKey'].some(key=>next[key]!==mqttUI.connection[key]);if(changed){mqttUI.adapter.disconnect();mqttUI.connected=false;mqttUI.transport='real';mqttUI.status='Settings changed · reconnect MQTT to apply the new subscription';mqttUI.subscribedTopic='';}}return saveBeforeReconnect()};
 const previousIngest=mqttIngestUplink;
 mqttIngestUplink=function(topic,message){
  const entry={id:++sequence,time:new Date().toLocaleTimeString(),topic,raw:typeof message==='string'?message:JSON.stringify(message,null,2),status:'Received',reason:''};history.unshift(entry);history.length=Math.min(history.length,10);
  try{
   const normalized=normalize(message);entry.decoded=normalized.decoded;
   const eui=normalized.message.devEUI;if(eui&&String(eui).toLowerCase()!==mqttUI.connection.devEUI.toLowerCase()){entry.status='Other device';entry.reason='DevEUI does not match the selected device.'}
   else if(!mqttUI.connected||mqttUI.transport!=='real'){entry.status='Not live';entry.reason='The page is not in connected MQTT mode.'}
   else{
    const before=mqttUI.decoded;mqttUI.error='';previousIngest(topic,normalized.message);
    if(mqttUI.decoded!==before){mqttUI.lastRawUplink=entry.raw;mqttUI.lastRawUplinkTopic=topic;entry.status='Updated';if(normalized.raw)mqttUI.raw=normalized.raw;const d=normalized.message.object;const displayFields=['ambient_temperature','celsius_ambient_temperature','fahrenheit_ambient_temperature','target_temperature','system_status','humidity','current_temperature_control_mode','fan_mode_setting'];if(!displayFields.some(k=>k in d)){entry.status=d.wires_relay?'Relay status':'Received';entry.reason=d.wires_relay?'Relay status received. This packet contains no temperature or setpoint; the display keeps the latest reported temperatures.':'Message parsed; it contains no thermostat display fields.'}}
    else {entry.status=mqttUI.error?'Parse / filter issue':'Filtered';entry.reason=mqttUI.error||'Check the uplink topic filter and device identity.'}
   }
  }catch(e){entry.status='Invalid payload';entry.reason=e.message;mqttUI.error='Uplink: '+e.message}
  mqttRender();
 };
 mqttUI.adapter.onMessage(mqttIngestUplink);HVACMQTT.receive=mqttIngestUplink;
 const style=document.createElement('style');style.textContent='.mqtt-live-source{display:grid;gap:6px;background:#f2f6fa;border-radius:8px;padding:12px;margin-bottom:12px;font-size:14px}.mqtt-live-source code{white-space:pre-wrap;font-size:15px;overflow-wrap:anywhere}.mqtt-live-source>span{color:#64818f}.mqtt-recent-uplinks{border:1px solid #dbe5ec;border-radius:8px;margin:14px 0;background:#fff}.mqtt-recent-uplinks>summary{padding:11px 13px;font-weight:600;font-size:15px;cursor:pointer}.mqtt-recent-uplinks>summary>span{font-weight:400;color:#78909e;font-size:14px;float:right}.mqtt-history-list{max-height:350px;overflow:auto;padding:0 12px 10px}.mqtt-history-list>p{font-size:14px}.mqtt-history-entry{border-top:1px solid #e5edf2}.mqtt-history-entry>summary{display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 0;font-size:14px}.mqtt-history-entry time{color:#738897;white-space:nowrap}.mqtt-history-entry strong{font-size:14px;color:#a66b2b;white-space:nowrap}.mqtt-history-entry strong.ok{color:#214d82}.mqtt-history-entry summary code{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.mqtt-history-body{padding:4px 0 12px}.mqtt-history-body h4{margin:12px 0 6px;font-size:14px}.mqtt-history-body p{font-size:14px;color:#9a5c35}.mqtt-history-body pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f4f8fa;padding:12px;font-size:13px;line-height:1.5;max-height:240px;overflow:auto;border-radius:6px}.mqtt-history-body button{font-size:14px;padding:6px 10px}';document.head.append(style);
})();
