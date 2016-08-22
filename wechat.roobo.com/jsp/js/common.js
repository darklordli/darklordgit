function showAlert(str){
		var $divAlert = $("#divAlert");
		if($divAlert.length == 0){
			var html = "<div id=\"divAlert\"><span></span></div>";
	    	$("body").append(html);
	    	$divAlert = $("#divAlert");
		}

		$divAlert.find("span").text(str);
		$divAlert.show().delay(2000).fadeOut();
	}

/** 返回 data-id=\"1\" data-title=\"abcd\" 字符串 */
function buildDataAttrForLi(id,title,coverSmallUrl,duration,url,downloadUrl,downloadSize,albumTitle,albumCoverSmallUrl){
	var str = "data-id=\""+id+"\" data-title=\""+title+"\" data-coversmallurl=\""+coverSmallUrl+"\" data-duration=\""+duration
	+"\" data-url=\""+url+"\" data-downloadurl=\""+downloadUrl
	+"\" data-downloadsize=\""+downloadSize+"\" data-albumtitle=\""+albumTitle
	+"\" data-albumcoversmallurl=\""+albumCoverSmallUrl+"\" ";
	return str;
}

function createTrack(_li){
	var url = _li.data("url");
	var id = _li.data("id");
	var title = _li.data("title");
	var coverSmallUrl = _li.data("coversmallurl");
	var duration = parseInt(_li.data("duration"));
	var downloadUrl = _li.data("downloadurl");
	var downloadSize = parseInt(_li.data("downloadsize"));
	var albumTitle = _li.data("albumtitle");
	var albumCoverSmallUrl = _li.data("albumcoversmallurl");
	
	var track ={id:0,title:title,coverSmallUrl:coverSmallUrl,duration:duration,url:url,
			downloadUrl:downloadUrl,downloadSize:downloadSize,albumTitle:albumTitle,albumCoverSmallUrl:albumCoverSmallUrl};
	console.log(track);
	return track;
}

var audio = undefined;;
function createAudio(){
	if (typeof(audio) == "undefined"){
		var a = audiojs.create(document.getElementsByTagName('audio'),{
            trackEnded: toolbar_playTrackEnd
        });
		audio = a[0];
	}	
}

function stopAudio(){
	if (typeof(audio) != "undefined"){
		audio.pause();
	}
}

function showMaskLoading(){
		$(".mask-hy").show();
	}

	function hideMaskLoading(){
		$(".mask-hy").hide();
	}

function locate_footer(type){
	var d = new Date();
	if(type == 1){
		window.location.href = window.contextPath+"/storylist.do?d="+d; //这里需要加上时间戳充掉缓存，否则安卓系统的微信内置浏览器会切换2次后无效
	}	
	else if(type == 2)	
		window.location.href = window.contextPath+"/favoritelist.do?d="+d;
	else if(type == 3)	
		window.location.href = window.contextPath+"/tracklist.do?d="+d;
}	

function toolbar_bind($li,$toolbar){
	console.log("common li click");
	
	if($li.hasClass('editing') == false){
		if($li.next().attr("id") == "toolbar"){
			$li.next().toggle();
		}
		else{
			console.log("here");
			$toolbar.css('display','block');
			$li.after($toolbar);

			/*var trackId = $li.data("id");
			var $btnHtmlPlay = $toolbar.find("button.btnHtmlPlay");
			var preTrackId = $btnHtmlPlay.data("pretrackid");
			console.log(preTrackId+"----"+trackId);
			if(preTrackId == trackId){
				if(audio.playing)
					$btnHtmlPlay.addClass('playing');	
				else
					$btnHtmlPlay.removeClass('playing');	
			}
			else
				$btnHtmlPlay.removeClass('playing');
			*/
			$toolbar.show();
			console.log("show");
		}
		
		if(!$toolbar.is(":hidden")){
			var trackId = $li.data("id");
			var $btnHtmlPlay = $toolbar.find("button.btnHtmlPlay");
			var preTrackId = $btnHtmlPlay.data("pretrackid");
			console.log(preTrackId+"----"+trackId);
			if(preTrackId == trackId){
				if(audio.playing)
					$btnHtmlPlay.addClass('playing');	
				else
					$btnHtmlPlay.removeClass('playing');	
			}
			else
				$btnHtmlPlay.removeClass('playing');
		}
	}	
}

