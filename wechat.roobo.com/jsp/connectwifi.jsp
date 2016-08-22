<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>配置</title>
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<style type="text/css">
		.myform{
			padding-top:0.5cm;
		}

	</style>
</head>

<body>
	<div class="container">


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
		'configWXDeviceWiFi'
    ]
  });



	wx.ready(function () {
		//这里放配置成功后就触发的内容
		wx.hideOptionMenu();
		doConnect();
	});

	function doConnect(){
		var key = "MTIzNDU2Nzg5MDEyMzQ1Ng=="; //1234567890123456 加码

		wx.invoke('configWXDeviceWiFi', {
			key:key
        }, function(res) {
            wx.closeWindow();

        });
	}

	//从后台获取加码
	function getMessage(s){

		var result = "";
		$.ajax({
	          type:"Get",
	          url:"../encode.do?sourceString="+s,
	          async:false,
         	  cache:false,
         	 success:function(msg){
          		result = msg;
          }
	      });

		return result;
	}

</script>
</html>
