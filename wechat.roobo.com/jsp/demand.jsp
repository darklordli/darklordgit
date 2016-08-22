<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title>点播
	</title>

	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<link href="resources/theme1/css/common.css" rel="stylesheet">

	<style type="text/css">
		a.showMic{
			display: block;
			min-height: 100px;
			background-image:url(resources/theme1/img/pic_mic.png);
			background-repeat:no-repeat;
			background-position:40px center;
			background-size: 64px 64px;
			padding-top: 20px;
			padding-left: 120px;
			border-bottom:1px solid #ddd;
			text-decoration: none;

		}

		a.showMic span.title{
			display: block;
			font-weight: bold;
		}

		a.showMic span.description{
			font-size: 12px;
			font-weight: normal;
			color: #a7a7a7;
		}

		#micModal .tips{
			min-height: 200px;
			padding:5px;
			padding-top: 20px;
		}

		#micModal .tips span{
			display: block;
			margin-bottom: 5px;
		}

		#micModal .tips button.close{
			width:24px;
			height:24px;
			background-image: url(resources/theme1/img/remove.png);
			background-repeat:no-repeat;
			background-position:right top;
			position:absolute;
			right: 0px;
			top: 0px;
			border-color: transparent;
			background-color: transparent;
			box-shadow: none;
		}

		.modal-footer{
			min-height: 80px;
			background-image: url(resources/theme1/img/pic_mic_2.png);
			background-repeat:no-repeat;
			background-position:center top;
			background-size: 48px 48px;
			text-align: center;
    		border-top: 0;
    		padding-top: 55px;
    		padding-bottom: 10px;
		}

		.modal-footer button.startRecord{
			color:#a7a7a7;
			background-color: #A0E7F8;
		}

		.modal-footer button.endRecord{
			display: none;
			color:#a7a7a7;
			background-color: #FCD59D;
		}

		.voice{
			display: none;
			height: 80px;
			padding-left: 40px;
			border-bottom:1px solid #ddd;
		}

		.voice button{
			background-repeat:no-repeat;
			border-color: transparent;
			background-color: transparent;
			box-shadow: none;
		}

		.voice button.playVoice{
			background-image: url(resources/theme1/img/pic_ly.png);
			background-position:center bottom;
			background-size: 100%;
			width:70px;
			height:40px;
		}

		.voice button.playVoice.playing{
			background-image: url(resources/theme1/img/pic_ly_playing.gif);
			background-position:center bottom;
			background-size: 100%;
		}

		.voice button.removeVoice{
			background-image: url(resources/theme1/img/btn_del.png);
			background-position:center center;
			background-size: 24px 24px;
			width:30px;
			height:30px;
			float:right;
		}

		.voice button.refreshVoice{
			background-image: url(resources/theme1/img/btn_cl.png);
			background-position:center center;
			background-size: 24px 24px;
			width:30px;
			height:30px;
			float:right;
		}

	</style>

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/bootbox.min.js"></script>
	<script src="js/common.js"></script>
	<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
</head>

<body>
	<div>
		<input type="hidden" name="openid" value="${openid}" />
		<input type="hidden" name="deviceId" value="${deviceId}" />
		<input type="hidden" name="trackId" value="${trackId}" />
		<input type="hidden" name="albumId" value="${albumId}" />

		<div class="list-group tracklist"></div>
		<a class="showMic">
			<span class="title">录引子</span>
			<span class="description">在故事播放前面给宝宝说上一段话吧</span>
		</a>

		<div class="voice">
			<span>引子：</span>
			<button type="button" class="playVoice"></button>
			<button type="button" class="removeVoice" onclick="removeVoice()"></button>
			<button type="button" class="refreshVoice" onclick="showMic()"></button>
		</div>

		<div class="navbar-fixed-bottom text-center">
			<button type="button" class="btn btn-success btn-lg btn-block" onclick="doSave()">点播</button>
		</div>

		<div id="micModal" class="modal"
			tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
			<div class="modal-dialog modal-sm">
				<div class="modal-content">
					<div class="tips">
						<button type="button" class="close" data-dismiss="modal"></button>
						<span>提示:在故事播放前录一段话给宝宝吧</span>
						<span>例如:宝宝祝你生日快乐</span>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn startRecord" onclick="startRecord()">点击说话</button>
						<button type="button" class="btn endRecord" onclick="endRecord()">点击结束</button>
					</div>
				</div>
			</div>
		</div>
	</div>

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
'onVoiceRecordEnd',
'playVoice',
'pauseVoice',
'stopVoice',
'onVoicePlayEnd',
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

	$("a.showMic").click(showMic);

	/*wx.onVoiceRecordEnd({  //android not work,ios work
	    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
	    complete: function(res){

	    }
	});
	*/

	wx.onVoicePlayEnd({
	    success: function (res) {
	    	var $btn = $(".voice button.playVoice");
	    	if($btn.hasClass("playing")){
	    		$btn.removeClass("playing");
	    	}
	    	$btn.on("click",playVoice);
	    }
	});

});


