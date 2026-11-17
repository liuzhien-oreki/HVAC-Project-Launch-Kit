/* Key illustrations from the official UC701 online guide, not PDF-page screenshots. */
const UCI_IMAGES=[
 [['uc701-air-conditioner-type.png','Identify the AC type and check its IR remote']],
 [['uc701-installation-location.jpg','Choose an unobstructed IR path and installation position']],
 [['uc701-insert-external-sensor.png','Connect only the optional probes and IR emitter needed'],['uc701-transformer1.png','CT: clamp one conductor, not the combined L/N cable']],
 [['uc701-wall-screw-mount-controller.png','Secure the controller to the mounting plate'],['uc701-battery-installation.png','Optional battery compartment: observe polarity']],
 [['toolbox-app-bluetooth-scan-qr.jpg','Scan the device QR code in Bluetooth mode'],['uc701-bluetooth-search-device.jpg','Select the matching UC701 device']],
 [['uc701-ir-code-learning-path.jpg','Device → IR Code Learning → Start Learning'],['uc701-enter-ir-learning-mode.jpg','Follow the on-screen IR learning sequence']],
 [['uc701-test-ac-control.jpg','Test power, mode, setpoint and fan against the actual AC']],
 [['uc701-ac-control-parameters.jpg','Enable supported AC modes and independent targets'],['toolbox-app-lorawan-setting.jpg','Match the gateway frequency plan and join credentials']],
 [['uc701-keep-bluetooth-advertising.jpg','Keep UC701 Bluetooth advertising available'],['wt401-communication-ble-pairing.jpg','WT401: select the intended UC701 and pair']],
 [['uc701-ac-control-toolbox.jpg','Validate the final controls and record the room configuration']]
];
const UCI_SOURCES=['compatibility.html','hardware-installation.html','hardware-installation.html','hardware-installation.html','accessing-the-device-using-bluetooth.html','ir-code-learning.html','ir-code-learning.html','configure-lorawan-parameters.html','configure-communication-parameters.html','configure-air-conditioner-control-parameters.html'];
UC701_DATA.install.forEach((step,i)=>{step.images=UCI_IMAGES[i].map(([file,caption])=>({image:'uc701/install/'+file,caption}));step.image=step.images[0].image;step.source=UC701_DOC+UCI_SOURCES[i];step.text=step.text.replace('Cool 77°F (25°C)','Cool 25°C (77°F)')});
const uciOriginalArticle=ucGuideArticle;ucGuideArticle=function(){const html=uciOriginalArticle(),steps=ucGuideSteps(),step=steps[Math.min(UC.guide.step,steps.length-1)];if(!step.images)return html;const gallery='<div class="uci-step-gallery '+(step.images.length===1?'single':'')+'">'+step.images.map(({image,caption})=>'<figure><button class="uc-guide-image uci-key-image" onclick="ucZoom(\''+image+'\')"><img src="assets/'+image+'" alt="'+ucEsc(caption)+'"><span>Click to enlarge</span></button><figcaption>'+ucEsc(caption)+'</figcaption></figure>').join('')+'</div>';return html.replace(/<button class="uc-guide-image"[\s\S]*?<\/button>/,gallery)};
