<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

</head>
<body>
	<div id="pageAlbumsbrowse" class="page out" style="overflow:auto">
		<input id="albumId" type="hidden" value="${albumId}" />
		<input id="albumTotalCount" type="hidden" value="" />

		<div id="divAudio" class="audiohide">
			<audio preload></audio>
		</div>

		<div class="header">
		    <a class="logo-home" href="#pageAlbumslist"><img src="resources/theme2/images/logob.png" alt="img" width="40"></a>
		    <div class="header-text">
		        <strong>网络资源</strong>
		        <em>海量资源，想听就听</em>
		    </div>
		</div>
		<div class="header-clear"></div>

		<div class="toolbar">
	    	<a href="#" class="mini-nav-icon facebook-nav"></a>
	        <a href="#" class="mini-nav-icon go-up up-nav"></a>
	        <a href="#" class="mini-nav-icon twitter-nav"></a>
	        <div class="clear"></div>
	    </div>
		<div class="mask-hy" style="display:none;"><i class="loading-hy"></i></div>
		<div class="list-group">
		</div>

	</div>

</body>
