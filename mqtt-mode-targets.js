/* Targets belong to control modes. Demo values never seed a real connection. */
(function(){
 const modes=['heat','em heat','cool','auto'];
 const cn={'制热':'heat','应急制热':'em heat','制冷':'cool','自动':'auto'};
 const current=()=>modes.includes(mqttUI.quickMode)?mqttUI.quickMode:'cool';
 const active=()=>integrationChoice==='MQTT'||integrationChoice==='NS-MQTT';
 const store=mqttUI.modeTargets={simulation:{heat:20,'em heat':21,cool:24,auto:22},real:{}};
 store.simulation[current()]=applied;
 let selected=current(),kind='simulation',confirmedMode=null,pendingTarget;
 const bank=()=>store[mqttUI.transport==='real'?'real':'simulation'];
 function restore(){
  const value=bank()[selected];mqttUI.modeTargetUnknown=mqttUI.transport==='real'&&!Number.isFinite(value);
  if(Number.isFinite(value)){applied=setpoint=value;mqttUI.quickTarget=value*1.8+32;if(mqttUI.transport==='real')mqttUI.hasTargetPreview=true}
  else if(mqttUI.transport==='real'){mqttUI.quickTarget=NaN;mqttUI.hasTargetReport=false;mqttUI.hasTargetPreview=false}
  const field=document.querySelector('[data-mqtt-target]');if(field)field.value=mqttUI.modeTargetUnknown?'':mqttQuickTargetDisplay();renderLCD();
 }
 function remember(){if(!mqttUI.modeTargetUnknown&&Number.isFinite(applied))bank()[selected]=applied}
 function select(mode,save=true){if(!modes.includes(mode))return;const nextKind=mqttUI.transport==='real'?'real':'simulation';if(nextKind===kind&&save)remember();kind=nextKind;selected=mode;restore()}
 const previewBefore=mqttPreviewCommand;
 mqttPreviewCommand=function(command){
  if(!active())return previewBefore(command);
  const mode=command.current_temperature_control_mode?.mode;
  if(mode)select(mode);
  const targetMode=command.temperature_control_mode||mode||selected;
  let visible=command;
  if(typeof command.target_temperature==='number'&&Number.isFinite(command.target_temperature)){
   if(modes.includes(targetMode))bank()[targetMode]=command.target_temperature;
   // Configuring a different mode's target must not change the active screen.
   if(targetMode!==selected){visible={...command};delete visible.target_temperature}
  }
  const result=previewBefore(visible);restore();return result;
 };
 const displayBefore=mqttQuickTargetDisplay;
 mqttQuickTargetDisplay=function(){return active()&&mqttUI.transport==='real'&&mqttUI.modeTargetUnknown?'':displayBefore()};
 const commandBefore=mqttQuickCommand;
 mqttQuickCommand=function(){if(active()&&mqttUI.quickSelection==='target'&&mqttUI.modeTargetUnknown)throw Error('Enter a target for the selected mode, or wait for its device report.');return commandBefore()};
 // A user-entered target establishes a preview even when no report exists yet.
 const inputBefore=mqttQuickTargetInput;
 mqttQuickTargetInput=function(value){if(active()&&value!==''&&Number.isFinite(Number(value))){const c=unitState.unit==='F'?(Number(value)-32)/1.8:Number(value);if(c>=5&&c<=35){mqttUI.modeTargetUnknown=false;bank()[selected]=c}}return inputBefore(value)};
 const changeBefore=mqttQuickChange;
 mqttQuickChange=function(key,value){
  if(active()&&key==='quickMode')select(value);
  const result=changeBefore(key,value);
  if(active()&&key==='quickTarget'){remember();restore()}
  return result;
 };
 const physicalBefore=physical;
 physical=function(action){
  if(!active())return physicalBefore(action);
  if(mqttUI.transport==='real'&&mqttUI.modeTargetUnknown&&['plus','minus'].includes(action)){toast(mqText('Enter this mode’s target first, or wait for its device report.','请先输入当前模式的目标温度，或等待设备上报。'));return}
  const beforeMode=selected,result=physicalBefore(action);
  if(mqttUI.transport!=='real'){
   const mode=cn[appliedMode];if(mode&&mode!==beforeMode){mqttUI.quickMode=mode;select(mode)}else if(['plus','minus'].includes(action))remember();
   restore();mqttRender();
  }
  return result;
 };
 const ingestBefore=mqttIngestUplink;
 mqttIngestUplink=function(topic,message){
  const before=mqttUI.decoded,result=ingestBefore(topic,message);
  if(mqttUI.decoded===before||mqttUI.transport!=='real')return result;
  const data=mqttUI.decoded,mode=data.current_temperature_control_mode?.mode;
  const target=data.celsius_target_temperature??data.target_temperature??(typeof data.fahrenheit_target_temperature==='number'?(data.fahrenheit_target_temperature-32)/1.8:undefined);
  if(modes.includes(mode))confirmedMode=mode;
  if(Number.isFinite(target)){
   if(confirmedMode){store.real[confirmedMode]=target;pendingTarget=undefined}else pendingTarget=target;
  }else if(confirmedMode&&Number.isFinite(pendingTarget)){store.real[confirmedMode]=pendingTarget;pendingTarget=undefined}
  kind='real';selected=current();restore();mqttRender();return result;
 };
 mqttUI.adapter.onMessage(mqttIngestUplink);HVACMQTT.receive=mqttIngestUplink;
 const connectBefore=mqttConnectReal;
 mqttConnectReal=async function(){store.real={};confirmedMode=null;pendingTarget=undefined;const result=await connectBefore();if(mqttUI.transport==='real'){kind='real';selected=current();restore();mqttRender()}return result};
 const simulationBefore=mqttReturnSimulation;
 mqttReturnSimulation=async function(){const result=await simulationBefore();if(active()){kind='simulation';selected=current();restore();mqttRender()}return result};
 const appliedBefore=mqttApplySimulated;mqttApplySimulated=function(command){const result=appliedBefore(command);if(active())restore();return result};
 const markupBefore=mqttQuickMarkup;mqttQuickMarkup=function(){return markupBefore().replace('data-mqtt-target','data-mqtt-target placeholder="'+(mqttUI.modeTargetUnknown&&mqttUI.transport==='real'?mqText('Waiting for setpoint','等待该模式设定值'):'')+'"')};
 const viewBefore=views[3];views[3]=function(){if(active()){kind=mqttUI.transport==='real'?'real':'simulation';selected=current();restore()}return viewBefore()};
})();
