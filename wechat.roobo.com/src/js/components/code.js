/**
 * @description: 炬力公众号
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/8/1
 */

/**0
 *
 * @name    cfgcenter.js
 * @param   {String}    名称
 * @param   {Function}  方法
 */

 codeVM=new Vue({
   el: "html",
   data:{
     src:""
   },
   computed:{
    babateng:function(){
         return DEBUG=="babateng"||DEBUG=="dev"
      },
    tip:function(){
      if(this.babateng){
        return "扫描二维码加入阿零家庭圈"
      }
      else{
        return "扫描二维码加入智能故事机微信家庭群"
      }
    }
   },
   ready:function(){
     this.getdata();
   },
   methods:{
     getdata:function(){
       var _self=this;
       $.ajax({
           url:juli.URL.getcode+"?deviceId="+utils.getdevice(),
           type: "get",
           cache:false
       })
       .done(function(res){
         console.log(res);
         _self.$data.src=res
       })
     }
   }
})
