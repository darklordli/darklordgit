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
    list: ""
  },
  ready: function () {
    this.getdata();
  },
  methods: {
    getdata: function () {
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
          })
          historyvm.list=res;

        })
    },
    demand:function(item){                      //点播-儿童馆
      //点播开始的时候先把所有元素的播放状态去掉
      var _self = this;
      $.each(_self.list,function(i,n){
          n.isplay=false;
      })
      var json = {
        title: item.title,
        duration : item.duration,
        url : item.url,
        downloadUrl : item.downloadUrl,
        downloadSize : item.downloadSize
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
         var json = {
           openId: utils.openid,
           trackId:res
         };
         $.ajax({
            url: juli.URL.play+"?mediaId=",
             type : "POST",
             contentType : 'application/json',
             async : false,
             //dataType : 'json',
             timeout : 4000,
             data : JSON.stringify(json),
             success:function(msg) {
                if (msg=="ok"){
                    alert("点播成功");
                    item.isplay=true;
                    _self.$set("item.isplay",true)
                }
                else {
                  alert("点播失败提示")
                }
               }
           });
      });
    },
    pause:function(item){                        //暂停-儿童馆
      var _self = this;
       pauseTrack();
       item.isplay=false;
    },
    addfav: function (item) {               //添加收藏
      item.openid = utils.openid
      console.log("addfav item:", JSON.stringify(item));
      var favJson = {
        openId: utils.openid,
        trackId: item.id,
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
         alert("已添加收藏");
      });
    },
    download: function (item) {               //下载
      var _self = this;
      var json = [{
        title: item.name,
        duration: item.duration,
        albumTitle: item.albumTitle,
        albumCoverSmallUrl: item.albumCoverSmallUrl,
        url: item.url,
        downloadUrl: item.downloadUrl,
        downloadSize: item.downloadSize
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
    },
    del: function (id) {                   //删除历史
      var deldata = {
        id: id,
        openId: utils.openid
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
          alert("删除成功");
          historyvm.getdata();
        })
    }
  }
})
