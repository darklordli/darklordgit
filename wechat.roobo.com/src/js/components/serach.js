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
       el:"#j_search",
       data:{
         searchdata:"",
         list:"",
         input:"",
         historylist:"",
         showsearch:"",
         downloaddata:"",
         playtracklist:""
       },
       ready:function(){
         this.decide("url");
         this.initselectdata();       //初始化selecr组件数据
       },
       computed:{
         babateng:function(){
             return DEBUG=="babateng"||DEBUG=="dev"
           }
       },
       methods:{                                          //先根据参数判断从哪获取搜索关键词
         initselectdata:function(){                             //初始化select组件
            var _self = this;
            var playtracklist=utils.gettrackList();

            console.log(playtracklist);

            if (playtracklist.length) {
            $.each(playtracklist,function(i,n){
              n.title=n.name;
              n.value=n.id;
            })
            }
            _self.playtracklist=playtracklist;
         },
         decide:function(param){
           if (param=="url"){
             this.searchdata = utils.getparam("search");
             this.input = this.searchdata
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
             //res.islike=false;
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
            //console.log(res);

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
             // alert("已清除搜索记录");
              $.toast("已清除搜索记录", "text");
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
             $.each(res.data.resources,function(i,n){
               n.sec=utils.formatSeconds(n.length);
               n.isexpand=false;
               n.isplay=false;
               n.islike=false;
             })
              _self.list=res;
              _self.showsearch=true;
             //将搜索关键词发到添加搜索历史接口
              _self.addhistory();
           })
         },
         toggleopen:function(item){                    //切换展开收起
           $.each(this.list.data.resources,function(i,n){
               n.isexpand=false;
           })
           item.isexpand=!item.isexpand;
         },
         try:function(item){                  //试听某资源
           //开始前把所有的播放状态置为false
           $.each(this.list.data.resources,function(i,n){
             n.isplay=false;
           })

           var tryaudio=document.getElementById('try')
           tryaudio.src=item.content;
           tryaudio.play();
           item.isplay=true;
           //播放完毕，回到false
           tryaudio.onended = function() {
              item.isplay=false;
           };
         },
         stoptry:function(item){                      //试听暂停
           var tryaudio=document.getElementById('try');
           tryaudio.pause();
           item.isplay=false;
         },
         demand:function(item){                      //点播-收藏-需先判断是否已经绑定设备
           utils.demand(item.id,item.content);
         },
         addfav: function (item) {               //添加收藏--需先判断是否已经绑定设备

           //如果没有绑定设备--提示并返回
           if (!utils.getdevice()){
             // alert("您还没有绑定设备，请去绑定设备！");
               $.alert("您还没有绑定设备，请去绑定设备！","", function () {
                   // 回调
               });
             return false;
           }

           var json = {
             openId: utils.openid,
             trackId:item.id,
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
             $.toast("已添加收藏", "text");
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
               // alert("已删除收藏");
               $.toast("已删除收藏", "text");
               item.islike=false;
             })
         },
         download: function (item) {               //下载
           var _self = this;

           if(!utils.getdevice()){
             $.alert("您还没有绑定设备，请去绑定设备！","", function () {
               // 回调
             });
             return false;
           }

           var json = [{
             title: item.name,
             id:item.id,
             duration: item.length,
             url: item.content,
             downloadUrl: item.content,
             downloadSize: item.size
           }];

           _self.downloaddata=json;

           $("#select").select({
             title: "请选择播放列表",
             items:_self.playtracklist,
             closeText:"取消",
             onChange:function(){
               //传（名，值）
               _self.downloadfun($("#select").val(),$("#select").data('values'));
             }
           });

           //调用打开select，开始选择，并拿到值
            $("#select").select("open");
         },

         downloadfun: function (name,val) {               //下载--需先判断是否已经绑定设备
           var _self = this;
           console.log(name)
           console.log(val)
           $.ajax({
             url: juli.URL.download+"?deviceId="+utils.getdevice()+"&id="+val+"&name="+encodeURI(encodeURI(name)),
             type : 'post',
             async: false,
             contentType: 'application/json',
             data: JSON.stringify(_self.downloaddata)
           })
           .done(function (res) {
              console.log(res);
               $.toast("添加成功！", "text");
               //清除select状态
              utils.clearselect();
            });
         },

         href:function(item){
           location.href="single.html?id="+item.id;
         }
       }
   })
