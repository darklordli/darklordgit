!function(e,t,a){var s=function(){for(var e=new RegExp("audio(.min)?.js.*"),t=document.getElementsByTagName("script"),a=0,s=t.length;a<s;a++){var r=t[a].getAttribute("src");if(e.test(r)){var i=r.split("/");return i.pop(),i.join("/")+"/"}}return""}();a[e]={instanceCount:0,instances:{},flashSource:'      <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="$1" width="1" height="1" name="$1" style="position: absolute; left: -1px;">         <param name="movie" value="$2?playerInstance='+e+'.instances[\'$1\']&datetime=$3">         <param name="allowscriptaccess" value="always">         <embed name="$1" src="$2?playerInstance='+e+'.instances[\'$1\']&datetime=$3" width="1" height="1" allowscriptaccess="always">       </object>',settings:{autoplay:!1,loop:!1,preload:!0,imageLocation:s+"player-graphics.gif",retinaImageLocation:s+"player-graphics@2x.gif",swfLocation:s+"audiojs.swf",useFlash:function(){var e=document.createElement("audio");return!(e.canPlayType&&e.canPlayType("audio/mpeg;").replace(/no/,""))}(),hasFlash:function(){if(navigator.plugins&&navigator.plugins.length&&navigator.plugins["Shockwave Flash"])return!0;if(navigator.mimeTypes&&navigator.mimeTypes.length){var e=navigator.mimeTypes["application/x-shockwave-flash"];return e&&e.enabledPlugin}try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash");return!0}catch(t){}return!1}(),createPlayer:{markup:'          <div class="play-pause">             <p class="play"></p>             <p class="pause"></p>             <p class="loading"></p>             <p class="error"></p>           </div>           <div class="scrubber">             <div class="progress"></div>             <div class="loaded"></div>           </div>           <div class="time">             <em class="played">00:00</em>/<strong class="duration">00:00</strong>           </div>           <div class="error-message"></div>',playPauseClass:"play-pause",scrubberClass:"scrubber",progressClass:"progress",loaderClass:"loaded",timeClass:"time",durationClass:"duration",playedClass:"played",errorMessageClass:"error-message",playingClass:"playing",loadingClass:"loading",errorClass:"error"},css:'        .audiojs audio { position: absolute; left: -1px; }         .audiojs { width: 460px; height: 36px; background: #404040; overflow: hidden; font-family: monospace; font-size: 12px;           background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #444), color-stop(0.5, #555), color-stop(0.51, #444), color-stop(1, #444));           background-image: -moz-linear-gradient(center top, #444 0%, #555 50%, #444 51%, #444 100%);           -webkit-box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3); -moz-box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3);           -o-box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3); box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3); }         .audiojs .play-pause { width: 25px; height: 40px; padding: 4px 6px; margin: 0px; float: left; overflow: hidden; border-right: 1px solid #000; }         .audiojs p { display: none; width: 25px; height: 40px; margin: 0px; cursor: pointer; }         .audiojs .play { display: block; }         .audiojs .scrubber { position: relative; float: left; width: 280px; background: #5a5a5a; height: 14px; margin: 10px; border-top: 1px solid #3f3f3f; border-left: 0px; border-bottom: 0px; overflow: hidden; }         .audiojs .progress { position: absolute; top: 0px; left: 0px; height: 14px; width: 0px; background: #ccc; z-index: 1;           background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #ccc), color-stop(0.5, #ddd), color-stop(0.51, #ccc), color-stop(1, #ccc));           background-image: -moz-linear-gradient(center top, #ccc 0%, #ddd 50%, #ccc 51%, #ccc 100%); }         .audiojs .loaded { position: absolute; top: 0px; left: 0px; height: 14px; width: 0px; background: #000;           background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #222), color-stop(0.5, #333), color-stop(0.51, #222), color-stop(1, #222));           background-image: -moz-linear-gradient(center top, #222 0%, #333 50%, #222 51%, #222 100%); }         .audiojs .time { float: left; height: 36px; line-height: 36px; margin: 0px 0px 0px 6px; padding: 0px 6px 0px 12px; border-left: 1px solid #000; color: #ddd; text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5); }         .audiojs .time em { padding: 0px 2px 0px 0px; color: #f9f9f9; font-style: normal; }         .audiojs .time strong { padding: 0px 0px 0px 2px; font-weight: normal; }         .audiojs .error-message { float: left; display: none; margin: 0px 10px; height: 36px; width: 400px; overflow: hidden; line-height: 36px; white-space: nowrap; color: #fff;           text-overflow: ellipsis; -o-text-overflow: ellipsis; -icab-text-overflow: ellipsis; -khtml-text-overflow: ellipsis; -moz-text-overflow: ellipsis; -webkit-text-overflow: ellipsis; }         .audiojs .error-message a { color: #eee; text-decoration: none; padding-bottom: 1px; border-bottom: 1px solid #999; white-space: wrap; }                 .audiojs .play { background: url("$1") -2px -1px no-repeat; }         .audiojs .loading { background: url("$1") -2px -31px no-repeat; }         .audiojs .error { background: url("$1") -2px -61px no-repeat; }         .audiojs .pause { background: url("$1") -2px -91px no-repeat; }                 @media only screen and (-webkit-min-device-pixel-ratio: 2),           only screen and (min--moz-device-pixel-ratio: 2),           only screen and (min-moz-device-pixel-ratio: 2),           only screen and (-o-min-device-pixel-ratio: 2/1),           only screen and (min-device-pixel-ratio: 2) {             .audiojs .play, .audiojs .loading, .audiojs .error, .audiojs .pause {               background-image: url("$2");               -webkit-background-size: 30px 120px;               -moz-background-size: 30px 120px;               -o-background-size: 30px 120px;               background-size: 30px 120px;             }         }                 .playing .play, .playing .loading, .playing .error { display: none; }         .playing .pause { display: block; }                 .loading .play, .loading .pause, .loading .error { display: none; }         .loading .loading { display: block; }                 .error .time, .error .play, .error .pause, .error .scrubber, .error .loading { display: none; }         .error .error { display: block; }         .error .play-pause p { cursor: auto; }         .error .error-message { display: block; }',trackEnded:function(e){},flashError:function(){var t=this.settings.createPlayer,s=r(t.errorMessageClass,this.wrapper),i='Missing <a href="http://get.adobe.com/flashplayer/">flash player</a> plugin.';this.mp3&&(i+=' <a href="'+this.mp3+'">Download audio file</a>.'),a[e].helpers.removeClass(this.wrapper,t.loadingClass),a[e].helpers.addClass(this.wrapper,t.errorClass),s.innerHTML=i},loadError:function(t){var s=this.settings.createPlayer,i=r(s.errorMessageClass,this.wrapper);a[e].helpers.removeClass(this.wrapper,s.loadingClass),a[e].helpers.addClass(this.wrapper,s.errorClass),i.innerHTML='Error loading: "'+this.mp3+'"'},init:function(){var t=this.settings.createPlayer;a[e].helpers.addClass(this.wrapper,t.loadingClass)},loadStarted:function(){var t=this.settings.createPlayer,s=r(t.durationClass,this.wrapper),i=Math.floor(this.duration/60),n=Math.floor(this.duration%60);a[e].helpers.removeClass(this.wrapper,t.loadingClass),s.innerHTML=(i<10?"0":"")+i+":"+(n<10?"0":"")+n},loadProgress:function(e){var t=this.settings.createPlayer,a=r(t.loaderClass,this.wrapper);a.style.width=Math.round(100*e)+"%"},playPause:function(){this.playing?this.settings.play():this.settings.pause()},play:function(){var t=this.settings.createPlayer;a[e].helpers.removeClass(this.wrapper,t.errorClass),a[e].helpers.addClass(this.wrapper,t.playingClass)},pause:function(){var t=this.settings.createPlayer;a[e].helpers.removeClass(this.wrapper,t.playingClass)},updatePlayhead:function(e){var t=this.settings.createPlayer,a=r(t.progressClass,this.wrapper);a.style.width=Math.round(100*e)+"%";var s=r(t.playedClass,this.wrapper),i=this.duration*e,n=Math.floor(i/60),o=Math.floor(i%60);s.innerHTML=(n<10?"0":"")+n+":"+(o<10?"0":"")+o}},create:function(e,t){var t=t||{};return e.length?this.createAll(t,e):this.newInstance(e,t)},createAll:function(e,t){var a=t||document.getElementsByTagName("audio"),s=[];e=e||{};for(var r=0,i=a.length;r<i;r++)(" "+a[r].parentNode.className+" ").replace(/[\n\t]/g," ").indexOf(" audiojs ")>-1||s.push(this.newInstance(a[r],e));return s},newInstance:function(e,s){var e=e,r=this.helpers.clone(this.settings),i="audiojs"+this.instanceCount,n="audiojs_wrapper"+this.instanceCount;this.instanceCount++;null!=e.getAttribute("autoplay")&&(r.autoplay=!0),null!=e.getAttribute("loop")&&(r.loop=!0),"none"==e.getAttribute("preload")&&(r.preload=!1),s&&this.helpers.merge(r,s),r.createPlayer.markup?e=this.createPlayer(e,r.createPlayer,n):e.parentNode.setAttribute("id",n);var o=new a[t](e,r);return r.css&&this.helpers.injectCss(o,r.css),r.useFlash&&r.hasFlash?(this.injectFlash(o,i),this.attachFlashEvents(o.wrapper,o)):r.useFlash&&!r.hasFlash&&r.flashError.apply(o),(!r.useFlash||r.useFlash&&r.hasFlash)&&this.attachEvents(o.wrapper,o),this.instances[i]=o,o},createPlayer:function(e,t,a){var s=document.createElement("div"),r=e.cloneNode(!0);return s.setAttribute("class","audiojs"),s.setAttribute("className","audiojs"),s.setAttribute("id",a),r.outerHTML&&!document.createElement("audio").canPlayType?(r=this.helpers.cloneHtml5Node(e),s.innerHTML=t.markup,s.appendChild(r),e.outerHTML=s.outerHTML,s=document.getElementById(a)):(s.appendChild(r),s.innerHTML=s.innerHTML+t.markup,e.parentNode.replaceChild(s,e)),s.getElementsByTagName("audio")[0]},attachEvents:function(t,s){if(s.settings.createPlayer){var i=s.settings.createPlayer,n=r(i.playPauseClass,t),o=r(i.scrubberClass,t),l=function(e){var t=0;if(e.offsetParent)do t+=e.offsetLeft;while(e=e.offsetParent);return t};a[e].events.addListener(n,"click",function(e){s.playPause.apply(s)}),a[e].events.addListener(o,"click",function(e){var t=e.clientX-l(this);s.skipTo(t/o.offsetWidth)}),s.settings.useFlash||(a[e].events.trackLoadProgress(s),a[e].events.addListener(s.element,"timeupdate",function(e){s.updatePlayhead.apply(s)}),a[e].events.addListener(s.element,"ended",function(e){s.trackEnded.apply(s)}),a[e].events.addListener(s.source,"error",function(e){clearInterval(s.readyTimer),clearInterval(s.loadTimer),s.settings.loadError.apply(s)}))}},attachFlashEvents:function(e,t){t.swfReady=!1,t.load=function(e){t.mp3=e,t.swfReady&&t.element.load(e)},t.loadProgress=function(e,a){t.loadedPercent=e,t.duration=a,t.settings.loadStarted.apply(t),t.settings.loadProgress.apply(t,[e])},t.skipTo=function(e){e>t.loadedPercent||(t.updatePlayhead.call(t,[e]),t.element.skipTo(e))},t.updatePlayhead=function(e){t.settings.updatePlayhead.apply(t,[e])},t.play=function(){t.settings.preload||(t.settings.preload=!0,t.element.init(t.mp3)),t.playing=!0,t.element.pplay(),t.settings.play.apply(t)},t.pause=function(){t.playing=!1,t.element.ppause(),t.settings.pause.apply(t)},t.setVolume=function(e){t.element.setVolume(e)},t.loadStarted=function(){t.swfReady=!0,t.settings.preload&&t.element.init(t.mp3),t.settings.autoplay&&t.play.apply(t)}},injectFlash:function(e,t){var a=this.flashSource.replace(/\$1/g,t);a=a.replace(/\$2/g,e.settings.swfLocation),a=a.replace(/\$3/g,+new Date+Math.random());var s=e.wrapper.innerHTML,r=document.createElement("div");r.innerHTML=a+s,e.wrapper.innerHTML=r.innerHTML,e.element=this.helpers.getSwf(t)},helpers:{merge:function(e,t){for(attr in t)(e.hasOwnProperty(attr)||t.hasOwnProperty(attr))&&(e[attr]=t[attr])},clone:function(e){if(null==e||"object"!=typeof e)return e;var t=new e.constructor;for(var a in e)t[a]=arguments.callee(e[a]);return t},addClass:function(e,t){var a=new RegExp("(\\s|^)"+t+"(\\s|$)");a.test(e.className)||(e.className+=" "+t)},removeClass:function(e,t){var a=new RegExp("(\\s|^)"+t+"(\\s|$)");e.className=e.className.replace(a," ")},injectCss:function(e,t){var a="",s=document.getElementsByTagName("style"),r=t.replace(/\$1/g,e.settings.imageLocation);r=r.replace(/\$2/g,e.settings.retinaImageLocation);for(var i=0,n=s.length;i<n;i++){var o=s[i].getAttribute("title");if(o&&~o.indexOf("audiojs")){if(d=s[i],d.innerHTML===r)return;a=d.innerHTML;break}}var l=document.getElementsByTagName("head")[0],p=l.firstChild,d=document.createElement("style");l&&(d.setAttribute("type","text/css"),d.setAttribute("title","audiojs"),d.styleSheet?d.styleSheet.cssText=a+r:d.appendChild(document.createTextNode(a+r)),p?l.insertBefore(d,p):l.appendChild(d))},cloneHtml5Node:function(e){var t=document.createDocumentFragment(),a=t.createElement?t:document;a.createElement("audio");var s=a.createElement("div");return t.appendChild(s),s.innerHTML=e.outerHTML,s.firstChild},getSwf:function(e){var t=document[e]||window[e];return t.length>1?t[t.length-1]:t}},events:{memoryLeaking:!1,listeners:[],addListener:function(t,s,r){t.addEventListener?t.addEventListener(s,r,!1):t.attachEvent&&(this.listeners.push(t),this.memoryLeaking||(window.attachEvent("onunload",function(){if(this.listeners)for(var t=0,s=this.listeners.length;t<s;t++)a[e].events.purge(this.listeners[t])}),this.memoryLeaking=!0),t.attachEvent("on"+s,function(){r.call(t,window.event)}))},trackLoadProgress:function(e){if(e.settings.preload){var t,a,e=e,s=/(ipod|iphone|ipad)/i.test(navigator.userAgent);t=setInterval(function(){e.element.readyState>-1&&(s||e.init.apply(e)),e.element.readyState>1&&(e.settings.autoplay&&e.play.apply(e),clearInterval(t),a=setInterval(function(){e.loadProgress.apply(e),e.loadedPercent>=1&&clearInterval(a)},200))},200),e.readyTimer=t,e.loadTimer=a}},purge:function(e){var t,a=e.attributes;if(a)for(t=0;t<a.length;t+=1)"function"==typeof e[a[t].name]&&(e[a[t].name]=null);if(a=e.childNodes)for(t=0;t<a.length;t+=1)purge(e.childNodes[t])},ready:function(){return function(e){var t=window,a=!1,s=!0,r=t.document,i=r.documentElement,n=r.addEventListener?"addEventListener":"attachEvent",o=r.addEventListener?"removeEventListener":"detachEvent",l=r.addEventListener?"":"on",p=function(s){"readystatechange"==s.type&&"complete"!=r.readyState||(("load"==s.type?t:r)[o](l+s.type,p,!1),!a&&(a=!0)&&e.call(t,s.type||s))},d=function(){try{i.doScroll("left")}catch(e){return void setTimeout(d,50)}p("poll")};if("complete"==r.readyState)e.call(t,"lazy");else{if(r.createEventObject&&i.doScroll){try{s=!t.frameElement}catch(c){}s&&d()}r[n](l+"DOMContentLoaded",p,!1),r[n](l+"readystatechange",p,!1),t[n](l+"load",p,!1)}}}()}},a[t]=function(e,t){this.element=e,this.wrapper=e.parentNode,this.source=e.getElementsByTagName("source")[0]||e,this.mp3=function(e){var t=e.getElementsByTagName("source")[0];return e.getAttribute("src")||(t?t.getAttribute("src"):null)}(e),this.settings=t,this.loadStartedCalled=!1,this.loadedPercent=0,this.duration=1,this.playing=!1},a[t].prototype={updatePlayhead:function(){var e=this.element.currentTime/this.duration;this.settings.updatePlayhead.apply(this,[e])},skipTo:function(e){e>this.loadedPercent||(this.element.currentTime=this.duration*e,this.updatePlayhead())},load:function(t){this.loadStartedCalled=!1,this.source.setAttribute("src",t),this.element.load(),this.mp3=t,a[e].events.trackLoadProgress(this)},loadError:function(){this.settings.loadError.apply(this)},init:function(){this.settings.init.apply(this)},loadStarted:function(){return!!this.element.duration&&(this.duration=this.element.duration,this.updatePlayhead(),void this.settings.loadStarted.apply(this))},loadProgress:function(){if(null!=this.element.buffered&&this.element.buffered.length){this.loadStartedCalled||(this.loadStartedCalled=this.loadStarted());var e=this.element.buffered.end(this.element.buffered.length-1);this.loadedPercent=e/this.duration,this.settings.loadProgress.apply(this,[this.loadedPercent])}},playPause:function(){this.playing?this.pause():this.play()},play:function(){var t=/(ipod|iphone|ipad)/i.test(navigator.userAgent);t&&0==this.element.readyState&&this.init.apply(this),this.settings.preload||(this.settings.preload=!0,this.element.setAttribute("preload","auto"),a[e].events.trackLoadProgress(this)),this.playing=!0,this.element.play(),this.settings.play.apply(this)},pause:function(){this.playing=!1,this.element.pause(),this.settings.pause.apply(this)},setVolume:function(e){this.element.volume=e},trackEnded:function(e){this.skipTo.apply(this,[0]),this.settings.loop||this.pause.apply(this),this.settings.trackEnded.apply(this)}};var r=function(e,t){var a=[];if(t=t||document,t.getElementsByClassName)a=t.getElementsByClassName(e);else{var s,r,i=t.getElementsByTagName("*"),n=new RegExp("(^|\\s)"+e+"(\\s|$)");for(s=0,r=i.length;s<r;s++)n.test(i[s].className)&&a.push(i[s])}return a.length>1?a:a[0]}}("audiojs","audiojsInstance",this);