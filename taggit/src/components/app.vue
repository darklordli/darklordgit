<style scoped>
    .layout {
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        height: 100vh;
        height: 100%;
    }

    .layout-header {
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
        background: #657180;
    }

    .layout-logo {
        line-height: 60px;
        color: #fff;
        font-size: 20px;
        margin: 0 0 0 30px;
    }

    .layout-copy {
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }

    .layout-login{
      float: right;
      margin:0px 30px 0px 0px
    }


    .layout-ceiling {
        padding: 10px 0;
        overflow: hidden;
        float:right;
    }

    .layout-ceiling-main {
        float: right;
        margin-right: 15px;
    }

    .layout-ceiling-main a {
        color: #9ba7b5;
    }
    .left-bar{
        background: #464c5b;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
</style>
<template>
    <div class="layout">
      <div class="layout-header">
          <span class="layout-logo">
            <Icon type="social-reddit"></Icon>
            新资源管理系统

            <span class="layout-login">
              <Icon type="person-stalker"></Icon>
              欢迎您：{{logininfo.realname}}
              ({{logininfo.loginName}}),
              来自:{{logininfo.dept}}
              <i-button
              type="warning"
              icon="android-exit"
              @click.stop.prevent="logout()"
              >退出系统</i-button>
            </span>
          </span>
      </div>

      <Row type="flex">
            <i-col span="3" class="layout-menu-left left-bar">
              <Menu theme="dark" width="auto" :open-keys="['1','2','3','4']"
                    style="height:100vh"
                    @on-select="changeMenu">
                    <Menu-item key="editoraudit">
                      <Icon type="ios-list-outline"></Icon>
                      音频资源管理
                    </Menu-item>
                    <Menu-item key="voiceslist">
                      <Icon type="upload"></Icon>
                      音频上线管理
                    </Menu-item>
                    <Menu-item key="tagmanger">
                        <Icon type="pricetags"></Icon>
                        标签管理
                    </Menu-item>
                    <Menu-item key="categorylist">
                        <Icon type="music-note"></Icon>
                        专辑管理
                    </Menu-item>
              </Menu>
            </i-col>
    <i-col span="21" style="padding: 0 10px">
        <router-view></router-view>
        <Back-top></Back-top>
    </i-col>
</Row>

<div class="layout-copy">
    2017 &copy; roobo
</div>
</div>
</template>
<script>
import config from '../config/config';
import util from '../libs/util';
    export default {
        data() {
            return {
              //登陆信息
              logininfo:""
            };
        },
        ready() {
          this.writecookie();
          this.getlogininfo();
        },
        beforeDestroy() {

        },
        methods: {
          //先写一个cookie
          writecookie(){
            let cookie='{\"id\":66,\"accountType\":\"AD\",\"loginName\":\"wangfeng\",\"password\":null,\"dept\":\"%E6%8A%80%E6%9C%AF%E9%83%A8\",\"realname\":\"%E7%8E%8B%E5%B3%B0\",\"email\":\"wangfeng@roobo.com\",\"mobile\":\"13701318294\",\"createTime\":\"2016-07-07 16:40:14\",\"lastloginTime\":\"2017-03-21 09:45:41\",\"admin\":true}';
            document.cookie="CURRENT_USER="+JSON.stringify(cookie);
          },
          // 拿登陆信息
          getlogininfo(){
            this.logininfo = util.getCookie('CURRENT_USER')
            this.logininfo=JSON.parse(JSON.parse(this.logininfo));
          },
          // 退出系统
          logout(){
            location.href="http://ecp.roobo.net/dashboard";
          },
          // changeMenu(menuKey) {
          //           this.$router.go({
          //               name: menuKey
          //           });
          //   },
          //本是单页应用无新开页面，但应产品需求尝试新开页面
          changeMenu(menuKey) {
            if (config.env === "development") {
               window.open('/#!/'+menuKey,'_blank');
            }
            else {
               window.open('/new-res/index_prod.html#!/'+menuKey,'_blank');
            }
          }
        }
    };
</script>
