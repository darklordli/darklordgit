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
	<script src="js/common.js"></script>

	<!--<style type="text/css">
body{
 margin:0px;
 padding:0px;
 padding-bottom: 80px;
}
#pageTag {
	min-height: 600px;

}
.footer {
position:fixed;
bottom:0px;
left:0px;
right:0px;
width:100%;
background-color: #f0f0f0;
	min-height: 60px;
	padding:5px;

}
</style>-->
<!--[if IE 6]>
<style type="text/css">
html{overflow:hidden;}
body{height:100%;overflow:auto;}
#glideDiv0{position:absolute;}
</style>
<![endif]-->
</head>

<body>
	<div id="pageTag" class="fastscroll" data-openid="${openid}" data-deviceid="${deviceId}"
		style="padding-top: 5px;">
	</div>
	<jsp:include page="storylist_footer.jsp"/>

<script type="text/javascript">
window.contextPath = "";
window.openid = "";
window.deviceId = "";

$(document).ready(function() {
	$(".footer").find("a.cloud").addClass('current');

	window.contextPath = '<%= request.getContextPath() %>';

	window.openid = $("#pageTag").data("openid");
	window.deviceId = $("#pageTag").data("deviceid");
	console.log(window.openid+"---"+window.deviceId);

	refresh_tag_list();
});

function refresh_tag_list(){
	var url = window.contextPath+"/searchtaglist.do";

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
		success : function(
				data) {
			var count = $(data).size();
			var i = 0;

			while(i<count)
			{
				var tag_name=data[i].tag_name;
				var cover_url_small=data[i].cover_url_small;
				var aHref = contextPath+"/albumslist.do?tag_name="+encodeURI(encodeURI(tag_name));

				var html = "<div class=\"col-xs-4\">"
					+ "<a href='"+ aHref+"' data-tagname='"+ tag_name +"' style='background-image:url("+ cover_url_small +")'>"
					+"<span>"+tag_name+"</span>"
					+"</a>"
					+"</div>";

				$("#pageTag").append(html);

				i = i +1;
			}

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
