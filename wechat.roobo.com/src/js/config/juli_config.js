/**
 * @description: roobo 微信公众号接口配置
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/7/14
 */

 "use strict";
 var juli = window.juli || {};
 var DEBUG="babateng";

 if (DEBUG=="dev"){
   window.juli.host = "http://172.17.232.67";           //开发环境接口地址
   window.juli.root="http://dwn.roo.bo/appimg/";                 //rooboAI系统测试地址
   window.juli.search="http://172.17.232.67";                 //搜索接口
   window.juli.search="http://172.17.232.67";                 //搜索接口
   window.juli.dir="/storybox";                             //接口目录
 }

 else if (DEBUG=="zhineng"){
   window.juli.host = "http://dev.storybox.roobo.com";           //测试环境接口地址
   window.juli.root="http://test-www.roobo.net";                 //rooboAI系统正式地址
   window.juli.search="http://dev.storybox.roobo.com";                 //测试环境搜索接口
   window.juli.appid="wxf45ec14451d07bfd";                                          //测试环境appid
   window.juli.MQTT="101.200.151.229";                               //测试环境mqtt
   window.juli.MQTTPORT=8083;                               //mqtt端口
   window.juli.dir="/storybox";                             //接口目录
 }

 else if (DEBUG=="zhiling"){
   window.juli.host = "http://wechat.roobo.com";           //正式环境接口地址
   window.juli.root="http://test-www.roobo.net";                 //rooboAI系统正式地址
   window.juli.search="http://wechat.roobo.com";                 //生产环境appid
   window.juli.appid="wx9c5f793c4eee9683";
   window.juli.MQTT="storybox.mqtt.roobo.com";                               //志玲公众号mqtt
   window.juli.MQTTPORT=8083;                               //mqtt端口
   window.juli.dir="/storybox";                             //接口目录
 }
 else if (DEBUG=="babateng"){
   window.juli.host = "http://wechat.roobo.com";           //正式环境接口地址
   window.juli.root="http://wechat.roobo.com/";                 //rooboAI系统正式地址
   window.juli.search="http://wechat.roobo.com";                 //生产环境appid
   window.juli.appid="wxf4bbd1868bb126fc";
   window.juli.MQTT="storybox.mqtt.roobo.com";                               //测试环境mqtt
   window.juli.MQTTPORT=8084;                               //mqtt端口
   window.juli.dir="/bbtbox";                             //接口目录
 }

juli.URL = {
    codeid:window.juli.host + window.juli.dir + '/roobo/getOpenId.do',       //取openid
    getSign:window.juli.host+ window.juli.dir + '/roobo/getSign.do',          //取微信JS-SDK签名
    sinvoice:window.juli.host+ window.juli.dir + '/sinvoice/set.do',          //声波配网

    //资源相关
    cate:window.juli.host + "/resource/getCategroy",              //大类列表
    subcate:window.juli.host + "/resource/getSubCategroy",           //子类列表
    getsingle:window.juli.host + "/resource/findById",                 //单个资源
    download :window.juli.host + window.juli.dir +"/track/download.do",       //单个媒体下载
    downloadlist :window.juli.host + window.juli.dir +"/roobo/tracklist/addTrackBatch.do",       //整个资源列表下载
    reset :window.juli.host + "/resource/ResetTrackList",           //
    reset400 :window.juli.host + window.juli.dir +"/roobo/tracklist/resetTrackList.do",           //

    //搜索相关
    search: window.juli.search + "/resource/EsSearch/",      //ES搜索
    savesearch:window.juli.host + "/resource/insertSearchHistory",          //保存搜索历史
    getsearch:window.juli.host + "/resource/getSearchHistory",             //查询搜索历史
    clearsearch:window.juli.host + "/resource/clearSearchHistory",          //清空搜索历史

    //收藏相关
    getlike:window.juli.host + window.juli.dir +"/favorite/getlist.do",           //获取收藏列表
    addlike:window.juli.host + window.juli.dir +"/favorite/save.do",              //添加收藏列表
    dellike:window.juli.host + window.juli.dir +"/favorite/delete.do",             //删除收藏列表

    //点播历史相关
    play:      window.juli.host + window.juli.dir +"/roobo/save.do",              //点播
    gethistory:window.juli.host + window.juli.dir +"/demand/getlist.do",           //获取用户的点播列
    delhistory:window.juli.host + window.juli.dir +"/demand/delete.do",           //点播删除
    demand:    window.juli.host + window.juli.dir +"/demand/online/save.do",              //点播

     //家庭成员相关
    getdevice:window.juli.host +window.juli.dir +"/familymember/getdeviceid.do",           //获取用户绑定的设备号
    getmember:window.juli.host +window.juli.dir +"/familymember/getlist.do",              //获取所有家庭成员
    join:     window.juli.host +window.juli.dir +"/familymember/join.do",                 //加入家庭
    quit:     window.juli.host +window.juli.dir +"/familymember/quit.do",                 //退出家庭
    editname: window.juli.host +window.juli.dir +"/familymember/modifynickname.do",       //修改家庭成员昵称

    //设备相关
    getcode: window.juli.host +window.juli.dir +"/boxqrticket/get.do",                   //获取设备二维码信息
    setvolume: window.juli.host +window.juli.dir +"/boxinfo/setvolume.do",                //音量调节 0-40
    getinfo: window.juli.host +window.juli.dir +"/boxinfo/get.do",                      //获取设备信息
    getversion: window.juli.host +window.juli.dir +"/boxinfo/getversion.do",             //获取固件最新版本号

    //播放列表相关
    add:        window.juli.host +window.juli.dir +"/track/add.do",                      //添加资源到资源信息表
    getlist:    window.juli.host +window.juli.dir +"/track/getpage.do",                   //获取播放列表
    addlist:    window.juli.host +window.juli.dir +"/tracklist/add.do",                   //添加资源到播放列表
    gettracklist:    window.juli.host +window.juli.dir +"/tracklist/getlistsimple.do",   //获取设备二维码信息
    remove:     window.juli.host +window.juli.dir +"/track/remove.do",                   //删除资源到播放列表
    singleview: window.juli.host +window.juli.dir +"/track/getid.do",                     //拿到资源ID
    sync: window.juli.host +window.juli.dir +"/roobo/tracklist/syncTrackList.do",           //同步播放列表
    getplaytracklist:window.juli.host +window.juli.dir +"/tracklist/getlistview.do",   //获取设备播放列表
    getlistinfo:window.juli.host +window.juli.dir +"/tracklist/get.do",                  //获取设备播放列表
    inital:window.juli.host +window.juli.dir +"/tracklist/inital.do"                     //初始化

  };
