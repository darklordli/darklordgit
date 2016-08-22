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

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/iscroll.js"></script>
	<script src="js/common.js"></script>

</head>

<body>
	<!--<div id="wrapper">-->
		<div id="pageAlbumslist" class="fastscroll" data-openid="${openid}" data-deviceid="${deviceId}">
			<input id="tag_name" type="hidden" value="${tag_name}" />
			<div class="list-group">
			</div>

		</div>
	<!--</div>-->
	<!--<jsp:include page="storylist_footer.jsp"/>-->

<script type="text/javascript">
window.contextPath = "";
window.openid = "";
window.deviceId = "";

//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(document).ready(function() {
	$(".footer").find("a.cloud").addClass('current');
	window.contextPath = '<%= request.getContextPath() %>';

	window.openid = $("#pageAlbumslist").data("openid");
	window.deviceId = $("#pageAlbumslist").data("deviceid");
	console.log(window.openid+"---"+window.deviceId);

	albumslist_list_callback();

});

function albumslist_list_callback(){
	console.log("albumslist_list_callback");
	var tag_name = $("#tag_name").val();
	console.log(tag_name);
	console.log(encodeURI(encodeURI(tag_name)));
	var page = 1;
	var count = 20;
	var totalPage =0;
	var totalCount=0; //总行数

	$("#pageAlbumslist .list-group a").remove();
	//first get totalPage & totalCount
	var loadFirstPage = function() {
		var url = contextPath+"/searchalbumslist.do?tag_name="+encodeURI(encodeURI(tag_name))+"&page="+page+"&count="+count;
		console.log(url);
		$
		.ajax({
			type: 'GET',
			url : url,
			dataType: 'json',
			cache:true,
			async:false,
			error: function(data){
				console.log("loadFirstPage is error");
			},
			success : function(
					data) {
				totalPage =data.total_page;
				totalCount =data.total_count;

				var size = $(data.albums).size();
				var i = 0;

				while(i<size)
				{
					var album_title=data.albums[i].album_title;
					var album_id=data.albums[i].id;
					var cover_url_small = data.albums[i].cover_url_small;
					var include_track_count = data.albums[i].include_track_count;
					var aHref = contextPath+"/albumsbrowse.do?albumId="+album_id;

					var html = "<a href='"+aHref+"' data-reload=\"true\" class=\"list-group-item\" "
						+" data-albumid='"+ album_id+"'>"
						+" <img src='"+cover_url_small+"' />"
						+ "<h2>"+album_title+"</h2>"
						+ "<p>"+include_track_count+"首</p>"
						+"</a>";
					$("#pageAlbumslist .list-group").append(html);

					i = i +1;
				}
			}
		});
	};

	loadFirstPage();
	//var myScroll = new IScroll('#wrapper', { mouseWheel: true,scrollbars: true,click: true});

	page +=1;
	console.log("page:"+page+" totalPage:"+totalPage+" totalCount:"+totalCount);

	if(page <=totalPage){
		//first page is over ,begin second
		var element = "<a href='#' style='display:none'"
			+" data-reload=\"true\" class=\"list-group-item\">";
		for(var i=count+1;i<=totalCount;i++)
			$("#pageAlbumslist .list-group").append(element);

		var deferreds = [];
		while (page <=totalPage) {
			var request = albumslistPageRequest(tag_name,page,count);
			deferreds.push(request);
			page = page +1;
		}

		$.when.apply(null, deferreds).done(function() {
            console.log("all done");
        });
	}


	function albumslistPageRequest(tag_name,page,count){
		var url = contextPath+"/searchalbumslist.do?tag_name="+encodeURI(encodeURI(tag_name))+"&page="+page+"&count="+count;
		//console.log(url);

		return $.ajax({
			type: 'GET',
			url : url,
			dataType: 'json',
			cache:true,
			async:true,
			error: function(data){
				console.log("albumslistPageRequest is error");
			},
			success : function(data) {

				console.log("page:"+page+" callback");
				var size = $(data.albums).size();
				var i = 0;

				while(i<size)
				{
					var album_title=data.albums[i].album_title;
					var album_id=data.albums[i].id;
					var cover_url_small = data.albums[i].cover_url_small;
					var include_track_count = data.albums[i].include_track_count;
					var aHref = contextPath+"/albumsbrowse.do?albumId="+album_id;

					var html = "<img src='"+cover_url_small+"' />"
						+ "<h2>"+album_title+"</h2>"
						+ "<p>"+include_track_count+"首</p>";

					var $el = $("#pageAlbumslist .list-group").find("a").eq((page-1)*count +i);
					$el.html(html);
					$el.attr("data-albumid",album_id);
					$el.attr("href",aHref);
					$el.show();

					i = i +1;
				}

				//myScroll.refresh();

			}
		});
	}
}

/*(function()
	{
	    var agent = navigator.userAgent.toLowerCase();        //检测是否是ios
	    var iLastTouch = null;                                //缓存上一次tap的时间
	    if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0)
	    {
	        document.body.addEventListener('touchend', function(event)
	        {
	            var iNow = new Date()
	                .getTime();
	            iLastTouch = iLastTouch || iNow + 1 // 第一次时将iLastTouch设为当前时间+1  ;
	            var delta = iNow - iLastTouch;
	            if (delta < 500 && delta > 0)
	            {
	                event.preventDefault();
	                return false;
	            }
	            iLastTouch = iNow;
	        }, false);
	    }

	})();*/
</script>
</body>
