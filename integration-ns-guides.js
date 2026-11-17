const nsGuideRoot='https://support.milesight-iot.com/support/solutions/articles/';
const nsGuides=[
['The Things Stack / TTN',[['Basic Station','73000514079-milesight-gateway-the-things-stack-ttn-integration-via-basic-station'],['Semtech Packet Forwarder','73000514119-the-things-stack-milesight-gateway-integration-via-semtech-packet-forwarder']]],
['ChirpStack',[['Integration guide','73000514269-chirpstack-milesight-gateway-integration']]],
['Actility ThingPark',[['Basic Station','73000626112-actility-thingpark-milesight-gateway-integration-via-basic-station'],['LRR software','73000643849-milesight-gateway-actility-thingpark-integration-via-lrr-software']]],
['AWS IoT Core for LoRaWAN',[['Integration guide','73000514215-aws-iot-core-for-lorawan-milesight-gateways-integration']]],
['Senet',[['Integration guide','73000514112-senet-milesight-gateway-integration']]],
['LORIOT',[['Integration guide','73000514249-loriot-milesight-gateway-integration']]],
['Everynet',[['Integration guide','73000573360-everynet-platform-integration']]],
['Sensgreen',[['Integration guide','73000625819-milesight-gateway-sensgreen-integration']]]
];
function nsServerIcon(){return '<svg class="ns-server-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="10" y="5" width="28" height="12" rx="3"/><rect x="10" y="21" width="28" height="12" rx="3"/><path d="M16 11h2m5 0h9M16 27h2m5 0h9M24 33v9M9 42h30M9 39v6m30-6v6"/></svg>'}
function openNsGuides(){document.getElementById('ns-guides-dialog').showModal()}
function nsIntegrationModal(){const t=installCopy;return '<dialog id="ns-guides-dialog" class="ns-guides-dialog" aria-labelledby="ns-guides-title"><header>'+nsServerIcon()+'<div><h2 id="ns-guides-title">'+t('Third-party network servers','第三方网络服务器')+'</h2><p>'+t('Choose your platform to open the official integration guide.','选择平台，打开官方集成说明。')+'</p></div><button class="ns-close" aria-label="'+t('Close','关闭')+'" onclick="document.getElementById(\'ns-guides-dialog\').close()">×</button></header><div class="ns-guide-grid">'+nsGuides.map((g,i)=>'<article class="ns-guide-card">'+nsServerIcon()+'<div><h3>'+g[0]+'</h3>'+g[1].map(l=>'<a href="'+nsGuideRoot+l[1]+'" target="_blank" rel="noopener">'+(l[0]==='Integration guide'?t('Integration guide','集成说明'):l[0])+' ↗</a>').join('')+'</div></article>').join('')+'</div><div class="ns-guides-footer"><span>'+t('Gateway → network server setup. Follow each guide’s model and firmware requirements.','网关 → 网络服务器接入。请按各文档核对网关型号及固件要求。')+'</span><a href="https://support.milesight-iot.com/support/solutions/folders/73000565001" target="_blank" rel="noopener">'+t('All official guides','全部官方说明')+' ↗</a></div></dialog>'}
