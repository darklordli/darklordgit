/**
 * Created by lixinwei on 16/8/6.
 */


!(function ($, win, undefined) {
    "use strict";

    wx.ready(function () {
        //这里放配置成功后就触发的内容
        wx.hideOptionMenu();
        
        doConnect();
    });

    function doConnect(){
        var key = "MTIzNDU2Nzg5MDEyMzQ1Ng=="; //1234567890123456 加码

        wx.invoke('configWXDeviceWiFi', {
            key:key
        }, function(res) {
            wx.closeWindow();

        });
    }

    //从后台获取加码
    function getMessage(s){

        var result = "";
        $.ajax({
            type:"Get",
            url:"../encode.do?sourceString="+s,
            async:false,
            cache:false,
            success:function(msg){
                result = msg;
            }
        });

        return result;
    }


})(jQuery, window);