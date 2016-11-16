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
 listvm=new Vue({
   el: '#j_index',
   data:{
     loading:true,
     list:"",
     input:"",
     imghost:"http://dwn.roo.bo/appimg/"
   },
   ready:function(){
     this.getdata();
   },
   methods:{
     getdata:function(){                          //获取数据
       var _self = this;
       $.ajax({
           url :juli.URL.cate,
           type:'get',
           dataType:'json',
           cache:false
       })
       .done(function(res){
         _self.loading=false;
         listvm.list=res;
         })
       },
       search:function(){                       //去搜索页
         console.log(this.input)
          location.href="search.html?search="+this.input;
       }
     }

})
