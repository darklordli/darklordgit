/**
 * @description: roobo 微信公众号接口配置
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/7/14
 */

 "use strict";
 var juli = window.juli || {};
 var DEBUG=false;

 if (DEBUG){
   window.juli.host = "http://172.17.236.100";           //开发环境接口地址
   window.juli.root="http://dwn.roo.bo/appimg/";                 //rooboAI系统测试地址
   window.juli.search="http://172.17.132.97";                 //搜索接口
 }
 else{
   window.juli.host = "http://wechat.roobo.com";           //正式环境接口地址
   window.juli.root="http://test-www.roobo.net";                 //rooboAI系统正式地址
   window.juli.search="http://wechat.roobo.com";                 //搜索接口
 }

juli.URL = {

    //资源相关
    cate:window.juli.host + "/resource/getCategroy",              //大类列表
    subcate:window.juli.host + "/resource/getSubCategroy",           //子类列表
    getsingle:window.juli.host + "/resource/findById",                 //单个资源
    download :window.juli.host + "/storybox/track/download.do",       //单个媒体下载
    downloadlist :window.juli.host + "/resource/addTrackBatch",       //整个资源列表下载
    reset :window.juli.host + "/resource/ResetTrackList",           //

    //搜索相关
    search: window.juli.search + "/resource/EsSearch/",      //ES搜索
    savesearch:window.juli.host + "/resource/insertSearchHistory",          //保存搜索历史
    getsearch:window.juli.host + "/resource/getSearchHistory",             //查询搜索历史
    clearsearch:window.juli.host + "/resource/clearSearchHistory",          //清空搜索历史

    //收藏相关
    getlike:window.juli.host + "/storybox/favorite/getlist.do",           //获取收藏列表
    addlike:window.juli.host + "/storybox/favorite/save.do",              //添加收藏列表
    dellike:window.juli.host + "/storybox/favorite/delete.do",             //删除收藏列表

    //点播历史相关
    play:      window.juli.host + "/storybox/roobo/save.do",              //点播
    gethistory:window.juli.host + "/storybox/demand/getlist.do",           //获取用户的点播列
    delhistory:window.juli.host + "/storybox/demand/delete.do",           //点播删除
    demand:    window.juli.host + "/storybox/demand/online/save.do",              //点播

     //家庭成员相关
    getdevice:window.juli.host + "/storybox/familymember/getdeviceid.do",           //获取用户绑定的设备号
    getmember:window.juli.host + "/storybox/familymember/getlist.do",              //获取所有家庭成员
    join:     window.juli.host + "/storybox/familymember/join.do",                 //加入家庭
    quit:     window.juli.host + "/storybox/familymember/quit.do",                 //退出家庭
    editname: window.juli.host + "/storybox/familymember/modifynickname.do",       //修改家庭成员昵称

    //设备相关
    getcode: window.juli.host + "/storybox/boxqrticket/get.do",                   //获取设备二维码信息
    setvolume: window.juli.host + "/storybox/boxinfo/setvolume.do",                //音量调节 0-40
    getinfo: window.juli.host + "/storybox/boxinfo/get.do",                      //获取设备信息
    getversion: window.juli.host + "/storybox/boxinfo/getversion.do",             //获取固件最新版本号

    //播放列表相关
    add:        window.juli.host + "/storybox/track/add.do",                      //添加资源到资源信息表
    getlist:    window.juli.host + "/storybox/track/getlist.do",                   //获取播放列表
    addlist:    window.juli.host + "/storybox/tracklist/add.do",                   //添加资源到播放列表
    gettracklist:    window.juli.host + "/storybox/tracklist/getlistsimple.do",   //获取设备二维码信息
    remove:     window.juli.host + "/storybox/track/remove.do",                   //删除资源到播放列表
    singleview: window.juli.host + "/storybox/track/getid.do",                     //拿到资源ID
    sync: window.juli.host + "/storybox/roobo/tracklist/syncTrackList.do"                           //同步播放列表
  };
