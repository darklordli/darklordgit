<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <title>播放控制</title>
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<link href="resources/theme1/css/common.css" rel="stylesheet">
	<link href="resources/theme1/css/tracklist.css" rel="stylesheet">

	<style type="text/css">
	.list-group li.playing {
			background-image:url(resources/theme1/img/btn_vol.png);
 			background-repeat:no-repeat;
			background-position:99% center;
			background-size: 24px 24px;
		}


	.modal-header span{
		display:block;
		text-align: center;
	}
	.modal-footer{
		padding: 0;
		min-height: 40px;
		border-top:0;
	}
	.modal-footer button{
		border-color: transparent;
		background-color: transparent;
		box-shadow: none;
		color:#5dc5ec;
		height:100%;
		width:100%;
		display:block;
	}

	a.selectTrackListItem{
		background-position: 10px 10px;
		background-repeat: no-repeat;
		background-size: 24px 24px;
		padding-left: 40px;
		min-height: 48px;
	}

	#selectlistModal .modal-dialog{
		position: fixed;
		top: 0; right: 0; bottom: 0; left: 0;
	   	margin: auto;
	   	height: 400px;
	   	width:90%;
	}

	</style>

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/bootbox.min.js"></script>
	<script src="js/lib/mqttws31.js"></script>
	<script src="js/lib/jquery.scrollTo.js"></script>

	<script src="js/mqttclient.js"></script>
	<script src="js/common.js"></script>
</head>

<body>
	<div id="pageControlBox" class="fastscroll" data-openid="${openid}" data-deviceid="${deviceId}">
		<!--  <div class="fastscroll">-->
			<div class="list-group list" style="margin-bottom: 0">
			</div>
			<div class="list-group tracklist">
			</div>
		<!--  </div>-->
	</div>
	<div class="navbar-fixed-bottom text-center controlboxfooter">
			<marquee id="mymarquee" align="middle" behavior="alternate"><span></span></marquee>
			<span id="description"></span>
			<button class="pull-left setmode"></button>
			<button class="pull-right selectlist"></button>
			<div class="text-center">
				<button class="backward"></button>
				<button class="control"></button>
				<button class="forward"></button>
			</div>
		</div>
		<div class="offline" style="display:none;">
			<span>故事机不在线</span>
		</div>
		<div id="selectlistModal" class="modal bs-example-modal-sm"
			tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
			<div class="modal-dialog modal-sm">
				<div class="modal-content">
					<div class="modal-header">
						<span>选择歌单</span>
					</div>
					<div class="list-group list" style="margin-bottom:0;overflow-y:auto;max-height:282px;">

					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
					</div>
				</div>
			</div>
		</div>

 <script type="text/javascript">

