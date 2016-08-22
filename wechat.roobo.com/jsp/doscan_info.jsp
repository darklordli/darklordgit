<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <title>提示页</title>
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<style type="text/css">
		.container{
			background-repeat: no-repeat;
			background-position: center center;
			background-image: url("resources/theme1/img/btn_logo_b.png");
			min-height: 300px;
		}

		.navbar-fixed-bottom span{
			margin-bottom: 20px;
			font-size: 16px;
		}

	</style>
</head>

<body style="background-color: #f1f1f1;">
	<div class="container">
		<div class="navbar-fixed-bottom text-center">
			<span>还没有绑定故事机</span>
			<button type="button" class="btn btn-success btn-lg btn-block" onclick="doScan()">扫一扫</button>
		</div>
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

	(function()
{
    var agent = navigator.userAgent.toLowerCase();        //检测是否是ios
    var iLastTouch = null;                                //缓存上一次tap的时间
    if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0)
    {
        document.body.addEventListener('touchend', function(event)
        {
            var iNow = new Date()
                .getTime();
            iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */ ;
            var delta = iNow - iLastTouch;
            if (delta < 500 && delta > 0)
            {
                event.preventDefault();
                return false;
            }
            iLastTouch = iNow;
        }, false);
    }

})();

</script>
</html>
