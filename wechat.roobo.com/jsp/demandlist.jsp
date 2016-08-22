<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <title>点播历史</title>
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<link href="resources/theme1/css/common.css" rel="stylesheet">

	<style type="text/css">
	#pageAlbumsbrowse .list-group li.playing {
			background-image:url(resources/theme1/img/music_note_Green.png);
			background-repeat:no-repeat;
			background-position:right center;
		}

	</style>

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/bootbox.min.js"></script>
	<script src="js/lib/audiojs/audio.js"></script>

	<script src="js/common.js"></script>

</head>

<body>
  	<div id="pageDemand" class="fastscroll" >
  		<input type="hidden" name="openid" value="${openid}" />
  		<input type="hidden" name="deviceId" value="${deviceId}" />
  		<div class="tracklist_header">
			<img src="resources/theme1/img/pic_ls.png" />
			<span>点播历史</span>
		</div>
		<div id="divAudio" class="audiohide">
			<audio preload></audio>
		</div>
		<div id="toolbar">
			<button type="button" class="col-xs-3 btnHtmlPlay">试听</button>
			<button type="button" class="col-xs-3 btnDemand">点播</button>
			<button type="button" class="col-xs-3 btnDemandRemove">移除</button>

		</div>
		<div class="list-group tracklist">
		</div>

	</div>
	<jsp:include page="storylist_footer.jsp"/>
<script type="text/javascript">

$(document).ready(function() {

	window.contextPath = '<%= request.getContextPath() %>';

	window.openid = $("input[name=openid]").val();
	window.deviceId = $("input[name=deviceId]").val();
	console.log(window.openid+"---"+window.deviceId);

	createAudio();
	loadDemand();

	$(".tracklist").on("click","li",function(){
		var $toolbar = $("#toolbar");
		toolbar_bind($(this),$toolbar);
	});

	$("body").on("click","#toolbar button.btnHtmlPlay",function(){
		toolbar_htmlplay($(this));
	});

	$("body").on("click","#toolbar button.btnDemand",function(){
		toolbar_demand($(this));
	});

	$("body").on("click","#toolbar button.btnDemandRemove",function(){
		toolbar_demandRemove($(this));
	});
});

function toolbar_demandRemove($btn){
	var $li = $btn.parent("#toolbar").prev("li");

	var id=$li.data("id");
	console.log("remove demand Id: "+id);

	var demand = {};
	demand.id = id;
	demand.openId = window.openid;

	$.ajax({
		type : "POST",
		url : contextPath + "/demand/delete.do",
		contentType : 'application/json',
		async : false,
		data:JSON.stringify(demand),
		//dataType : 'json',
		timeout : 4000,
		success : function(msg) {
			console.log("remove "+msg);
			if(msg == "ok"){
				showAlert("移除成功");
				$("#toolbar").hide();
				var playTrackId = $("#toolbar").find(".btnHtmlPlay").data("pretrackid");
				if(playTrackId == id)
					stopAudio();

				$li.nextAll("li").find(".list-index").each(function(){
					var index = parseInt($(this).text());
					console.log(index);
					$(this).text((index-1)+".");
				});

				$li.remove();
			}
		},
		error : function(data) {
			//hideMaskLoading();
		}
	});
}

function loadDemand(){
	$("#pageDemand").find(".tracklist").find("li").remove();

	var url = contextPath+"/demand/getlist.do?openId="+openid;
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
			var count = $(data).size();
			var i = 0;

			while(i<count)
			{
				var title=data[i].title;
				var id=data[i].id;
				var coverSmallUrl = data[i].coverSmallUrl;
				var duration = data[i].duration;
				var url = data[i].url;
				var downloadUrl = data[i].downloadUrl;
				var downloadSize = data[i].downloadSize;
				var albumTitle = data[i].albumTitle;

				var html = "<li class=\"list-group-item noimage\""
				+ buildDataAttrForLi(id,title,coverSmallUrl,duration,url,downloadUrl,downloadSize,albumTitle,"")
				+" >"
				+"<div class=\"list-index\">"+(i+1)+".</div>"
				+"<span class=\"title\">"+title+"</span>"
				+ "<span class=\"description\">"+(parseInt(duration/60)>0?parseInt(duration/60)+"分":"")+(duration%60)+"秒 | "
				+ parseFloat(downloadSize*1.0/1048576).toFixed(2)+"M | "
				+ albumTitle
				+"</span>"
				+"</li>";
				console.log(html);
				$("#pageDemand").find(".tracklist").append(html);

				i = i +1;
			}

		}
	});
};

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
