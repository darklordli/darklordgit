<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
	<title>
		<c:choose>
		   <c:when test="${pageType == 'list'}">
		         家庭成员
		   </c:when>
		   <c:when test="${pageType == 'invite'}">
		         邀请家人
		   </c:when>
		</c:choose>
	</title>

	<link href="resources/theme1/css/mobilebone.css" rel="stylesheet">
	<link href="resources/theme1/css/mobilebone.animate.css" rel="stylesheet">
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<link href="resources/theme1/css/common.css" rel="stylesheet">

	<style type="text/css">
		.device{
			min-height: 80px;
			background-color: #60c4e9;
			padding-left: 100px;
			padding-top:10px;
		}

		.device img{
			 position: absolute;
		    top: 10px;
		    left: 20px;
		    max-width: 50px;
		    max-height: 50px;
		    width: 100%;
		    height: 100%;
		}

		.device span.title{
			display: block;
			font-size: 16px;
			margin-bottom: 8px;
			color:#FFFFFF;
		}

		.device span.description{
			font-size: 14px;
			color: #FFFFFF;
		}

		.memberlist{
			padding: 5px;
			background-color: #fff;
		}
		.memberlist a.member{
			border-color: transparent;
			background-color: transparent;
			box-shadow: none;
			display:inline-block;
			background-repeat:no-repeat;
			background-position:center top;
			background-size: 50px 50px;
			text-decoration:none;
			padding-top: 50px;
			text-align: center;
			margin-bottom: 10px;
			min-height: 70px;
		}

		.memberlist a.member span{
			font-size: 14px;
			font-weight: normal;
			color: #b8b8b8;
		}

		.memberlist a.member span.admin{
			color: #0000FF;
		}

		#divFuncList{
			padding-top: 20px;
			padding-bottom: 20px;
		}

		#divFuncList #modifyNickname{
			border-bottom-right-radius: 0;
    		border-bottom-left-radius: 0;
    		border-top-left-radius: 0;
    		border-top-right-radius: 0;
		}

		#divFuncList button span.description{
			font-size: 14px;
			font-weight: normal;
		}

		#divFuncList button span.value{
			float:right;
			font-size: 14px;
			font-weight: normal;
			color: #b8b8b8;
		}

		#quitFamily{
			display: block;
			background-color: #fff;
			text-align: center;
			min-height:50px;
			padding-top: 20px;
			padding-bottom: 20px;
			text-decoration:none;
		}

		#quitFamily span{
			font-size: 14px;
			font-weight: normal;
			color:#FF0000;
		}

		div.showQrcode{
			width: 100%; height:100%;
		    /*center*/
		    position: absolute;
		    top: 0; right: 0; bottom: 0; left: 0;
		    margin: auto;
		    background:#000; filter: alpha(opacity=70); opacity: 0.7;
		    text-align: center;
		    display:none;
		    z-index: 99999;
		    display: none;
		    padding-top: 50px;
		}

		div.showQrcode img{
			width: 200px;
			height:200px;
		}

		#modifyNicknamemodal .modal-footer button{
			width:50%;
		}
		#modifyNicknamemodalCancel{
			position:absolute;
			top:0;
			left:0;
		}

		#modifyNicknamemodalSubmit{
			position:absolute;
			top:0;
			right:0;
			border-left:1px solid #e5e5e5;
		}
	</style>

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/mobilebone.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/bootbox.min.js"></script>
	<script src="js/lib/audiojs/audio.js"></script>

	<script src="js/common.js"></script>

</head>

<body style="background-color: #e7e7e7;">
	<div class="device">
		<input type="hidden" name="openid" value="${openid}" />
		<input type="hidden" name="deviceId" value="${deviceId}" />
		<input type="hidden" name="pageType" value="${pageType}" />
		<img src="resources/theme1/img/btn_logo.png" />
		<span class="title">微信故事机</span>
		<span class="description">${deviceIdShow}</span>
	</div>
	<div class="memberlist row">
	</div>
	<div id="divFuncList" class="list-group">
		<button type="button" id="modifyNickname" class="list-group-item" data-toggle="modal" data-target="#modifyNicknamemodal">
			<span class="description">我在本群的昵称：</span>
			<span class="value"></span>
		</button>
	</div>
	<a id="quitFamily" href="#"><span>退出该群</span></a>

	<div id="modifyNicknamemodal" class="modal fade bs-example-modal-sm"
		tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-header">
					<span>修改昵称</span>
				</div>
				<div class="modal-body">
					<form>
						<div class="form-group">
							<label for="addTrackListName" class="control-label">新昵称：</label>
							<input type="text" class="form-control" id="nickname" maxlength="8">
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal" id="modifyNicknamemodalCancel">取消</button>
					<button type="button" class="btn btn-primary"
						id="modifyNicknamemodalSubmit">确定</button>
				</div>
			</div>
		</div>
	</div>

	<div class="showQrcode">
		<img src=""></img>
	</div>
<script type="text/javascript">

