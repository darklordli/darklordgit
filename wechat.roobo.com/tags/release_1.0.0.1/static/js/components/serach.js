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
     searchVM=new Vue({
       el: '#j_search',
       data:{
         searchdata:"",
         list:"",
         input:"",
         historylist:"",
         showsearch:""
       },
       ready:function(){
         this.decide("url");
       },
       methods:{                                          //先根据参数判断从哪获取搜索关键词
         decide:function(param){
           if (param=="url"){
             this.searchdata = utils.getparam("search");
           }
           else {
             this.searchdata = this.input;
           }
           if (this.searchdata==""){                   //如果搜索关键词为空，则走搜索历史纪录
            this.searchhistory();
           }
           else{                                          //否则用关键词查搜索接口
            this.search();
           }
         },
         searchhistory:function(){                        //取搜索历史
           var _self=this;
           $.ajax({
               url:juli.URL.getsearch+"/"+utils.openid+"/"+utils.getdevice(),
               type: 'get',
               cache:false
           })
           .done(function(res){
             console.log(res);
             _self.showsearch=false;
             _self.historylist=res;
           })
         },
         addhistory:function(){                          //添加搜索历史
           var _self=this;
           var json={
             openId:utils.openid,
             deviceId:utils.getdevice(),
             keyword:_self.searchdata
           }
          $.ajax({
              url:juli.URL.savesearch,
              type: 'post',
              cache:false,
              async:false,
 		          contentType : 'application/json',
              data:JSON.stringify(json)
          })
          .done(function(res){
            console.log(res);
            alert("已添加搜索历史")
          })
         },
         clearhistory:function(){                            //清空搜索历史
           var _self=this;
           $.ajax({
               url:juli.URL.clearsearch+"/"+utils.openid+"/"+utils.getdevice(),
               type: 'get',
               cache:false,
               data:{
                 openId:utils.openid,
                 deviceId:utils.getdevice()
               }
           })
           .done(function(res){
             console.log(res);
             alert("已清除搜索记录");
            _self.searchhistory();
           })
         },
         searchbyhistory:function(item){                  //点击搜索记录进行搜索
           this.searchdata=item.keyword;
           this.search();
         },
         search:function(){                            //取搜索结果
           var _self=this;
           $.ajax({
               url:juli.URL.search+_self.searchdata,
               type: 'get',
               cache:false,
               contentType: 'application/json'
           })
           .done(function(res){
             console.log(res);
             _self.list=res;
             _self.showsearch=true;
             $.each(_self.list.data.resources,function(i,n){
               n.sec=utils.formatSeconds(n.length);
               n.isexpand=false;
             })
             //将搜索关键词发到添加搜索历史接口
             _self.addhistory()
           })
         },
         toggleopen:function(item){                    //切换展开收起
           $.each(this.list.data.resources,function(i,n){
               n.isexpand=false;
           })
           item.isexpand=!item.isexpand;
         },
         try:function(src){                      //试听某资源
           var tryaudio=document.getElementById('try')
           tryaudio.src=src;
           tryaudio.play();
         },
         demand:function(item){                      //点播-儿童馆
           var _self = this;
           var json = {
             title: item.name,
             coverSmallUrl:_self.currentCategory.imgSmall,
             albumCoverSmallUrl:_self.currentCategory.imgSmall,
             duration: item.length,
             url: item.content,
             downloadUrl: item.content,
             downloadSize: item.size
           };
           $.ajax({
             url: juli.URL.add,
             type: 'post',
             contentType: 'application/json',
      			 async : false,
             data: JSON.stringify(json)
           })
           .done(function (res) {
              console.log(res)
              _self.playdemand(res)
           });
         },
         playdemand:function(id){                 //播放
           var _self = this;
           var json = {
             openId: utils.openid,
             trackId:id
           };
           console.log(json)
           $.ajax({
              url: juli.URL.play+"?mediaId=",
         			type : "POST",
         			contentType : 'application/json',
         			async : false,
         			//dataType : 'json',
         			timeout : 4000,
         			data : JSON.stringify(json),
         			success : function(msg) {
                  console.log(msg)
         				}
         		});
         },
         addfav: function (item) {               //添加收藏--需先判断是否已经绑定设备

           //如果没有绑定设备--提示并返回
           if (!utils.getdevice()){
             alert("您还没有绑定设备，请去绑定设备！")
             return false;
           }

           var json = {
             openId: utils.openid,
             title: item.name,
             duration: item.length,
             url: item.content,
             downloadUrl: item.content,
             downloadSize: item.size
           };
           $.ajax({
             url: juli.URL.addlike,
             type: 'post',
             contentType: 'application/json',
             data: JSON.stringify(json)
           })
           .done(function (res) {
              alert("已添加收藏");
               item.islike=true;
           });
         },
         dellike:function(item){                   //删除收藏
              var deldata={
                trackId:item.id,
                openId:utils.openid
              }
             $.ajax({
                 url:juli.URL.dellike,
                 type: 'post',
                 cache:false,
                 async:false,
    		         contentType : 'application/json',
                 data:JSON.stringify(deldata)
             })
             .done(function(res){
               console.log(res);
               alert("已删除收藏");
               item.islike=false;
             })
         },
         download: function (item) {               //下载
           var _self = this;
           var json = [{
             title: item.name,
             duration: item.length,
             url: item.content,
             downloadUrl: item.content,
             downloadSize: item.size
           }];
           console.log(json);
           $.ajax({
             url: juli.URL.download+"?deviceId="+utils.getdevice()+"&id=819&name="+encodeURI(encodeURI(utils.tracklist)),
             type: 'post',
             contentType: 'application/json',
             data: JSON.stringify(json)
           })
           .done(function (res) {
              console.log(res);
              alert("添加成功！");
            });
         }
       }
   })
