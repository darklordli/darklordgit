listvm=new Vue({el:"html",data:{loading:!0,list:"",input:"",imghost:"http://dwn.roo.bo/appimg/"},computed:{babateng:function(){return"babateng"==DEBUG||"dev"==DEBUG},title:function(){return this.babateng?"故事云":"儿童馆"}},ready:function(){this.getdata()},methods:{getdata:function(){var t=this;$.ajax({url:juli.URL.cate,type:"get",dataType:"json",cache:!1}).done(function(n){t.loading=!1,listvm.list=n})},search:function(){console.log(this.input),location.href="search.html?search="+this.input}}});