$(document).ready(function() {

	window.contextPath = '<%= request.getContextPath() %>';
	window.openid = $("#pageControlBox").data("openid");
	window.deviceId = $("#pageControlBox").data("deviceid");
	console.log(window.openid+"---"+window.deviceId);

	window.trackListId = -1;
	window.trackId = -1;
	window.type = -1;

	clientCreate(onConnectCallback);

	var url = contextPath+"/controlbox/getdefault.do?deviceId="+window.deviceId;
	console.log(url);
	$.ajax({
		type: 'GET',
		url : url,
		dataType: 'json',
		cache:false,
		async:false,
		error: function(data){
			alert("出现未知错误,请稍候重试");
		},
		success : function(data) {
			var isOnline = data.isOnline;
			var boxplay_trackListId = data.boxplay_trackListId;
			var trackLists = data.trackLists;

			if(trackLists.length == 0){
				common_alert("故事机里还没有歌单","去云端故事看看",function(){
					window.location = contextPath + "/storylist.do";
				});

			}
			else{
				var defaultTrackListId = 0;
				var trackLists_select = [];

				var hasSetPlay= false;//是否设置了自定义播放列表
				for(var i=0;i<trackLists.length;i++){
					var play=trackLists[i].play;
					if(play){
						hasSetPlay = true;
						break;
					}
				}

				var boxplayExists = false;//boxplay中缓存的列表是否存在
				for(var i=0;i<trackLists.length;i++){
					var id=trackLists[i].id;
					if(id == boxplay_trackListId){
						boxplayExists = true;
						break;
					}
				}

				for(var i=0;i<trackLists.length;i++){
					var id=trackLists[i].id;
					var play=trackLists[i].play;

					if((hasSetPlay && play) || (!hasSetPlay)){ //如果没有定义，则全部放进去
						trackLists_select.push(trackLists[i]);
					}
				}

				if(boxplayExists) //如果存在就直接显示
					defaultTrackListId = boxplay_trackListId;
				else{//如果不存在，则显示trackLists_select中大于boxplay_trackListId的第一个，如果不存在，就取第一个
					for(var j=0;j<trackLists_select.length;j++){
						if(boxplay_trackListId<trackLists_select[j].id){
							defaultTrackListId = trackLists_select[j].id;
							break;
						}
					}
					if(defaultTrackListId == 0)
						defaultTrackListId = trackLists_select[0].id;
				}

				refreshSelectlistModal(trackLists_select); //填充选择列表

				console.log("isOnline:"+isOnline);
				window.deviceOnline = isOnline;

				window.trackListId = defaultTrackListId;
				tracklistchange_controlbox(defaultTrackListId);
				if(!isOnline){
					showOffline();
				}


				/*if(!isOnline && defaultTrackListId >0){
					tracklistchange_controlbox(defaultTrackListId);
					showOffline();

				}
				else if(isOnline){
					if(window.trackListId == -1)
						tracklistchange_controlbox(defaultTrackListId);
					else{
						tracklistchange_controlbox(window.trackListId);
						trackchange_controlbox(window.trackId,window.type);

						queryTrack();
						queryPlayStatus();
						queryMode();
					}
				}*/
			}
		}
	});

	$(".controlboxfooter").find("button.forward").click(function(){
		forwardTrack();
	});

	$(".controlboxfooter").find("button.backward").click(function(){
		backwardTrack();
	});

	$(".controlboxfooter").find("button.control").click(function(){
		if($(this).hasClass("pause"))
			pauseTrack();
		else
			resumeTrack();
	});

	$(".controlboxfooter").find("button.setmode").click(function(){
		if($(this).hasClass("repeatone"))
			setRepeatall();
		else
			setRepeatone();
	});

	$(".controlboxfooter").find("button.selectlist").click(function(){
		$("#selectlistModal").modal();
	});

	var _$tracklist = $("#pageControlBox").find(".tracklist");
	_$tracklist.on("click","li",function(){
		var trackId = $(this).data("id");
		var trackListId = $(this).data("tracklistid");
		var url = $(this).data("url");
		var downloadUrl = $(this).data("downloadurl");

		playTrack(trackListId,trackId,url,downloadUrl);
	});

	$("#selectlistModal").find(".list").on("click","a",function(){
		var trackListId = parseInt($(this).attr("name"));
		tracklistchange_controlbox(trackListId);
		queryTrack();
		$("#selectlistModal").modal('hide');
	});
});

function showOffline(){
	if(window.deviceOnline == false)
		$(".offline").show();
	else
		$(".offline").hide();
}

function refreshSelectlistModal(trackLists){
	$("#selectlistModal").find(".list").html("");
	console.log("trackLists.length:"+trackLists.length);

	if(trackLists.length >0){
		for(var i=0;i<trackLists.length;i++){
			var id=trackLists[i].id;
			var name=trackLists[i].name;
			var trackCount=trackLists[i].trackCount;
			var downloadTrackCount=trackLists[i].downloadTrackCount;
			var coverSmallUrl=trackLists[i].coverSmallUrl;
			var size=trackLists[i].size;

			var html = "<a href=\"#\"  class=\"list-group-item\" name='"+id+"'>"
			+" <img src='"+coverSmallUrl+"' />"
			+"<h3>"+name+"</h3>"
			+ "<span><small>"+trackCount+"首，已下载"+downloadTrackCount+"首("+parseFloat(size*1.0/1048576).toFixed(2)+"M)</small></span>"
			+"<input type='hidden' name='id' value='"+id+"' />"
			+"</a>";

			$("#selectlistModal").find(".list").append(html);
		}
	}
}

