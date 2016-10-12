
# Roobo前端项目目录

### 炬力故事机方案  微信公众号

*   目录：wechat.roobo.com
*   线上地址：微信搜索：智聆 公众号并关注  首页URL为：http://wechat.roobo.com/storybox/assets/index1.html
*   更新时间：2016/8/23
*   上线时间：2016/8/16

#####项目介绍

炬力故事机方案微信公众号是一个toB项目，是公司为珠海炬力集成电路设计有限公司做的一个基于故事机硬件的微信公众号控制系统的解决方案，炬力集成为美国上市公司。

项目功能为：通过微信公众号的页面入口，将其作为遥控器，通过此系统提供的音乐资源，给故事机（类似于火火兔）提供播放资源，提供将故事机进行，点播，播放，家人群组控制，生成二维码，将故事机绑定微信号，给故事机设备进行声波配网，配置网络等功能。

项目需求为使用炬力提供的后台代码，在不改变对方后台功能的基础上，替换资源部分的后台功能，添加了基于AI的资源搜索，重新设计公众号页面，重构了 整个微信公众号的使用体验和流程，使用了我司自己的稳定的音乐资源。

#####此项目的技术要点，及技术难点


1  炬力方已经将整站前后端代码提供给我方，对于前端代码，通过阅读，发现其使用的开发方式为极其落后的jquery+ajax+dom操作的方式，没有使用任何基于MVC架构的框架或者模板系统，ajax请求接口后返回的数据直接在ajax的success回调中 通过拼接html字符串的方式append到页面中，并且将很多通过接口上传的数据存放到了dom的date属性中，这固然是一个开发方式。但是思路严重古董，并且完全无法维护和扩展。

  本期的公众号项目将前端体验改版的情况下，前端测无法将原有代码修改，只能进行重构，时间紧，任务急。其各个页面设计稿如下，此为第一个难点。


######2016/10/13 update：添加微信智能硬件相关功能的说明和整理

2  项目业务中，微信公众号前端测除了采用ajax的方式与后台接口交互数据外，还需要通过在页面端调用MQTT的JSSDK,将对故事机的操作指令通过MQTT的 即时通讯协议消息直接下发到设备，实现控制故事机设备的 播放，暂停，音量控制，切歌，切换循环模式，固件升级等的直接操作。

（来自百度百科--MQTT（Message Queuing Telemetry Transport，消息队列遥测传输）是IBM开发的一个即时通讯协议，有可能成为物联网的重要组成部分。该协议支持所有平台，几乎可以把所有联网物品和外部连接起来，被用来当做传感器和致动器（比如通过Twitter让房屋联网）的通信协议。百科地址为：http://baike.baidu.com/link?url=6wJ-EO4gU4halF3OB7fJilHlBeccTdFgGzzGJ2sedqYq15AFeNQSkW9qVyFKIAOJY91YI-2SL-ybxL5B3ouUYa）

对于MQTT SDK，之前没有接触过，虽然炬力方给的代码已经有了调用的实例，并已经封装好了一个mqttclient.js文件，其中对所有的MQTT下发到设备的消息，以及设备上发的消息的处理，都已经做了封装，但开发时仍然要对其逻辑做一定消化。此为第二个难点也是要点。

PS: 经过开发体验，MQTT非常强大，搭建一个MQTT的消息SERVER成本也并不高，国内很多企业都广泛使用MQTT作为Android手机客户端与服务器端推送消息的协议,随着机器人以及互联网的发展在未来几年，MQTT的应用会越来越广，值得终点关注。

3 在公众号的前端，除了通过mqtt的消息服务给故事机下发json格式的控制信息外，还需要通过微信的IOT服务，即微信硬件平台提供的api,来提供一部分控制故事机的服务，（包括airkiss配网和声波配网）。整个的微信公众号项目，其实是接入了微信的智能设备服务。


######简介什么是微信硬件IOT及其API:

微信硬件平台是微信2015年底推出的连接物与人，物与物的IOT解决方案。主页： http://iot.weixin.qq.com/
而 微信硬件JSAPI接口属于微信JS-SDK的一部分，jsapi是网页javascript的接口，该接口允许厂商的网页对局域网设备（设备必须支持AirKiss3.0）和蓝牙设备进行操作。例如扫描设备，连接设备，收发数据，绑定设备等。

除了在微信公众号后台通过认证，并添加设备功能插件外。前端开发中在此项目中使用的要点为：

1.需要在 wx.config 方法中传入一个beta字段，值为true，则会在注入wx.invoke方法来调用还未开放的jsapi方法。

