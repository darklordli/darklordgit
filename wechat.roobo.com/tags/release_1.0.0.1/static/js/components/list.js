/**
 * @description: roobo AI配置管理
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/5/31
 */

/*资源列表页 */

 sublistvm=new Vue({
   el: '#j_list',
   ready:function(){
     this.getdata();
   },
   data:{
     pagenum:1,
     listdata:""
   },
   methods:{
     getdata:function(){                              //获取数据
       var _self = this;
       $.ajax({
           url:juli.URL.subcate+"/"+utils.getparam("id")+"/"+_self.pagenum+"/"+utils.pagesize,
           type: 'get',
           dataType: 'json',
           cache:false
       })
       .done(function(res){
         console.log(res);
         //根据返回的数据判断显示数据还是跳到资源列表页
         if (res.categoryList.length){
           sublistvm.$data=res;
         }
         else{
          location.href="listdetail.html?id="+utils.getparam("id");
         }
       })
     }
     }
})
