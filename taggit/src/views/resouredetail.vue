<style lang="less">
.layout-breadcrumb {
    padding: 10px 15px 0;
}
  .fr{float: right;}
  .classwrapper .ivu-tree li{float: left;width:200px}
  .tagwrapper .ivu-tree li{float: left;margin: 0px 40px 10px 0px}
  .cf{display:inline-block;zoom:1;width: 100%}
  .cf:after{content:".";display:block;clear:both;visibility:hidden;line-height:0;height:0}
  html[xmlns] .clearfix{display:block}

  .wrapper_editor{
    padding: 20px 0px 20px 10px;
    border-bottom:1px solid #ccc;
    font-weight:bold;
    font-size:14px;
  }
  .btn_wrapper{
    padding:10px;
    a{
      margin:10px
    }
  }
  .error_wrapper{
    color:red;
    font-weight:bolder;
    font-size:14px;
    padding: 20px 0px 20px 10px;
  }
</style>

<template>
    <div class="layout-header"></div>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item>首页</Breadcrumb-item>
              <Breadcrumb-item>音频资源管理</Breadcrumb-item>
              <Breadcrumb-item v-if="status=='detail'">
                资源详情
              </Breadcrumb-item>
              <Breadcrumb-item v-if="status=='edit'">
                编辑资源
              </Breadcrumb-item>
              <Breadcrumb-item v-if="status=='verify'">
                审核资源
              </Breadcrumb-item>
          </Breadcrumb>
      </div>

      <div class="layout-content">
        <div class="layout-content-main">

          <!-- 资源基本信息-->
          <Card style="height:380px">
            <p slot="title" style="height:35px">
              <Icon type="ios-paper"></Icon>
              基本信息
              ( id: <Tag color="blue">{{resouredata.id}}</Tag> )
              <Tag type="dot" color="yellow">{{{clevel}}}</Tag>
            </p>

            <p slot="extra">
              操作人：<span>{{resouredata.userinfo.editor}}
                ({{resouredata.userinfo.reviewer_email}})</span>，
              操作时间：<span>{{dataformat}}</span>

              <i-button

                type="primary"
                :disabled = editdisable
                icon="edit"
                v-if="status=='detail'"
                v-on:click.stop.prevent="toedit()">
                编辑资源
              </i-button>

              <i-button
                type="primary"
                icon="backspace"
                v-if="status=='edit'"
                v-on:click.stop.prevent="todetail()">
                返回查看
              </i-button>
            </p>


            <i-col span="12">
              <i-form
              :label-width="120"
              >
                  <Form-item label="资源名称：">
                      {{resouredata.name}}
                  </Form-item>

                  <Form-item label="作者/歌手：">
                      <span v-if="status=='detail'||status=='verify'">
                          {{resouredata.artist}}
                      </span>
                      <i-input v-if="status=='edit'"
                      :value.sync="resouredata.artist">
                      </i-input>
                  </Form-item>

                  <Form-item label="类型：">{{resouredata.type}}</Form-item>

                  <Form-item label="时长：">{{resouredata.length}}</Form-item>

                  <Form-item label="音频：">
                    <audio :src="resouredata.content"
                      controls="controls">
                    </audio>

                  </Form-item>
                  </i-form>
            </i-col>

            <i-col span="12">
              <i-form
              :label-width="120"
              >
                  <Form-item label="别名：">
                    <span v-if="status=='detail'||status=='verify'">
                        {{resouredata.nickname}}
                    </span>

                    <i-input v-if="status=='edit'"
                    :value.sync="resouredata.nickname">
                    </i-input>

                  </Form-item>
                  <!-- <Form-item label="系列名称：">
                      {{resouredata.source}}
                  </Form-item> -->

                  <Form-item label="来源：">{{resouredata.srcname}}</Form-item>
                  <Form-item label="大小：">{{resouredata.size}}</Form-item>
                  </i-form>
            </i-col>
          </card>

          <!-- 关键词列表-->
          <Card>
            <p slot="title">
            <Icon type="ios-paper"></Icon>关键词列表
            </p>
            <i-form
            :label-width="120"
            >
                <Form-item label="预制关键词：">
                  <span v-if="status=='detail'||status=='verify'">
                    {{resouredata.keywords}}
                  </span>

                  <i-input v-if="status=='edit'"
                  :value.sync="resouredata.keywords">
                  </i-input>
                </Form-item>
            </i-form>
          </card>

          <!-- 详情状态的分类/标签列表-->
          <Card v-if="status=='detail'" class="tagwrapper">
            <p slot="title">
            <Icon type="ios-paper"></Icon>分类/标签列表
            </p>
            <i-form
            :label-width="60"
            >
                <Form-item label="分类：">
                  <Tree :data="detailtreedata"></Tree>
                </Form-item>

                <Form-item label="标签：">
                  <p v-for="item in detailtaglist">
                    <Tag type="dot"
                    color="red"
                    style="float:left;clear:both">{{item.title}}:</Tag>
                    <!-- 标签,每一个标签都是一棵树-->
                    <Tree :data="item.children" class="cf"></Tree>
                  </p>
                </Form-item>
            </i-form>
          </card>

          <!-- 编辑状态的分类/标签列表-->
          <Card v-if="status=='edit'">
            <p slot="title">
              <Icon type="ios-paper"></Icon>分类/标签列表
            </p>

            <Card class="classwrapper cf">
                <p slot="title">分类</p>
                <!-- 分类数据 -->
                <Tree :data="classifylist"
                @on-select-change="gettaglist"
                @on-check-change="getcheckclass"
                show-checkbox
                ></Tree>
            </card>

            <Card class="tagwrapper">
              <p slot="title">标签</p>
              <template v-for="item in taglist">
                <!-- 标签 -->
                <Tag type="border" color="blue">{{item.title}}</Tag>
                  <Card class="cf">
                      <Tree :data="item.children"
                        show-checkbox
                        @on-check-change="getchecktags"
                      ></Tree>
                  </card>
              </template>
            </card>
          </card>

          <!-- 审核状态的分类/标签列表-->
          <Card v-if="status=='verify'">
              <p slot="title">
              <Icon type="ios-paper"></Icon>分类/标签列表
              </p>

              <Card class="classwrapper cf">
                  <p slot="title">分类</p>
                  <!-- 分类数据 -->
                  <Tree :data="classifylist"
                  ></Tree>
              </card>

              <Card class="tagwrapper">
                <p slot="title">标签</p>
                <template v-for="item in taglist">
                  <Tag type="border" color="blue">{{item.title}}</Tag>
                    <Card class="cf">
                      <!-- 标签数据 -->
                      <Tree :data="item.children"
                      show-checkbox>
                      </Tree>
                    </card>
                </template>
              </card>
          </card>

          <div class="wrapper_editor">
            <Icon type="person"></Icon> 操作人：
              <span>{{resouredata.userinfo.editor}}
                (<Icon type="email"></Icon>
                {{resouredata.userinfo.editor_email}})
              </span>，
            <Icon type="clock"></Icon> 操作时间：
              <span>{{dataformat}}</span>
          </div>

          <!-- 如果是编辑状态 -->
          <template v-if="status=='edit'">

          <p class="error_wrapper" v-if="resouredata.check_info">
              <Icon type="android-close"></Icon>
              不合格原因：{{resouredata.check_info}}
          </p>

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
          </template>

          <!-- 如果是审核状态 -->
          <template v-if="status=='verify'">

            <p class="error_wrapper">
              <Icon type="android-close"></Icon>
              不合格原因：
                <i-input type="textarea"
                style="width:500px"
                :value.sync="verifydata.check_info"
                :autosize="true"
                placeholder="请输入...">
                </i-input>
            </p>

            <div class="wrapper_editor">
              <Icon type="person"></Icon> 审核人：
              <span>{{resouredata.userinfo.reviewer}}
                (<Icon type="email"></Icon>
                {{resouredata.userinfo.reviewer_email}})
              </span>
              <Icon type="clock"></Icon> 审核时间：
              <span>{{resouredata.userinfo.reviewed_at}}</span>
            </div>

            <div  class="btn_wrapper">
            <i-button
            type="success"

              size="large"
            icon="thumbsup"
            :disabled = "!verifydata.check_info == ''"
            v-on:click.stop.prevent="verifysuc()"
            >审核通过</i-button>

            <i-button type="error"
            icon="thumbsdown"
            size="large"
            :disabled = '!verifydata.check_info'
            v-on:click.stop.prevent="verifyfail()"
            >审核未通过</i-button>
          </div>

          </template>

         </div>
      </div>
