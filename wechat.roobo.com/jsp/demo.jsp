<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>demo</title>

	<link href="resources/theme2/css/style.css"	rel="stylesheet" type="text/css">
	<link href="resources/theme2/css/framework-style.css" 	rel="stylesheet" type="text/css">
	<link href="resources/theme2/css/framework.css" 			rel="stylesheet" type="text/css">
	<link href="resources/theme2/css/bxslider.css"			rel="stylesheet" type="text/css">
	<link href="resources/theme2/css/swipebox.css"			rel="stylesheet" type="text/css">
	<link href="resources/theme2/css/icons.css"				rel="stylesheet" type="text/css">
	<link href="resources/theme2/css/retina.css" 				rel="stylesheet" type="text/css" media="only screen and (-webkit-min-device-pixel-ratio: 2)" />

	<link href="resources/theme1/css/mobilebone.css" rel="stylesheet">
	<link href="resources/theme1/css/mobilebone.animate.css" rel="stylesheet">
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">
	<link href="resources/theme1/css/storybox.css" rel="stylesheet">

	<style type="text/css">
		#pageAlbumsbrowse .toolbar{
			text-align:left;
			background-color:#e7e7e7;
			display:none;
			padding-left:20px;
			padding-top:5px;
			padding-bottom:5px;
		}

		.header{
			position:fixed;
			width:100%;
			z-index:9999;
			height:40px;
			background-color:#f9f9f9;
			border-bottom:solid 1px #e9e9e9;
			text-align:center;
		}

				.header-clear{
			height:70px;
		}

		.header .header-left-button{
			float:left;
			padding-top:5px;
			padding-bottom:5px;
		}


		.header-center-text{
			padding-top:10px;
			display:inline-block;
		}

		.header .header-right-button{
			float:right;
			padding-top:5px;
			padding-bottom:5px;
		}

		.nav-icon-with-under-text{
			width:60px;
			height:60px;
			text-align:center
		}

		.nav-icon-with-under-text span:not(.icon){
			display:block;
		}
	</style>

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/mobilebone.min.js"></script>

</head>

<body>
	<div id="demo" class="content page out">
		<div class="landing-logo">
	    	<img class="replace-2x" src="resources/theme2/images/logo.png" alt="img" width="100">
	    </div>

	    <div class="welcome-text">
	    	<h3>Welcome to flaty</h3>
	        <p>Flat, simple, intuitive!</p>
	    </div>

	    <div class="navigation-icons">
	    	<a href="demo/storylist.do" data-success='demo_storylist_callback' data-reload
	    		class="nav-icon icon-red cloud-nav" title="网络资源"></a>
	        <a href="#about" class="nav-icon icon-blue about-nav"></a>
	        <a href="blog.html" class="nav-icon icon-magenta blog-nav"></a>
	        <a href="folio.html" class="nav-icon icon-dblue folio-nav"></a>
	        <a href="video.html" class="nav-icon icon-green video-nav"></a>
	        <a href="contact.html" class="nav-icon icon-yellow mail-nav"></a>
	        <!--  <a href="#" class="nav-icon-with-under-text"><span class="icon bg-green icon-arrow-left"></span><span><small>网络资源</small></span></a>-->

	    </div>

	    <div class="small-navigation-icons">
	    	<a href="#" class="small-nav-icon facebook-nav"></a>
	        <a href="#" class="small-nav-icon phone-nav"></a>
	        <a href="#" class="small-nav-icon twitter-nav"></a>
	        <div class="clear"></div>
	    </div>

	    <p class="landing-copyright copyright">COPYRIGHT 2013. ALL RIGHTS RESERVED</p>


	</div>
  	<div id="home" class="page out">
  		这是home的首页
  		<a href="#home_2">第二页</a>
  	</div>
  	<div id="about" class="page out">
  		这是Abount
  	</div>
  	<div id="home_2" class="page out">
  		这是home的第二页
  	</div>
<script type="text/javascript">

$(document).ready(function() {

	contextPath = '<%= request.getContextPath() %>';



});

function demo_storylist_callback(){
	var url = contextPath+"/searchtaglist.do";

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
				var tag_name=data[i].tag_name;
				var cover_url_small=data[i].cover_url_small;
				var aHref = contextPath+"/demo/albumslist.do?tag_name="+encodeURI(encodeURI(tag_name));

				//流式布局，小屏幕3个一排，大屏幕4个一排
				var html = "<div class=\"col-xs-4 col-md-3\">"
					+ "<a href='"+ aHref+"' data-success='albumslist_list_callback'>"
					+"<img src='"+cover_url_small+"' class=\"img-responsive\" />"
					+tag_name
					+"</a>"
					+"</div>";

				$("#storylist").append(html);

				i = i +1;
			}

		}
	});
}

