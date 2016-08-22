/**
 * @description: 炬力公众号
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/8/1

/**取类别中的资源并点播*/

  myvm=new Vue({
   el: '#J_my',
   data:{
     fav:"",
     history:"",
     playlist:""
   },
   ready:function(){
     this.getdevice();
     this.getfav();
     this.gethistory();
     this.getplaylist();
   },
   methods:{
     getdevice:function(){                    //判断是否绑定设备
       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         alert("您还没有绑定设备，请去绑定设备！")
         window.location.href = 'doscan_info.html';
       }
     },
     getfav:function(){
       var _self=this;
       $.ajax({
           url:juli.URL.getlike,
           type: 'get',
           dataType: 'json',
           cache:false,
           data:{
             openId: utils.openid
           }
       })
       .done(function(res){
         console.log(res);
         _self.fav=res;
       })
     },
     gethistory: function () {
       var _self=this;
       $.ajax({
         url: juli.URL.gethistory,
         type: 'get',
         dataType: 'json',
         cache: false,
         data: {
           openId: utils.openid
         }
       })
         .done(function (res) {
           console.log(res);
           _self.history=res;
          })
     },
     getplaylist: function () {
       var _self=this;
       $.ajax({
         url: juli.URL.getlist,
         type: 'get',
         dataType: 'json',
         cache: false,
         data: {
           trackListId: juli.URL.trackListId,
         }
       })
         .done(function (res) {
           console.log(res);
           $.each(res,function(i,n){
             n.sec=utils.formatSeconds(n.duration);
             n.isplay=false;
             n.islike=false;
           })
           _self.playlist=res;
          })
        clientCreate(onConnectCallback);
     },
     play: function (item) {                      //点播--首先要判断故事机是否在线--是否连接

       //如果故事机不在线--则提示并返回
      if (!utils.online()){
         alert("故事机不在线！")
         return false;
       }

       //播放开始的时候先把所有元素的播放状态去掉
       var _self = this;
       $.each(_self.playlist,function(i,n){
           n.isplay=false;
       })

      var trackId = item.id;
   		var trackListId =juli.URL.trackListId;
   		var url = item.url;
   		var downloadUrl = item.downloadUrl;
   		playTrack(trackListId,trackId,url,downloadUrl);
      item.isplay=true;
     },
     pause:function(item){                        //暂停-儿童馆
       var _self = this;
        pauseTrack();
        item.isplay=false;
     },
     addfav: function (item) {               //添加收藏
       var json = {
         openId: utils.openid,
         trackId: item.id,
         title: item.title,
         coverSmallUrl: item.coverSmallUrl,
         duration: item.duration,
         albumTitle: item.albumTitle,
         albumCoverSmallUrl: item.albumCoverSmallUrl,
         url: item.url,
         downloadUrl: item.downloadUrl,
         downloadSize: item.downloadSize,
       };
       $.ajax({
         url: juli.URL.addlike,
         type: 'post',
         contentType: 'application/json',
         data: JSON.stringify(json)
       })
       .done(function (res) {
          alert("已添加收藏");
          item.islike=true;
       });
     },
     dellike:function(item){                   //删除收藏
          var deldata={
            trackId:item.id,
            openId:utils.openid
          }
         $.ajax({
             url:juli.URL.dellike,
             type: 'post',
             cache:false,
             async:false,
		         contentType : 'application/json',
             data:JSON.stringify(deldata)
         })
         .done(function(res){
           console.log(res);
           alert("删除收藏");
           item.islike=false;
         })
     },
     remove:function(item){                   //删除下载
       var _self=this;
       var arr=[];
       arr.push(item.id);
       $.ajax({
         url: juli.URL.remove+'?id='+juli.URL.trackListId+'&deviceId='+utils.getdevice(),
         type: 'post',
         contentType: 'application/json',
         data: JSON.stringify(arr)
       })
         .done(function (res) {
           console.log(res);
           alert("删除成功")
           _self.playlist.$remove(item);
          })
     }
   }
})
