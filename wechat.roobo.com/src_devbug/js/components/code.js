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
   el: '#j_code',
   data:{
     src:""
   },
   ready:function(){
     this.getdata();
   },
   methods:{
     getdata:function(){
       var _self=this;
       $.ajax({
           url:juli.URL.getcode+"?deviceId="+utils.getdevice(),
           type: 'get',
           cache:false
       })
       .done(function(res){
         console.log(res);
         _self.$data.src=res
       })
     }
   }
})
