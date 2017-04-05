import Vue from 'vue';
import VueRouter from 'vue-router';
import App from 'components/app.vue';
import Routers from './router';
import iView from 'iview';
import axios from 'axios';
import util from './libs/util';
import config from './config/config';
import store from './store/store';

import 'iview/dist/styles/iview.css';
import './less/common.less';


//数据可视化
import echarts from 'echarts'

Vue.use(VueRouter);
Vue.use(iView);

// 类似于vue-resource的调用方法，之后可以在实例里直接用this.$http.get()等
Vue.prototype.$http = axios

// 开启debug模式
Vue.config.debug = true;

// 路由配置
let router = new VueRouter({
    // 是否开启History模式的路由, 如果生产环境的服务端没有进行相关配置,请慎用
    history: false
});

router.map(Routers);

// router.beforeEach((transition) => {
//     // window.scrollTo(0, 0);
//     // if (Vue.cookie.get('loginName')) {
//     //     transition.next();

//     //   } else {
//     //       //未登录跳转
//     //       location.href=config.loginurl;
//     //   }
// });

router.afterEach(() => {

});
App.store = store;
router.redirect({
    '*': "/index"
});
router.start(App, '#app');
