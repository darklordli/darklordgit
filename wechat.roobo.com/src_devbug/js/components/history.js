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

historyvm = new Vue({
  el: '#j_history',
  data: {
    loading:true,
    list: ""
  },
  ready: function () {
    this.getdata();
  },
  methods: {
    getdata: function () {
      var _self = this;
      $.ajax({
        url: juli.URL.gethistory,
        type: 'get',
        dataType: 'json',
        cache: false,
        data: {
          openId: utils.openid
        }
      })
        .done(function (res) {
          console.log(res);
          $.each(res,function(i,n){
            n.sec=utils.formatSeconds(n.duration);
            n.isplay=false;
			      n.islike=false;
          })
          _self.list=res;
         _self.loading=false;
        })
    },
    demand:function(item){                      //收藏列表-我的
      var _self = this;

       //如果故事机不在线--则提示并返回
      if (!utils.online()){
          $.toast("故事机不在线", "text");
         return false;
       }

      var json = {
         openId: utils.openid,
         trackId:item.trackId
       };
      $.ajax({
          url:juli.URL.getsingle+"/"+item.trackId,
          type: 'get',
          dataType: 'json',
          cache:false,
          async:false,
      })
      .done(function(res){
        json.url=res.content
      })
      $.ajax({
         url: juli.URL.demand+"?mediaId=",
          type : "POST",
          contentType : 'application/json',
          async : false,
          //dataType : 'json',
          timeout : 4000,
          data : JSON.stringify(json),
          success:function(msg) {
             if (msg=="0"){
               $.toast("点播成功！", "text");
             }
             else {
               $.toast("点播失败", "text");
             }
            }
        });
    },

    addfav: function (item) {               //添加收藏
      item.openid = utils.openid
      console.log("addfav item:", JSON.stringify(item));
      var favJson = {
        openId: utils.openid,
        trackId: item.trackId,
        title: item.title,
        coverSmallUrl: item.coverSmallUrl,
        duration: item.duration,
        albumTitle: item.albumTitle,
        albumCoverSmallUrl: item.albumCoverSmallUrl,
        url: item.url,
        downloadUrl: item.downloadUrl,
        downloadSize: item.downloadSize,
      };

      $.ajax({
        url: juli.URL.addlike,
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(favJson)
      })
      .done(function (res) {
         console.log(res);
         // alert("已添加收藏");
          $.toast("已添加收藏", "text");
          item.islike=true;

      });
    },
    dellike:function(item){                   //删除收藏
         var deldata={
           trackId:item.trackId,
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
          item.islike=false;
        })
    },
    download: function (item) {               //下载
      var _self = this;
      var json = [{
        title: item.title,
        id:item.trackId,
        duration: item.duration,
        albumTitle: item.albumTitle,
        albumCoverSmallUrl: item.albumCoverSmallUrl,
        url: item.url,
        downloadUrl: item.downloadUrl,
        downloadSize: item.downloadSize
      }];
      console.log(json);
      $.ajax({
        url: juli.URL.download+"?deviceId="+utils.getdevice()+"&id="+utils.trackListId()+"&name="+encodeURI(encodeURI(utils.tracklist)),
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(json)
      })
      .done(function (res) {
         console.log(res);
         // alert("添加成功！");
          $.toast("添加成功！", "text");
       });
    },
    del: function (item) {                   //删除历史
      var _self = this;
      var deldata = {
        openId: utils.openid,
        trackId: item.trackId,
        deviceId:utils.getdevice()
      }
      console.log(deldata);
      $.ajax({
        url: juli.URL.delhistory,
        type: 'post',
        cache: false,
        async: false,
        contentType: 'application/json',
        data: JSON.stringify(deldata)
      })
        .done(function (res) {
          // alert("删除成功");
         $.toast("删除成功", "text");
          _self.getdata();
        })
    }
  }
})
