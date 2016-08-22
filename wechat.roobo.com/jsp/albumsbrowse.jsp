<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <title>云端故事</title>
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<link href="resources/theme1/css/common.css" rel="stylesheet">
	<link href="resources/theme1/css/storybox.css" rel="stylesheet">

	<style type="text/css">
	#pageAlbumsbrowse .list-group li.playing {
<%-- 			background-image:url(resources/theme1/img/music_note_Green.png); --%>
/* 			background-repeat:no-repeat; */
/* 			background-position:right center; */
		}

	</style>

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/audiojs/audio.js"></script>
	<script src="js/lib/bootbox.min.js"></script>

	<script src="js/common.js"></script>

</head>

<body>
	<!--<div id="wrapper">-->
		<div id="pageAlbumsbrowse" class="fastscroll" data-openid="${openid}" data-deviceid="${deviceId}">
			<input id="albumId" type="hidden" value="${albumId}" />
			<input id="albumTotalCount" type="hidden" value="" />

			<div id="divAudio" class="audiohide">
				<audio preload></audio>
			</div>
			<div class="mask-hy" style="display:none;"><i class="loading-hy"></i></div>

			<div id="toolbar">
				<button type="button" class="col-xs-3 btnHtmlPlay">试听</button>
				<button type="button" class="col-xs-3 btnDemand">点播</button>
				<button type="button" class="col-xs-3 btnDownload">下载</button>
				<button type="button" class="col-xs-3 btnFavorite">收藏</button>
			</div>
			<div class="tracklist_header"></div>
			<div class="commandbar">
				<button type="button" class="btnDownload" disabled="disabled">
					下载到故事机
				</button>
			</div>
			<div id="listAlbumsbrowse"  class="list-group tracklist">
			</div>
		</div>
	<!--</div>-->
	<!--<jsp:include page="storylist_footer.jsp"/>-->
	<jsp:include page="select_add_tracklist.jsp"/>

<script type="text/javascript">
window.contextPath = "";
window.openid = "";
window.deviceId = "";

//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(document).ready(function() {
	$(".footer").find("a.cloud").addClass('current');

	window.contextPath = '<%= request.getContextPath() %>';

	window.openid = $("#pageAlbumsbrowse").data("openid");
	window.deviceId = $("#pageAlbumsbrowse").data("deviceid");
	console.log(window.openid+"---"+window.deviceId);

	createAudio();
	albumsbrowse_list_callback();

	$(".commandbar").find("button.btnDownload").click(function(){
		if(window.deviceId == "")
			window.location = window.contextPath+"/doscan.do";
		else
			addAlbumToTrackList();

	});

	$("#pageAlbumsbrowse").find(".tracklist").on("click","li",function(){
		var $toolbar = $("#toolbar");
		toolbar_bind($(this),$toolbar);
	});

	$("body").on("click","#toolbar button.btnHtmlPlay",function(){
		toolbar_htmlplay($(this));
	});

	$("body").on("click","#toolbar button.btnDemand",function(){
		toolbar_demand($(this));
	});

	$("body").find("#toolbar button.btnDownload").click(function(){
		if(window.deviceId == ""){
			window.location = window.contextPath+"/doscan.do";
		}
		else
			select_add_tracklist_show($(this),toolbar_download_callback);
	});

	$("body").on("click","#toolbar button.btnFavorite",function(){
		toolbar_favorite($(this));
	});


});