function toolbar_htmlplay($btn){
	var $li = $btn.parent("#toolbar").prev("li");
	$li.parent().find("li.playing").removeClass('playing');
	
	var play_url_32 = $li.data("url");
	console.log(play_url_32);
	var trackId = $li.data("id");
	var preTrackId =$btn.data("pretrackid");

	if(preTrackId != trackId){
		audio.load(play_url_32);
		audio.play();
		console.log("audio mp3:"+audio.mp3);
		$li.addClass('playing');
		$btn.addClass("playing");
		preTrackId = trackId;
		$btn.data("pretrackid",preTrackId);
				
	}
	else{
		audio.playPause();
		$li.toggleClass('playing');
		$btn.toggleClass("playing");
	}
}

function toolbar_playTrackEnd(){
	var $btnHtmlPlay = $("#toolbar").find("button.btnHtmlPlay");
	$btnHtmlPlay.removeClass('playing');
}

function toolbar_demand($btn){
	var $li = $btn.parent("#toolbar").prev("li");
	var track = createTrack($li);
	var trackId = 0;
	
	$.ajax({
		type : "POST",
		url : contextPath + "/track/add.do",
		contentType : 'application/json',
		async : false,
		//dataType : 'json',
		timeout : 4000,
		data : JSON.stringify(track),
		success : function(msg) {
			trackId = parseInt(msg);
		},
		error : function(data) {
			//hideMaskLoading();
		}
	});
	console.log("trackId:"+trackId);
	window.location = contextPath +"/track/demand.do?trackId="+trackId+"&albumId=0";
}

function toolbar_download_callback($btn,trackListId){
	console.log("this is toolbar_download_callback"+trackListId);

	var $li = $btn.parent("#toolbar").prev("li");
	var track = createTrack($li);
	console.log(track);
	var tracks = [];
	tracks.push(track);

	$.ajax({
		type : "POST",
		url : contextPath + "/track/download.do?deviceId=" + window.deviceId
				+ "&id=" + trackListId+"&name=",
		contentType : 'application/json',
		async : true,
		//dataType : 'json',
		timeout : 4000,
		data : JSON.stringify(tracks),
		success : function(msg) {
			if(msg == "ok"){
				showAlert("下载成功");
			}
			else if(msg == "duplicate"){
				common_alert("请勿重复添加","确定",function(){
					
				});
				
			}
		},
		error : function(data) {
			//hideMaskLoading();
		}
	});
}

function common_confirm(message,confirmText,confirmCallback,cancelText){
	bootbox.dialog({
		size:"small",
		message: '<span class=\'bootboxMessage\'>'+message+'</span>',
		closeButton:false,  
	    buttons: {
	    	success: {
	        	label: confirmText,
	       		className: "bootboxConfirm",
	       		callback: confirmCallback
	     	},
	    	cancel: {
	        	label: cancelText,
	        	className: "bootboxCancel",
	       		callback: function () {
	         		console.log("cancel");
	       			}
	     		}	 
	   		}
	 	}
		);
}

function common_alert(message,okText,okCallback){
	bootbox.dialog({
		size:"small",
		message: '<span class=\'bootboxMessage\'>'+message+'</span>',
		closeButton:false,  
	    buttons: {
	    	success: {
	        	label: okText,
	       		className: "bootboxOk",
	       		callback: okCallback
	     	}
	    }}
	 	);
}

/*function isMobile() {
    var useragent = navigator.userAgent;
    console.log("useragent--------"+useragent);
    return useragent.indexOf('Android') != -1
            || useragent.indexOf('iPhone') != -1
            || useragent.indexOf('iPod') != -1
            || useragent.indexOf('iPad') != -1;
}

$(document).ready(function() {
    // Make a custom log for mobile devices
    if (!isMobile()) {
        console.log = function(message) {
            if ($("#console-log").length == 0) {
                $("body").append($('<ul id="console-log" style="position:fixed; top:0; left:0; width:100%; height:200px;overflow:auto; list-style-type:none; margin:0; padding:0; padding-top:25px; font-size:9px; background:rgba(0,0,0,0.85); color:white; font-family: monospace;"><li>Mobile console.log</li></ul>'));
            }
            $("#console-log").append($('<li style="margin-left:none;">' + message + '</li>'));
        }
    }
});*/