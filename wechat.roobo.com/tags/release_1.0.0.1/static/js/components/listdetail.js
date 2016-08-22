/**
 * @description: 炬力公众号
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/8/1

/**取类别中的资源并点播*/

 listdetailvm=new Vue({
   el: '#j_listdetail',
   ready:function(){
     this.getdata();
   },
   data:{
     pagenum:1,
     listdata:""
   },
   computed:{
     haspage:function(){                              //如果categoryList.length
       if (this.listdata.resourcePage.result.length < this.listdata.resourcePage.totalRows){
         return true
       }
       else{
         return false
       }
     }
   },
   methods:{
     getdata:function(){
       var _self=this;
       $.ajax({
           url:juli.URL.subcate+"/"+utils.getparam("id")+"/"+_self.pagenum+"/"+utils.pagesize,
           type: 'get',
           dataType: 'json',
           cache:false
       })
       .done(function(res){
         console.log(res);
         $.each(res.resourcePage.result,function(i,n){
           n.sec=utils.formatSeconds(n.length);
           n.isplay=false;
           n.islike=false;
           n.isexpand=false;
         })
        listdetailvm.listdata=res;
       })
     },
     nextpage:function(){                         //获取下一页数据
       var _self = this;
       _self.pagenum=_self.pagenum+1;
       $.ajax({
           url:juli.URL.subcate+"/"+utils.getparam("id")+"/"+_self.pagenum+"/"+utils.pagesize,
           type: 'get',
           dataType: 'json',
           cache:false
       })
       .done(function(res){
         console.log(res);
         $.each(res.resourcePage.result,function(i,n){
           n.sec=utils.formatSeconds(n.length);
           n.isplay=false;
           n.islike=false;
           n.isexpand=false;
         })
         //把获取的元素的有用部分压入现在的vm的数据中--需依次压入，不能一次性压入，否则数组会变成就数组的最后一个元素
         $.each(res.resourcePage.result,function(i,n){
             n.isplay=false;
            _self.listdata.resourcePage.result.push(n)
         })

       });
     },
     toggleopen:function(item){                    //切换展开收起
       $.each(this.listdata.resourcePage.result,function(i,n){
           n.isexpand=false;
       })
       item.isexpand=!item.isexpand;
     },
     try:function(src){                  //播放某资源
       var tryaudio=document.getElementById('try')
       tryaudio.src=src;
       tryaudio.play();
     },
     demand:function(item){                      //点播-儿童馆-需先判断是否已经绑定设备
       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         alert("您还没有绑定设备，请去绑定设备！")
         return false;
       }

       //点播开始的时候先把所有元素的播放状态去掉
       var _self = this;
       $.each(_self.listdata.resourcePage.result,function(i,n){
           n.isplay=false;
       })
       var json = {
         title: item.name,
         coverSmallUrl : _self.listdata.currentCategory.imgSmall,
         albumCoverSmallUrl :_self.listdata.currentCategory.imgSmall,
         duration : item.length,
         url : item.content,
         downloadUrl : item.content,
         downloadSize : item.size
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
                     item.isplay=true;
                     _self.$set("item.isplay",true)
                 }
                 else {
                   alert("点播失败提示")
                 }
        				}
        		});
       });
     },
     pause:function(item){                        //暂停-儿童馆
       var _self = this;
        pauseTrack();
        item.isplay=false;
     },
     addfav: function (item) {               //添加收藏--需先判断是否已经绑定设备

       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         alert("您还没有绑定设备，请去绑定设备！")
         return false;
       }

       var json = {
         openId: utils.openid,
         title: item.name,
         duration: item.length,
         url: item.content,
         downloadUrl: item.content,
         downloadSize: item.size
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
     download: function (item) {               //下载--需先判断是否已经绑定设备

       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         alert("您还没有绑定设备，请去绑定设备！")
         return false;
       }

       var _self = this;
       var json = [{
         title: item.name,
         duration: item.length,
         albumTitle:_self.listdata.currentCategory.name,
         albumCoverSmallUrl:_self.listdata.currentCategory.imgSmall,
         url: item.content,
         downloadUrl: item.srcurl,
         downloadSize: item.size
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
