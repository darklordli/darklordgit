<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title>远程设置
	</title>

	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<link href="resources/theme1/css/nouislider.min.css" rel="stylesheet">
	<link href="resources/theme1/css/common.css" rel="stylesheet">

	<style type="text/css">
		.setting{
			padding-top: 50px;
			text-align: center;
		}

		.setting span{
			font-size: 14px;
			display: block;
		}

		#slider-range {
		    width: 250px;
		    margin: 50px auto;
		}
	</style>

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/bootbox.min.js"></script>
	<script src="js/lib/mqttws31.js"></script>
	<script src="js/lib/nouislider.min.js"></script>
	<script src="js/mqttclient.js"></script>
	<script src="js/common.js"></script>


</head>

<body>
	<div class="setting">
		<input type="hidden" name="openid" value="${openid}" />
		<input type="hidden" name="deviceId" value="${deviceId}" />
		<span>音量</span>

		<div id="slider-range"></div>

		<span>关机</span>
		<img src="resources/theme1/img/btn_closedevice.png" style="width:64px;height:64px;" onclick="poweroff()" />
	</div>
	<div class="offline" style="display:none;">
		<span>故事机不在线</span>
	</div>

<script type="text/javascript">
window.deviceId = "";
window.deviceOnline = false;

$(document).ready(function() {
	window.deviceId = $("input[name=deviceId]").val();
	var volume = 0;

	var url = "boxinfo/get.do?deviceId="+window.deviceId;
	console.log(url);
	$
	.ajax({
		type: 'GET',
		url : url,
		dataType: 'json',
		cache:false,
		async:false,
		error: function(data){
			alert('Error'+data);
		},
		success : function(
				data) {

			volume = data.volume;
			window.deviceOnline = data.online;

			showOffline();
		}
	});
	//console.log(window.deviceId);
	clientCreate(onConnectCallback);

	var rangeSlider = document.getElementById('slider-range');

	noUiSlider.create(rangeSlider, {
		start: [volume],
		step:1,
		range: {
			'min': [0],
			'max': [40]
		}
	});


	//这里必须使用change事件，drag和tap
	rangeSlider.noUiSlider.on('change', function( values, handle ) {
		var volumeValue = parseInt(values[handle]);
		console.log("volume value:"+volumeValue);
		doSetVolume(volumeValue);
	});


});

function doSetVolume(volumeValue){
	var boxinfo = {id:window.deviceId,volume:volumeValue};
	$.ajax({
		type : "POST",
		url : "boxinfo/setvolume.do?",
		contentType : 'application/json',
		async : true,
		timeout : 4000,
		data : JSON.stringify(boxinfo),
		success : function(msg) {
			if(msg == "ok"){

			}
		},
		error : function(data) {
			//hideMaskLoading();
		}
	});
	cmd_setvolume(volumeValue);
}

//远程关机
function poweroff(){
	bootbox.confirm({
	    size: 'small',
	    message: "确定要关机吗？",
	    callback: function(result){
	    	if(result){
	    		cmd_poweroff();

	    		$(".offline").show();
	    	}
	    }
	});
}

/*function onMessageArrived(message){
	console.log("onMessageArrived:"+message.payloadString);

	try{
		var obj = JSON.parse(message.payloadString);
		console.log(obj);
		if(obj.hasOwnProperty("volume")){
			currentVolumeDisplay(obj.volume);
		}else if(obj.hasOwnProperty("onlineStatus")){
			onlineStatus_change(obj.onlineStatus);
		}
	}
	catch(e){
		console.log(e);
	}
}*/

//当前是否在线情况的改变
function onlineStatus_change(onlineStatus){
	if(onlineStatus == "on" || onlineStatus == "online" || onlineStatus == "on-upgrade-failed"){
		window.deviceOnline = true;
	}
	else
		window.deviceOnline = false;

	showOffline();
}

function showOffline(){
	//alert(window.deviceOnline);
	if(window.deviceOnline == false)
		$(".offline").show();
	else
		$(".offline").hide();
}

function currentVolumeDisplay(volume){
	var slider = document.getElementById('slider-range');
	slider.noUiSlider.set(volume);
}
</script>
</body>
