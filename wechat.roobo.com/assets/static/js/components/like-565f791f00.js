likevm=new Vue({el:"#j_favlist",data:{loading:!0,list:"",downloaddata:"",playtracklist:""},ready:function(){this.getdata(),this.initselectdata()},methods:{initselectdata:function(){var t=this,a=utils.gettrackList();console.log(a),a.length&&$.each(a,function(t,a){a.title=a.name,a.value=a.id}),t.playtracklist=a},getdata:function(){var t=this;$.ajax({url:juli.URL.getlike,type:"get",dataType:"json",cache:!1,data:{openId:utils.openid}}).done(function(a){console.log(a),$.each(a,function(t,a){a.sec=utils.formatSeconds(a.duration),a.isplay=!1,a.islike=!1}),t.list=a,t.loading=!1})},demand:function(t){if(!utils.online())return $.toast("故事机不在线","text"),!1;var a={openId:utils.openid,trackId:t.trackId};$.ajax({url:juli.URL.getsingle+"/"+t.trackId,type:"get",dataType:"json",cache:!1,async:!1}).done(function(t){a.url=t.content}),$.ajax({url:juli.URL.demand+"?mediaId=",type:"POST",contentType:"application/json",async:!1,timeout:4e3,data:JSON.stringify(a),success:function(t){"0"==t?$.toast("点播成功！","text"):$.toast("点播失败","text")}})},pause:function(t){pauseTrack(),t.isplay=!1},download:function(t){var a=this,e=[{title:t.title,id:t.trackId,duration:t.duration,albumTitle:t.albumTitle,albumCoverSmallUrl:t.albumCoverSmallUrl,url:t.url,downloadUrl:t.downloadUrl,downloadSize:t.downloadSize}];a.downloaddata=e,$("#select").select({title:"请选择播放列表",items:a.playtracklist,closeText:"取消",onChange:function(){a.downloadfun($("#select").val(),$("#select").data("values"))}}),$("#select").select("open")},downloadfun:function(t,a){var e=this;console.log(t),console.log(a),$.ajax({url:juli.URL.download+"?deviceId="+utils.getdevice()+"&id="+a+"&name="+encodeURI(encodeURI(t)),type:"post",async:!1,contentType:"application/json",data:JSON.stringify(e.downloaddata)}).done(function(t){console.log(t),$.toast("添加成功！","text"),utils.clearselect()})},del:function(t){var a={trackId:t.trackId,openId:utils.openid};$.ajax({url:juli.URL.dellike,type:"post",cache:!1,async:!1,contentType:"application/json",data:JSON.stringify(a)}).done(function(t){console.log(t),$.toast("删除收藏","text"),likevm.getdata()})}}});