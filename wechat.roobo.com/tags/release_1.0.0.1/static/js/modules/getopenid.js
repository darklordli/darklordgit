/**
 * Created by lixinwei on 16/8/8.
 */


!(function ($, win, undefined) {
    "use strict";
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
    var _url = location.href.split('#')[0];
    var openUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9c5f793c4eee9683&redirect_uri="+ _url +"&response_type=code&scope=snsapi_base#wechat_redirect";
    var codeidUrl = 'http://wechat.roobo.com/storybox/roobo/getOpenId.do';
    // var codeidUrl = 'http://localhost:8080/storybox/roobo/getOpenId.do';
    var wxcode = setUrl.get('code', pageUrl);
    window.openId = '';
    window.deviceId = '';

    getOpenId(codeidUrl, wxcode);

    function  getOpenId(_ajaxUrl, _code) {
        $.ajax({
            url: _ajaxUrl,
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                code: _code
            }
        })
            .done(function (res) {
                console.log(res);
                if(res.error === '0'){
                    window.location.href = openUrl;
                }else {
                    localStorage.setItem('openId', res.openid);
                    window.openId = res.openid;
                    getDeviceId(res.openid);
                }

            })
            .fail(function () {
                console.log("error");
            });

    }


    // var localOpenid = localStorage.getItem('openId');
    // console.log(getDeviceId(localOpenid));

    function getDeviceId(opid) {
        $.ajax({
            url: 'http://wechat.roobo.com/storybox/familymember/getdeviceid.do',
            // url: 'http://localhost:8080/storybox/familymember/getdeviceid.do',
            type: 'GET',
            dataType: 'html',
            async: false,
            data: {
                openId: opid
            }
        })
            .done(function (res) {
                window.deviceId = res;
                if (window.deviceId ==='' || window.deviceId === undefined){
                    window.location.href = 'doscan_info.html';
                }
            })
            .fail(function () {
                console.log("error");
            });
    }



})(jQuery, window);