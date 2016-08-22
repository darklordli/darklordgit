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

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/mqttws31.js"></script>
	<script src="js/mqttclient.js"></script>
	<script src="js/common.js"></script>
</head>

<body>
	<div id="pageTrackList" class="fastscroll" data-openid="${openid}" data-deviceid="${deviceId}">
		<div class="list-group list">
			<a href="javascript:locate_controlbox()" class="list-group-item">
				<img src="resources/theme1/img/pic_yk.png" />
				<h3>播放控制</h3>
				<span><small>通过手机wifi控制故事机播放</small></span></a>
			<a href="demandlist.do" class="list-group-item">
				<img src="resources/theme1/img/pic_ls.png" />
				<h3>点播历史</h3>
				<span><small>历史单曲点播记录</small></span></a>
			<a href="tracklist/set.do" class="list-group-item">
				<img src="resources/theme1/img/pic_zdy.png" />
				<h3>自定义公仔播放</h3>
				<span><small>设置播放列表</small></span></a>

		</div>
		<p><span>公仔下载的歌单</span></p>
		<div id="list" class="list-group list">
		</div>
	</div>
 	<jsp:include page="storylist_footer.jsp"/>


 <script type="text/javascript">

$(document).ready(function() {
	$(".footer").find("a.tracklist").addClass('current');
	window.contextPath = '<%= request.getContextPath() %>';
	window.openid = $("#pageTrackList").data("openid");
	window.deviceId = $("#pageTrackList").data("deviceid");
	console.log(window.openid+"---"+window.deviceId);

	loadTrackList();


});

function loadTrackList(){
	var $list = $("#pageTrackList").find("#list.list-group");

	var url = window.contextPath+"/tracklist/getlistview.do?deviceId="+window.deviceId;
	console.log(url);
	$list.html("");
	$list.removeClass("empty");

	$.ajax({
		type: 'GET',
		url : url,
		dataType: 'json',
		cache:false,
		async:false,
		error: function(data){
			alert("出现未知错误,请稍候重试");
		},
		success : function(
				data) {
			var count = $(data).size();
			var i = 0;

			while(i<count)
			{
				var id=data[i].id;
				var name=data[i].name;
				var trackCount=data[i].trackCount;
				var downloadTrackCount=data[i].downloadTrackCount;
				var coverSmallUrl=data[i].coverSmallUrl;
				var size=data[i].size;

				var aHref = contextPath+"/tracklist/track.do?trackListId="+id;

				var html = "<a href=\""+aHref+"\"  class=\"list-group-item\" name='"+id+"'  data-reload "
				+" data-tracklistid='"+ id +"' data-coversmallurl='"+ coverSmallUrl +"' data-title='"+name+"' >"
				+" <img src='"+coverSmallUrl+"' />"
				+"<h3>"+name+"</h3>"
				+ "<span>"+trackCount+"首，已下载"+downloadTrackCount+"首("+parseFloat(size*1.0/1048576).toFixed(2)+"M)</span>"
				+"<input type='hidden' name='id' value='"+id+"' />"
				+"</a>";

				$list.append(html);

				i = i +1;
			}

			if(count == 0){
				$list.addClass("empty");
			}
		}
	});
};

/*function onMessageArrived(message){
	console.log("onMessageArrived:"+message.payloadString);

	try{
		var obj = JSON.parse(message.payloadString);
		console.log(obj);
		if(obj.hasOwnProperty("trackListId") && obj.hasOwnProperty("trackId") && obj.hasOwnProperty("type")){
			window.trackListId = obj.trackListId;
		}
	}
	catch(e){
		console.log(e);
	}
}*/

function locate_controlbox(){
	var url = contextPath+"/tracklist/controlbox.do";
	window.location = url;
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
