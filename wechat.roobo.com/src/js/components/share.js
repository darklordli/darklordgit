/**
 * Created by lixinwei on 16/8/6.
 */


!(function ($, win, undefined) {
    "use strict";
    var wcUrl = {
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
    var _did = wcUrl.get('did', pageUrl);
    var $img = $('#shareImg');
    var _src = window.juli.host + window.juli.dir + "/download/qrticket/"+ wcUrl.get('did', pageUrl) +".png?t="+ new Date().getTime();
    $img.attr('src',_src);


})(jQuery, window);
