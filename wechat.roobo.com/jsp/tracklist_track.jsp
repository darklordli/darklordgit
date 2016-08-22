<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <title>公仔歌单</title>
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<link href="resources/theme1/css/common.css" rel="stylesheet">
	<link href="resources/theme1/css/tracklist.css" rel="stylesheet">

	<style type="text/css">
	.list-group li.playing {
			background-image:url(resources/theme1/img/music_note_Green.png);
 			background-repeat:no-repeat;
			background-position:right center;
		}
	</style>

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/bootbox.min.js"></script>
	<script src="js/lib/audiojs/audio.js"></script>
	<script src="js/lib/mqttws31.js"></script>
	<script src="js/mqttclient.js"></script>
	<script src="js/common.js"></script>
</head>

<body>
	<div id="pageTrack" class="fastscroll" data-openid="${openid}" data-deviceid="${deviceId}"
		data-tracklistid="${trackListId}">
	 	<div class="tracklist_header"></div>

		<div class="commandbar">
			<button type="button" class="btnTrackListRemove">
				移除歌单
			</button>
			<button type="button" class="pull-right btnTrackListEdit">&nbsp;&nbsp;</button>
			<button type="button" class="btnCancel">
				取消
			</button>
			<button type="button" class="pull-right btnSelectAll">
				全选
			</button>
		</div>

	 	<input type="hidden" name="type" />
		<div class="list-group tracklist">
		</div>

		<div id="toolbar">
			<button type="button" class="col-xs-3 btnHtmlPlay">试听</button>
			<button type="button" class="col-xs-3 btnTrackCopy">复制到</button>
			<button type="button" class="col-xs-3 btnTrackMove">移动到</button>
			<button type="button" class="col-xs-3 btnTrackRemove">删除</button>
		</div>
		<div id="divAudio" class="audiohide">
			<audio preload></audio>
		</div>
	</div>
	<jsp:include page="storylist_footer.jsp"/>
	<jsp:include page="select_add_tracklist.jsp"/>

<script type="text/javascript">

$(document).ready(function() {
	$(".footer").find("a.tracklist").addClass('current');
	window.contextPath = '<%= request.getContextPath() %>';
	window.openid = $("#pageTrack").data("openid");
	window.deviceId = $("#pageTrack").data("deviceid");
	console.log(window.openid+"---"+window.deviceId);

	createAudio();
	track_callback();
	tracklist_header();

	clientCreate(onConnectCallback);

	$("#pageTrack").find(".tracklist").on("click","li",function(){
		var $toolbar =$("#toolbar");
		toolbar_bind($(this),$toolbar);
	});

	$("body").on("click","#toolbar button.btnHtmlPlay",function(){
		toolbar_htmlplay($(this));
	});


	$("body").on("click","#toolbar button.btnTrackCopy",function(){
		if(checkBeforeCopyMove())
			select_add_tracklist_show($(this),copyTrack);
	});

	$("body").on("click","#toolbar button.btnTrackMove",function(){
		if(checkBeforeCopyMove())
			select_add_tracklist_show($(this),moveTrack);
	});

	$("body").on("click","#toolbar button.btnTrackRemove",function(){
		if(checkBeforeCopyMove())
			removeFromTrackList();
	});

	/** 移除整个列表 */
	$(".commandbar").find("button.btnTrackListRemove").click(function(){
		removeTrackList();
	});



	/** 开始编辑 */
	$(".commandbar").find("button.btnTrackListEdit").click(function(){
		beginEditList();
	});

	/** 取消编辑 */
	$(".commandbar").find("button.btnCancel").click(function(){
		cancelEditList();
	});

	/** 全选 */
	$(".commandbar").find("button.btnSelectAll").click(function(){
		$(".tracklist").find("input[name=selected]").prop("checked",true);
	});

});

