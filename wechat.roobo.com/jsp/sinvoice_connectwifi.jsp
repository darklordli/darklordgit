<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    <title>配置网络</title>
	<link href="resources/theme1/css/weui.min.css" rel="stylesheet">
	<link href="resources/theme1/css/common.css" rel="stylesheet">
	<style type="text/css">
		.hd {
		    padding: 2em 0;
		    background-image:url(resources/theme1/img/pic_wifi.png);
 			background-repeat:no-repeat;
 			background-position:center center;
 			height: 150px;
 			background-size: 130px 130px;
		}

		.page_title {
		    text-align: center;
		    font-size: 34px;
		    color: #225fba;
		    font-weight: 400;
		    margin: 0 15%;
		}
	</style>
	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/mqttws31.js"></script>
	<script src="js/mqttclient.js"></script>
	<script src="js/lib/audiojs/audio.js"></script>
	<script src="js/common.js"></script>
</head>

<body>
	<div class="hd">

	</div>
	<div class="weui_cells weui_cells_form">
	    <div class="weui_cell">
	        <div class="weui_cell_hd">
	            <label class="weui_label">WIFI</label>
	        </div>
	        <div class="weui_cell_bd weui_cell_primary">
	            <input name="ssid" class="weui_input" type="text" placeholder="请输入WIFI名称">
	        </div>
	        <div class="weui_cell_ft">
                <i class="weui_icon_warn"></i>
            </div>
	    </div>
	    <div class="weui_cell">
	        <div class="weui_cell_hd">
	            <label class="weui_label">密码</label>
	        </div>
	        <div class="weui_cell_bd weui_cell_primary">
	            <input name="password" class="weui_input" type="password" placeholder="请输入WIFI密码">
	        </div>
	    </div>

	</div>
	<div class="weui_cells_tips"></div>
	<div class="weui_btn_area">
        <a class="weui_btn weui_btn_primary" id="btnConnect">连接</a>
    </div>
	<input type="hidden" name="openid" value="${openid}" />
	<input type="hidden" name="deviceId" value="${deviceId}" />

	<div id="loadingToast" class="weui_loading_toast" style="display:none;">
	    <div class="weui_mask_transparent"></div>
	    <div class="weui_toast">
	        <div class="weui_loading">
	            <div class="weui_loading_leaf weui_loading_leaf_0"></div>
	            <div class="weui_loading_leaf weui_loading_leaf_1"></div>
	            <div class="weui_loading_leaf weui_loading_leaf_2"></div>
	            <div class="weui_loading_leaf weui_loading_leaf_3"></div>
	            <div class="weui_loading_leaf weui_loading_leaf_4"></div>
	            <div class="weui_loading_leaf weui_loading_leaf_5"></div>
	            <div class="weui_loading_leaf weui_loading_leaf_6"></div>
	            <div class="weui_loading_leaf weui_loading_leaf_7"></div>
	            <div class="weui_loading_leaf weui_loading_leaf_8"></div>
	            <div class="weui_loading_leaf weui_loading_leaf_9"></div>
	            <div class="weui_loading_leaf weui_loading_leaf_10"></div>
	            <div class="weui_loading_leaf weui_loading_leaf_11"></div>
	        </div>
	        <p class="weui_toast_content">配置中</p>
	    </div>
	</div>

	<div id="toast" style="display: none;">
	    <div class="weui_mask_transparent"></div>
	    <div class="weui_toast">
	        <i class="weui_icon_toast"></i>
	        <p class="weui_toast_content">配置成功</p>
	    </div>
	</div>

	<div class="weui_dialog_alert" id="dialog2" style="display: none;">
	    <div class="weui_mask"></div>
	    <div class="weui_dialog">
	        <div class="weui_dialog_hd"><strong class="weui_dialog_title">配置超时</strong></div>
	        <div class="weui_dialog_bd">配置超时，请重新连接</div>
	        <div class="weui_dialog_ft">
	            <a href="javascript:;" class="weui_btn_dialog primary">确定</a>
	        </div>
	    </div>
	</div>
	<div id="divAudio" class="audiohide">
		<audio preload loop="loop"></audio>
	</div>