2.需要在wx.config的方法的参数jsApiList数组中，传入需要额外使用的jsapi名称。(在使用任何jsapi的接口前，必须先调用wx.config方法)。
微信智能硬件JS-SDK的api包括getWXDeviceInfos：获取设备信息，sendDataToWXDevice：	发送数据给设备 等多个控制与发送消息给设备的方法，此项目因为硬件原因并没有走这些方法，而是通过更为成熟了MQTT消息服务。
只用了js-sdk 的 configWXDeviceWiFi 方法，其作用为：调起原生AirKiss界面，不需要先调用openWXDeviceLib，也就是通过AirKiss给硬件配网。
（具体代码见：本人github目录...）

相关参考文档及开发工具:
1.微信硬件官网  http://iot.weixin.qq.com/
2.微信智能硬件JS-SDK api文档    http://iot.weixin.qq.com/wiki/new/index.html?page=4-7
3.微信公众平台JS-SDK api文档    http://mp.weixin.qq.com/wiki/11/74ad127cc054f6b80759c40f77ec03db.html
4 签名算法确认工具  http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign
5 微信公众平台接口调试工具 http://mp.weixin.qq.com/debug/

#####本次采用的技术要点：

######UI框架部分：

这是需要快速搭建起H5页面及交互部分的需求，在开发初期在对mui以及淘宝的 SUI MOBILE进行选型之后，都没有进行选择，原因是设计稿中虽然有列表式的布局，但大量的还是自定义的ICON,列表样式，播放控制界面，用mui以及SUI MOBILE的限制太多，不太适用，采用了微信出品的 JQUERY-WEUI,WEUI的jquery实现版....其提供的actionsheet，alert，confirm等组件对于微信公众号的页面来说风格十分契合。
主体页面均使用REM手动自己布局+部分使用font Awesome提供的图标（font Awesome现在可是github上第一大开源项目。。。 ）

（jQuery WeUI 中使用的是官方 WeUI 的 CSS 代码，并提供了 jQuery/Zepto 版本的 API 实现。因为直接使用了官方的 CSS，所以你不用担心跟官方版本的冲突。实际上 jQuery WeUI == WeUI + jQuery 插件。）

（MUI:http://dev.dcloud.net.cn/mui/
  SUIMOBILE:http://m.sui.taobao.org/
  JQUERY-WEUI:http://jqweui.com/
）

######数据处理与逻辑部分：

逻辑部分的前端框架毫不犹豫的选择VUE,一方面，随着几个项目的试水，对VUE的各个特新已经愈加熟悉和理解，另一方面，此项目的restfulapi的数据交互,也特别适合使用数据驱动的MVVM式的开发方式。整个项目下来完全没有任何操作DOM的代码。完全使用数据对应状态的思想开发完毕。

到了2016年，随着vue-router，vuex,以及vue2，整个VUE的生态已经愈加成熟，但是不像react和angualr,vue完全不对开发者的开发方式做规定，这正是本人喜欢使用此框架的原因。使用完全体（或者叫全家桶）的将全部的es6, 路由，热加载，组件化，组件状态管理的 开发形式，或者像这个项目中，全部都是standalone引入，每个页面都新建一个VUE根实例的形式，都可以完成开发。

后续会研究一下VUE官方的 cli（https://github.com/vuejs/vue-cli）生成的模板，将项目迁移为组件化的形式，提高其可维护性和可扩展性...

（此项目的前端架构图稍后上传）


######2016/9/8 mark一下使用vue中遇到的一个诡异bug：

在做vue开发时，页面的vue实例编译完成之前，需要隐藏html模板中未编译好的内容，在VUE中有v-cloak 这个api,添加到标签中，并且在css中加入[v-clock] {display:none} 来避免模块的闪烁。
而实际上，出现了个别的页面（家庭成员页，资源详情页），v-clock失去了作用。
实际修改的 历程经过了下面几个阶段

1 没有加clock,自然是会出现闪烁

2 在需要避免闪烁的容器上加入了v-cloak，并且将[v-cloak] {display:none} 加入到了header中加载的css文件中，不起作用

3 google了一下,在http://www.cnblogs.com/whitewolf/p/3495822.html 中作者遇到了同样的问题，思考了一下浏览器渲染的机制，渲染html的速度可能会比并行加载header中css的速度还快，所以将[v-clock] {display:none} 放到了html的 header中,依然不起作用

4 看了一下 [v-cloak] {display:none} 这句css, [v-cloak] 是一个属性选择器，他的意思是 选择所有包含有 v-clock 这个属性的DOM容器,在css中属性选择器的优先级是很低的，与class的 优先级相同，所以会不会 有别的 css的定义比他的 优先级高，所以覆盖了 display:none呢，所以改为  [v-cloak] {display:none!important} ，成功解决。

######2016 10  update  此bug已解决
