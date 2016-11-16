var clientId = new Date().getTime().toString();
var client = new Paho.MQTT.Client("storybox.mqtt.roobo.com", 8083, clientId);
//var client = new Paho.MQTT.Client("58.254.217.112", 9001, clientId);
	// set callback handlers
client.onConnectionLost = onConnectionLost;

var onConnectCallback;

function onConnect(){
	// Once a connection has been made, make a subscription and send a message.
	  console.log("onConnect");
	  //alert("onConnect");

	  if(window.deviceId != ""){
		  client.subscribe("storybox/"+window.deviceId+"/client");
		  //client.subscribe("storybox/"+window.deviceId+"/server");
	  }

	  //询问设备是否在线
	  //var objCmd = {cmd:"getOnlineStatus"};
	  //clientPublish(objCmd);
	  //alert(window.deviceId);
	  if(onConnectCallback)
		  onConnectCallback();

	  //支持离线消息，clearSession=false外，还必须订阅时qos=1
	  //client.subscribe('12345',{qos:1});
}

function onFailure(){
	var date = new Date();
	console.log(date+" failure,try to reclient");
	clientConnect();
}

function onConnectionLost(){

	 clientConnect();
}

function onMessageDelivered(message){
	alert("发送成功");
}

//function onMessageArrived(message){
//	alert(message.payloadString);
//}


function clientCreate(onConnectCallback){
	if(WebSocketCheck()){
		client.onMessageArrived = onMessageArrived;

		onConnectCallback = onConnectCallback;
		clientConnect();
	}
	else{
		var html = "<div class=\"alert alert-danger notSupportWebSocket\"><span>抱歉，您的浏览器不支持某些重要特性，有些功能无法正常使用</span></div>";
    	$("body").find("div").eq(0).before(html);
	}
}

function clientConnect(){
	// connect the client
	try{
		client.connect({
			cleanSession:false,
			onSuccess:onConnect,
			onFailure:onFailure
			});
	}
	catch(error){
		console.log(error);
	}
}

function clientPublish(obj){
	if(WebSocketCheck()){
		var s = JSON.stringify(obj); //message is object ,like {cmd:"download",track:{url:play_url_32,title:trackId}}
		console.log(s);
		//alert(s);
		if(window.deviceId != ""){
			//var bytes = str2ab(s);
			var message = new Paho.MQTT.Message(s);
			//message = new Paho.MQTT.Message("hello");
		 	var topic = "storybox/"+window.deviceId+"/server/page";
		 	//alert(topic);
		 	message.destinationName = topic;
		 	try{
		 		client.send(message);
		 	}
		 	catch(error){
		 		console.log(error);
		 	}
		}
	}
}


function WebSocketCheck()
{
   if ("WebSocket" in window)
      return true;
   else
	  return false;
}

function onMessageArrived(message){
	console.log("onMessageArrived:"+message.payloadString);

	try{
		var obj = JSON.parse(message.payloadString);
		console.log(obj);
		if(obj.hasOwnProperty("onlineStatus")){
			if(onlineStatus_change)
				onlineStatus_change(obj.onlineStatus);
		}
		else if(obj.hasOwnProperty("boxInfo")){
			if(showBoxInfo)
				showBoxInfo(obj.boxInfo);
		}
		else if(obj.hasOwnProperty("volume")){
			if(currentVolumeDisplay)
				currentVolumeDisplay(obj.volume);
		}
		else if(obj.hasOwnProperty("trackListId") && obj.hasOwnProperty("trackId") && obj.hasOwnProperty("type")){
			if(playTrack_change)
				playTrack_change(obj.trackListId,obj.trackId,obj.type);
		}
		else if(obj.hasOwnProperty("playStatus")){
			if(playStatus_change)
				playStatus_change(obj.playStatus);
		}
		else if(obj.hasOwnProperty("mode")){
			if(mode_change)
				mode_change(obj.mode);
		}
		else if(obj.hasOwnProperty("downloadStatus") && obj.hasOwnProperty("trackId")){
			if(after_download)
			if(after_download)
				after_download(obj.downloadStatus,obj.trackId);
		}
		else if(obj.hasOwnProperty("configWifi")){
			if(onConfigWifi)
				onConfigWifi(obj.configWifi);
		}
		else if(obj.hasOwnProperty("playSinVoiceUrl") && obj.hasOwnProperty("openId")){
			console.log("------------------------------------");
			if(playSinVoiceUrl)
				playSinVoiceUrl(obj.playSinVoiceUrl,obj.openId);
		}
	}
	catch(e){
		console.log(e);
	}
}

/*********************************发消息*************************************/
//播放当前歌曲
function playTrack(trackListId,trackId,url,downloadUrl){
	var cmdObj = {cmd:"playTrack",trackListId:trackListId,trackId:trackId,url:url,downloadUrl:downloadUrl};
	clientPublish(cmdObj);
}

//下一首
function forwardTrack(){
	var cmdObj = {cmd:"forward"};
	clientPublish(cmdObj);
}

//上一首
function backwardTrack(){
	var cmdObj = {cmd:"backward"};
	clientPublish(cmdObj);
}

//暂停
function pauseTrack(){
	var cmdObj = {cmd:"pause"};
	clientPublish(cmdObj);
}

//继续播放
function resumeTrack(){
	var cmdObj = {cmd:"resume"};
	clientPublish(cmdObj);
}

//询问当前播放歌曲
function queryTrack(){
	var cmdObj = {cmd:"getTrack"};
	clientPublish(cmdObj);
}

//询问当前播放状态
function queryPlayStatus(){
	var cmdObj = {cmd:"getPlayStatus"};
	clientPublish(cmdObj);
}

//询问当前播放模式
function queryMode(){
	var cmdObj = {cmd:"getMode"};
	clientPublish(cmdObj);
}

//设置列表循环
function setRepeatall(){
	var cmdObj = {cmd:"setMode",value:"repeat all"};
	clientPublish(cmdObj);
}

//设置单曲循环
function setRepeatone(){
	var cmdObj = {cmd:"setMode",value:"repeat one"};
	clientPublish(cmdObj);
}

//远程关机
function cmd_poweroff(){
	var cmdObj = {cmd:"setPoweroff"};
	clientPublish(cmdObj);

}

//设置音量
function cmd_setvolume(value){
	var cmdObj = {cmd:"setVolume",value:value};
	clientPublish(cmdObj);
}


//主动询问是否在线
function getOnlineStatus(){
	var cmdObj = {cmd:"getOnlineStatus"};
	clientPublish(cmdObj);
}

//主动询问设备信息
function getBoxInfo(){
	var cmdObj = {cmd:"getBoxInfo"};
	clientPublish(cmdObj);
}

//升级指令
function boxUpgrade(versionName,firmwareUrl){
	var cmdObj = {cmd:"upgrade",versionName:versionName,firmwareUrl:firmwareUrl};
	clientPublish(cmdObj);
}
