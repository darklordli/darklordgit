/**
 * Created by lixinwei on 16/8/4.
 */

"use strict";

wx.ready(function () {
    //这里放配置成功后就触发的内容
    wx.hideOptionMenu();

    /*wx.getNetworkType({
     success: function (res) {
     var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
     }
     });
     */
});

var audio = undefined;

function createAudio(){
    if (typeof(audio) == "undefined"){
        var a = audiojs.create(document.getElementsByTagName('audio'),{});
        audio = a[0];

    }
}
createAudio();


$(function () {
    // window.deviceId = $("input[name=deviceId]").val();
    // window.openId = $("input[name=openid]").val();
    window.configResult = false; //配置结果

    $("input[name=ssid]").change(function () {
        checkSsid();
        console.log(111);
    });

    var ssid= window.localStorage.getItem("ssid");
    var password= window.localStorage.getItem("ssidpassword");

    $("input[name=ssid]").val(ssid);
    $("input[name=password]").val(password);

    clientCreate(onConnectCallback);
});

function checkSsid() {
    var ssid = $("input[name=ssid]").val();
    if (ssid == "") {
        $("input[name=ssid]").parents(".weui_cell").addClass('weui_cell_warn');
        return false;
    } else {
        $("input[name=ssid]").parents(".weui_cell").removeClass('weui_cell_warn');
        return true;
    }
}

$("#btnConnect").click(function () {
    if (checkSsid()) {
        // audio.load('https://raw.githubusercontent.com/kolber/audiojs/master/mp3/bensound-dubstep.mp3');
        // audio.setVolume(0.0);
        // audio.play();

        var ssid = $("input[name=ssid]").val();
        var password = $("input[name=password]").val();
        var waitSeconds = 120;

        var sinVoiceSet = {
            openId: window.openId,
            deviceId: window.deviceId,
            ssid: ssid,
            password: password
        };
        console.log(sinVoiceSet);

        $.ajax({
            type: "POST",
            url: "http://wechat.roobo.com/storybox/sinvoice/set.do",
            // url: "http://localhost:8080/storybox/sinvoice/set.do",
            contentType: 'application/json',
            async: false,
            timeout: 4000,
            data: JSON.stringify(sinVoiceSet),
            success: function (msg) {
                var fileUrl = msg + "?date=" + new Date().getTime();
                var _src = $(audio.element).attr('src');

                if (_src !== undefined){
                    $(audio.element).attr('src', '');
                }
                audio.load(fileUrl);
                audio.play();

                for(var j = 0;j < (waitSeconds/2);j++) {
                    setTimeout(checkIfConnected,1000*j*2);
                }

                setTimeout(checkIfTimeout,1000*(waitSeconds+1));

                window.localStorage.setItem("ssid",ssid);
                window.localStorage.setItem("ssidpassword",password);

            },
            error: function (data) {
                //hideMaskLoading();
            }
        });
    }
});


function onConnectCallback() {
    console.log("this is callback");
    client.subscribe("storybox/" + window.deviceId + "/server");
}

function checkIfConnected() {
    console.log("checkIfConnected");
    if (!window.configResult) {
        // $("#loadingToast").show();
        // $('.weui_toast').remove();
        $.showLoading("配置中");
    }
    else {
        // $("#loadingToast").hide();
        // $("#toast").show();
        $.hideLoading();
        $.toast("配置成功", "text");

        setTimeout(function () {
            audio.pause();
            wx.closeWindow();
        }, 1000);
    }
}



function checkIfTimeout() {
    console.log("checkIfTimeout");
    if (!window.configResult) {
        // $("#loadingToast").hide();
        $.hideLoading();
        audio.pause();
        // $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
        //     $('#dialog2').off('click').hide();
        // });
        $.alert("配置超时，请重新连接", "配置超时");
    }
}

function onConfigWifi(configWifi) {
    if (configWifi == "success") {
        window.configResult = true;
    }
}

function playSinVoiceUrl(url, openId) {
    //alert(url);
    //alert(window.openId +"\r\n"+openId);
    if (window.openId == openId) {
        audio.pause();
        audio.setVolume(1.0);
        audio.load(url);
        audio.play();
    }
}
