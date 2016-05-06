
# Roobo前端项目目录

### 公司官网 WWW.ROOBO.COM
*   目录：www.roobo.com
*   更新时间：2016/3/23
*   采用的技术要点：

1. gulp构建自动化  源目录 src 输出目录 website，页面公共部分抽出为组件
2. less及sass预编译
3. 采用fontmin技术使字体子集话并是用font-face实现自定义字体
4. pc端与移动端采用响应式设计，是一套页面兼容适配全端

###### update 2016.5
1.已经开始在roobo官网加入运营型功能，初步为新闻信息，通过运营后台提供的接口读取。
2.roobo官网将开发多语言的国际版本，如网站结构与内容相同，将采用jquery.i18n.properties插件加载语言资源包的形式.

此项目进行中
* * *

#####  WWW.ROOBO.COM包含puddings官网以及预售
*   目录：www.roobo.com/rmall
*   更新时间：2016/3/23
*   采用的技术要点：

1. 前后端分离，面向接口开发，ajax异步编程
2. 采用arttemplate模板渲染数据并封装到html中
3. pc端与移动端采用响应式设计，是一套页面兼容适配全端
4. 后端返回数据采用跨域资源共享，Cross-Origin Resource Sharing ，使得才兼容html5的浏览器上实现AJAX跨域
5. IE8,IE9等不支持CORS的浏览器上，尝试采用jquery.xdomainrequest.js实现ajax跨域，目前还有问题，正在尝试中

###### update 2016.5
1.已经实现在本网站下单支付购买，查看订单状态和订单管理等功能。
PS:目前的前端架构依然采用的是传统的js字符串模板(art template)—ajax+jquery绑定dom事件的结构，采用判断特定dom元素是否存在，执行次dom元素对应的函数的方法进行js的管理。比较低效+容易出错，后续重构为采用基于mvvm的框架vue.js，逐步将其基于数据和双向绑定的模板，组件，路由等特性导入到现有的项目，逐步替代JQ.
此项目进行中

* * *

### 布丁官方网站 pudding.roo.bo

*   目录：pudding.roo.bo
*   更新时间：2016/1/7
*   采用的技术要点：

1. 根据用户代理UA判断浏览平台跳转到不同站点，如移动端则跳转到m站，m.pudding.roobo.com
2. 首页采用video标签播放html5格式视频，并且在视频加载完毕之前显示封面图（第一帧）
3. 采用fullpage.js实现全屏滚动，后效果欠佳未采用
4. 采用amazeui框架（支持国产）实现部分交互效果，如动画，导航滚动等
5. 使用jquery的mousewheel插件监听处理鼠标滑动，在mac的触摸屏上出现问题，有待修复

此项目已完结

* * *

### 布丁S官方网站 

*   目录：pudding1s.roobo.com
*   更新时间：2016/1/7
*   pudding1s使用说明H5站
*   采用的技术要点：
*   
1. 采用zepto作为基础框架
2. 触摸延迟使用fastclick.js处理
3. 不同尺寸移动端适配采用REM单位，在不用DPR和宽度的设备同比缩放

此项目已完结

* * *

### T1 官方网站 

未开始....