/**
 * 当前播放列表改变的回调
 * @param trackListId
 */
function tracklistchange_controlbox(trackListId){
	var url = contextPath+"/controlbox/getlistview.do?deviceId="+window.deviceId+"&trackListId="+trackListId;
	console.log(url);
	$
	.ajax({
		type: 'GET',
		url : url,
		dataType: 'json',
		cache:false,
		async:false,
		error: function(data){
			//alert('Error'+data);
		},
		success : function(
				data) {
			var id=data.id;
			var name=data.name;
			var trackCount=data.trackCount;
			var downloadTrackCount=data.downloadTrackCount;
			var coverSmallUrl=data.coverSmallUrl;
			var size=data.size;

			if(id >0){
				var html = "<a href=\"#\"  class=\"list-group-item\" name='"+id+"' style='background-image:url("+ coverSmallUrl +");background-repeat: no-repeat;'>"
				//+" <img src='"+coverSmallUrl+"' />"
				+"<h3>"+name+"</h3>"
				+ "<span><small>"+trackCount+"首，已下载"+downloadTrackCount+"首("+parseFloat(size*1.0/1048576).toFixed(2)+"M)</small></span>"
				+"<input type='hidden' name='id' value='"+id+"' />"
				+"</a>";

				$("#pageControlBox").find(".list-group.list:first").html("").append(html);
			}
		}});


	var $tracklist = $("#pageControlBox").find(".tracklist");

	url = contextPath+"/track/getlist.do?trackListId="+trackListId;
	console.log(url);
	$
	.ajax({
		type: 'GET',
		url : url,
		dataType: 'json',
		cache:false,
		async:false,
		error: function(data){
			//alert('Error'+data);
		},
		success : function(
				data) {
			var count = $(data).size();
			var i = 0;

			if(count >0){
				$tracklist.html("");
			}

			while(i<count)
			{
				var title=data[i].title;
				var id=data[i].id;
				var coverSmallUrl = data[i].coverSmallUrl;
				var duration = data[i].duration;
				var url = data[i].url;
				var downloadUrl = data[i].downloadUrl;
				var status = data[i].status;
				var downloadSize = data[i].downloadSize;
				var albumTitle = data[i].albumTitle;
				var liClass = "list-group-item";

				var html = "<li class=\""+ liClass+" noimage\" "
				+ buildDataAttrForLi(id,title,coverSmallUrl,duration,url,downloadUrl,downloadSize,albumTitle,"")
				+ "data-tracklistid=\""+trackListId+"\""
				+">"
				+"<div class=\"list-index\">"+(i+1)+".</div>"
				+"<span class=\"title\">"+title+"</span>"
				+ "<span class=\"description "+ (status==0?"notdownload":"download") +"\">"
				+(parseInt(duration/60)>0?parseInt(duration/60)+"分":"")+(duration%60)+"秒 | "
				+ parseFloat(downloadSize*1.0/1048576).toFixed(2)+"M | "
				+ albumTitle
				+"</span>"
				+"<input type='hidden' name='id' value='"+id+"' />"
				+"</li>";

				$tracklist.append(html);

				i = i +1;
			}

		}
	});
}


/**
 * 当前播放歌曲改变的回调
 * @param trackId 歌曲id
 * @param type type=0普通列表播放 1点播 2留言
 */
