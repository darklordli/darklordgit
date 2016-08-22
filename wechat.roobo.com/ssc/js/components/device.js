/**
 * @description: device
 * @author: lixinwei
 * @version: V1
 * @update: 15/11/4
 */

//设备平台
//Device.os.phone
//Device.os.tablet

//设备系统
//Device.os.ios
//Device.os.android
//Device.os.webos
//Device.os.blackberry
//Device.os.bb10
//Device.os.rimtabletos

//设备类型
//Device.os.iphone
//Device.os.ipad
//Device.os.ipod
//Device.os.touchpad
//Device.os.kindle
//Device.os.uc

//浏览器类型
//Device.browser.chrome
//Device.browser.firefox
//Device.browser.safari
//Device.browser.webview
//Device.browser.silk
//Device.browser.playbook
//Device.browser.ie

//屏幕旋转
//Device.os.protrait  //横屏
//Device.os.landscape //竖屏

//iPhone
//Device.os.phone
//Device.os.iphone
//Device.os.ios

//版本号
//Device.os.version
//Device.os.ucversion
//Device.browser.version

!(function () {

    function device(ua) {
        var os = this.os = {},
            browser = this.browser = {},

            webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
            android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
            osx = !!ua.match(/\(Macintosh\; Intel /),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            touchpad = webos && ua.match(/TouchPad/),
            kindle = ua.match(/Kindle\/([\d.]+)/),
            silk = ua.match(/Silk\/([\d._]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
            bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
            playbook = ua.match(/PlayBook/),
            uc = ua.match(/UCBrowser\/([\w.\s]+)/),
            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            firefox = ua.match(/Firefox\/([\d.]+)/),
            ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
            webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
            safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
            orientation = Math.abs(window.orientation);

        if (browser.webkit = !!webkit) browser.version = webkit[1];

        if (android) os.android = true, os.version = android[2];
        if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
        if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        if (webos) os.webos = true, os.version = webos[2];
        if (touchpad) os.touchpad = true;
        if (blackberry) os.blackberry = true, os.version = blackberry[2];
        if (bb10) os.bb10 = true, os.version = bb10[2];
        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
        if (playbook) browser.playbook = true;
        if (uc) os.uc = true, os.ucversion = uc[1];
        if (kindle) os.kindle = true, os.version = kindle[1];
        if (silk) browser.silk = true, browser.version = silk[1];
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
        if (orientation !== 90) os.protrait = true;
        if (orientation === 90) os.landscape = true;

        if (chrome) browser.chrome = true, browser.version = chrome[1];
        if (firefox) browser.firefox = true, browser.version = firefox[1];
        if (ie) browser.ie = true, browser.version = ie[1];
        if (safari && (osx || os.ios)) {
            browser.safari = true;
            if (osx) browser.version = safari[1]
        }
        if (webview) browser.webview = true;

        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
        (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
        os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
        (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
        (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
    }

    window.Device = new device(navigator.userAgent);


    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(function() {
            return Device;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Device;
    } else {
        window.Device = Device;
    }

})();