function onConnectCallback(){queryTrack(),queryMode(),queryPlayStatus()}function playTrack_change(t,e,i){"-1"!=e&&$.each(myvm.playlist,function(t,i){i.isplay=!1,i.id==e&&(i.isplay=!0,$.toast("当前播放歌曲为:"+i.title,"text"))})}function mode_change(t){"repeat all"==t?$.toast("当前循环模式为:全部循环~","text"):$.toast("当前循环模式为:单曲循环~","text")}function onlineStatus_change(t){return"on"!=t&&"online"!=t&&"on-upgrade-failed"!=t?(myvm.deviceOnline=!1,$.toast("故事机断网了哦~","text"),!1):void(myvm.deviceOnline=!0)}myvm=new Vue({el:"#J_my",data:{fav:"",history:"",playlist:"",deviceOnline:!0},ready:function(){this.getdevice(),this.getfav(),this.gethistory(),this.getplaylist()},methods:{getdevice:function(){utils.getdevice()||(window.location.href="doscaninfo.html")},getfav:function(){var t=this;$.ajax({url:juli.URL.getlike,type:"get",dataType:"json",cache:!1,data:{openId:utils.openid}}).done(function(e){t.fav=e})},gethistory:function(){var t=this;$.ajax({url:juli.URL.gethistory,type:"get",dataType:"json",cache:!1,data:{openId:utils.openid}}).done(function(e){t.history=e})},getplaylist:function(){var t=this;$.ajax({url:juli.URL.getlist,type:"get",dataType:"json",cache:!1,data:{trackListId:utils.trackListId()}}).done(function(e){$.each(e,function(t,e){e.sec=utils.formatSeconds(e.duration),e.isplay=!1,e.islike=!1,e.trackId=e.id}),t.playlist=e}),clientCreate(onConnectCallback)},singleview:function(t){if(!utils.online())return $.toast("故事机不在线","text"),!1;location.href="singleview.html?id="+t.id},play:function(t){if(!utils.online())return $.toast("故事机不在线","text"),!1;var e=this;$.ajax({url:juli.URL.getsingle+"/"+t.trackId,type:"get",dataType:"json",cache:!1}).done(function(i){var a=t.trackId,n=utils.trackListId(),l=i.content,o=i.content;playTrack(n,a,l,o),$.each(e.playlist,function(t,e){e.isplay=!1}),t.isplay=!0})},pause:function(t){pauseTrack(),t.isplay=!1},addfav:function(t){var e=this,i={openId:utils.openid,trackId:t.trackId,title:t.title,coverSmallUrl:t.coverSmallUrl,duration:t.duration,albumTitle:t.albumTitle,albumCoverSmallUrl:t.albumCoverSmallUrl,url:t.url,downloadUrl:t.downloadUrl,downloadSize:t.downloadSize};$.ajax({url:juli.URL.addlike,type:"post",contentType:"application/json",data:JSON.stringify(i)}).done(function(i){$.toast("已添加收藏","text"),t.islike=!0,e.getfav()})},dellike:function(t){var e=this,i={trackId:t.trackId,openId:utils.openid};$.ajax({url:juli.URL.dellike,type:"post",cache:!1,async:!1,contentType:"application/json",data:JSON.stringify(i)}).done(function(i){$.toast("删除收藏","text"),t.islike=!1,e.getfav()})},remove:function(t){var e=this,i=[];i.push(t.trackId),$.ajax({url:juli.URL.remove+"?id="+utils.trackListId()+"&deviceId="+utils.getdevice(),type:"post",contentType:"application/json",data:JSON.stringify(i)}).done(function(i){$.toast("删除成功","text"),e.playlist.$remove(t)})}}});