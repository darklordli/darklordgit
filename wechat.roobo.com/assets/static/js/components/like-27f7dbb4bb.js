likevm=new Vue({el:"#j_favlist",data:{list:""},ready:function(){this.getdata()},methods:{getdata:function(){$.ajax({url:juli.URL.getlike,type:"get",dataType:"json",cache:!1,data:{openId:utils.openid}}).done(function(t){$.each(t,function(t,a){a.sec=utils.formatSeconds(a.duration),a.isplay=!1,a.islike=!1}),likevm.list=t})},demand:function(t){var a=this;$.each(a.list,function(t,a){a.isplay=!1});var e={title:t.title,duration:t.duration,url:t.url,downloadUrl:t.downloadUrl,downloadSize:t.downloadSize,deviceId:utils.getdevice(),openId:utils.openid,trackId:t.trackId};$.ajax({url:juli.URL.play+"?mediaId=",type:"POST",contentType:"application/json",async:!1,timeout:4e3,data:JSON.stringify(e),success:function(t){"ok"==t?$.toast("点播成功，请点击故事机上的播放按钮","text"):$.toast("点播失败","text")}})},pause:function(t){pauseTrack(),t.isplay=!1},download:function(t){if(!utils.getdevice())return $.alert("您还没有绑定设备，请去绑定设备！","",function(){}),!1;var a=[{title:t.title,id:t.trackId,duration:t.duration,albumTitle:t.albumTitle,albumCoverSmallUrl:t.albumCoverSmallUrl,url:t.url,downloadUrl:t.downloadUrl,downloadSize:t.downloadSize}];$.ajax({url:juli.URL.download+"?deviceId="+utils.getdevice()+"&id="+utils.trackListId()+"&name="+encodeURI(encodeURI(utils.tracklist)),type:"post",contentType:"application/json",data:JSON.stringify(a)}).done(function(t){$.toast("添加成功！","text")})},del:function(t){var a={trackId:t.trackId,openId:utils.openid};$.ajax({url:juli.URL.dellike,type:"post",cache:!1,async:!1,contentType:"application/json",data:JSON.stringify(a)}).done(function(t){$.toast("删除收藏","text"),likevm.getdata()})}}});