function albumslist_list_callback(){
	console.log("albumslist");
	var tag_name = $("#tag_name").val();

	var page = 1;
	var count = 20;
	var totalPage =3;

	// Loads the next albums
	var loadAlbums = function() {
		var url = contextPath+"/searchalbumslist.do?tag_name="+encodeURI(encodeURI(tag_name))+"&page="+page+"&count="+count;
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
				totalPage =data.total_page;

				var count = $(data.albums).size();
				var i = 0;

				while(i<count)
				{
					var album_title=data.albums[i].album_title;
					var album_id=data.albums[i].id;
					var cover_url_small = data.albums[i].cover_url_small;
					var include_track_count = data.albums[i].include_track_count;
					var aHref = contextPath+"/demo/albumsbrowse.do?albumId="+album_id;

					var html = "<a href='"+ aHref+"' data-success='albumsbrowse_list_callback' class=\"list-group-item\">"
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

	loadAlbums();

	$("#pageAlbumslist").scroll(function() {

		   // We check if we're at the bottom of the scrollcontainer
		   if ($(this)[0].scrollHeight - $(this).scrollTop() == $(this).outerHeight()
				   && page <=totalPage) {

		      // If we're at the bottom, show the overlay and retrieve the next page
		      page +=1;

		      loadAlbums();
		   }
		});

}

function albumsbrowse_list_callback(){
	var albumId = $("#albumId").val();
	console.log(albumId);

	var page = 1;
	var count = 20;
	var totalPage =3;

	var albumTitle = "";
	var albumCoverUrlSmall = "";
	var totalCount = 0;

	// Loads the next songs
	var loadTracks = function() {
		var url = contextPath+"/searchalbumsbrowse.do?albumId="+albumId+"&page="+page+"&count="+count;
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
				totalPage =data.total_page;
				albumTitle = data.album_title;
				albumCoverUrlSmall = data.cover_url_small;
				totalCount = data.total_count;

				loadAlbumInTrackList();

				var count = $(data.tracks).size();
				var i = 0;

				while(i<count)
				{
					var track_title=data.tracks[i].track_title;
					var track_id=data.tracks[i].id;
					var cover_url_small = data.tracks[i].cover_url_small;
					var duration = data.tracks[i].duration;
					var play_url_32 = data.tracks[i].play_url_32;
					var download_url = data.tracks[i].download_url;

					var html = "<li class=\"list-group-item\" id='"+track_id+"' height=\"200\">"
					+" <img src='"+cover_url_small+"' />"
					+"<strong>"+track_title+"</strong><br>"
					+ "<span>"+(parseInt(duration/60)>0?parseInt(duration/60)+"分":"")+(duration%60)+"秒</span>"
					+"<input type='hidden' name='play_url_32' value='"+play_url_32+"' />"
					+"<input type='hidden' name='track_title' value='"+track_title+"' />"
					+"<input type='hidden' name='download_url' value='"+download_url+"' />"
					+"<input type='hidden' name='cover_url_small' value='"+cover_url_small+"' />"
					+"<input type='hidden' name='duration' value='"+duration+"' />"
					+"</li>";

					$("#pageAlbumsbrowse .list-group").append(html);

					i = i +1;
				}

			}
		});
	};

	loadTracks();

	function loadAlbumInTrackList(){
		console.log($("#pageAlbumsbrowse .list-group").size());
		//只在第一次加载
		if($("#pageAlbumsbrowse .list-group li").size() == 0){
			var html = "<li class=\"list-group-item\" name=''>"
					+" <img src='"+albumCoverUrlSmall+"' />"
					+"<strong>"+albumTitle+"</strong><br>"
					+ "<span>"+totalCount+"首</span>"
					+" <div class=\"heading-right\">"
					+" <a href=\"#\" class=\"small-nav-icon facebook-nav\"></a>"
					+" <a href=\"#\" class=\"small-nav-icon phone-nav\"></a></div>"
					+"</li>";
			$("#pageAlbumsbrowse .list-group").append(html);

			$("#albumTotalCount").val(totalCount);
		}
	}

	$("#pageAlbumsbrowse").scroll(function() {

		   // We check if we're at the bottom of the scrollcontainer
		   if ($(this)[0].scrollHeight - $(this).scrollTop() == $(this).outerHeight()
				   && page <=totalPage) {

		      // If we're at the bottom, show the overlay and retrieve the next page
		      page +=1;

		      loadTracks();
		   }
		});

	$("#pageAlbumsbrowse .list-group li:not(:first-child)").click(function(){
		var $toolbar = $(".toolbar");
		$toolbar.attr('display','block');
		$toolbar.show();

		$(this).after($toolbar);
		//$(this).parent().find("li.selected").removeClass('selected');
		//$(this).addClass('selected');
	});
}
</script>
</body>
