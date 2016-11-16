/**
 * @description: roobo 工具类js
 * @author: libaojun@roo.bo
 * @version: V2
 * @update: 16/4/19
 */

/**
 *
 * @name    util.js
 * @param   {String}    名称
 * @param   {Function}  方法
 */

    var utils = {
      pagesize:10,
      //openid:"oTv0AxBDYyBEPLWBm9sfX9Uml6J8",            //openid
      openid:window.openId,                           //openid
      tracklist:"播放列表",
      trackListId:function(){                           //拿到播放列表ID
        var trackListId;
        $.ajax({
            url :juli.URL.gettracklist,
            type:'get',
            async:false,
            cache: false,
            data:{
              deviceId:utils.getdevice()
            }
        })
        .done(function(res){
          console.log(res);
          //如果查到有播放列表，则返回播放列表，没有则先创建列表，然后递归拿一次播放列表
          if (!res.length){
            utils.createtrackList();
            utils.trackListId();
          }
          trackListId = res[0].id;
          })
          return trackListId;
      },
      createtrackList:function(){                        //
        var newjson = {
          id:0,
          deviceId: utils.getdevice(),
          name:"默认列表",
          coverSmallUrl:""
        };
        console.log(newjson)
        $.ajax({
          url: juli.URL.addlist,
          type: 'post',
          contentType: 'application/json',
          data: JSON.stringify(newjson)
        })
        .done(function(res){
          console.log(res);
        });
      },
      getdevice:function(){                            //获取deviceid
        var deviceid;
        var openId=utils.openid;

        $.ajax({
            url :juli.URL.getdevice,
            type:'get',
            async:false,
            cache: false,
            data:{
              openId:utils.openid
            }
        })
        .done(function(res){
          console.log(res);
          deviceid = res;
          window.deviceId=res;
          })
          return deviceid;
        },
        demand:function(trackId,url){               //点播的通用方法
          //如果没有绑定设备--提示并返回
          if (!utils.getdevice()){
            $.alert("您还没有绑定设备，请去绑定设备！","", function () {
         // 回调
            });
            return false;
          }
          //如果故事机不在线--则提示并返回
         if (!utils.online()){
            // alert("故事机不在线！");
             $.toast("故事机不在线", "text");
            return false;
          }

          var json = {
            openId: utils.openid,
            trackId:trackId,
            url:url
          };
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
      play:function(trackId){                            //播放通用方法
        var playJson = {
          openId: utils.openid,
          trackId:trackId
        };
        console.log(JSON.stringify(playJson));
        $.ajax({
          url: juli.URL.play+"?mediaId="+"",
          type: 'POST',
          contentType: 'application/json',
          cache: false,
          data: JSON.stringify(playJson),
        })
        .done(function (res) {
            console.log(res);
        });
      },
      getparam :function(name){      //获取url参数
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if(results == null)
          return "";
        else
          return decodeURIComponent(results[1].replace(/\+/g, " "));
      },
      formatSeconds : function(value){
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if(theTime > 60) {
            theTime1 = parseInt(theTime/60);
            theTime = parseInt(theTime%60);
                if(theTime1 > 60) {
                theTime2 = parseInt(theTime1/60);
                theTime1 = parseInt(theTime1%60);
                }
        }
            var result = ""+parseInt(theTime)+"秒";
            if(theTime1 > 0) {
            result = ""+parseInt(theTime1)+"分"+result;
            }
            if(theTime2 > 0) {
            result = ""+parseInt(theTime2)+"小时"+result;
            }
        return result;
      },
      online:function(){                              //设备是否在线
        var isonline;
        $.ajax({
            url :juli.URL.getinfo,
            type:'get',
            async : false,
            cache:false,
            data:{
              deviceId:utils.getdevice()
            }
        })
        .done(function(res){
          isonline = res.online;
          })
          return isonline;
        },
      sync:function(){                              //使故事机同步播放列表
        var json={
          id:utils.trackListId(),
          deviceId:utils.getdevice(),
          name:utils.tracklist
        }
       $.ajax({
           url:juli.URL.sync,
           type: 'post',
           cache:false,
           async:false,
           contentType : 'application/json',
           data:JSON.stringify(json)
       })
       .done(function(res){
         console.log(res);
       })
      },
      settitle:function(name){                   //解决iosbug
          console.log(name)
          var $body = $('body');
           document.title =name;
           var $iframe = $("<iframe style='display:none;' src='/favicon.ico'></iframe>");
           $iframe.on('load',function() {
             setTimeout(function() {
               $iframe.off('load').remove();
             }, 0);
           }).appendTo($body);
        },

      };