</template>

<script>
//标签类型（0分类、1标签组、2标签）
import util from '../libs/util';
import config from '../config/config';
    export default {
        name:"resouredetail",
        data() {
            return {
              //登陆信息
              logininfo:"",
              //资源详情数据
              resouredata:{
                userinfo:""
              },

              detailtreedata:[],

              // 整合好的某资源的标签树的数据
              showtreedata:[],
              detailtaglist:[],
              //某分类下的标签组和标签数据
              taglist:[] ,
              // 全量分类数据(编辑用)
              classifylist:[],
              // 全量分类数据(审核用)
              classifylistdisabled:[],
              // 某资源的标签数据(审核用)
              taglistdisabled:[],
              verifytreedata:[],
              //修改的资源数据
              changedata:{
                  "keywords" : [],
                  "clevel" :"",
                  "artist": "",
                  "nickname":"",
                  "userinfo" : {
                    "editor" : "",
                    "editor_email":""
                  }
              },
              // 审核的资源数据
              verifydata:{
                  "clevel" :"",
                  "check_info":"",
                  "userinfo" : {
                    "reviewer" :"",
                    "reviewer_email":""
                  }
              }
                }
        },
        computed:{
          editdisable(){
            if (this.resouredata.clevel === 5||this.resouredata.clevel === 3||this.resouredata.clevel === 4){
              return true
            }
          },
          clevel(){
            return util.getResouceStatus(this.resouredata.clevel);
          },
          id(){
            return this.$route.params.id
          },
          //页面状态：detail/edit/verify
          //如没有action,则设置为detail
          status(){
            if (this.$route.query.action){
              return this.$route.query.action
            }
            else {
              return "detail"
            }
          },
          dataformat(){
            return util.dataformat(this.resouredata.userinfo.edited_at);
          }
        },
        ready(){
          this.getlogininfo();
          this.getresoure();
          this.getclasslist();
        },
        methods:{
          // 拿登陆信息
          getlogininfo(){
            this.logininfo = util.getCookie('CURRENT_USER')
            this.logininfo=JSON.parse(JSON.parse(this.logininfo));
          },
          //获取资源详情
          getresoure(){
            let url= `/airesources/${this.$route.params.id}?tags=1&userinfo=1&tagnew=1&tagtree=1`;
            util.ajax({
                method: 'GET',
                url: util.getUrl(url)
                })
                .then((res) => {
                    this.resouredata = res.data.data;

                    //时长处理
                    this.resouredata.length = util.formatSeconds(this.resouredata.length)

                    //体积处理
                    this.resouredata.size = util.formatFileSize(this.resouredata.size)

                    //处理预制关键词
                    this.resouredata.keywords = this.resouredata.keywords.join(",");

                    //整合标签页数据，供页面显示
                    this.edittree();


                })
                .catch(function(error) {
                    console.error(error);
                });
          },

          //整合标签页数据，供页面显示
          edittree(){

            // 详情用
            this.detailtreedata.push(this.resouredata.tagnew);
            this.detailtaglist=util.gettaglist(this.detailtreedata);

            // 编辑用
            this.showtreedata.push(this.resouredata.tagtree);
            this.taglist=util.gettaglist(this.showtreedata);

            //展开子分类
            // util.expandtree(this.detailtreedata);
          },

          //获取分类数据
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

                    // 编辑用全量分类数据
                    this.classifylist = res.data.data.children;

                    //  审核用
                    util.selectclass(this.classifylist,this.resouredata.catearr.id)
                })
                .catch(function(error) {
                    console.error(error);
                });
          },

          //点击了某个分类的逻辑
          gettaglist(node){
          let id=0;
          console.log(node);
          if (node[0].id){
            id = node[0].id
          }
          else if(node[0].tagId){
            id = node[0].tagId
          }
          // 如果选择的是资源原有的分类，则显示已经打的标签
          if (id == this.resouredata.catearr.id){
            this.taglist=util.gettaglist(this.showtreedata);
            return false;
          }

            // 如果点击的不是根节点的话，则不产生请求
            if (node[0].pid!=0){
              return false;
            }

            //取消原本勾选的所有分类
            util.uncheckedtree(this.classifylist);

            //取消原本根分类的选择状态
            util.unselecttree(this.classifylist);

            //这个根分类之外的分类disable
            util.disableclass(this.classifylist,id);

            //获取某分类的标签数据
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
                  })
                  .catch(function(error) {
                      console.error(error);
                  });

              //保存当前选择的分类,清楚已选择标签
              this.changedata.tagnew=[];
              this.changedata.tagnew[0]=id;

          },
          //把选择的分类添加到changedata
          getcheckclass(nodearr){
            nodearr.forEach((value)=>{
              this.changedata.tagnew.push(value.id);
            })
          },
          //勾选某节点
          selectclass(node){
            //首先获取此节点的标签数据
            this.gettaglist(node);
            //取消其他子分类的勾选
            util.checkclass(this.classifylist,node);
          },
          //获取一个标签组已经选中的标签,放在标签组的tagsid属性内
          getchecktags(nodearr){
              console.log(nodearr);
              if (nodearr[0].id){
                nodearr.forEach((value)=>{
                  this.changedata.tagnew.push(value.id)
                })
              }
              else if (nodearr[0].tagId){
                nodearr.forEach((value)=>{
                  this.changedata.tagnew.push(value.tagId)
                })
              }
          },
          //转到编辑模式
          toedit(){
            this.$router.go({
              name: "resouredetail",
              params:{
                id:this.$route.params.id
              },
              query:{
                action:'edit'
              }
            });
          },

          //转到查看模式
          todetail(){
            this.$router.go({
              name: "resouredetail",
              params:{
                id:this.$route.params.id
              },
              query:{
                action:'detail'
              }
            });
          },

          //保存修改
          tosave(){
            this.changedata.clevel=2;
            this.tosend();
          },

          //提交修改
          tosubmit(){
            this.changedata.clevel=3;
            this.tosend();
          },

          tosend(){
            this.changedata.keywords=this.resouredata.keywords.split(",");
            this.changedata.artist=this.resouredata.artist;
            this.changedata.nickname=this.resouredata.nickname;
            this.changedata.userinfo.editor=this.logininfo.loginName;
            this.changedata.userinfo.editor_email=this.logininfo.email;
            let formdata = new FormData();
            formdata.append("json",JSON.stringify(this.changedata));
            // 提交资源本身信息
            let url=`/airesources/${this.$route.params.id}`;

            util.ajax({
                method: 'POST',
                url: util.getUrl(url),
                data:formdata
                })
                .then((res) => {
                  util.tip(res);
                  // 提交后各个临时数据清零，重新请求资源
                  this.detailtreedata=[];
                  this.showtreedata=[];
                  this.detailtaglist=[];
                  // this.taglistdisabled=[];
                  // this.verifytreedata=[];
                  this.getresoure();
                })
                .catch(function(error) {
                    console.error(error);
                });
          },

          //审核通过
          verifysuc(){
            // 1	审核通过（开发和联调环境可用）
            this.verifydata.clevel=4;
            this.tosendverify();
          },
          //审核未通过
          verifyfail(){
            // -3	审核失败
            this.verifydata.clevel=2;
            this.tosendverify();
          },
          //发送审核信息
          tosendverify(){

            this.verifydata.userinfo.reviewer=this.logininfo.loginName;
            this.verifydata.userinfo.reviewer_email=this.logininfo.email;

            let formdata = new FormData();
            formdata.append("json",JSON.stringify(this.verifydata));
            let url=`/airesources/${this.$route.params.id}`;
            util.ajax({
                method: 'POST',
                url: util.getUrl(url),
                data:formdata
                })
                .then((res) => {
                  util.tip(res);
                  // 审核后再取一遍资源详情
                  this.getresoure();
                })
                .catch(function(error) {
                    console.error(error);
                });
          },
        }

    }
</script>
