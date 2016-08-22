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
      openid:window.openId,            //openid
      tracklist:"播放列表1",
      getdevice:function(){                            //获取deviceid
        var deviceid;
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
          })
          return deviceid;
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
        }
      };