function albumsbrowse_list_callback(){
	var _albumId = $("#pageAlbumsbrowse").find("#albumId").val();
	console.log("albumId:"+_albumId);

	var page = 1;
	var count = 20;
	var totalPage =3;

	var _albumTitle = "";
	var _albumCoverUrlSmall = "";
	var _totalCount = 0;
	var _$toolbar = $("#pageAlbumsbrowse").find("#toolbar");
	var _$tracklist = $("#pageAlbumsbrowse").find(".tracklist");

	_$toolbar.hide();

	loadFirstPageTracks();
	//var myScroll = new IScroll('#wrapper', { mouseWheel: true,scrollbars: true,click: true  });

	page +=1;
	console.log("page:"+page+" totalPage:"+totalPage+" totalCount:"+_totalCount);

	if(page <=totalPage){
		//first page is over ,begin second
		var element = "<li class=\"list-group-item\" style='display:none;' />";
		for(var i=count+1;i<=_totalCount;i++){
			console.log(" index:"+i+" empty li")
			_$tracklist.append(element);
		}

		var deferreds = [];
		while (page <=totalPage) {
			var request = albumRequest(_albumId,page,count);
			deferreds.push(request);
			page = page +1;
		}

		$.when.apply(null, deferreds).done(function() {
            console.log("all track done");

            $(".commandbar .btnDownload").removeAttr('disabled');
        });
	}
	else{
		console.log("only one page track");

        $(".commandbar .btnDownload").removeAttr('disabled');
	}

	// Loads the next songs
	function loadFirstPageTracks(){
		_$tracklist.find("li").remove();

		var url = contextPath+"/searchalbumsbrowse.do?albumId="+_albumId+"&page="+page+"&count="+count;
		console.log(url);

		$
		.ajax({
			type: 'GET',
			url : url,
			dataType: 'json',
			cache:true,
			async:false,
			error: function(data){
				alert("出现未知错误,请稍候重试");
			},
			success : function(data) {
				totalPage =data.total_page;
				_albumTitle = data.album_title;
				_albumCoverUrlSmall = data.cover_url_small;
				_totalCount = data.total_count;

				loadAlbumInTrackList(_albumTitle,_albumCoverUrlSmall);

				var size = $(data.tracks).size();
				var i = 0;

				while(i<size)
				{
					var title=data.tracks[i].track_title;
					var id=data.tracks[i].id;
					var coverSmallUrl = data.tracks[i].cover_url_small;
					var duration = data.tracks[i].duration;
					var url = data.tracks[i].play_url_32;
					var downloadUrl = data.tracks[i].download_url;
					var downloadSize = data.tracks[i].download_size;
					var albumTitle = data.tracks[i].subordinated_album.album_title;
					var albumCoverSmallUrl = data.tracks[i].subordinated_album.cover_url_small;

					var html = "<li class=\"list-group-item\" name='"+id+"'"
					+ buildDataAttrForLi(id,title,coverSmallUrl,duration,url,downloadUrl,downloadSize,albumTitle,albumCoverSmallUrl)
					+" >"
					+" <img src='"+coverSmallUrl+"' />"
					+"<span class=\"title\">"+title+"</span>"
					+ "<span class=\"description\">"+(parseInt(duration/60)>0?parseInt(duration/60)+"分":"")+(duration%60)+"秒  | "
					+ parseFloat(downloadSize*1.0/1048576).toFixed(2) +"M</span>"
					+"</li>";

					_$tracklist.append(html);

					i = i +1;
				}

			}
		});
	}


	function loadAlbumInTrackList(albumTitle,albumCoverUrlSmall){
		console.log($("#pageAlbumsbrowse #listAlbumsbrowse").size());
		//只在第一次加载
		if(_$tracklist.find("li").size() == 0){
			var html = " <img src='"+_albumCoverUrlSmall+"' />"
					+"<span>"+_albumTitle+"</span>";

			$(".tracklist_header").html(html);
			$(".tracklist_header").data("albumtitle",albumTitle);
			$(".tracklist_header").data("albumcoverurlsmall",albumCoverUrlSmall);

			console.log("html:"+html);
		}
	}


	// 专辑按页请求
	function albumRequest(albumId,page,count){
		var url = contextPath + "/searchalbumsbrowse.do?albumId=" + albumId
		+ "&page=" + page + "&count=" + count;
		console.log(url);

		return $.ajax({
			type : 'GET',
			url : url,
			dataType : 'json',
			cache : true,
			async : true,
			error : function(data) {
				console.log('Error' + data);
			},
			success : function(data) {
				var size = $(data.tracks).size();
				var i = 0;

				while(i<size)
				{
					var title=data.tracks[i].track_title;
					var id=data.tracks[i].id;
					var coverSmallUrl = data.tracks[i].cover_url_small;
					var duration = data.tracks[i].duration;
					var url = data.tracks[i].play_url_32;
					var downloadUrl = data.tracks[i].download_url;
					var downloadSize = data.tracks[i].download_size;
					var albumTitle = data.tracks[i].subordinated_album.album_title;
					var albumCoverSmallUrl = data.tracks[i].subordinated_album.cover_url_small;

					var html = "<img src='"+coverSmallUrl+"' />"
					+"<span class=\"title\">"+title+"</span>"
					+ "<span class=\"description\">"+(parseInt(duration/60)>0?parseInt(duration/60)+"分":"")+(duration%60)+"秒  | "
					+ parseFloat(downloadSize*1.0/1048576).toFixed(2) +"M</span>";

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
					$el.data("albumcoversmallurl",albumCoverSmallUrl);
					$el.show();

					i = i +1;
				}

				//myScroll.refresh();
			}
		});
	}



}

