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

 singlevm=new Vue({
   el: '#j_single',
   ready:function(){
     this.getdata();
   },
   methods:{
     getdata:function(){
       var _self=this;
       $.ajax({
           url:juli.URL.getsingle+"/"+utils.getparam("id"),
           type: 'get',
           dataType: 'json',
           cache:false
       })
       .done(function(res){
         res.islike=false;
         res.isplay=false
         res.sec=utils.formatSeconds(res.length);
         singlevm.$data=res
       })
     },
     try:function(){                      //试听
       var tryaudio=document.getElementById('try');
       tryaudio.play();
       this.isplay=true;
     },
     stoptry:function(){                      //试听暂停
       var tryaudio=document.getElementById('try');
       tryaudio.pause();
       this.isplay=false;
     },
     demand:function(){                      //点播-儿童馆-需先判断是否已经绑定设备
       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         alert("您还没有绑定设备，请去绑定设备！")
         return false;
       }
       var json = {
         title: this.name,
         duration : this.length,
         url : this.content,
         downloadUrl : this.content,
         downloadSize : this.size
       };

       $.ajax({
         url: juli.URL.add,
         type: 'post',
         contentType: 'application/json',
  			 async : false,
         data: JSON.stringify(json)
       })
       .done(function (res) {
          console.log(res)
          var json = {
            openId: utils.openid,
            trackId:res
          };
          $.ajax({
             url: juli.URL.play+"?mediaId=",
        			type : "POST",
        			contentType : 'application/json',
        			async : false,
        			//dataType : 'json',
        			timeout : 4000,
        			data : JSON.stringify(json),
        			success:function(msg) {
                 if (msg=="ok"){
                     alert("点播成功提示");
                 }
                 else {
                   alert("点播失败提示")
                 }
        				}
        		});
       });
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
         title: _self.name,
         duration: _self.length,
         url: _self.content,
         downloadUrl: _self.content,
         downloadSize: _self.size
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
     },
     download: function (item) {               //下载

       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         alert("您还没有绑定设备，请去绑定设备！")
         return false;
       }

       var _self = this;
       var json = [{
         title:this.name,
         duration: this.length,
         url:this.content,
         downloadUrl:this.srcurl,
         downloadSize: this.size
       }];
       console.log(json);
       $.ajax({
         url: juli.URL.download+"?deviceId="+utils.getdevice()+"&id=819&name="+encodeURI(encodeURI(utils.tracklist)),
         type: 'post',
         contentType: 'application/json',
         data: JSON.stringify(json)
       })
       .done(function (res) {
          console.log(res);
          alert("添加成功！");
        });
     }
   }
})
