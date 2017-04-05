<style scoped>
  .fr{float: right;}
  .layout-breadcrumb {
      padding: 10px 15px 0;
  }
  .num_wrapper{font-size:18px;padding:10px;}
  .classwrapper .ivu-tree li{float: left;width:200px}
  .tagwrapper .ivu-tree li{float: left;margin: 0px 40px 10px 0px}
  .cf{display:inline-block;zoom:1;width: 100%}
  .cf:after{content:".";display:block;clear:both;visibility:hidden;line-height:0;height:0}
  html[xmlns] .clearfix{display:block}
</style>

<template>
    <div class="layout-header"></div>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item>首页</Breadcrumb-item>
              <Breadcrumb-item>音频资源管理</Breadcrumb-item>
              <Breadcrumb-item>批量打标签</Breadcrumb-item>
          </Breadcrumb>
      </div>

      <div class="layout-content">
        <div class="layout-content-main">
          <Menu mode="horizontal" :theme="theme1" active-key="1">
              <Menu-item key="1">
                  批量打分类/标签
              </Menu-item>
          </Menu>

          <p class="num_wrapper">共选择 {{tagsData.length}} 条记录</p>

          <Card class="classwrapper cf">
              <p slot="title">分类</p>

              <!-- 分类数据 -->
              <Tree :data="classifylist"
              @on-select-change="gettagnode"
              @on-check-change="getcheckclass"
              show-checkbox
              ></Tree>

          </card>

          <Card class="tagwrapper">
            <p slot="title">标签</p>
            <template v-for="item in taglist">
              <Tag type="border" color="blue">{{item.title}}</Tag>
                <Card class="cf">
                  <!-- 标签,每一个标签都是一棵树-->
                  <Tree :data="item.children"
                  show-checkbox
                  @on-check-change="savetags">
                  </Tree>

                </card>
            </template>
          </card>

          <p class="btn_wrapper">
            <i-button type="warning"
            icon="ios-compose"
            size="large"
            v-on:click.stop.prevent="tosave()"
            >保存</i-button>

            <i-button type="success"
            icon="checkmark-round"
            size="large"
            v-on:click.stop.prevent="tosubmit()"
            >提交</i-button>
          </p>

         </div>
      </div>
</template>

<script>
import config from '../config/config';
import util from '../libs/util';
import { getTags } from '../store/getters'

    export default {
        data() {
            return {
              //登陆信息
              logininfo:"",
              // 全量分类数据
              classid:"",
              // 全量分类数据
              classifylist:[],
              //某分类下的标签组和标签数据
              taglist:[],
              //临时分类和标签数据
              tmptaglist:{
                    "id":[],
                    "append":0,
                    "data":[
                        {
                            "res_db":"aires",
                            "resources" : []
                        }
                        ],
                    "clevel":null,
                    "userinfo" :{
                      "editor":"",
                      "editor_email":""
                    }
              }
            }
        },
        ready(){
          this.getlogininfo();
          this.endids();
          this.getclass();
          this.getclasslist();
        },
        vuex: {
            getters: {
                tagsData: getTags
            }
        },
        methods:{
          // 拿登陆信息
          getlogininfo(){
            this.logininfo = util.getCookie('CURRENT_USER')
            this.logininfo=JSON.parse(JSON.parse(this.logininfo));
          },
          // 保存id数组
          endids(){
            this.tagsData.forEach((value)=>{
              this.tmptaglist.data[0].resources.push(value.id)
            })
          },
          // 获取第一个资源的分类
          getclass(){
            let url= `/airesources/${this.tagsData[0].id}`;
            console.log(url);
            util.ajax({
                method: 'GET',
                url: util.getUrl(url)
                })
                .then((res) => {
                  this.classid = res.data.data.catearr.id;
                  console.log(this.classid);
                })
                .catch(function(error) {
                    console.error(error);
                });
          },
          //获取全量分类数据
          getclasslist(){
            let json={
                  "appId":"",
                  "id":0,
                  "type":0
              };

            util.ajax({
                method: 'POST',
                url: util.getUrl('/tag/list'),
                data:json
                })
                .then((res) => {
                    console.log('分类');
                    this.classifylist = res.data.data.children;

                    //匹配每一个节点，将资源所在的分类选中,用id匹配
                    util.selectclass(this.classifylist,this.classid);

                    //获取资源所在的分类的全量标签
                    this.gettaglist(this.classid);

                    //展开子分类
                    util.expandtree(this.classifylist);

                })
                .catch(function(error) {
                    console.error(error);
                });
          },

          //给批量资源切换分类
          gettagnode(node){
            // 如果点击的不是根节点的话，则不产生请求
            if (node[0].pid!=0){
              return false;
            }
            //取消原本勾选的所有分类
            util.uncheckedtree(this.classifylist);
            //取消原本根分类的选择状态
            util.unselecttree(this.classifylist);
            //这个根分类之外的分类disable
            util.disableclass(this.classifylist,node[0].id);

            //清空分类
            this.tmptaglist.id=[];
            this.tmptaglist.id.push(node[0].id);
            this.gettaglist(node[0].id);
          },
          //获取资源所在分类的标签数据
          // 参数为为分类id
          gettaglist(id){
            let json={
                  "appId":"",
                  "id":id,
              };
              util.ajax({
                  method: 'POST',
                  url: util.getUrl('/tag/list'),
                  data:json
                  })
                  .then((res) => {
                      this.taglist = res.data.data.children;
                      console.log(this.taglist)
                  })
                  .catch((error) => {
                      console.error(error);
                  });
          },

          //把选择的分类添加到changedata
          getcheckclass(nodearr){
            nodearr.forEach((value)=>{
              this.changedata.tagnew.push(value.id);
            })
            console.log(this.changedata.tagnew);
          },

          //获取一个标签组内已经选中的标签
          savetags(nodearr){
              console.log(nodearr);
              nodearr.forEach((value)=>{
                this.tmptaglist.id.push(value.id)
              })
          },

          //保存修改
          tosave(){
            this.tmptaglist.clevel=2;
            this.tosend();
          },

          //提交修改
          tosubmit(){
            this.tmptaglist.clevel=3;
            this.tosend();
          },

          tosend(){
            this.tmptaglist.userinfo.editor = this.logininfo.loginName;
            this.tmptaglist.userinfo.editor_email = this.logininfo.email;

            // 提交资源的标签和分类信息
            util.ajax({
                method: 'POST',
                url: util.getUrl("/tag/resources"),
                data:this.tmptaglist
                })
                .then((res) => {
                    console.log(res);
                    util.tip(res);
                })
                .catch(function(error) {
                    console.error(error);
                });
          },
        }

    }
</script>
