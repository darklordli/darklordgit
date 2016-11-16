/**
 * @description: 炬力公众号
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/8/1
*/

/**
my.js 我的页面 js里的方法列表

1 显示设备的播放列表

2 跳转到列表详情页

3 拿到我的收藏数

5 拿到点播历史数

*/

  myvm=new Vue({
   el: 'html',
   data:{
     loading:true,
     fav:"",
     history:"",
     playlist:"",
     deviceOnline:true,
     masked:false,
     playtracklist:""
   },
   ready:function(){
     //this.getdevice();
     this.getfav();
     this.gethistory();
     utils.gettrackList();
     this.getplaytracklist();
   },
   computed:{
     babateng:function(){
         return DEBUG=="babateng"||DEBUG=="dev"
       },
    title:function(){
      if(this.babateng){
        return "阿零"
      }
      else{
        return "我的"
      }
    }
   },
   methods:{
     getdevice:function(){                    //判断是否绑定设备
       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
           window.location.href = 'doscaninfo.html';
       }
     },
     getplaytracklist: function () {                   //显示设备的播放列表
       var _self=this;
       _self.playtracklist=utils.gettrackList();
       console.log(_self.playtracklist)
       this.loading=false;
     },
     linklist:function(item){                             //跳转到列表页
       location.href="mylist.html?id="+item.id;
     },
     getfav:function(){                                   //拿到我的收藏数
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
     gethistory: function () {                          //拿到点播历史数
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
     }
   }
})
