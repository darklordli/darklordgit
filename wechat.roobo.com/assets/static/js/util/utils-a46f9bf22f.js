var utils={pagesize:10,openid:window.openId,tracklist:"播放列表",trackListId:function(){var e;return $.ajax({url:juli.URL.gettracklist,type:"get",async:!1,cache:!1,data:{deviceId:utils.getdevice()}}).done(function(t){t.length||(utils.createtrackList(),utils.trackListId()),e=t[0].id}),e},createtrackList:function(){var e={id:0,deviceId:utils.getdevice(),name:"默认列表",coverSmallUrl:""};$.ajax({url:juli.URL.addlist,type:"post",contentType:"application/json",data:JSON.stringify(e)}).done(function(e){})},getdevice:function(){var e;utils.openid;return $.ajax({url:juli.URL.getdevice,type:"get",async:!1,cache:!1,data:{openId:utils.openid}}).done(function(t){e=t,window.deviceId=t}),e},play:function(e){var t={openId:utils.openid,trackId:e};$.ajax({url:juli.URL.play+"?mediaId=",type:"POST",contentType:"application/json",cache:!1,data:JSON.stringify(t)}).done(function(e){})},getparam:function(e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var t="[\\?&]"+e+"=([^&#]*)",n=new RegExp(t),a=n.exec(window.location.search);return null==a?"":decodeURIComponent(a[1].replace(/\+/g," "))},formatSeconds:function(e){var t=parseInt(e),n=0,a=0;t>60&&(n=parseInt(t/60),t=parseInt(t%60),n>60&&(a=parseInt(n/60),n=parseInt(n%60)));var i=""+parseInt(t)+"秒";return n>0&&(i=""+parseInt(n)+"分"+i),a>0&&(i=""+parseInt(a)+"小时"+i),i},online:function(){var e;return $.ajax({url:juli.URL.getinfo,type:"get",async:!1,cache:!1,data:{deviceId:utils.getdevice()}}).done(function(t){e=t.online}),e},settitle:function(e){var t=$("body");document.title=e;var n=$("<iframe style='display:none;' src='/favicon.ico'></iframe>");n.on("load",function(){setTimeout(function(){n.off("load").remove()},0)}).appendTo(t)}};