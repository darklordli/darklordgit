<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>绑定</title>
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<style type="text/css">
		.container{
			min-height: 300px;
			text-align: center;
			padding-top: 20px;
		}

		.container span{
			display: block;
			font-size: 14px;
		}

		.container img{
			width:70px;
			height:70px;
			margin-bottom: 30px;
		}

	</style>
	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/bootbox.min.js"></script>
</head>

<body>
	<div class="container">
		<span>请扫二维码</span>
		<img src="resources/theme1/img/pic_ewm.png" alt="" onclick="doScan()">
<!-- 		<span>或者手动输入设备号</span> -->
<!-- 		<input type="text" placeholder="请输入设备号" name="deviceId"/> -->
<%-- 		<input type="hidden" name="openId" value="${openid}" /> --%>
<!-- 		<button type="button" class="btn btn-success" onclick="bind()">确认</button> -->
	</div>

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

	function doScan(){
		wx.scanQRCode({
		    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
		    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
		    success: function (res) {
		    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
		}
		});

	}

	function bind(){
		var deviceId = $("input[name=deviceId]").val();
		if(deviceId == ""){
			bootbox.alert({
					    size: 'small',
					    message: "设备号不能为空",
					    callback: function(){

					    }});
		}
		else{
			var openId = $("input[name=openId]").val();

			var familyMember = {openId:openId,deviceId:deviceId};
			$.ajax({
				type : "POST",
				url : "familymember/join.do",
				contentType : 'application/json',
				async : false,
				cache:false,
				timeout : 4000,
				data : JSON.stringify(familyMember),
				success : function(msg) {
					if(msg == "ok"){
						window.location = "familymember/list.do";
					}
				},
				error : function(data) {
					//hideMaskLoading();
				}
			});
		}
	}



</script>
</html>
