/**
 * @description: 炬力公众号
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/8/1
 */

/**收藏列表逻辑*/

likevm=new Vue({
   el: '#j_favlist',
   data:{
     list:""
   },
   ready:function(){
     this.getdata();
   },
   methods:{
     getdata:function(){
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
         $.each(res,function(i,n){
           n.sec=utils.formatSeconds(n.duration);
           n.isplay=false;
             n.islike=false;
         })
         likevm.list=res;
       })
     },
     demand:function(item){                      //收藏列表-我的
       //点播开始的时候先把所有元素的播放状态去掉
       var _self = this;
       $.each(_self.list,function(i,n){
           n.isplay=false;
       })
       var json = {
         title: item.title,
         duration : item.duration,
         url : item.url,
         downloadUrl : item.downloadUrl,
         downloadSize : item.downloadSize,
         deviceId:utils.getdevice(),
         openId: utils.openid,
         trackId:item.trackId
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
                     // alert("点播成功");
                     $.toast("点播成功，请点击故事机上的播放按钮", "text");
                     //item.isplay=true;
                 }
                 else {
                   // alert("点播失败提示");
                     $.toast("点播失败", "text");
                 }
        				}
        		});
       /*});*/
     },
     pause:function(item){                        //暂停-儿童馆
       var _self = this;
        pauseTrack();
        item.isplay=false;
     },
     download: function (item) {               //下载
       
       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         // alert("您还没有绑定设备，请去绑定设备！");
           $.alert("您还没有绑定设备，请去绑定设备！","", function () {
               // 回调
           });
         return false;
       }


       var _self = this;
       var json = [{
         title: item.title,
         id:item.trackId,
         duration: item.duration,
         albumTitle: item.albumTitle,
         albumCoverSmallUrl: item.albumCoverSmallUrl,
         url: item.url,
         downloadUrl: item.downloadUrl,
         downloadSize: item.downloadSize
       }];
       console.log(json);
       $.ajax({
         url: juli.URL.download+"?deviceId="+utils.getdevice()+"&id="+utils.trackListId()+"&name="+encodeURI(encodeURI(utils.tracklist)),
         type: 'post',
         contentType: 'application/json',
         data: JSON.stringify(json)
       })
       .done(function (res) {
          console.log(res);
          // alert("添加成功！");
           $.toast("添加成功！", "text");
        });
     },
     del:function(item){                   //删除收藏
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
           likevm.getdata();
         })
     }
   }
})