</script>
<script type="text/javascript">
window.deviceId = "";
window.deviceOnline = false;
window.contextPath = "";
var localId="";
var timeId;

/*
$(window).unload(function(){
	beforeunload();
});

window.onbeforeunload = beforeunload;
function beforeunload() {
    wx.stopVoice({
	    localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
	});
}*/


$(document).ready(function() {
	window.deviceId = $("input[name=deviceId]").val();
	var openId = $("input[name=openid]").val();
	var trackId = $("input[name=trackId]").val();
	console.log(trackId);
	window.contextPath = '<%= request.getContextPath() %>';

	var url = "track/getid.do?trackId="+trackId;
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
			var title=data.title;
			var id=data.id;
			var coverSmallUrl = data.coverSmallUrl;
			var duration = data.duration;
			var url = data.url;
			var downloadUrl = data.downloadUrl;
			var status = data.status;
			var downloadSize = data.downloadSize;
			var albumTitle = data.albumTitle;
			var liClass = "list-group-item";

			var html = "<li class=\""+ liClass+"\" "
			+ buildDataAttrForLi(id,title,coverSmallUrl,duration,url,downloadUrl,downloadSize,albumTitle,"")
			+">"
			+" <img src='"+coverSmallUrl+"' />"
			+"<span class=\"title\">"+title+"</span>"
			+ "<span class=\"description\"><small>"+(parseInt(duration/60)>0?parseInt(duration/60)+"分":"")+(duration%60)+"秒 | "
			+ parseFloat(downloadSize*1.0/1048576).toFixed(2)+"M | "
			+ albumTitle
			+"</span>"
			+"</li>";

			$(".tracklist").append(html);

		}
	});

	var $btn = $(".voice button.playVoice");
	$btn.on("click",playVoice);
});

function showMic(){
	$('#micModal').modal({backdrop: 'static', keyboard: false}); //点击空白区域不关闭模态框
}

$('#micModal').on('show.bs.modal', function (e) {
  	$("button.startRecord").show();
	$("button.endRecord").hide();
})


function startRecord(){
	/*console.log("start to record");
	$("button.startRecord").hide();
	$("button.endRecord").show();
	timeId = setTimeout(forceEndRecord,10000);
	console.log("timeId is:"+timeId);
	$('#micModal').find(".close").hide();*/

	wx.startRecord({
		success:function (res) {
			$("button.startRecord").hide();
			$("button.endRecord").show();
			timeId = setTimeout(forceEndRecord,58000);
			$('#micModal').find(".close").hide();
		}
	});
}

function endRecord(){
	/*clearTimeout(timeId);
	console.log("end record");
	$('#micModal').modal('hide');
    $(".showMic").hide();
	$(".voice").show();
	$('#micModal').find(".close").show();*/

	wx.stopRecord({
	    success: function(res){
	    	localId = res.localId;

	    	clearTimeout(timeId);
	        $('#micModal').modal('hide');
	        $(".showMic").hide();
	    	$(".voice").show();
	    	$('#micModal').find(".close").show();
	    },
	    fail: function (res) {
	    	clearTimeout(timeId);
	        $('#micModal').modal('hide');
	        $(".showMic").hide();
	    	$(".voice").show();
	    	$('#micModal').find(".close").show();
	      }

	});
}

//超过时间后强制关闭录音
function forceEndRecord(){
	console.log("try to force");
	endRecord();

}

function removeVoice(){
	$(".showMic").show();
	$(".voice").hide();
	localId = "";
}

function playVoice(){
	var $btn = $(".voice button.playVoice");
	if(!$btn.hasClass("playing")){
		$btn.addClass("playing");
	}
	$btn.off("click");

	wx.playVoice({
	    localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
	});

}

function doSave(){
	if(localId != ""){
		wx.uploadVoice({
		    localId: localId,
		    isShowProgressTips: 1, // 默认为1，显示进度提示
		        success: function (res) {
		        	mediaId = res.serverId; // 返回音频的服务器端ID
		       		save(mediaId);
		    }
		});
	}
	else
		save("");
}

function save(mediaId){
	var openId = $("input[name=openid]").val();
	var trackId = $("input[name=trackId]").val();
	var albumId = $("input[name=albumId]").val();

	var demand = {};
	demand.openId = openId;
	demand.trackId = parseInt(trackId);
	console.log(demand);

	$.ajax({
			type : "POST",
			url : contextPath + "/demand/save.do?mediaId="+mediaId,
			contentType : 'application/json',
			async : false,
			//dataType : 'json',
			timeout : 4000,
			data : JSON.stringify(demand),
			success : function(msg) {
				if(msg == "ok"){
					showAlert("点播成功");
					/*if(albumId == 0)
						window.location = contextPath +"/storylist.do#&/storybox/favoritelist.do";
					else
						window.location = contextPath +"/storylist.do#&/storybox/albumsbrowse.do?albumId="+albumId;*/

					history.back();
				}
			},
			error : function(data) {
				//hideMaskLoading();
			}
		});
}




</script>
</body>
