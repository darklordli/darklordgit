/**
 * @description: px2rem
 * @author: lixinwei
 * @version: V1
 * @update: 16/1/14
 */

"use strict";

!(function(win){

    var dpr, rem, scale, tid;
    var doc = win.document;
    var docEl = doc.documentElement;
    var fontEl = doc.createElement('style');
    var metaEl = doc.querySelector('meta[name="viewport"]');


    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/(iphone|ipod|ipad)/gi);
        var isMobile = isAndroid || isIPhone;  // 粗略的判断
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }


    // 设置data-dpr属性，留作的css hack之用
    docEl.setAttribute('data-dpr', dpr);

    if (metaEl) {
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ',' + 'minimum-scale=' + scale + ', user-scalable=no');


    } else{
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');

        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }


    function refRem(){
        var domWidth = docEl.getBoundingClientRect().width;
        if ( domWidth / dpr > 750 ) {
            domWidth = 750 * dpr;
        }
        rem = domWidth / 10;
        docEl.style.fontSize = rem + 'px';
        docEl.firstElementChild.appendChild(fontEl);
        fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';
    }

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refRem, 300);

    }, false);

    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refRem, 300);
        }
    }, false);

    refRem();

    // 给js调用的，某一dpr下rem和px之间的转换函数
    win.rem2px = function(v) {
        v = parseFloat(v);
        return v * rem;
    };
    win.px2rem = function(v) {
        v = parseFloat(v);
        return v / rem;
    };

    win.dpr = dpr;
    win.rem = rem;


})(window);