$(document).ready(function() {
	var deviceId = $("input[name=deviceId]").val();
	var selfOpenId = $("input[name=openid]").val();
	var selfNickname = "";
	var selfAdmin = false;
	var pageType = $("input[name=pageType]").val();
	var openIds = [];

	console.log(deviceId);
	$.ajax({
	    type:"GET",
	    url:"familymember/getlist.do?deviceId="+deviceId,
	    async:false,
	    dataType:"json",
       	cache:false,
       	success:function(data){
       			var count = $(data).size();
       		 	var i=0;
       		 	while(i<count){
       		 		var nickname = data[i].nickname;
       		 		var openId = data[i].openId;
       		 		var headImgUrl = data[i].headImgUrl;
					var admin = data[i].admin;
					openIds.push(openId);

       		 		var html ="<a class=\"member col-xs-4 col-md-3\" data-openid=\""+openId+"\""
       		 			+" style=\"background-image:url("+ headImgUrl+ ")\">";
       		 		if(admin)
       		 			html +="<span class='admin'>"+cutStrForNum(nickname,6)+"</span>";
       		 		else
       		 			html +="<span>"+cutStrForNum(nickname,6)+"</span>";

       		 		html +="</a>";

       		 		$("div.memberlist").append(html);

       		 		if(selfOpenId == openId){
       		 			selfNickname = nickname;
       		 			$("#modifyNickname").find("span.value").text(selfNickname);
       		 			selfAdmin = admin;
       		 		}

       		 		i = i+1;
       		 	}
        	}
	      });

	if(pageType == "invite"){
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
	          		$("div.showQrcode img").attr('src',msg);
	          }
		      });
		$("div.showQrcode").show();

	}

	$('#modifyNicknamemodal').on('show.bs.modal', function (event) {
	  var button = $(event.relatedTarget) // Button that triggered the modal

	  var modal = $(this)
	  modal.find('#nickname').val(selfNickname);

	})

	$("#modifyNicknamemodalSubmit").click(function(){
		var nickname= $('#modifyNicknamemodal').find("#nickname").val();

		if(nickname==""){
			common_alert("昵称不能为空","确定",function(){
				return;
			});

		}
		else{
			var familyMember = {openId:selfOpenId,nickname:nickname};
			$.ajax({
				type : "POST",
				url : "familymember/modifynickname.do?",
				contentType : 'application/json',
				async : false,
				timeout : 4000,
				data : JSON.stringify(familyMember),
				success : function(msg) {
					if(msg == "ok"){
						selfNickname = nickname;
						console.log(selfNickname);
						$("#modifyNickname").find("span.value").text(selfNickname);

						$("div.memberlist").find("a.member").each(function(){
							var openid = $(this).data("openid");
							if(openid == selfOpenId){
								$(this).find("span").text(cutStrForNum(selfNickname,6));
							}
						});

					}
					else if(msg == "null"){
						common_alert("你已经被管理员从群组中移除","确定",function(){

						});

					}
				},
				error : function(data) {
					//hideMaskLoading();
				}
			});
			$('#modifyNicknamemodal').modal('hide');
		}
	});

	$("#quitFamily").click(function(){
		var message = "退出该群后将不能与微信故事机互动,你确定吗？";
		if(selfAdmin)
			message = "你是管理员，退出后该群会自动解散，你确定吗？";

		common_confirm(message,"确定",function(){
			var familyMember = {openId:selfOpenId,admin:selfAdmin};
					$.ajax({
						type : "POST",
						url : "familymember/quit.do?byAdmin=false",
						contentType : 'application/json',
						async : false,
						cache:false,
						timeout : 4000,
						data : JSON.stringify(familyMember),
						success : function(msg) {
							if(msg == "ok"){
								var d = new Date();
								window.location = "familymember/list.do?d="+d;
							}
						},
						error : function(data) {
							//hideMaskLoading();
						}
					});
		},"取消");

	});

	$("div.memberlist").on("click","a.member",function(){
		var openId = $(this).data("openid");
		//管理员才有权限
		if(selfAdmin){
			common_confirm("你确定要将该成员踢出群组吗？","确定",function(){
				var familyMember = {openId:openId,admin:false};
						$.ajax({
							type : "POST",
							url : "familymember/quit.do?byAdmin=true",
							contentType : 'application/json',
							async : false,
							timeout : 4000,
							data : JSON.stringify(familyMember),
							success : function(msg) {
								if(msg == "ok"){
									var d = new Date();
								window.location = "familymember/list.do?d="+d;
								}
							},
							error : function(data) {
								//hideMaskLoading();
							}
						});
			},"取消");

		}
	});

	/** 从字符串开头截取指定长度，中文算2个 */
	function cutStrForNum(str, num){
		var len = 0;
		for (var i = 0; i < str.length; i++) {
	        if (str[i].match(/[^x00-xff]/ig) != null) //全角
	            len += 2;
	        else
	            len += 1;

	        if(len >=num){
	        	len = i;
	        	break;
	        }
	    }
	    console.log(str.substr(0,len+1));
	    return str.substr(0,len+1);

	    /*var len = 0;
	    for (var i = 0; i < str.length; i++) {
	        if (str[i].match(/[^x00-xff]/ig) != null) //全角
	            len += 2;
	        else
	            len += 1;
	    }
	    if (len >= num) {
	        newStr = str.substring(0, num);
	    }
	    console.log("newStr:"+newStr);
	    return newStr; */
	}
});

</script>
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
		wx.hideMenuItems({
		    //仅保留发送给朋友
		    menuList: ['menuItem:share:timeline','menuItem:share:qq','menuItem:share:weiboApp',
		    'menuItem:favorite','menuItem:share:facebook','menuItem:share:QZone','menuItem:openWithQQBrowser','menuItem:openWithSafari','menuItem:share:email']
		});

		var deviceId = $("input[name=deviceId]").val();
		var linkUrl = "<%= request.getScheme() %>://<%= request.getServerName() %>:<%= request.getServerPort() %>familymember/inviteQrcode.do?deviceId="+deviceId;
		wx.onMenuShareAppMessage({
		    title: '您的好友想把您加入聊天群组', // 分享标题
		    desc: '您的好友想把您加入故事机的聊天群组，在新页面，长按可识别二维码', // 分享描述
		    link: linkUrl, // 分享链接
		    type: 'link', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () {
		        // 用户确认分享后执行的回调函数
		    },
		    cancel: function () {
		        // 用户取消分享后执行的回调函数
		    }
		});
	});




</script>
