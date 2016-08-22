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
     info:"",
     isupdate:"",
     firmware:""
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
     this.getinfo();
     this.getmembers();
     this.getver();
   },
   methods:{
     getver:function(){
       var _self=this;
       $.ajax({
           url :juli.URL.getversion,
           type:'get',
           async:false,
           cache: false
       })
       .done(function(res){
         console.log(res);
         _self.firmware=res
         if(_self.info.firmwareVersion < firmware[0]){
         _self.isupdate=true;
   			}
         })
     },
     update:function(){                                   //升级
       var _self=this;
       //判断电量
       if(this.info.electricity <25){
         alert("电量低于25%，请充电后再升级");
         return false;
 			}
      //判断界面上的版本号和服务端缓存的是否相同
      if(data.firmwareVersion != firmwareVersionValue){
        alert("有别的家庭成员已经给故事机升级了,确定后查看最新信息");
        this.getinfo();
        return false;
      }
      //开始升级
      boxUpgrade(_self.firmware[0],_self.firmware[0]);
      this.isupdate=false;
     },
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
         _self.members=res;
         })
       },
     quit:function(item){                                              //非管理员自己退出

       //非管理员只能对自己退出，先判断是否是自己，如果不是自己则退出
       if (item.openId!=utils.openid) {
        return false;
       }

       alert("您确定退出该微信群吗？")
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
             alert("退出成功")
             _self.getmembers();
           })
         },
      quitbyadmin:function(item){                                    //管理员自己退出以及删除他人

        //管理员自己退出提示
        if (item.openId==utils.openid) {
           alert("您是管理员，推出后改群会自动解散，你确定吗")
        }

        //删除他人提示
        else{
           alert("您确定删除"+item.nickname+"?")
        }
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
              alert("删除成功")
              _self.getmembers();
              //如果没有绑定设备，则退出页面到微信中
              if(!utils.getdevice()){
                wx.ready(function () {
                  wx.closeWindow();
                });
              }
            })



        },
       getinfo:function(){                              //获取设备信息-需提示是否在线

         //如果故事机不在线--则提示
        if (!utils.online()){
           alert("故事机不在线！")
         }

       var _self=this;
         $.ajax({
             url :juli.URL.getinfo,
             type:'get',
             async : false,
             cache:false,
             data:{
               deviceId:utils.getdevice()
             }
         })
         .done(function(res){
           console.log(res);
           res.id=res.id.split("_")[0]
           _self.info=res;
           })
         }
     }
})
