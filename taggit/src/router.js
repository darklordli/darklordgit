const routers = {
    //404页面
    'index': {
        name: 'index',
        component: require('./views/index')
    },
    //标签管理
    '/tagmanger': {
        name: 'tagmanger',
        component(resolve) {
            require(['./views/tagmanger'], resolve)
        }
    },
    //新标签管理
    '/tagmanger2': {
        name: 'tagmanger2',
        component(resolve) {
            require(['./views/tagmanger2'], resolve)
        }
    },
    //标签资源/歌曲列表
    '/tagsongs/:id': {
        name: 'tagsongs',
        component(resolve) {
            require(['./views/tagsongs'], resolve)
        }
    },
    //歌单管理
    '/listmanger': {
        name: 'listmanger',
        component(resolve) {
            require(['./views/listmanger'], resolve)
        }
    },
    //编辑专辑
    '/newliststep1/:listid': {
        name: 'newliststep1',
        component(resolve) {
            require(['./views/newliststep1'], resolve)
        }
    },
    //新建歌单
    '/newliststep3/:listid': {
        name: 'newliststep3',
        component(resolve) {
            require(['./views/newliststep3'], resolve)
        }
    },
    //歌单列表
    '/newliststep4/:listid': {
        name: 'newliststep4',
        component(resolve) {
            require(['./views/newliststep4'], resolve)
        }
    },
    //专辑列表
    '/categorylist': {
        name: 'categorylist',
        component(resolve) {
            require(['./views/categorylist'], resolve)
        }
    },
    //歌单列表
    '/selectionlist': {
        name: 'selectionlist',
        component(resolve) {
            require(['./views/selectionlist'], resolve)
        }
    },
    //资源编辑审核
    '/editoraudit': {
        name: 'editoraudit',
        component(resolve) {
            require(['./views/editoraudit'], resolve)
        }
    },
    //上传音资源
    '/voicesupload': {
        name: 'voicesupload',
        component(resolve) {
            require(['./views/voicesupload'], resolve)
        }
    },
    //资源详情-(包括显示，编辑，审核)
    '/resouredetail/:id': {
        name: 'resouredetail',
        component(resolve) {
            require(['./views/resouredetail'], resolve)
        }
    },
    //音频资源列表
    '/voiceslist': {
        name: 'voiceslist',
        component(resolve) {
            require(['./views/voiceslist'], resolve)
        }
    },
    //批量打分类/标签
    '/multitagmark': {
        name: 'multitagmark',
        component(resolve) {
            require(['./views/multitagmark'], resolve)
        }
    },
    //批量添加标签
    '/multitagadd': {
        name: 'multitagadd',
        component(resolve) {
            require(['./views/multitagadd'], resolve)
        }
    },
    //批量添加标签
    '/multitagclean': {
        name: 'multitagclean',
        component(resolve) {
            require(['./views/multitagclean'], resolve)
        }
    }
};
export default routers;