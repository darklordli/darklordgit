function onConnect(){""!=window.deviceId&&client.subscribe("storybox/"+window.deviceId+"/client"),onConnectCallback&&onConnectCallback()}function onFailure(){new Date;clientConnect()}function onConnectionLost(){clientConnect()}function onMessageDelivered(e){}function clientCreate(e){if(WebSocketCheck())client.onMessageArrived=onMessageArrived,e=e,clientConnect();else{var n='<div class="alert alert-danger notSupportWebSocket"><span>抱歉，您的浏览器不支持某些重要特性，有些功能无法正常使用</span></div>';$("body").find("div").eq(0).before(n)}}function clientConnect(){try{client.connect({cleanSession:!1,onSuccess:onConnect,onFailure:onFailure})}catch(e){}}function clientPublish(e){if(WebSocketCheck()){var n=JSON.stringify(e);if(""!=window.deviceId){var t=new Paho.MQTT.Message(n),o="storybox/"+window.deviceId+"/server/page";t.destinationName=o;try{client.send(t)}catch(a){}}}}function WebSocketCheck(){return"WebSocket"in window}function onMessageArrived(e){try{var n=JSON.parse(e.payloadString);n.hasOwnProperty("onlineStatus")?onlineStatus_change&&onlineStatus_change(n.onlineStatus):n.hasOwnProperty("boxInfo")?showBoxInfo&&showBoxInfo(n.boxInfo):n.hasOwnProperty("volume")?currentVolumeDisplay&&currentVolumeDisplay(n.volume):n.hasOwnProperty("trackListId")&&n.hasOwnProperty("trackId")&&n.hasOwnProperty("type")?playTrack_change&&playTrack_change(n.trackListId,n.trackId,n.type):n.hasOwnProperty("playStatus")?playStatus_change&&playStatus_change(n.playStatus):n.hasOwnProperty("mode")?mode_change&&mode_change(n.mode):n.hasOwnProperty("downloadStatus")&&n.hasOwnProperty("trackId")?after_download&&after_download&&after_download(n.downloadStatus,n.trackId):n.hasOwnProperty("configWifi")?onConfigWifi&&onConfigWifi(n.configWifi):n.hasOwnProperty("playSinVoiceUrl")&&n.hasOwnProperty("openId")&&playSinVoiceUrl&&playSinVoiceUrl(n.playSinVoiceUrl,n.openId)}catch(t){}}function playTrack(e,n,t,o){var a={cmd:"playTrack",trackListId:e,trackId:n,url:t,downloadUrl:o};clientPublish(a)}function forwardTrack(){var e={cmd:"forward"};clientPublish(e)}function backwardTrack(){var e={cmd:"backward"};clientPublish(e)}function pauseTrack(){var e={cmd:"pause"};clientPublish(e)}function resumeTrack(){var e={cmd:"resume"};clientPublish(e)}function queryTrack(){var e={cmd:"getTrack"};clientPublish(e)}function queryPlayStatus(){var e={cmd:"getPlayStatus"};clientPublish(e)}function queryMode(){var e={cmd:"getMode"};clientPublish(e)}function setRepeatall(){var e={cmd:"setMode",value:"repeat all"};clientPublish(e)}function setRepeatone(){var e={cmd:"setMode",value:"repeat one"};clientPublish(e)}function cmd_poweroff(){var e={cmd:"setPoweroff"};clientPublish(e)}function cmd_setvolume(e){var n={cmd:"setVolume",value:e};clientPublish(n)}function getOnlineStatus(){var e={cmd:"getOnlineStatus"};clientPublish(e)}function getBoxInfo(){var e={cmd:"getBoxInfo"};clientPublish(e)}function boxUpgrade(e,n){var t={cmd:"upgrade",versionName:e,firmwareUrl:n};clientPublish(t)}var clientId=(new Date).getTime().toString(),client=new Paho.MQTT.Client("storybox.mqtt.roobo.com",8083,clientId);client.onConnectionLost=onConnectionLost;var onConnectCallback;