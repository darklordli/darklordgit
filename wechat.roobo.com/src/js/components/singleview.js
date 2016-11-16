/**
 * @description: 炬力公众号
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/8/1
 */

/**
 *
 * @name    cfgcenter.js
 * @param   {String}    名称
 * @param   {Function}  方法
 */


 //这些方法需要放到window下
  function onConnectCallback(){                     //获取设备信息，设置页面中的文字信息
    console.log("hahah，链接啦！")
    queryTrack();
    queryPlayStatus();
    queryMode();
  }

 //拿到播放状态后设置页面
 function playStatus_change(playStatus){ //playing pause
   console.log(playStatus);
   if(playStatus == "playing"){
     singleview.isplay=true;
   }
   else{
     singleview.isplay=false;
   }
 }

 //拿到当前播放的资源后设置页面
 function playTrack_change(trackListId,trackId,type){
   console.log(trackListId)
   console.log(trackId)
   console.log(type)
   singleview.loading=false;
   if (trackId=="-1"){
     singleview.title="当前无正在播放歌曲~";
   }
   else {
     singleview.getsingle(trackId);
     //utils.settitle(singleview.title);
   }
 }

 //播放模式改变
 function mode_change(mode){ //repeat one，repeat all
   var _self=singleview;
   console.log(mode);
   if(mode == "repeat all"){
     _self.isloop=true
      //$.toast("当前循环模式为:全部循环~", "text");
   }else{
     _self.isloop=false
      //$.toast("当前循环模式为:单曲循环~", "text");
   }
 }

 //当前是否在线情况的改变
 function onlineStatus_change(onlineStatus){
 	if(onlineStatus == "on"  || onlineStatus == "online" || onlineStatus == "on-upgrade-failed"){
 		singleview.deviceOnline = true;
 	}
 	else{
 		singleview.deviceOnline = false;
    $.toast("故事机断网了哦~", "text");
    return false;
 	}
 }


 singleview=new Vue({                         //此页面的打开和每个操作都要检测故事机是否在线
   el: '#j_singleview',
   ready:function(){
     this.getdevice();            //先获取deviceID
     this.getdeviceinfo();
   },
   data:{
     loading:true,
     isplayed:false,                                                  //已经在播放的标记，如果为true，则播放键变为resume()
     currentdata:"",                                                  //当前资源的数据
     islike:"",
     isloop:"",                                                    //是否全部循环
     isplay:false,                                                    //是否正在播放
     trackId:"",                                                     //正在播放的
     sec:"",                                                         //转为分秒
     title:"",                                                       //存储标题
     deviceOnline:true
   },
   computed:{
     babateng:function(){
       return DEBUG=="babateng"||DEBUG=="dev"
     }
   },
   methods:{
     getdevice:function(){                                    //获取deviceId
       utils.getdevice();
     },
     getdeviceinfo:function(){                              //与设备建立连接--首先要判断故事机是否在线--是否连接
        var _self=this;

        //如果故事机不在线--则提示并返回
       if (!_self.deviceOnline){
          // alert("故事机不在线！");
           $.toast("故事机不在线", "text");
          return false;
        }

        clientCreate(onConnectCallback);                  //与设备建立连接
     },
     getsingle:function(id){                               //根据查到歌曲信息
       var _self=this;
       $.ajax({
           url:juli.URL.getsingle+"/"+id,
           type: 'get',
           dataType: 'json',
           cache:false
       })
       .done(function(res){
         console.log(res);
         if (!res){
           $.alert("已经没有更多歌曲了哦~","", function () {
              return false;
           });
         }
         _self.currentdata=res;
         _self.title=_self.currentdata.name;
         _self.sec=utils.formatSeconds(_self.currentdata.length);
         _self.$set('islike',false)

       })
     },

     play: function () {                      //播放--首先要判断故事机是否在线
         var _self = this;

         //如果故事机不在线--则提示并返回
        if (!_self.deviceOnline){
           // alert("故事机不在线！");
            $.toast("故事机不在线", "text");
           return false;
         }

         //如果isplayed为true，则播放键变为resume()方法，然后返回
         if(_self.isplayed==true){
			     resumeTrack();
           return false;
         }
         $.ajax({                                 //先根据ID查track信息
             url:juli.URL.getsingle+"/"+utils.getparam("id"),
             type: 'get',
             dataType: 'json',
             cache:false
         })
         .done(function(res){
           console.log(res)
           var trackId =parseInt(utils.getparam("id"));
           var trackListId = utils.trackListId();
           var url = res.content;
           var downloadUrl = res.content;
           playTrack(trackListId,trackId,url,downloadUrl);
           _self.isplay=true;
           _self.isplayed=true;
         })
     },

     pause:function(){                        //暂停-儿童馆
         var _self = this;
       //如果故事机不在线--则提示并返回
      if (!_self.deviceOnline){
         // alert("故事机不在线！");
          $.toast("故事机不在线", "text");
         return false;
       }

        pauseTrack();
        this.isplay=false;
     },

     resume:function(){                       //恢复播放
       var _self = this;
     //如果故事机不在线--则提示并返回
        if (!_self.deviceOnline){
           // alert("故事机不在线！");
            $.toast("故事机不在线", "text");
           return false;
         }
      resumeTrack();
      this.isplay=false;
      },

     repeatone:function(){                    //发单曲循环消息
         var _self = this;
       //如果故事机不在线--则提示并返回
      if (!_self.deviceOnline){
         // alert("故事机不在线！");
          $.toast("故事机不在线", "text");
         return false;
       }

			setRepeatone();
        this.isloop=true;
     },
     repeatall:function(){                    //发全部循环消息
         var _self = this;
       //如果故事机不在线--则提示并返回
      if (!_self.deviceOnline){
         // alert("故事机不在线！");
          $.toast("故事机不在线", "text");
         return false;
       }

			 setRepeatall();
        this.isloop=false;
     },
     forward:function(){                      //下一首
         var _self = this;
       //如果故事机不在线--则提示并返回
      if (!_self.deviceOnline){
         // alert("故事机不在线！");
          $.toast("故事机不在线", "text");
         return false;
       }

         forwardTrack()
     },
     backward:function(){                     //上一首
         var _self = this;
       //如果故事机不在线--则提示并返回
      if (!_self.deviceOnline){
         // alert("故事机不在线！");
          $.toast("故事机不在线", "text");
         return false;
       }

          backwardTrack();
     },
     addfav: function () {               //添加收藏
       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         // alert("您还没有绑定设备，请去绑定设备！");
           $.alert("您还没有绑定设备，请去绑定设备！","", function () {
               // 回调
           });
         return false;
       }
       var _self=this;
       var json = {
         openId: utils.openid,
         trackId:_self.currentdata.id,
         title: _self.currentdata.name,
         duration: _self.currentdata.length,
         url: _self.currentdata.content,
         downloadUrl: _self.currentdata.content,
         downloadSize: _self.currentdata.size
       };
       $.ajax({
         url: juli.URL.addlike,
         type: 'post',
         contentType: 'application/json',
         data: JSON.stringify(json)
       })
       .done(function (res) {
           $.toast("已添加收藏", "text");
          _self.islike=true;
       });
     },
     dellike:function(){                   //删除收藏
       var _self=this;
          var deldata={
            trackId:_self.currentdata.id,
            openId:utils.openid
          }
         $.ajax({
             url:juli.URL.dellike,
             type: 'post',
             cache:false,
             async:false,
		         contentType:'application/json',
             data:JSON.stringify(deldata)
         })
         .done(function(res){
             console.log(res);
             // alert("删除收藏");
             $.toast("删除收藏", "text")
             _self.islike=false;
         })
     }
   }
})
