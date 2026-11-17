(function(){
 const half=v=>Math.round(Number(v)*2)/2;
 function snapTarget(){setpoint=applied}
 // Apply the control preview without generating a synthetic device report.
 window.mqttPreviewCommand=function(command){
  if(command.system_status!==undefined){unitState.power=command.system_status==='on';mqttUI.quickPower=unitState.power?'on':'off'}
  const control=command.current_temperature_control_mode?.mode;
  if(control){mqttUI.quickMode=control;appliedMode=mode=({heat:'制热',cool:'制冷',auto:'自动','em heat':'应急制热'})[control]||appliedMode}
  if(typeof command.target_temperature==='number'){mqttUI.hasTargetPreview=true;applied=setpoint=command.target_temperature;}
  if(command.fan_mode_setting?.mode){mqttUI.quickFan=command.fan_mode_setting.mode;unitState.fan=({auto:'Auto','always on':'On',circulate:'Circulate'})[mqttUI.quickFan]||unitState.fan}
  if(command.temperature_unit?.unit)unitState.unit=command.temperature_unit.unit==='fahrenheit'?'F':'C';
  if(command.child_lock_config)unitState.locked=Object.values(command.child_lock_config).some(v=>v==='enable');
  if(command.control_permission)unitState.remote=command.control_permission==='remote control';
  if(command.plan_type!==undefined)setLcdPlan(command.plan_type);
  snapTarget();mqttUI.quickTarget=applied*1.8+32;renderLCD();
 };
 const oldLCD=renderLCD;renderLCD=function(){snapTarget();return oldLCD()};
 const oldQuick=mqttQuickChange;mqttQuickChange=function(key,value){if(key==='quickTarget'){value=unitState.unit==='C'?half((Number(value)-32)/1.8)*1.8+32:half(value);if(!Number.isFinite(value))return;const input=document.querySelector('[data-mqtt-target]');if(input)input.value=unitState.unit==='C'?half((value-32)/1.8):half(value)}oldQuick(key,value);mqttPreviewCommand(mqttQuickCommand())};
 const oldQuickMarkup=mqttQuickMarkup;mqttQuickMarkup=function(){return oldQuickMarkup().replace('step="1"','step="0.5"')};
 const oldQuickCommand=mqttQuickCommand;mqttQuickCommand=function(){mqttUI.quickTarget=half(mqttUI.quickTarget);return oldQuickCommand()};
 const oldPhysical=physical;physical=function(action){if(mqttUI.transport==='real')return oldPhysical(action);if(action==='plus'||action==='minus'){if(unitState.locked||unitState.remote||!unitState.power)return oldPhysical(action);const shown=unitState.unit==='F'?applied*1.8+32:applied;const next=half(shown)+(action==='plus'?.5:-.5);applied=setpoint=unitState.unit==='F'?(next-32)/1.8:next;renderLCD();mqttUI.quickTarget=applied*1.8+32;mqttRender();return}return oldPhysical(action)};
 const oldRender=mqttRender;mqttRender=function(){oldRender();if(mqttUI.transport==='real'){const caption=document.querySelector('.mqtt-device-column details');if(caption)caption.innerHTML=deviceOperationHelp()}};
})();