function track_callback(pageInto, pageOut,options){
	console.log("track_callback");



	var page = 1;
	var count = 20;
	var totalPage =0;
	var totalCount=0; //总行数

	var _trackListId = $("#pageTrack").data("tracklistid");
	var _$toolbar = $("#pageTrack").find("#toolbar");
	var _$tracklist = $("#pageTrack").find(".tracklist");

	loadFirstPage();

	page +=1;
	console.log("page:"+page+" totalPage:"+totalPage+" totalCount:"+totalCount);

	if(page <=totalPage){
		//first page is over ,begin second
		var element = "<li class=\"list-group-item\" />";
		for(var i=count+1;i<=totalCount;i++)
			_$tracklist.append(element);

		var deferreds = [];
		while (page <=totalPage) {
			var request = trackPageRequest(_trackListId,page,count);
			deferreds.push(request);
			page = page +1;
		}

		$.when.apply(null, deferreds).done(function() {
            console.log("all track done");
        });
	}

	function loadFirstPage(){
		console.log("page:"+page);

		if(page == 1)
			_$tracklist.html("");

		var url = contextPath+"/track/getpage.do?trackListId="+_trackListId
			+"&currentPage="+page+"&pageSize="+count;
		console.log(url);
		$
		.ajax({
			type: 'GET',
			url : url,
			dataType: 'json',
			cache:false,
			async:false,
			error: function(data){
				console.log("loadFirstPage is error");
			},
			success : function(
					data) {
				totalPage =data.totalPage;
				totalCount = data.totalCount;
				console.log("totalPage:"+totalPage);

				var size = $(data.tracks).size();
				var i = 0;

				while(i<size)
				{
					var title=data.tracks[i].title;
					var id=data.tracks[i].id;
					var coverSmallUrl = data.tracks[i].coverSmallUrl;
					var duration = data.tracks[i].duration;
					var url = data.tracks[i].url;
					var downloadUrl = data.tracks[i].downloadUrl;
					var status = data.tracks[i].status;
					var downloadSize = data.tracks[i].downloadSize;
					var albumTitle = data.tracks[i].albumTitle;
					var liClass = "list-group-item";

					var html = "<li class=\""+ liClass+"\" "
					+ buildDataAttrForLi(id,title,coverSmallUrl,duration,url,downloadUrl,downloadSize,albumTitle,"")
					+">"
					+"<div class=\"list-index\">"+((page-1)*count+i+1)+".</div>"
					+"<span class=\"title\">"+title+"</span>"
					+ "<span class=\"description "+ (status==0?"notdownload":"download") +"\">"
					+(parseInt(duration/60)>0?parseInt(duration/60)+"分":"")+(duration%60)+"秒 | "
					+ parseFloat(downloadSize*1.0/1048576).toFixed(2)+"M | "
					+ albumTitle
					+"</span>"
					//+"<div class=\"pull-right\">"
					+" <input type=\"checkbox\" name=\"selected\" id=\"selected"+id+"\" />"
					+"<label class=\"trackselectbox\" for=\"selected"+id+"\"><span></span></label>"
					//+"</div>"
					+"<input type='hidden' name='id' value='"+id+"' />"
					+"</li>";

					_$tracklist.append(html);

					i = i +1;
				}

			}
		});
	};

	function trackPageRequest(trackListId,page,count){
		var url = contextPath+"/track/getpage.do?trackListId="+_trackListId
			+"&currentPage="+page+"&pageSize="+count;
		console.log(url);

		return $.ajax({
			type: 'GET',
			url : url,
			dataType: 'json',
			cache:false,
			async:true,
			error: function(data){
				console.log("trackPageRequest is error");
			},
			success : function(
					data) {

				console.log("page:"+page+" callback");
				var size = $(data.tracks).size();
				var i = 0;

				while(i<size)
				{
					var title=data.tracks[i].title;
					var id=data.tracks[i].id;
					var coverSmallUrl = data.tracks[i].coverSmallUrl;
					var duration = data.tracks[i].duration;
					var url = data.tracks[i].url;
					var downloadUrl = data.tracks[i].downloadUrl;
					var status = data.tracks[i].status;
					var downloadSize = data.tracks[i].downloadSize;
					var albumTitle = data.tracks[i].albumTitle;

					var html = "<div class=\"list-index\">"+((page-1)*count+i+1)+".</div>"
					+"<span class=\"title\">"+title+"</span>"
					+ "<span class=\"description "+ (status==0?"notdownload":"download") +"\">"
					+(parseInt(duration/60)>0?parseInt(duration/60)+"分":"")+(duration%60)+"秒 | "
					+ parseFloat(downloadSize*1.0/1048576).toFixed(2)+"M | "
					+ albumTitle
					+"</span>"
					+"<div class=\"pull-right\">"
					+" <input type=\"checkbox\" name=\"selected\" id=\"selected"+id+"\" />"
					+"<label class=\"trackselectbox\" for=\"selected"+id+"\"><span></span></label>"
					+"</div>";

					var $el = _$tracklist.find("li").eq((page-1)*count +i);
					$el.html(html);
					$el.data("id",id);
					$el.data("title",title);
					$el.data("coversmallurl",coverSmallUrl);
					$el.data("duration",duration);
					$el.data("url",url);
					$el.data("downloadurl",downloadUrl);
					$el.data("downloadsize",downloadSize);
					$el.data("albumtitle",albumTitle);

					i = i +1;
				}


			}
		});
	}
}

