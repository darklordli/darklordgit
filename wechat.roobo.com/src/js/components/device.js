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
     info:"",
     firmware:"",
     isonline:true,
     num:0,
     newversion:false
   },
   computed:{
     canupdate:function(){
       if (!this.isonline){
          return false;
        }
       if (this.firmware.electricity<50){
          return false;
       }
       return true;
     }
   },
   ready:function(){
     this.getinfo();
     this.getlistnum();
     this.getver();
   },
   methods:{
     getlistnum: function () {                   //拿到我的播放列表
       var _self=this;
       $.ajax({
         url: juli.URL.getplaytracklist,
         type: 'get',
         dataType: 'json',
         cache: false,
         data: {
             deviceId:utils.getdevice()
         }
       })
      .done(function (res) {
        $.each(res,function(i,n){
          _self.num+=n.downloadTrackCount;
        })
      })
     },
     getver:function(){
       var _self=this;
       $.ajax({
           url :juli.URL.getversion,
           type:'get',
           async:false,
           cache: false,
           data:{
             deviceId:utils.getdevice()
           }
       })
       .done(function(res){
         console.log(res);
         _self.firmware=res
         if(_self.info.firmwareVersion < _self.firmware[0]){
         _self.newversion=true;
         clientCreate(onConnectCallback);
   			}
         })
     },
     update:function(){                                   //升级
       var _self=this;
       $.confirm("将升级故事机软件，请保证您在故事机旁边，升级过程中不要关机或断开网络。", function() {
           //点击确认后的回调函数
           _self.updatefun();
       }, function() {
           //点击取消后的回调函数
           return false;
       });
      // //判断界面上的版本号和服务端缓存的是否相同
      // if(data.firmwareVersion != firmwareVersionValue){
      //   // alert("有别的家庭成员已经给故事机升级了,确定后查看最新信息");
      //
      //     $.alert("有别的家庭成员已经给故事机升级了,确定后查看最新信息","", function () {
      //         //回掉
      //     });
      //
      //   this.getinfo();
      //   return false;
      // }
     },
    updatefun:function(){
      var _self=this;
      //开始升级
      boxUpgrade(_self.firmware[0],_self.firmware[1]);
      _self.canupdate=false;
    },
    getinfo:function(){                              //获取设备信息-需提示是否在线
         var _self=this;

         //如果故事机不在线--则提示
        if (!utils.online()){
          $.toptip('故事机不在线！',600000 ,'warning');
          _self.isonline=false;
         }
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
           res.id=res.id.split("_")[0];
           res.cardAvailable=res.cardAvailable+'MB/';
           res.cardTotal=res.cardTotal+'MB';
           if(res.electricity>100){
             res.electricity='正在充电';
           }else{
             res.electricity+'%';
           }
           _self.info=res;
           })
         }
     }
})
