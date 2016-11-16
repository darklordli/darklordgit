/**
 * @description: wx.config
 * @author: lixinwei
 * @version: V1
 * @update: 16/8/4
 */

!(function ($, win, undefined) {

    var setUrl = {
        /**
         * 将URL中的参数解析为对象
         * @param  {String} url 解析的URL字符串
         * @return {Object}     返回结果
         */
        parse: function(url){
            var re = /[\?&]([^\?&=]+)=([^&]+)/g, matcher = null, items = {};

            url = url || window.location.search;

            while (null != (matcher = re.exec(url))) {
                items[matcher[1]] = decodeURIComponent(matcher[2]);
            }

            return items;
        },
        /**
         * 获取URL中指定参数值
         * @param  {String} name 指定参数名
         * @param  {String} url  指定URL，可靠默认为当前URL
         * @return {String}      返回指定参数名值
         */
        get: function(name, url){
            var o = this.parse(url);

            return (o[name]) ? o[name] : '';
        },
        check: function(url){
            var reg = /^https?:\/\/[a-z]+\.fenqile\.com\//i,
                ret = true;

            if(/^https?/.test(url)){
                ret = reg.test(url);
            }
            return ret;
        }
    };

    var pageUrl = window.location.href;
    var obj = setUrl.parse(pageUrl);
    var _url = location.href.split('#')[0];
    var currUrl = encodeURIComponent(_url);
    var openUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+window.juli.appid+"&redirect_uri="+ _url +"&response_type=code&scope=snsapi_base#wechat_redirect";
    var wxcode = setUrl.get('code', pageUrl);

    getSign(wxcode, _url);

    function getSign(_code, _dataUrl) {

        $.ajax({
            url: juli.URL.getSign,
            type: 'POST',
            dataType: 'json',
            data: {
                code: _code,
                url: _dataUrl
            }
            })
            .done(function (res) {
                console.log(res);
                if(res.error === '0'){
                    window.location.href = openUrl;
                }else {
                    wx.config({
                        beta: true,
                        debug: false,
                        appId: res.appid,
                        timestamp: Number(res.timestamp),
                        nonceStr: res.nonceStr,
                        signature: res.signature,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone',
                            'hideMenuItems',
                            'showMenuItems',
                            'hideAllNonBaseMenuItem',
                            'showAllNonBaseMenuItem',
                            'translateVoice',
                            'startRecord',
                            'stopRecord',
                            'onVoiceRecordEnd',
                            'playVoice',
                            'onVoicePlayEnd',
                            'pauseVoice',
                            'stopVoice',
                            'uploadVoice',
                            'downloadVoice',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage',
                            'getNetworkType',
                            'openLocation',
                            'getLocation',
                            'hideOptionMenu',
                            'showOptionMenu',
                            'closeWindow',
                            'scanQRCode',
                            'chooseWXPay',
                            'openProductSpecificView',
                            'addCard',
                            'chooseCard',
                            'openCard',

                            'configWXDeviceWiFi'
                        ]
                    });
                }
            })
            .fail(function () {
                console.log("error");
            });
    }

})(jQuery, window);