function tracklist_header(){
	var trackListId = $("#pageTrack").data("tracklistid");
	var url = contextPath+"/tracklist/get.do?id="+trackListId;
	$(".tracklist_header").html("");

	$.ajax({
		type: 'GET',
		url : url,
		dataType: 'json',
		cache:false,
		async:true,
		error: function(data){
			console.log("tracklist_header is error");
		},
		success : function(
				data) {
			var id= data.id;
			var name = data.name;
			var coverSmallUrl = data.coverSmallUrl;

			var html = "<span>"+name+"</span>";
			$(".tracklist_header").html(html);
			$(".tracklist_header").css("background-image","url('"+coverSmallUrl+"')");
		}
	});
}

function removeTrackList(){
	common_confirm("会移除公仔里的歌单，确定？","移除",function(){
		var trackListId = $("#pageTrack").data("tracklistid");

		console.log(trackListId+"----------------")

		$.ajax({
			type : "POST",
			url : contextPath + "/tracklist/remove.do?id="+trackListId+"&deviceId=" + window.deviceId,
			contentType : 'application/json',
			async : false,
			cache:false,
			//dataType : 'json',
			timeout : 4000,
			success : function(msg) {
				console.log("remove "+msg);
				if(msg == "ok"){
					showAlert("移除成功");
					window.location = contextPath+"/tracklist.do";
				}
			},
			error : function(data) {
				//hideMaskLoading();
			}
		});
	},"取消");

}

function beginEditList(){
	var $li = $(".tracklist").find("li");
	var $toolbar = $("#toolbar");

	$li.addClass('editing');
	$li.find("input[name=selected]").prop("checked",false);

	$(".commandbar").find("button").hide();
	$(".commandbar").find("button.btnCancel").show();
	$(".commandbar").find("button.btnSelectAll").show();

	$toolbar.addClass('navbar-fixed-bottom');
	$toolbar.find(".btnHtmlPlay").hide();
	$toolbar.find(".btnTrackCopy").removeClass('col-xs-3').addClass('col-xs-4');
	$toolbar.find(".btnTrackMove").removeClass('col-xs-3').addClass('col-xs-4');
	$toolbar.find(".btnTrackRemove").removeClass('col-xs-3').addClass('col-xs-4');
	$toolbar.show();

	$(".footer").after($toolbar);
	$(".footer").hide();
}

function cancelEditList(){
	var $li = $(".tracklist").find("li");
	var $toolbar = $("#toolbar");

	$li.removeClass('editing');
	$(".commandbar").find("button").show();
	$(".commandbar").find("button.btnCancel").hide();
	$(".commandbar").find("button.btnSelectAll").hide();

	$toolbar.removeClass('navbar-fixed-bottom');
	$toolbar.find(".btnHtmlPlay").show();
	$toolbar.find(".btnTrackCopy").removeClass('col-xs-4').addClass('col-xs-3');
	$toolbar.find(".btnTrackMove").removeClass('col-xs-4').addClass('col-xs-3');
	$toolbar.find(".btnTrackRemove").removeClass('col-xs-4').addClass('col-xs-3');
	$toolbar.hide();

	$(".footer").show();
}

/** 复制到指定列表 */
function copyTrack($btn,trackListId){
	var trackIds = [];
	var $lis = [];

	var $toolbar = $("#toolbar");

	//判断是单选还是多选
	if($toolbar.hasClass('navbar-fixed-bottom')){
		//多选
		$(".tracklist").find("input[name=selected]:checked").each(function(){
			var $li = $(this).parents("li");
			var trackId = $li.data("id");
			$lis.push($li);
			trackIds.push(trackId);
		});
	}
	else{
		var $li = $toolbar.prev();
		var trackId = $li.data("id");
		$lis.push($li);
		trackIds.push(trackId);
	}

	copyToTrackList(trackListId,trackIds,$lis);
}

/** 移动单首歌到指定列表 */
function moveTrack($btn,trackListId){
	var trackIds = [];
	var $lis = [];
	var $toolbar = $("#toolbar");

	//判断是单选还是多选
	if($toolbar.hasClass('navbar-fixed-bottom')){
		//多选
		$(".tracklist").find("input[name=selected]:checked").each(function(){
			var $li = $(this).parents("li");
			var trackId = $li.data("id");
			$lis.push($li);
			trackIds.push(trackId);
		});
	}
	else{
		var $li = $toolbar.prev();
		var trackId = $li.data("id");
		$lis.push($li);
		trackIds.push(trackId);
	}

	moveToTrackList(trackListId,trackIds,$lis);
}

function checkBeforeCopyMove(){
	var $toolbar = $("#toolbar");

	if($toolbar.hasClass('navbar-fixed-bottom')){
		//多选
		var count = $(".tracklist").find("input[name=selected]:checked").size();
		if(count == 0){
			common_alert("没有选择歌曲","确定",function(){

			});
			return false;
		}
		else
			return true;
	}
	else{
		return true;
	}
}

