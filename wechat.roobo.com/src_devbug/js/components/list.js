/**
 * @description: 炬力公众号
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/8/1
 */


/**取类别中的资源并点播*/
 listdetailvm=new Vue({
   el: '#j_list',
   ready:function(){
     this.getlist();
   },
   data:{
     pagenum:1,
     imghost:"http://dwn.roo.bo/appimg/",
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
     getlist:function(){                              //获取数据
       var _self = this;
       $.ajax({
           url:juli.URL.subcate+"/"+utils.getparam("id")+"/"+_self.pagenum+"/"+utils.pagesize,
           type: 'get',
           dataType: 'json',
           cache:false
       })
       .done(function(res){
         console.log(res);
         if (res.resourcePage.result) {
           $.each(res.resourcePage.result,function(i,n){
             n.sec=utils.formatSeconds(n.length);
             n.isplay=false;
             n.islike=false;
             n.isexpand=false;
           })
         }
        _self.listdata=res;
        utils.settitle(_self.listdata.currentCategory.name);
       })
     },
     getdetail:function(item){
       var _self=this;
       $.ajax({
           url:juli.URL.subcate+"/"+item.id+"/"+_self.pagenum+"/"+utils.pagesize,
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
        _self.listdata=res;

        //更改url
        history.pushState("", "","#detail");
        utils.settitle(_self.listdata.currentCategory.name);
        //监听后退
        window.onpopstate=function()
        {
        listdetailvm.getlist();
        }
       })
     },
     nextpage:function(){                         //获取下一页数据
       var _self = this;
       _self.pagenum=_self.pagenum+1;
       $.ajax({
           url:juli.URL.subcate+"/"+_self.listdata.currentCategory.id+"/"+_self.pagenum+"/"+utils.pagesize,
           type: 'get',
           dataType: 'json',
           cache:false
       })
       .done(function(res){
         console.log(res);
         $.each(res.resourcePage.result,function(i,n){
           n.sec=utils.formatSeconds(n.length);
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
     try:function(item){                  //试听某资源
       //开始前把所有的播放状态置为false
       $.each(this.listdata.resourcePage.result,function(i,n){
         n.isplay=false;
       })

       var tryaudio=document.getElementById('try')
       tryaudio.src=item.content;
       tryaudio.play();
       item.isplay=true;
       //播放完毕，回到false
       tryaudio.onended = function() {
          item.isplay=false;
       };
     },
     stoptry:function(item){                      //试听暂停
       var tryaudio=document.getElementById('try');
       tryaudio.pause();
       item.isplay=false;
     },
     demand:function(item){                      //点播-儿童馆-需先判断是否已经绑定设备
       utils.demand(item.id,item.content);
     },
     addfav: function (item) {               //添加收藏--需先判断是否已经绑定设备

       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         // alert("您还没有绑定设备，请去绑定设备！");
           $.alert("您还没有绑定设备，请去绑定设备！","", function () {
                // 回调
           });
         return false;
       }

       var json = {
         openId: utils.openid,
         trackId:item.id,
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
          // alert("已添加收藏");
           $.toast("已添加收藏", "text");
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
           // alert("删除收藏");
             $.toast("删除收藏", "text");
           item.islike=false;
         })
     },
     downloadlist: function () {               //下载整个资源列表--需先判断是否已经绑定设备

       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
           $.alert("您还没有绑定设备，请去绑定设备！","", function () {
           });
         return false;
       }

       var _self = this;
       $.ajax({
           url :juli.URL.downloadlist+"/"+utils.getdevice()+"/"+utils.trackListId()+"/"+_self.listdata.currentCategory.id,
           type:'get',
           dataType:'json',
           cache:false,
           async:false,
       })
       .done(function(res){
         utils.sync();
         $.toast("添加成功", "text");
        })
     },
     download: function (item) {               //下载--需先判断是否已经绑定设备

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
         title: item.name,
         id:item.id,
         duration: item.length,
         albumTitle:_self.listdata.currentCategory.name,
         albumCoverSmallUrl:_self.listdata.currentCategory.imgSmall,
         url: item.content,
         downloadUrl: item.srcurl,
         downloadSize: item.size
       }];
       console.log(json);
       $.ajax({
         url: juli.URL.download+"?deviceId="+utils.getdevice()+"&id="+utils.trackListId()+"&name="+encodeURI(encodeURI(utils.tracklist)),
         type: 'post',
         async:false,
         contentType: 'application/json',
         data: JSON.stringify(json)
       })
       .done(function (res) {
          console.log(res);
          // alert("添加成功！");
           $.toast("添加成功！", "text");
        });
     }
   }
})
