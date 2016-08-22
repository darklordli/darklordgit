<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Access-Control-Allow-Origin" content="*" />
	<title>设备信息
	</title>

	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<link href="resources/theme1/css/common.css" rel="stylesheet">

	<style type="text/css">
		li.boxinfoitem span.description{
			font-size: 14px;
			font-weight: normal;
		}

		li.boxinfoitem span.value{
			float:right;
			font-size: 14px;
			font-weight: normal;
			color: #d3d3d3;
		}

		#btnUpgrade{
			float:right;
		}

		.battery{
			float:right;
			width:32px;
			height: 28px;
			background-repeat:no-repeat;
		    background-position:right top;
		    background-size:32px 28px;
		}

		.battery_empty{
			background-image:url(resources/theme1/img/battery_empty.png);
		}

		.battery_caution{
			background-image:url(resources/theme1/img/battery_caution.png);
		}

		.battery_low{
			background-image:url(resources/theme1/img/battery_low.png);
		}

		.battery_two{
			background-image:url(resources/theme1/img/battery_two.png);
		}

		.battery_third{
			background-image:url(resources/theme1/img/battery_third.png);
		}

		.battery_full{
			background-image:url(resources/theme1/img/battery_full.png);
		}

		.battery_cd{
			background-image:url(resources/theme1/img/battery_cd.png);
		}



	</style>

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/bootbox.min.js"></script>
	<script src="js/lib/mqttws31.js"></script>
	<script src="js/mqttclient.js"></script>
	<script src="js/common.js"></script>

</head>

<body>
	<div>
		<input type="hidden" name="openid" value="${openid}" />
			<input type="hidden" name="deviceId" value="${deviceId}" />

		<ul class="list-group">
			<li class="list-group-item boxinfoitem">
				<span class="description">设备号</span>
				<span class="value">${deviceIdShow}</span>
			</li>
			<li class="list-group-item boxinfoitem">
				<span class="description">连接网络</span>
				<span id="netValue" class="value"></span>
			</li>
			<li class="list-group-item boxinfoitem">
				<span class="description">存储空间</span>
				<span id="cardCapacityValue" class="value"></span>
			</li>
			<li class="list-group-item boxinfoitem">
				<span class="description">电量</span>
				<span id="electricityValue" class="battery"></span>
			</li>
			<li class="list-group-item boxinfoitem">
				<span class="description">固件版本</span>
				<button id="btnUpgrade" type="button" class="btn btn-success btn-xs">升级</button>
				<span id="firmwareVersionValue" class="value"></span>
			</li>
		</ul>
	</div>
	<div class="offline" style="display:none;">
		<span>故事机不在线</span>
	</div>
<script type="text/javascript">
window.deviceId = "";
window.deviceOnline = false;
$("#btnUpgrade").hide();

$(document).ready(function() {
	window.deviceId = $("input[name=deviceId]").val();
	var openId = $("input[name=openid]").val();

	var url = "boxinfo/get.do?deviceId="+window.deviceId;
	console.log(url);
	$.ajax({
		type: 'GET',
		url : url,
		dataType: 'json',
		cache:false,
		async:false,
		error: function(data){
			alert('Error'+data);
		},
		success : function(data) {
			showBoxInfo(data);
			window.deviceOnline = data.online;
			showOffline();
		}
	});

	clientCreate(onConnectCallback);

	getVersion();

});

function onConnectCallback(){
	console.log("this is callback");
	getBoxInfo();
}

//当前是否在线情况的改变
function onlineStatus_change(onlineStatus){
	if(onlineStatus == "on"  || onlineStatus == "online" || onlineStatus == "on-upgrade-failed"){
		window.deviceOnline = true;
	}
	else
		window.deviceOnline = false;

	showOffline();
}

//故事机信息显示
function showBoxInfo(boxInfo){
	try{
		var net = boxInfo.net;
		var cardAvailable = boxInfo.cardAvailable;
		var cardTotal = boxInfo.cardTotal;
		var electricity = boxInfo.electricity;
		var firmwareVersion = boxInfo.firmwareVersion;

		$("#netValue").text(net);
		$("#cardCapacityValue").text(cardAvailable+"MB/"+cardTotal+"MB");

		$("#electricityValue").removeClass('battery_empty battery_caution battery_low battery_two battery_third battery_full battery_cd');

		var cssName ="";
		if(electricity<=100 && electricity >80)
			cssName = "battery_full";
		else if(electricity<=80 && electricity >60)
			cssName = "battery_third";
		else if(electricity<=60 && electricity >40)
			cssName = "battery_two";
		else if(electricity<=40 && electricity >20)
			cssName = "battery_low";
		else if(electricity<=20 && electricity >5)
			cssName = "battery_caution";
		else if(electricity<=5)
			cssName = "battery_empty";
		else if(electricity>100)
			cssName ="battery_cd";
		$("#electricityValue").addClass(cssName);

		$("#firmwareVersionValue").text(firmwareVersion);
	}
	catch(e){
		console.log(e);
	}
}


function showOffline(){
	if(window.deviceOnline == false)
		$(".offline").show();
	else
		$(".offline").hide();
}

function getVersion(){
	var url = "boxinfo/getversion.do";
	console.log(url);

	$.ajax({
		type: 'GET',
		url : url,
		dataType: 'json',
		cache:false,
		async:false,
		error: function(data){
			alert('Error'+data);
		},
		success : function(data) {
			var versionName = data[0];
			var firmwareUrl = data[1];

			var currentVersion = $("#firmwareVersionValue").text();
			console.log(currentVersion+"   "+versionName);
			if(currentVersion < versionName){
				console.log("not equal");
				$("#btnUpgrade").data("versionname",versionName);
				$("#btnUpgrade").data("firmwareurl",firmwareUrl);
				$("#btnUpgrade").show();

			}
		}
	});
}
/*
function callback(data){
	var currentVersion = $("#firmwareVersionValue").text();
	var versionName = data.versionName;
	var firmwareUrl = data.firmwareUrl;

	console.log(currentVersion+"   "+versionName);
	if(currentVersion < versionName){
		console.log("not equal");
		$("#btnUpgrade").data("versionname",versionName);
		$("#btnUpgrade").data("firmwareurl",firmwareUrl);
		$("#btnUpgrade").show();

	}
}*/

$("#btnUpgrade").click(function(){
	var versionName = $(this).data("versionname");
	var firmwareUrl = $(this).data("firmwareurl");

	var firmwareVersionValue =$("#firmwareVersionValue").text();
	console.log(versionName +"  "+firmwareUrl);

	var url = "boxinfo/get.do?deviceId="+window.deviceId;
	console.log(url);
	$.ajax({
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
			if(data.electricity <25){
				bootbox.alert({
				    size: 'small',
				    message: "电量低于25%，请充电后再升级",
				    callback: function(){

				    }});
			}
			else{
				//判断界面上的版本号和服务端缓存的是否相同
				if(data.firmwareVersion != firmwareVersionValue){
					bootbox.alert({
					    size: 'small',
					    message: "有别的家庭成员已经给故事机升级了,确定后查看最新信息",
					    callback: function(){
					    	showBoxInfo(data);
					    }});
				}
				else{
					//alert("to upgrade");
					boxUpgrade(versionName,firmwareUrl);

					$(this).hide();
				}
			}
		}
	});


});


</script>
</body>
