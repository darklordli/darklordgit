/**
 * @description: 炬力公众号
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/9/18
*/

/**
my.js 我的列表详情页面 js里的方法列表

1 判断是否绑定设备

2 sync 使故事机同步播放列表

3 恢复默认列表的提示

5 恢复默认列表方法

6 恢复后续预置播放列表的提示

7 恢复列表失败

8 恢复预置播放列表方法

9 拿到当前播放列表的列表信息

10 拿到当前播放列表的数据

11 获取下一页数据

12 进入播放控制页

13 播放

14 暂停

15 恢复播放

16 添加收藏

17 删除收藏

18 播放列表删除数据

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
    $.each(myvm.playlist.tracks,function(i,n){
      n.isplay=false;
      if(n.id==trackId){
        n.isplay=true;
        //$.toast("当前播放歌曲为:"+n.title, "text");
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

function startInitialTrackList(id,trackIds){
console.log("开始初始化")
 if(utils.getparam("id") == id){
   $.ajax({
     type : "POST",
     url:juli.URL.inital + "?trackListId=" + utils.getparam("id") + "&deviceId="+utils.getdevice(),
     contentType : 'application/json',
     async:false,
     cache:false,
     timeout : 4000,
     data : JSON.stringify(trackIds)
  })
  .done(function (res) {
    console.log(res);
      $.hideLoading();
      clearTimeout(t);
      $.toast("恢复成功", "text");
      myvm.pagenum=1;
      myvm.getplaylist();
   })
 }
}


/**取类别中的资源并点播*/
  myvm=new Vue({
   el: 'html',
   data:{
     pagenum:1,
     imghost:"http://dwn.roo.bo/appimg/",
     loading:true,
     playlist:"",
     listinfo:"",
   },
   computed:{
     haspage:function(){                              //如果categoryList.length
       if (this.playlist.tracks.length < this.playlist.totalCount){
         return true
       }
       else{
         return false
       }
     }
   },
   ready:function(){
     this.getdevice();
     this.getinfo();
     this.getplaylist();
   },
   methods:{
     resetif:function(){                       //判断是否是默认列表，根据列表的名字走不同的恢复初始列表的方法
       var _self=this;
       //如果故事机不在线--则提示并返回
       if (!utils.online()){
         // alert("故事机不在线！");
          $.toast("故事机不在线", "text");
         return false;
       }

       if (_self.listinfo.name=="默认列表"){
         _self.default();
       }
       else{
         _self.reset();
       }

     },
     getdevice:function(){                    //判断是否绑定设备
       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
           window.location.href = 'doscaninfo.html';
       }
     },
     sync:function(){                              //使故事机同步播放列表
       var _self=this;
       var json={
         id:utils.getparam("id"),
         deviceId:utils.getdevice(),
         name:_self.listinfo.name
       }
      $.ajax({
          url:juli.URL.sync,
          type: 'post',
          cache:false,
          async:false,
          contentType : 'application/json',
          data:JSON.stringify(json)
      })
      .done(function(res){
        console.log(res);
      })
     },

     default:function(){                    //恢复默认列表的提示
       var _self=this;
       $.confirm("您确认恢复故事机的默认播放列表吗？", function() {
           //点击确认后的回调函数
           _self.defaultfunction();
       }, function() {
           //点击取消后的回调函数
           return false;
       });
     },

     defaultfunction:function(){                    //恢复默认列表
       var _self=this;
       $.ajax({
           //url:juli.URL.reset400+"/"+utils.getdevice()+"/"+utils.trackListId(),
           url:juli.URL.reset400,
           type: 'get',
           dataType: 'json',
           cache:false,
           data: {
               deviceId:utils.getdevice(),
               trackListId:utils.trackListId()
           }
       })
       .done(function(res){
        if (res=="ok"){
            $.toast("故事机的默认播放列表恢复成功~", "text");
            _self.getplaylist();
          }
          else {
            $.toast("故事机的默认播放列表恢复失败~", "text");
          }
        })
     },

     reset:function(){                     //恢复后续预置播放列表的提示
       var _self=this;
       $.confirm("当前播放列表将被恢复至出厂状态", function() {
           //点击确认后的回调函数
           getInitialTrackList(utils.getparam("id"));
           $.showLoading("正在恢复...");
           t=setTimeout('myvm.resetfail()',10000);

       }, function() {
           //点击取消后的回调函数
           return false;
       });
     },
     resetfail:function(){                     //恢复列表失败
       if(".weui_loading_toast"){
         $.hideLoading();
         $.toast("出现异常，请重试", "text");
       }
     },
     resetfun:function(){                    //恢复预置播放列表方法
       var _self=this;

       $.ajax({
           url:juli.URL.reset+"/"+utils.getdevice()+"/"+utils.getparam("id"),
           type: 'get',
           dataType: 'json',
           cache:false
       })
       .done(function(res){
        if (res=="1"){
            //_self.sync();                                   //同步故事机的播放列表,这里不需要走
            $.toast("播放列表恢复成功~", "text");
            _self.getplaylist();
          }
          else {
            $.toast("播放列表恢复失败~", "text");
          }
        })
     },

     getinfo:function(){                          //拿到当前播放列表
       var _self=this;
       $.ajax({
         url: juli.URL.getlistinfo,
         type: 'get',
         dataType: 'json',
         cache: false,
         data: {
           id:utils.getparam("id")
         }
       })
         .done(function (res) {
           _self.listinfo=res;
          })
     },
     getplaylist: function () {                   //拿到当前播放列表的数据
       var _self=this;
       $.ajax({
         url: juli.URL.getlist,
         type: 'get',
         dataType: 'json',
         cache: false,
         data: {
           trackListId:utils.getparam("id"),
           currentPage:this.pagenum,
           pageSize:utils.pagesize
         }
       })
         .done(function (res) {
           console.log(res);
           $.each(res.tracks,function(i,n){
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
     nextpage:function(){                         //获取下一页数据
       var _self = this;
       _self.pagenum=_self.pagenum+1;
       $.ajax({
         url: juli.URL.getlist,
         type: 'get',
         dataType: 'json',
         cache: false,
         data: {
           trackListId:utils.getparam("id"),
           currentPage:_self.pagenum,
           pageSize:utils.pagesize
         }
       })
       .done(function(res){
         console.log(res);
         $.each(res.tracks,function(i,n){
           n.sec=utils.formatSeconds(n.duration);
           n.islike=false;
           n.isexpand=false;
           n.isplay=false;
           n.ispause=false;
           n.trackId= n.id;
         })

         //把获取的元素的有用部分压入现在的vm的数据中--需依次压入，不能一次性压入，否则新数组会变成就旧数组的最后一个元素
         $.each(res.tracks,function(i,n){
           _self.playlist.tracks.push(n)
         })

       });
     },
     singleview:function (item) {                      //进入播放控制页--首先要判断故事机是否在线
       var _self = this;

       //如果故事机不在线--则提示并返回
      if (!utils.online()){
         // alert("故事机不在线！");
          $.toast("故事机不在线", "text");
         return false;
       }

       location.href="singleview.html?id="+item.id;
     },
     play: function (item) {                      //播放--首先要判断故事机是否在线--是否连接

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
      		var trackListId =parseInt(utils.getparam("id"));
      		var url = res.content;
      		var downloadUrl = res.content;
      		playTrack(trackListId,trackId,url,downloadUrl);

           //播放开始的时候先把所有元素的播放状态去掉
          $.each(_self.playlist.tracks,function(i,n){
              n.isplay=false;
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
         })
     },
     remove:function(item){                   //播放列表删除数据
       var _self=this;
       var arr=[];
       arr.push(item.trackId);
       $.ajax({
         url: juli.URL.remove+'?id='+utils.getparam("id")+'&deviceId='+utils.getdevice(),
         type: 'post',
         contentType: 'application/json',
         data: JSON.stringify(arr)
       })
         .done(function (res) {
           console.log(res);
             $.toast("删除成功", "text");
            _self.getplaylist();
          })
     }
   }
})
