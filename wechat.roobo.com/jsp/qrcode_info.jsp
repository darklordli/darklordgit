<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>扫描二维码</title>
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<style type="text/css">

		img#qrcode {
			width:200px;
			height:200px;
			position: fixed;
		    top: 0; right: 0; bottom: 0; left: 0;
   			margin: auto;
		}

	</style>
	<script src="js/lib/jquery-1.11.3.min.js"></script>
</head>

<body>
	<img id="qrcode" src=""></img>

</body>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>

<script>
wx.config({
	    debug: false,
	    appId: '${appid}',
	    timestamp: '${timestamp}',
	    nonceStr: '${nonceStr}',
	    signature: '${signature}',
	    jsApiList: [
	'checkJsApi',
	'onMenuShareTimeline',
	'onMenuShareAppMessage',
	'onMenuShareQQ',
	'onMenuShareWeibo',
	'hideMenuItems',
	'showMenuItems',
	'hideAllNonBaseMenuItem',
	'showAllNonBaseMenuItem',
	'translateVoice',
	'startRecord',
	'stopRecord',
	'onRecordEnd',
	'playVoice',
	'pauseVoice',
	'stopVoice',
	'uploadVoice',
	'downloadVoice',
	'chooseImage',
	'previewImage',
	'uploadImage',
	'downloadImage',
	'getNetworkType',
	'openLocation',
	'getLocation',
	'hideOptionMenu',
	'showOptionMenu',
	'closeWindow',
	'scanQRCode',
	'chooseWXPay',
	'openProductSpecificView',
	'addCard',
	'chooseCard',
	'openCard'
	    ]
	  });



	wx.ready(function () {
		//这里放配置成功后就触发的内容
		wx.hideOptionMenu();

	});

	var deviceId = '${deviceId}';
	var sceneType = '${sceneType}';

	$(document).ready(function() {
		//弹出二维码层
		var url = "boxqrticket/get.do?deviceId="+deviceId;
			console.log(url);

			$.ajax({
		          type:"GET",
		          url:url,
		          async:false,
		          //contentType : 'application/json',
	         	  cache:false,
	         	 success:function(msg){
	          		$("#qrcode").attr('src',msg);
	          }
		      });
	});
</script>
</html>
