/**
 * @description: 炬力公众号
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/8/1
*/

//这些方法需要放到window下
 function onConnectCallback(){                     //获取设备信息，设置页面中的文字信息
   console.log("hahah，链接啦！")
   queryTrack();
   queryMode();
   queryPlayStatus();
 }

//拿到当前播放的资源后将播放列表的播放图标置状态
function playTrack_change(trackListId,trackId,type){
  if (trackId!="-1"){
    $.each(myvm.playlist,function(i,n){
      n.isplay=false;
      if(n.id==trackId){
        n.isplay=true;
        $.toast("当前播放歌曲为:"+n.title, "text");
      }
    })
  }
}


//当前是否在线情况的改变
function onlineStatus_change(onlineStatus){
 if(onlineStatus == "on"  || onlineStatus == "online" || onlineStatus == "on-upgrade-failed"){
   myvm.deviceOnline = true;
 }
 else{
   myvm.deviceOnline = false;
   $.toast("故事机断网了哦~", "text");
   //播放开始的时候先把所有元素的播放状态去掉
  $.each(myvm.playlist,function(i,n){
      n.isplay=false;
  })
   return false;
 }
}

/**取类别中的资源并点播*/
  myvm=new Vue({
   el: '#J_my',
   data:{
     loading:true,
     fav:"",
     history:"",
     playlist:"",
     deviceOnline:true,
     masked:false
   },
   ready:function(){
     this.getdevice();
     this.getfav();
     this.gethistory();
     this.getplaylist();
   },
   methods:{
     defaultall:function(){                    //恢复默认列表的提示
       var _self=this;
       $.confirm("您确认恢复故事机的默认播放列表吗？", function() {
           //点击确认后的回调函数
           _self.defaultfunction();
       }, function() {
           //点击取消后的回调函数
           return false;
       });
     },
     defaultfunction:function(){               //恢复默认列表
       var _self=this;
       $.ajax({
           url:juli.URL.reset+"/"+utils.getdevice()+"/"+utils.trackListId(),
           type: 'get',
           dataType: 'json',
           cache:false
       })
       .done(function(res){
        if (res=="1"){
            utils.sync();
            $.toast("故事机的默认播放列表恢复成功~", "text");
            _self.getplaylist();
          }
          else {
            $.toast("故事机的默认播放列表恢复失败~", "text");
          }
        })
     },
     getdevice:function(){                    //判断是否绑定设备
       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
           window.location.href = 'doscaninfo.html';
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
     getplaylist: function () {                   //拿到我的播放列表
       var _self=this;
       $.ajax({
         url: juli.URL.getlist,
         type: 'get',
         dataType: 'json',
         cache: false,
         data: {
           trackListId: utils.trackListId()
         }
       })
         .done(function (res) {
           console.log(res);
           $.each(res,function(i,n){
             n.sec=utils.formatSeconds(n.duration);
             n.isplay=false;
             n.ispause=false;
             n.islike=false;
             n.trackId= n.id;
           })
           _self.playlist=res;
           _self.loading=false;
          })
        clientCreate(onConnectCallback);
     },
     singleview : function (item) {                      //进入播放控制页--首先要判断故事机是否在线
       var _self = this;

       //如果故事机不在线--则提示并返回
      if (!utils.online()){
         // alert("故事机不在线！");
          $.toast("故事机不在线", "text");
         return false;
       }
       location.href="singleview.html?id="+item.id;
     },

     play: function (item) {                      //点播--首先要判断故事机是否在线--是否连接

       //如果故事机不在线--则提示并返回
      if (!utils.online()){
         // alert("故事机不在线！");
          $.toast("故事机不在线", "text");
         return false;
       }

       var _self = this;
       $.ajax({
           url:juli.URL.getsingle+"/"+item.trackId,
           type: 'get',
           dataType: 'json',
           cache:false
       })
       .done(function(res){
          var trackId = item.trackId;
      		var trackListId =utils.trackListId();
      		var url = res.content;
      		var downloadUrl = res.content;
      		playTrack(trackListId,trackId,url,downloadUrl);

           //播放开始的时候先把所有元素的播放状态和暂停状态去掉
          $.each(_self.playlist,function(i,n){
              n.isplay=false;
              n.ispause=false;
          })
         item.isplay=true;
       });
     },
     pause:function(item){                        //暂停-儿童馆
       var _self = this;

       //如果故事机不在线--则提示并返回
      if (!utils.online()){
         // alert("故事机不在线！");
          $.toast("故事机不在线", "text");
         return false;
       }

        pauseTrack();
        item.ispause=true;
     },

     resume:function(item){                        //恢复播放
       var _self = this;

       //如果故事机不在线--则提示并返回
      if (!utils.online()){
         // alert("故事机不在线！");
          $.toast("故事机不在线", "text");
         return false;
       }

        resumeTrack();
        item.ispause=false;
     },

     addfav: function (item) {               //添加收藏
       var _self=this;
       var json = {
         openId: utils.openid,
         trackId: item.trackId,
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
          // alert("已添加收藏");
           $.toast("已添加收藏", "text");
          item.islike=true;
           _self.getfav();
       });
     },
     dellike:function(item){                   //删除收藏
         var _self=this;
          var deldata={
            trackId:item.trackId,
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
           // alert("删除收藏");
             $.toast("删除收藏", "text");
           item.islike=false;
             _self.getfav();
         })
     },
     remove:function(item){                   //播放列表删除数据
       var _self=this;
       var arr=[];
       arr.push(item.trackId);
       $.ajax({
         url: juli.URL.remove+'?id='+utils.trackListId()+'&deviceId='+utils.getdevice(),
         type: 'post',
         contentType: 'application/json',
         data: JSON.stringify(arr)
       })
         .done(function (res) {
           console.log(res);
           // alert("删除成功");
             $.toast("删除成功", "text");
           _self.playlist.$remove(item);
          })
     }
   }
})
