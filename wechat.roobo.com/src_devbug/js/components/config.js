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
 configvm=new Vue({
   el: '#j_config',
   data:{
     members:"",
     isadmin:"",
     isupdate:"",
     firmware:"",
     loading:true
   },
   computed:{
    isadmin: function(){                      //我是否是管理员
      var adminopenid;
      $.each(this.members,function(i,n){
        if (n.admin){
        adminopenid=n.openId
        }
      })
      if (utils.openid==adminopenid){
        return true;
      }
      else{
        return false;
      }
    }
  },
   ready:function(){
     this.getmembers();
   },
   methods:{
     getmembers:function(){                             //取得家庭成员列表
       var _self=this;
       $.ajax({
           url :juli.URL.getmember,
           type:'get',
           dataType:'json',
           cache:false,
           async : false,
           data:{
             deviceId:utils.getdevice()
           }
       })
       .done(function(res){
         console.log(res);
         $.each(res,function(i,n){
           if(n.openId==utils.openid){
             n.self=true;
           }
         })
         _self.loading=false;
         _self.members=res;
         })
       },
     quit:function(item){                                    //非管理员自己退出
       var _self=this;
       //非管理员只能对自己退出，先判断是否是自己，如果不是自己则退出
       if (item.openId!=utils.openid) {
        return false;
       }
         $.confirm("您确定退出该微信群吗？", function() {
             //点击确认后的回调函数
             _self.quitfun();
         }, function() {
             //点击取消后的回调函数
             return false;
         });
         },
      quitfun:function(){
        var _self=this;
        var json={
          openId:utils.openid,
          admin:false
        }
          $.ajax({
              url:juli.URL.quit+"?byAdmin=false",
              type: 'post',
              cache:false,
              async:false,
              contentType : 'application/json',
              data:JSON.stringify(json)
          })
          .done(function(res){
              console.log(res);
              if (res=="ok"){
                $.toast("删除成功", "text");
              }
              else{
                $.toast("删除失败", "text");
              }
              _self.getmembers();
              //如果没有绑定设备，则退出页面到微信中
              if(!utils.getdevice()){
                wx.ready(function () {
                  wx.closeWindow();
                });
              }
            })
      },
      quitbyadmin:function(item){                                    //管理员自己退出以及删除他人
        var _self=this;
        //管理员自己退出提示
        if (item.openId==utils.openid) {
            $.confirm("您是管理员，退出后该群会自动解散，你确定吗？", function() {
            //点击确认后的回调函数
             _self.quitbyadminfuc(item);
            }, function() {
            //点击取消后的回调函数
                return false;
            });
        }
        //删除他人提示
        else{
            $.confirm("您确定删除"+item.nickname+"?", function() {
            //点击确认后的回调函数
             _self.quitbyadminfuc(item);
            }, function() {
                //点击取消后的回调函数
                return false;
            });
        }
      },
      quitbyadminfuc:function(item){
        var _self=this;
        var json={
          openId:item.openId,
          admin:true
        }
        $.ajax({
            url:juli.URL.quit+"?byAdmin=true",
            type: 'post',
            cache:false,
            async:false,
            contentType : 'application/json',
            data:JSON.stringify(json)
        })
          .done(function(res){
              console.log(res);
              if (res=="ok"){
                $.toast("删除成功", "text");
              }
              else{
                $.toast("删除失败", "text");
              }
              _self.getmembers();
              //如果没有绑定设备，则退出页面到微信中
              if(!utils.getdevice()){
                wx.ready(function () {
                  wx.closeWindow();
                });
              }
            })
      }
     }
})
