function onConnectCallback(){console.log("hahah，链接啦！"),queryTrack(),queryMode(),queryPlayStatus()}function playTrack_change(t,e,i){"-1"!=e&&$.each(myvm.playlist.tracks,function(t,i){i.isplay=!1,i.id==e&&(i.isplay=!0)})}function onlineStatus_change(t){return"on"!=t&&"online"!=t&&"on-upgrade-failed"!=t?(myvm.deviceOnline=!1,$.toast("故事机断网了哦~","text"),$.each(myvm.playlist,function(t,e){e.isplay=!1}),!1):void(myvm.deviceOnline=!0)}function startInitialTrackList(e,i){console.log("开始初始化"),utils.getparam("id")==e&&$.ajax({type:"POST",url:juli.URL.inital+"?trackListId="+utils.getparam("id")+"&deviceId="+utils.getdevice(),contentType:"application/json",async:!1,cache:!1,timeout:4e3,data:JSON.stringify(i)}).done(function(e){console.log(e),$.hideLoading(),clearTimeout(t),$.toast("恢复成功","text"),myvm.pagenum=1,myvm.getplaylist()})}myvm=new Vue({el:"html",data:{pagenum:1,imghost:"http://dwn.roo.bo/appimg/",loading:!0,playlist:"",listinfo:""},computed:{haspage:function(){return this.playlist.tracks.length<this.playlist.totalCount}},ready:function(){this.getdevice(),this.getinfo(),this.getplaylist()},methods:{resetif:function(){var t=this;return utils.online()?void("默认列表"==t.listinfo.name?t["default"]():t.reset()):($.toast("故事机不在线","text"),!1)},getdevice:function(){utils.getdevice()||(window.location.href="doscaninfo.html")},sync:function(){var t=this,e={id:utils.getparam("id"),deviceId:utils.getdevice(),name:t.listinfo.name};$.ajax({url:juli.URL.sync,type:"post",cache:!1,async:!1,contentType:"application/json",data:JSON.stringify(e)}).done(function(t){console.log(t)})},"default":function(){var t=this;$.confirm("您确认恢复故事机的默认播放列表吗？",function(){t.defaultfunction()},function(){return!1})},defaultfunction:function(){var t=this;$.ajax({url:juli.URL.reset400,type:"get",dataType:"json",cache:!1,data:{deviceId:utils.getdevice(),trackListId:utils.trackListId()}}).done(function(e){"ok"==e?($.toast("故事机的默认播放列表恢复成功~","text"),t.getplaylist()):$.toast("故事机的默认播放列表恢复失败~","text")})},reset:function(){$.confirm("当前播放列表将被恢复至出厂状态",function(){getInitialTrackList(utils.getparam("id")),$.showLoading("正在恢复..."),t=setTimeout("myvm.resetfail()",1e4)},function(){return!1})},resetfail:function(){$.hideLoading(),$.toast("出现异常，请重试","text")},resetfun:function(){var t=this;$.ajax({url:juli.URL.reset+"/"+utils.getdevice()+"/"+utils.getparam("id"),type:"get",dataType:"json",cache:!1}).done(function(e){"1"==e?($.toast("播放列表恢复成功~","text"),t.getplaylist()):$.toast("播放列表恢复失败~","text")})},getinfo:function(){var t=this;$.ajax({url:juli.URL.getlistinfo,type:"get",dataType:"json",cache:!1,data:{id:utils.getparam("id")}}).done(function(e){t.listinfo=e})},getplaylist:function(){var t=this;$.ajax({url:juli.URL.getlist,type:"get",dataType:"json",cache:!1,data:{trackListId:utils.getparam("id"),currentPage:this.pagenum,pageSize:utils.pagesize}}).done(function(e){console.log(e),$.each(e.tracks,function(t,e){e.sec=utils.formatSeconds(e.duration),e.isplay=!1,e.ispause=!1,e.islike=!1,e.trackId=e.id}),t.playlist=e,t.loading=!1}),clientCreate(onConnectCallback)},nextpage:function(){var t=this;t.pagenum=t.pagenum+1,$.ajax({url:juli.URL.getlist,type:"get",dataType:"json",cache:!1,data:{trackListId:utils.getparam("id"),currentPage:t.pagenum,pageSize:utils.pagesize}}).done(function(e){console.log(e),$.each(e.tracks,function(t,e){e.sec=utils.formatSeconds(e.duration),e.islike=!1,e.isexpand=!1,e.isplay=!1,e.ispause=!1,e.trackId=e.id}),$.each(e.tracks,function(e,i){t.playlist.tracks.push(i)})})},singleview:function(t){return utils.online()?void(location.href="singleview.html?id="+t.id):($.toast("故事机不在线","text"),!1)},play:function(t){if(!utils.online())return $.toast("故事机不在线","text"),!1;var e=this;$.ajax({url:juli.URL.getsingle+"/"+t.trackId,type:"get",dataType:"json",cache:!1}).done(function(i){var a=t.trackId,n=parseInt(utils.getparam("id")),o=i.content,l=i.content;playTrack(n,a,o,l),$.each(e.playlist.tracks,function(t,e){e.isplay=!1}),t.isplay=!0})},pause:function(t){return utils.online()?(pauseTrack(),void(t.ispause=!0)):($.toast("故事机不在线","text"),!1)},resume:function(t){return utils.online()?(resumeTrack(),void(t.ispause=!1)):($.toast("故事机不在线","text"),!1)},addfav:function(t){var e={openId:utils.openid,trackId:t.trackId,title:t.title,coverSmallUrl:t.coverSmallUrl,duration:t.duration,albumTitle:t.albumTitle,albumCoverSmallUrl:t.albumCoverSmallUrl,url:t.url,downloadUrl:t.downloadUrl,downloadSize:t.downloadSize};$.ajax({url:juli.URL.addlike,type:"post",contentType:"application/json",data:JSON.stringify(e)}).done(function(e){$.toast("已添加收藏","text"),t.islike=!0})},dellike:function(t){var e={trackId:t.trackId,openId:utils.openid};$.ajax({url:juli.URL.dellike,type:"post",cache:!1,async:!1,contentType:"application/json",data:JSON.stringify(e)}).done(function(e){console.log(e),$.toast("删除收藏","text"),t.islike=!1})},remove:function(t){var e=this,i=[];i.push(t.trackId),$.ajax({url:juli.URL.remove+"?id="+utils.getparam("id")+"&deviceId="+utils.getdevice(),type:"post",contentType:"application/json",data:JSON.stringify(i)}).done(function(t){console.log(t),$.toast("删除成功","text"),e.getplaylist()})}}});