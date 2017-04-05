<style scoped>
.layout-breadcrumb {
    padding: 10px 15px 0;
}

.layout-content {
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
}

.layout-content-main {
    padding: 10px;
}

.div-split {
    margin: 5px 0px;
}

.demo-upload-list {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
}

.demo-upload-list img {
    width: 100%;
    height: 100%;
}

.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}

.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
<template>
<div class="layout-breadcrumb">
    <Breadcrumb>
        <Breadcrumb-item>首页</Breadcrumb-item>
        <Breadcrumb-item>歌单管理</Breadcrumb-item>
        <Breadcrumb-item>新建专辑</Breadcrumb-item>
    </Breadcrumb>
</div>
<div class="layout-content">
    <div class="layout-content-main">
        <Row>
            <Steps :current="0">
                <Step title="新建专辑" content="专辑内容编辑.."></Step>
                <Step title="添加资源" content="歌单内容编辑.."></Step>
                <Step title="资源整理" content="整理已添加的资源.."></Step>
            </Steps>
        </Row>
        <div class="div-split">&nbsp;</div>
        <Row>
            <i-col span="12">
                <i-form v-ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="120">
                    <Form-item label="(父)专辑：">
                        <i-input :value.sync="formValidate.pname" disabled placeholder="请输入专辑名称.."></i-input>
                    </Form-item>

                    <Form-item label="专辑名称：" prop="name">
                        <i-input :value.sync="formValidate.name" placeholder="请输入子专辑名称.."></i-input>
                    </Form-item>

                    <Form-item label="规约词：">
                        <i-input :value.sync="formValidate.nickname" placeholder="请输入规约词(词与词之间请用半角逗号分隔).."></i-input>
                    </Form-item>

                    <Form-item label="专辑类型：" prop="type">
                        <i-select :model.sync="formValidate.type">
                            <i-option v-for="item in typelist" :value="item.value">{{ item.label }}</i-option>
                        </i-select>
                    </Form-item>
                    <Form-item label="添加封面：">

                        <div class="demo-upload-list" v-for="item in uploadList">
                            <template v-if="item.status === 'finished'">
                                <img :src="item.url">
                                <div class="demo-upload-list-cover">
                                  <Icon type="ios-eye-outline" @click="handleView(item.name)"></Icon>
                                  <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
                                </div>
                            </template>
                            <template v-else>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template>
                        </div>
                        <Upload
                          v-ref:upload
                          :show-upload-list="false"
                          :on-success="handleSuccess"
                          :format="['jpg','jpeg','png']"
                          :max-size="2048"
                          :on-format-error="handleFormatError"
                          :on-exceeded-size="handleMaxSize"
                          :before-upload="handleBeforeUpload"
                          type="drag"
                          action="http://xyzdev.resourcebr.roobo.com/fileinput"
                          style="display: inline-block;width:100px;vertical-align: top;">
                            <div style="height:100px;width:100px;padding-top:20%;">
                              <Icon type="camera" size="20"></Icon>
                              <p>上传{{upName}}封面</p>
                              <p style="margin-top:-15px;">{{upSzie}}</p>
                              
                            </div>
                        </Upload>
                        <Modal title="查看图片" :visible.sync="largeImg.visible">
                            <img :src="largeImg.name"
                            v-if="largeImg.visible"
                            style="width:100%">
                        </Modal>
                    </Form-item>
                    <Form-item>
                        <i-button type="primary" @click="addCategory('formValidate', 'ok')">完成</i-button>&nbsp;&nbsp;
                        <i-button type="primary" @click="tonext('formValidate', 'next')">下一步</i-button>
                    </Form-item>`
                </i-form>
            </i-col>
        </Row>
    </div>
</div>
</template>
<script>
import config from '../config/config';
import util from '../libs/util';
import qs from 'qs';



export default {
    data() {
        return {
            id: 0,
            newId: 0,
            upName:'小',
            upSzie:"140*140",
            //弹出大图
            largeImg: {
                name: '',
                visible: false
            },
            //专辑内容数据
            formValidate: {
                pid: '',
                pname:"",
                name: '',
                nickname:null,
                type: '',
                img_large : '',
                img_small : '',
                editor:"",
                editor_email:"",
            },
            //类型
            typelist: util.albumTypeList,
            ruleValidate: {
               name: [
                   { required: true, message: '专辑名不能为空', trigger: 'blur' }
               ],
               type: [
                   { required: true, message: '请选择专辑类型', trigger: 'change' }
               ]
            }
        }
    },
    computed: {
        uploadList() {
            return this.$refs.upload ? this.$refs.upload.fileList : [];
        }
    },
    ready(){
        this.formValidate.editor = util.getCurrentEditor()[0];
        this.formValidate.editor_email = util.getCurrentEditor()[1];
        
        if(this.id != 0 && !this.$route.query.p){ 
            this.loadData();
            return;
        }

        if(this.$route.query.p){
            this.formValidate.name = "";
            this.formValidate.pid = this.id;
            this.formValidate.pname = this.$route.query.p;
        }

        
        
    },
    methods: {
        loadData(){
            util.ajax({
                method: 'GET',
                url: util.getUrl(`/album/${this.id}`),
            })
            .then((response) => {
                let res = response.data.data;
                res.nickname = res.nickname.join(",");//转化成字符串
                this.formValidate = {
                    pid: res.pid,
                    pname:res.pname,
                    name: res.name,
                    nickname:res.nickname,
                    type: res.type,
                    img_large : res.img_large,
                    img_small : res.img_small
                };
            })
            .catch((error) => {
                console.log(error);
            });
        },
        tonext(name, cat) {  //下一步
            this.addCategory(name, cat);
        },
        addCategory(name, cat) {    //新建专辑
            let narr = [];
            if(this.formValidate.nickname){
                narr = this.formValidate.nickname.split(",");
            }
            this.formValidate.nickname = narr;

            let jsonData = {
                json: JSON.stringify(this.formValidate)
            };
            
            
            let newUrl = '';
            let vm = this;
            if (this.id == 0) {
                newUrl = '/album/new'
            }else {
                newUrl = '/album/' + this.id
            }

            if(this.$route.query.p){
                newUrl = '/album/new'
            }
            console.log("post url:" + newUrl);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('提交成功!');
                    util.ajax({
                            method: 'post',
                            url: util.getUrl(newUrl),
                            data: qs.stringify(jsonData)
                        })
                        .then((response) => {
                            let res = response.data;
                            if (res.result == 0) {
                                this.$Message.success(res.msg);
                                this.newId = res.data.id;
                                if (cat == 'ok') {
                                    vm.$router.go({
                                        name: "categorylist"
                                    });
                                }else if (cat == 'next') {
                                    setTimeout(function() {
                                        vm.$router.go({
                                            name: "newliststep3",
                                            params: {
                                                listid: res.data.id
                                            }
                                        })
                                    }, 1000);
                                }

                            } else {
                                this.$Message.warning(res.desc);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        handleView(name) {
            this.largeImg.name = name;
            this.largeImg.visible = true;
        },
        goback(){
            this.$router.go({name: "categorylist"});
        },
        handleRemove(file) {
            // 从 upload 实例删除数据
            const fileList = this.$refs.upload.fileList;
            this.upName = '大';
            this.upSzie = "750*640";
            if(fileList.length == 1){
                this.upName = '小';
                this.upSzie = "140*140";
                this.formValidate.img_small = '';
            }else {
                this.formValidate.img_large = '';
            }
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess(res, file) {
            console.log(file);
            file.url = res.data[0];
            file.name = res.data[0];
            // 从 upload 实例添加数据
            const fileList = this.$refs.upload.fileList;
            this.upName = '大';
            this.upSzie = "750*640";
            if(fileList.length == 2){
                this.upName = '';
                this.upSzie = "";
                this.formValidate.img_large = res.data[0];
            }else {
                this.formValidate.img_small = res.data[0];
            }
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
            });
        },
        handleBeforeUpload() {
            const check = this.uploadList.length < 2;
            if (!check) {
                this.$Notice.warning({
                    title: '只能传二张图。'
                });
            }
            return check;
        },
    },
    route: {
        data: function(transition) {
            this.id = transition.to.params.listid;
            transition.next();
        }
    }
}
</script>