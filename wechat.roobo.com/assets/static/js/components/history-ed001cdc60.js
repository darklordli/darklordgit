historyvm=new Vue({el:"#j_history",data:{loading:!0,list:"",downloaddata:"",playtracklist:""},ready:function(){this.getdata(),this.initselectdata()},methods:{initselectdata:function(){var t=this,e=utils.gettrackList();console.log(e),e.length&&$.each(e,function(t,e){e.title=e.name,e.value=e.id}),t.playtracklist=e},getdata:function(){var t=this;$.ajax({url:juli.URL.gethistory,type:"get",dataType:"json",cache:!1,data:{openId:utils.openid}}).done(function(e){console.log(e),$.each(e,function(t,e){e.sec=utils.formatSeconds(e.duration),e.isplay=!1,e.islike=!1}),t.list=e,t.loading=!1})},demand:function(t){if(!utils.online())return $.toast("故事机不在线","text"),!1;var e={openId:utils.openid,trackId:t.trackId};$.ajax({url:juli.URL.getsingle+"/"+t.trackId,type:"get",dataType:"json",cache:!1,async:!1}).done(function(t){e.url=t.content}),$.ajax({url:juli.URL.demand+"?mediaId=",type:"POST",contentType:"application/json",async:!1,timeout:4e3,data:JSON.stringify(e),success:function(t){"0"==t?$.toast("点播成功！","text"):$.toast("点播失败","text")}})},addfav:function(t){t.openid=utils.openid,console.log("addfav item:",JSON.stringify(t));var e={openId:utils.openid,trackId:t.trackId,title:t.title,coverSmallUrl:t.coverSmallUrl,duration:t.duration,albumTitle:t.albumTitle,albumCoverSmallUrl:t.albumCoverSmallUrl,url:t.url,downloadUrl:t.downloadUrl,downloadSize:t.downloadSize};$.ajax({url:juli.URL.addlike,type:"post",contentType:"application/json",data:JSON.stringify(e)}).done(function(e){console.log(e),$.toast("已添加收藏","text"),t.islike=!0})},dellike:function(t){var e={trackId:t.trackId,openId:utils.openid};$.ajax({url:juli.URL.dellike,type:"post",cache:!1,async:!1,contentType:"application/json",data:JSON.stringify(e)}).done(function(e){console.log(e),$.toast("删除收藏","text"),t.islike=!1})},download:function(t){var e=this,a=[{title:t.title,id:t.trackId,duration:t.duration,albumTitle:t.albumTitle,albumCoverSmallUrl:t.albumCoverSmallUrl,url:t.url,downloadUrl:t.downloadUrl,downloadSize:t.downloadSize}];e.downloaddata=a,$("#select").select({title:"请选择播放列表",items:e.playtracklist,closeText:"取消",onChange:function(){e.downloadfun($("#select").val(),$("#select").data("values"))}}),$("#select").select("open")},downloadfun:function(t,e){var a=this;console.log(t),console.log(e),$.ajax({url:juli.URL.download+"?deviceId="+utils.getdevice()+"&id="+e+"&name="+encodeURI(encodeURI(t)),type:"post",async:!1,contentType:"application/json",data:JSON.stringify(a.downloaddata)}).done(function(t){console.log(t),$.toast("添加成功！","text"),utils.clearselect()})},del:function(t){var e=this,a={openId:utils.openid,trackId:t.trackId,deviceId:utils.getdevice()};console.log(a),$.ajax({url:juli.URL.delhistory,type:"post",cache:!1,async:!1,contentType:"application/json",data:JSON.stringify(a)}).done(function(t){$.toast("删除成功","text"),e.getdata()})}}});