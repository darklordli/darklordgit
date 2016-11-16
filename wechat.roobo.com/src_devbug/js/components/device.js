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
     isupdate:"",
     isonline:true,
     playlist:""
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
         url: juli.URL.getlist,
         type: 'get',
         dataType: 'json',
         cache: false,
         data: {
           trackListId: utils.trackListId()
         }
       })
      .done(function (res) {
        $.each(res,function(i,n){
          if (n.status==0) {
            res.splice(i,1)
          }
        })
        _self.playlist=res;
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
         _self.isupdate=true;
         clientCreate(onConnectCallback);
   			}
         })
     },
     update:function(){                                   //升级
       var _self=this;

       //判断电量
       if(this.info.electricity <25){
         // alert("电量低于25%，请充电后再升级");
         $.toast("电量低于25%，请充电后再升级哦~", "text");
         return false;
 			}
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
      //开始升级
      boxUpgrade(_self.firmware[0],_self.firmware[1]);
      _self.isupdate=false;
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