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

 singlevm=new Vue({
   el: 'html',
   data: {
     loading:true,
     singledata: "",
     downloaddata:"",
     playtracklist:""
   },
   ready:function(){
     this.getdata();                                          //此页面首先判断故事机是否在线
     this.initselectdata();                                   //初始化selecr组件数据
   },
   computed:{
     babateng:function(){
       return DEBUG=="babateng"||DEBUG=="dev"
     }
   },
   methods:{
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
     getdata:function(){
       var _self=this;
       $.ajax({
           url:juli.URL.getsingle+"/"+utils.getparam("id"),
           type: 'get',
           dataType: 'json',
           cache:false
       })
       .done(function(res){
         res.islike=false;
         res.isplay=false;
         res.trackId=res.id;
         res.title=res.name;
         res.duration=res.length;
         res.sec=utils.formatSeconds(res.length);
         singlevm.singledata=res;
         utils.settitle(_self.singledata.name);
       })
     },
     try:function(){                      //试听
       var tryaudio=document.getElementById('try');
       tryaudio.play();
       this.singledata.isplay=true;
     },
     stoptry:function(){                      //试听暂停
       var tryaudio=document.getElementById('try');
       tryaudio.pause();
       this.singledata.isplay=false;
     },
     demand:function(){                      //点播-儿童馆-需先判断是否已经绑定设备
       utils.demand(this.singledata.id,this.singledata.content);
     },
     addfav: function () {               //添加收藏

       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         // alert("您还没有绑定设备，请去绑定设备！");
           $.alert("您还没有绑定设备，请去绑定设备！","", function () {
               // 回调
           });
         return false;
       }

       var _self=this;

       var json = {
         openId: utils.openid,
         trackId:_self.singledata.id,
         title: _self.singledata.name,
         duration: _self.singledata.length,
         url: _self.singledata.content,
         downloadUrl: _self.singledata.content,
         downloadSize: _self.singledata.size
       };
       $.ajax({
         url: juli.URL.addlike,
         type: 'post',
         contentType: 'application/json',
         data: JSON.stringify(json)
       })
       .done(function (res) {
          // alert("已添加收藏");
           $.toast("已添加收藏", "text");
          _self.singledata.islike=true;
       });
     },
     dellike:function(){                   //删除收藏
       var _self=this;

          var deldata={
            trackId:_self.singledata.id,
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
           // alert("删除收藏");
             $.toast("删除收藏", "text");
           _self.singledata.islike=false;
         })
     },
     download: function (item) {               //下载
       var _self = this;

       //如果没有绑定设备--提示并返回
       if (!utils.getdevice()){
         // alert("您还没有绑定设备，请去绑定设备！");
           $.alert("您还没有绑定设备，请去绑定设备！","", function () {
               // 回调
           });
         return false;
       }


       var json = [{
         title:this.singledata.name,
         id:this.singledata.id,
         duration: this.singledata.length,
         url:this.singledata.content,
         downloadUrl:this.singledata.srcurl,
         downloadSize: this.singledata.size
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
         type: 'post',
         async:false,
         contentType: 'application/json',
         data: JSON.stringify(_self.downloaddata)
       })
       .done(function (res) {
          console.log(res);
          $.toast("添加成功！", "text");
           //清除select状态
          utils.clearselect();
        });
     }
   }
})