/** 添加专辑到列表中 */
function addAlbumToTrackList() {
	var tracks = [];

	showMaskLoading();
	//先把专辑名作为列表名新增一个列表
	var albumTitle = $(".tracklist_header").data("albumtitle");
	var albumCoverUrlSmall = $(".tracklist_header").data("albumcoverurlsmall");
	var _$tracklist = $("#pageAlbumsbrowse").find(".tracklist");

	var trackList = {id:0,deviceId:window.deviceId,name:albumTitle,coverSmallUrl:albumCoverUrlSmall};
	var trackListId=0;
	$.ajax({
		type : "POST",
		url : contextPath + "/tracklist/add.do",
		contentType : 'application/json',
		async : true,
		//dataType : 'json',
		timeout : 4000,
		data : JSON.stringify(trackList),
		success : function(msg) {
			trackListId = parseInt(msg);

			console.log("trackListId:"+trackListId);
			if(trackListId <0){
				common_alert("检测到已经存在同名专辑，不要重复下载","确定",function(){
					hideMaskLoading();
				});

			}
			else if(trackListId >0){

				_$tracklist.find("li").each(function(){
					var track = createTrack($(this));
					tracks.push(track);
				});


	        	$.ajax({
					type : "POST",
					url : contextPath + "/track/download.do?deviceId=" + window.deviceId
							+ "&id=" + trackListId
							+ "&name=" + encodeURI(encodeURI(albumTitle)),
					contentType : 'application/json',
					async : true,
					cache:false,
					//dataType : 'json',
					timeout : 7000,
					data : JSON.stringify(tracks),
					success : function(msg) {
						console.log(msg);
						showAlert("下载成功");
		            	hideMaskLoading();
					},
					error : function(data) {
						showAlert("下载失败");
		            	hideMaskLoading();
					}
				});

			}
		},
		error : function(data) {
			//hideMaskLoading();
		}
	});





}




//列表按页保存
function addToTrackListPost(id,name,tracks) {
	return $.ajax({
		type : "POST",
		url : contextPath + "/track/download.do?deviceId=" + window.deviceId
				+ "&id=" + id
				+ "&name=" + encodeURI(encodeURI(name)),
		contentType : 'application/json',
		async : true,
		//dataType : 'json',
		timeout : 20000,
		data : JSON.stringify(tracks),
		success : function(msg) {
			console.log(msg);
		},
		error : function(data) {
			//hideMaskLoading();
		}
	});
}

function showMaskLoading(){
	$("#pageAlbumsbrowse").find(".mask-hy").show();
}

function hideMaskLoading(){
	$("#pageAlbumsbrowse").find(".mask-hy").hide();
}

//收藏
function toolbar_favorite($btn){
	var _li = $btn.parent("#toolbar").prev("li");

	var track = createTrack(_li);
	var favorite ={};
	favorite.openId = window.openid;
	favorite.trackId = track.id;
	favorite.title = track.title;
	favorite.coverSmallUrl = track.coverSmallUrl;
	favorite.duration = track.duration;
	favorite.albumTitle = track.albumTitle;
	favorite.albumCoverSmallUrl = track.albumCoverSmallUrl;
	favorite.url = track.url;
	favorite.downloadUrl = track.downloadUrl;
	favorite.downloadSize = track.downloadSize;

	console.log("favorite.title:"+favorite.title);

	$.ajax({
		type : "POST",
		url : contextPath + "/favorite/save.do?",
		contentType : 'application/json',
		async : false,
		//dataType : 'json',
		timeout : 4000,
		data : JSON.stringify(favorite),
		success : function(msg) {
			showAlert("收藏成功");
		},
		error : function(data) {
			//hideMaskLoading();
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
</body>
