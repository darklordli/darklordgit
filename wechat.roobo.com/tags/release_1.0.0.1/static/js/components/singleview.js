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

 singleview=new Vue({
   el: '#j_singleview',
   ready:function(){
     this.getdata();
   },
   methods:{
     getdata:function(){
       var _self=this;
       $.ajax({
           url:juli.URL.singleview,
           type: 'get',
           dataType: 'json',
           cache:false,
           data:{
             trackId:utils.getparam("id")
           }
       })
       .done(function(res){
         console.log(res);
         res.islike=false;
         _self.$data=res;
         _self.sec = utils.formatSeconds(_self.duration);
       })
       	clientCreate(onConnectCallback);
     },
     play: function () {                      //点播
      var trackId = this.id;
   		var trackListId =juli.URL.trackListId;
   		var url = this.url;
   		var downloadUrl = this.downloadUrl;
   		playTrack(trackListId,trackId,url,downloadUrl);
      this.isplay=true;
     },
     pause:function(){                        //暂停-儿童馆
       var _self = this;
        pauseTrack();
        this.isplay=false;
     },
     repeatone:function(){                    //发单曲循环消息
			setRepeatone();
     },
     repeatall:function(){                    //发全部循环消息
			 setRepeatall();
     },
     forward:function(){                      //下一首
		    forwardTrack();
     },
     backward:function(){                     //上一首
		    backwardTrack();
     },
     addfav: function () {               //添加收藏

       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         alert("您还没有绑定设备，请去绑定设备！")
         return false;
       }

       var _self=this;
       var json = {
         openId: utils.openid,
         title: _self.title,
         duration: _self.duration,
         url: _self.url,
         downloadUrl: _self.downloadUrl,
         downloadSize: _self.downloadSize
       };
       $.ajax({
         url: juli.URL.addlike,
         type: 'post',
         contentType: 'application/json',
         data: JSON.stringify(json)
       })
       .done(function (res) {
          alert("已添加收藏");
          _self.islike=true;
       });
     },
     dellike:function(){                   //删除收藏
       var _self=this;
          var deldata={
            trackId:_self.id,
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
           _self.islike=false;
         })
     }
   }
})