function trackchange_controlbox(trackId,type){
	var $tracklist = $("#pageControlBox").find(".tracklist");
	$tracklist.find("li.playing").removeClass('playing');
	console.log("scrooTo");
	if(trackId >0 && (type == 0 || type == 1)){
		if(type==0){
			$tracklist.find("li").each(function(){
				if($(this).data("id") == trackId){
					$(this).addClass('playing');

					if(!$(this).isOnScreen())
						$.scrollTo($(this),800);
				}

			});
		}

		var url = contextPath+"/track/getid.do?trackId="+trackId;
		console.log(url);
		$.ajax({
			type: 'GET',
			url : url,
			dataType: 'json',
			cache:true, //用缓存
			async:false,
			error: function(data){
				//alert('Error'+data);
			},
			success : function(data) {
				if(type == 0){
					$("#mymarquee span").html(data.title);
					$("#description").text("");
				}
				else if(type == 1){
					$("#mymarquee span").html("点播："+data.title);
					var duration = data.duration;
					var downloadSize = data.downloadSize;
					var albumTitle = data.albumTitle;
					$("#description").text((parseInt(duration/60)>0?parseInt(duration/60)+"分":"")+(duration%60)+"秒 | "
				+ parseFloat(downloadSize*1.0/1048576).toFixed(2)+"M | "
				+ albumTitle);
				}
			}
		});
	}
	else if(type==2)
		$("#mymarquee span").html("播放留言中");

}



/*function onMessageArrived(message){
	console.log("onMessageArrived:"+message.payloadString);

	try{
		var obj = JSON.parse(message.payloadString);
		console.log(obj);
		if(obj.hasOwnProperty("onlineStatus")){
			onlineStatus_change(obj.onlineStatus);
		}
		else if(obj.hasOwnProperty("trackListId") && obj.hasOwnProperty("trackId") && obj.hasOwnProperty("type")){
			playTrack_change(obj.trackListId,obj.trackId,obj.type);
		}
		else if(obj.hasOwnProperty("playStatus")){
			playStatus_change(obj.playStatus);
		}
		else if(obj.hasOwnProperty("mode")){
			mode_change(obj.mode);
		}
		else if(obj.hasOwnProperty("downloadStatus") && obj.hasOwnProperty("trackId")){
			after_download(obj.downloadStatus,obj.trackId);
		}
	}
	catch(e){
		console.log(e);
	}
}*/

function onConnectCallback(){
	queryTrack();
	queryPlayStatus();
	queryMode();
}

//当前是否在线情况的改变
function onlineStatus_change(onlineStatus){
	if(onlineStatus == "on"  || onlineStatus == "online" || onlineStatus == "on-upgrade-failed"){
		window.deviceOnline = true;
	}
	else{
		window.deviceOnline = false;
	}

	showOffline();
}

//播放状态改变
function playStatus_change(playStatus){ //playing pause
	console.log(playStatus);
	var $button = $(".controlboxfooter").find("button.control");
	if(playStatus == "pause"){
		$button.removeClass('pause');
		document.getElementById('mymarquee').stop();
	}else if(playStatus == "playing"){
		$button.addClass('pause');
		document.getElementById('mymarquee').start();
	}
}

//播放模式改变
function mode_change(mode){ //repeat one，repeat all
	console.log(mode);
	var $button = $(".controlboxfooter").find("button.setmode");
	if(mode == "repeat all"){
		$button.removeClass('repeatone');
	}else{
		$button.addClass('repeatone');
	}

}

//播放歌曲改变
function playTrack_change(trackListId,trackId,type){
	if(trackListId >0 && trackListId != window.trackListId){
		window.trackListId = trackListId;
		tracklistchange_controlbox(trackListId);
	}
	window.trackId = trackId;
	window.type = type;
	trackchange_controlbox(trackId,type);
}

function after_download(downloadStatus,trackId){
	var selector = "li[data-id="+trackId+"]";
	console.log(selector);

	$("#pageControlBox").find(".tracklist").find(selector).find("span.description").removeClass('notdownload').addClass('download');
}

$.fn.isOnScreen = function(){

    var win = $(window);

    var viewport = {
        top : win.scrollTop()+80,
        bottom: win.scrollTop()+win.height()-160
    };

    var bounds = this.offset();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));

};

</script>
</body>