</body>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>

<script>
wx.config({
    beta: true,
    debug: false,
    appId: '${appid}',
    timestamp: '${timestamp}',
    nonceStr: '${nonceStr}',
    signature: '${signature}',
    jsApiList: [
		'closeWindow',
		'getNetworkType'
    ]
  });



	wx.ready(function () {
		//这里放配置成功后就触发的内容
		wx.hideOptionMenu();

		/*wx.getNetworkType({
		    success: function (res) {
		    	var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
		    }
		});
		*/
	});
	audio = undefined;;

	audio = undefined;;
	createAudio();

	$(document).ready(function() {
		window.deviceId = $("input[name=deviceId]").val();
		window.openId = $("input[name=openid]").val();
		window.configResult = false; //配置结果

		$("input[name=ssid]").change(function(){
			checkSsid();
		});

		clientCreate(onConnectCallback);
	});


	$("#btnConnect").click(function(){
		if(checkSsid()){
			/*Luckily, before the user can trigger the behavior to start audio, they have to click a button. I set the volume of the element to 0.0, and have it "play" when they click this button.
			After the sound is played silently, I simply set the volume property back to 1.0, and it plays without user intervention just fine.*/
			audio.load('https://raw.githubusercontent.com/kolber/audiojs/master/mp3/bensound-dubstep.mp3');
			audio.setVolume(0.0);
			audio.play();

			var ssid = $("input[name=ssid]").val();
			var password = $("input[name=password]").val();
			var waitSeconds = 120;

			var sinVoiceSet = {openId:window.openId,deviceId:window.deviceId,ssid:ssid,password:password};
			$.ajax({
				type : "POST",
				url : "sinvoice/set.do?",
				contentType : 'application/json',
				async : false,
				timeout : 4000,
				data : JSON.stringify(sinVoiceSet),
				success : function(msg) {
					if(msg == "ok"){
						var i = 0;
					      for(var j = 0;j < (waitSeconds/2);j++) {
					          setTimeout(checkIfConnected,1000*j*2);
					       }

					       setTimeout(checkIfTimeout,1000*(waitSeconds+1));
						}

				},
				error : function(data) {
					//hideMaskLoading();
				}
			});
		}
	});

	function checkSsid(){
		var ssid = $("input[name=ssid]").val();
		if(ssid == ""){
			$("input[name=ssid]").parents(".weui_cell").addClass('weui_cell_warn');
			return false;
		}
		else{
			$("input[name=ssid]").parents(".weui_cell").removeClass('weui_cell_warn');
			return true;
		}
	}

	function onConnectCallback(){
		console.log("this is callback");
		client.subscribe("storybox/"+window.deviceId+"/server");
	}

	function checkIfConnected(){
		console.log("checkIfConnected");
		if(!window.configResult){
			$("#loadingToast").show();
		}
		else{
			$("#loadingToast").hide();
			$("#toast").show();

			setTimeout(function(){
				audio.pause();
				wx.closeWindow();
			},1000);
		}
	}

	function checkIfTimeout(){
		console.log("checkIfTimeout");
		if(!window.configResult){
			$("#loadingToast").hide();
			audio.pause();
			$('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                    $('#dialog2').off('click').hide();
                });
		}
	}

	function onConfigWifi(configWifi){
		if(configWifi == "success"){
			window.configResult = true;
		}
	}

	function playSinVoiceUrl(url,openId){
		//alert(url);
		//alert(window.openId +"\r\n"+openId);
		if(window.openId == openId){
			audio.pause();
			audio.setVolume(1.0);
			audio.load(url);
			audio.play();
		}
	}

</script>
</html>
