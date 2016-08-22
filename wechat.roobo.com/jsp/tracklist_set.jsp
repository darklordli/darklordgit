<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <title>设置播放列表</title>
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<link href="resources/theme1/css/common.css" rel="stylesheet">
	<link href="resources/theme1/css/tracklist.css" rel="stylesheet">

	<style type="text/css">
		.tracklist li{
			padding-right: 40px;
		}
		.tracklist li input[name=selected]{
			display: none;
		}

		.tracklist li input[name=selected] + label.trackselectbox span{
			display:inline-block;
			width:26px;
		    height:26px;
		    background:url(resources/theme1/img/btn_unselect.png) center center no-repeat;
		    background-size: 26px 26px;
		    cursor:pointer;
		    position:absolute;
			top:10px;
			right:10px;
		}

		.tracklist li input[name=selected]:checked + label.trackselectbox span{
			background:url(resources/theme1/img/btn_select.png) center center no-repeat;
			background-size: 26px 26px;
		}
	</style>

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/bootbox.min.js"></script>
	<script src="js/common.js"></script>
</head>

<body>
	<div id="pageTrackListSet" class="fastscroll" data-openid="${openid}" data-deviceid="${deviceId}">
		<div id="list" class="list-group tracklist">
		</div>
	</div>
	<div class="navbar-fixed-bottom text-center">
		<button type="button" class="btn btn-success btn-lg btn-block">设  置</button>
	</div>

<script type="text/javascript">

$(document).ready(function() {
	$(".footer").find("a.tracklist").addClass('current');
	window.contextPath = '<%= request.getContextPath() %>';
	window.openid = $("#pageTrackListSet").data("openid");
	window.deviceId = $("#pageTrackListSet").data("deviceid");
	console.log(window.openid+"---"+window.deviceId);

	getList();

	$(".navbar-fixed-bottom button").click(function(){
		save();
	});
});

function getList(){
	var url = window.contextPath+"/tracklist/getlistview.do?deviceId="+window.deviceId;
	var $list = $(".tracklist");
	$list.html("");

	$.ajax({
			type : "GET",
			url : url,
			cache:false,
			async : false,
			dataType : 'json',
			timeout : 4000,
			success : function(data) {
				var count = $(data).size();
				if(count == 0){
					common_alert("故事机里还没有歌单","去云端故事看看",function(){
						window.location = contextPath + "/storylist.do";
					});

				}
				else{

					var i = 0;

					while(i<count)
					{
						var id=data[i].id;
						var name=data[i].name;
						var trackCount=data[i].trackCount;
						var downloadTrackCount=data[i].downloadTrackCount;
						var coverSmallUrl=data[i].coverSmallUrl;
						var size=data[i].size;
						var play=data[i].play;

						var aHref = contextPath+"/tracklist/track.do?trackListId="+id;

						var html = "<li class=\"list-group-item\" name='"+id+"'  data-reload "
						+" data-tracklistid='"+ id +"' data-coversmallurl='"+ coverSmallUrl +"' data-title='"+name+"' >"
						+" <img src='"+coverSmallUrl+"' />"
						+"<span class=\"title\">"+name+"</span>"
						+ "<span class=\"description\">"+trackCount+"首，已下载"+downloadTrackCount+"首("+parseFloat(size*1.0/1048576).toFixed(2)+"M)</span>"
						+"<input type='checkbox' name='selected' "+(play?"checked":"")+" id=\"selected"+id+"\"/>"
						+"<label class=\"trackselectbox\" for=\"selected"+id+"\"><span></span></label>"
						+"</li>";

						$list.append(html);

						i = i +1;
					}
				}
			},
			error : function(data) {
				//hideMaskLoading();
			}
		});


}

function save(){
	var $list = $("#pageTrackListSet").find(".list-group.tracklist");

	var count = $list.children().find("input[name=selected]:checked").size();
	if(count == 0){
		common_alert("请至少选择一个列表","确定",function(){
			return;
		});

	}
	else{
		var trackListArray = [];
		$list.children().each(function(){
			var id= parseInt($(this).data("tracklistid"));
			var play = false;
			if($(this).find("input[name=selected]:checked").length >0)
				play = true;
			console.log(id+"---"+play);
			var trackList = {};
			trackList.id = id;
			trackList.play = play;
			trackListArray.push(trackList);
		});
		console.log(trackListArray);

		$.ajax({
			type : "POST",
			url : contextPath + "/tracklist/setplaytracklist.do?deviceId=" + window.deviceId,
			contentType : 'application/json',
			async : false,
			//dataType : 'json',
			timeout : 4000,
			data : JSON.stringify(trackListArray),
			success : function(msg) {
				if(msg == "ok"){
					showAlert("设置成功");
				}
			},
			error : function(data) {
				//hideMaskLoading();
			}
		});
	}
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
