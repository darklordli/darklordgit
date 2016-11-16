/**
 * Created by lixinwei on 16/8/4.
 */


!(function ($, win, undefined) {
    "use strict";

    wx.ready(function () {
        //隐藏右上角菜单接口
        wx.hideOptionMenu();

        scan.init();
        console.log("success!");

    });

    wx.error(function (res) {
        JSON.stringify(res);
        alert(res.errMsg)
    });

    var scan = {
        doScan: function () {
            var _that = this;
            wx.scanQRCode({
                needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果

                }
            });
        },
        bindEvent: function () {
            var _that = this;
            $('.J-scan').on('click', function(event) {
                event.preventDefault();
                _that.doScan();

            });
        },
        init: function () {
            var _that = this;
            _that.bindEvent();
            
        }
    };




})(jQuery, window);