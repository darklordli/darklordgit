
# Roobo前端项目目录

##### m.roobo.com   roobo官网主站移动版h5版
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