/** 复制歌到指定列表 */
function copyToTrackList(id,trackIds,$lis){
	var trackListId = $("#pageTrack").data("tracklistid");

	$.ajax({
		type : "POST",
		url : contextPath + "/track/copy.do?id="+id+"&sourceId="+trackListId+"&deviceId=" + window.deviceId,
		contentType : 'application/json',
		async : false,
		//dataType : 'json',
		timeout : 4000,
		data : JSON.stringify(trackIds),
		success : function(msg) {
			console.log("-------------------------copy "+msg);
			if(msg == "ok"){
				showAlert("复制成功");
				cancelEditList();
			}
			else if(msg == "duplicate"){
				common_alert("请勿重复添加","确定",function(){

				});

			}
			else if(msg == "changed"){
				common_alert("列表被其他人编辑了，请重新进入列表再操作","确定",function(){

				});

			}
		},
		error : function(data) {
			//hideMaskLoading();
		}
	});
}

/** 移动歌到指定列表 */
function moveToTrackList(id,trackIds,$lis){
	var trackListId = $("#pageTrack").data("tracklistid");

	$.ajax({
		type : "POST",
		url : contextPath + "/track/move.do?id="+id+"&sourceId="+trackListId+"&deviceId=" + window.deviceId,
		contentType : 'application/json',
		async : false,
		//dataType : 'json',
		timeout : 4000,
		data : JSON.stringify(trackIds),
		success : function(msg) {
			console.log("move "+msg);
			if(msg == "ok"){
				showAlert("移动成功");
				for(var i=0;i<$lis.length;i++)
					$lis[i].remove();

				//暂停试听
				var playTrackId = $("#toolbar").find(".btnHtmlPlay").data("pretrackid");
				for(var i=0;i<trackIds.length;i++){
					if(playTrackId == trackIds[i])
						stopAudio();
				}

				var tmpi=0;
				$(".tracklist").find("li").find(".list-index").each(function(){
					$(this).text((tmpi+1)+".");
					tmpi +=1;
				});

				cancelEditList();
			}
			else if(msg == "duplicate"){
				common_alert("请勿重复添加","确定",function(){

				});

			}
			else if(msg == "changed"){
				common_alert("列表被其他人编辑了，请重新进入列表再操作","确定",function(){

				});

			}
		},
		error : function(data) {
			//hideMaskLoading();
		}
	});
}

/** 从列表中移除单首歌 */
function removeFromTrackList(){
	common_confirm("会移除公仔里的歌，确定？","移除",function(){
		var trackListId = $("#pageTrack").data("tracklistid");
		var trackIds = [];
		var $lis = [];
		var $toolbar = $("#toolbar");

		//判断是单选还是多选
		if($toolbar.hasClass('navbar-fixed-bottom')){
			//多选
			$(".tracklist").find("input[name=selected]:checked").each(function(){
				var $li = $(this).parents("li");
				var trackId = $li.data("id");
				$lis.push($li);
				trackIds.push(trackId);
			});
		}
		else{
			console.log("this is here");
			var $li = $toolbar.prev();
			var trackId = $li.data("id");
			$lis.push($li);
			trackIds.push(trackId);
		}

		$.ajax({
			type : "POST",
			url : contextPath + "/track/remove.do?id="+trackListId+"&deviceId=" + window.deviceId,
			contentType : 'application/json',
			async : false,
			cache:false,
			//dataType : 'json',
			timeout : 4000,
			data : JSON.stringify(trackIds),
			success : function(msg) {
				console.log("remove "+msg);
				if(msg == "ok"){
					showAlert("移除成功");

					for(var i=0;i<$lis.length;i++)
						$lis[i].remove();

					//暂停试听
					var playTrackId = $("#toolbar").find(".btnHtmlPlay").data("pretrackid");
					for(var i=0;i<trackIds.length;i++){
						if(playTrackId == trackIds[i])
							stopAudio();
					}

					var tmpi=0;
					$(".tracklist").find("li").find(".list-index").each(function(){
						$(this).text((tmpi+1)+".");
						tmpi +=1;
					});

					cancelEditList();
				}
			},
			error : function(data) {
				//hideMaskLoading();
			}
		});
	},"取消");

}

// function onMessageArrived(message){
// 	console.log("onMessageArrived:"+message.payloadString);
//
// 	try{
// 		var obj = JSON.parse(message.payloadString);
// 		console.log(obj);
// 		if(obj.hasOwnProperty("downloadStatus") && obj.hasOwnProperty("trackId")){
// 			after_download(obj.downloadStatus,obj.trackId);
// 		}
// 	}
// 	catch(e){
// 		console.log(e);
// 	}
// }

function onConnectCallback(){

}

function after_download(downloadStatus,trackId){
	var selector = "li[data-id="+trackId+"]";
	console.log(selector);
	$("#pageTrack").find(".tracklist").find(selector).find("span.description").removeClass('notdownload').addClass('download');
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
</body>
