<template>
<div class="layout-header">
</div>
<div class="layout-breadcrumb">
    <Breadcrumb>
        <Breadcrumb-item>首页</Breadcrumb-item>
        <Breadcrumb-item>资源编辑审核</Breadcrumb-item>
    </Breadcrumb>
</div>
<div class="layout-content">
    <div class="layout-content-main">
        <!--批量更新-->
        <div class="resource-update">

            <div class="update-btn">
                <a v-link="{name:'voicesupload'}"
                style="display:inline-block;vertical-align: top;">
                    <i-button type="primary">上传资源</i-button>
                </a>
                <div style="display:inline-block">
                    <Upload :format="['xls', 'xlsx', 'csv']"
                    :on-format-error="handleFormatError"
                    :max-size="10240"
                    :on-exceeded-size="handleMaxSize"
                    :on-success="handleSuccess"
                    multiple :action="upUrl">
                        <i-button type="primary" icon="refresh">
                            批量更新
                        </i-button>
                    </Upload>
                </div>
            </div>
        </div>

        <div class="resource-search">
            <div class="normal-search">
                <Row>
                    <i-col span="12">
                        <i-input :value.sync="formItem.search"
                        placeholder="模糊搜索关键词"
                        @on-enter="searchQuery(0)">
                            <i-button slot="append"
                            icon="ios-search" @click="searchQuery(0)">
                            </i-button>
                        </i-input>
                    </i-col>
                    <i-col span="12">
                        <div class="high-btn">
                            <i-button type="primary"
                            @click="showHighSearch">高级检索</i-button>
                        </div>
                    </i-col>
                </Row>
            </div>
            <div class="high-search" v-show="showbox">
                <i-form v-ref:form-item :model="formItem"
                :rules="ruleCustom" :label-width="80" inline>
                    <Form-item label="资源名称：">
                        <i-input :value.sync="iname"
                        placeholder="请输入">
                        </i-input>
                    </Form-item>

                    <Form-item label="ID：">
                        <i-input :value.sync="iid" placeholder="请输入">
                        </i-input>
                    </Form-item>

                    <Form-item label="作者/歌手：" prop="artist">
                        <i-input :value.sync="formItem.artist" placeholder="请输入">
                        </i-input>
                    </Form-item>
                    <Form-item label="分类：" prop="tagnew">
                        <!-- <i-select :model.sync="formItem.tagnew" placeholder="请选择" style="width:166px">
                            <template v-for="cats in catsArr">
                                <i-option :value="cats.id | toInt">{{cats.title}}</i-option>
                            </template>
                        </i-select> -->
                        <Cascader v-if="tag.show" :data="tag.data" :value.sync="formItem.tagnew" change-on-select></Cascader>
                        <Cascader v-else :data="tag.data" :value.sync="formItem.tagnew" change-on-select></Cascader>
                    </Form-item>
                    <Form-item label="来源：" prop="source">
                        <i-select :model.sync="formItem.source" placeholder="请选择" style="width:166px">
                            <template v-for="item in sourceArr">
                                <i-option :value="item">{{item}}</i-option>
                            </template>
                        </i-select>
                    </Form-item>
                    <Form-item label="关键词：">
                        <i-input :value.sync="ikeywords" placeholder="请输入">
                        </i-input>
                    </Form-item>
                    <Form-item label="编辑人：" prop="userinfo.reviewer">
                        <i-input :value.sync="formItem.userinfo.reviewer" placeholder="请输入"></i-input>
                    </Form-item>
                    <Form-item label="编辑时间：">
                        <row>
                            <i-col span="11">
                                <Date-picker type="date" placeholder="开始时间" :value.sync="reviewed.begintime" style="width: 166px"></Date-picker>
                            </i-col>
                            <i-col span="2">
                                <div class="center-line">
                                    -
                                </div>
                            </i-col>
                            <i-col span="11">
                                <Date-picker type="date" placeholder="结束时间" :value.sync="reviewed.endtime" style="width: 166px"></Date-picker>
                            </i-col>
                        </row>
                    </Form-item>
                    <Form-item label="审核人：" prop="userinfo.editor">
                        <i-input :value.sync="formItem.userinfo.editor" placeholder="请输入"></i-input>
                    </Form-item>
                    <Form-item label="审核时间：">
                        <row>
                            <i-col span="11">
                                <Date-picker type="date" placeholder="开始时间" :value.sync="editor.begintime" style="width: 166px"></Date-picker>
                            </i-col>
                            <i-col span="2">
                                <div class="center-line">
                                    -
                                </div>
                            </i-col>
                            <i-col span="11">
                                <Date-picker type="date" placeholder="结束时间" :value.sync="editor.endtime" style="width: 166px"></Date-picker>
                            </i-col>
                        </row>
                    </Form-item>
                    <Form-item label="审核状态：" prop="clevel">
                        <i-select :model.sync="formItem.clevel" placeholder="请选择" style="width:166px">
                            <template v-for="item in verifyStatus">
                                <i-option :value="item.value | toInt ">{{item.text}}</i-option>
                            </template>
                        </i-select>
                    </Form-item>
                    <Form-item :label-width="10">
                        <i-button type="primary" @click="searchQuery(0)">搜索</i-button>
                        <i-button type="ghost" @click="handleReset('formItem')" style="margin-left: 5px">重置</i-button>
                    </Form-item>
                </i-form>
            </div>
        </div>
        <div v-if="spinShow" class="spin-box">
            <Spin size="large" fix></Spin>
        </div>
        <div v-else class="search-data">
            <!--资源表格-->
            <i-table style="max-width:1490px" :content="self" size="small" stripe :columns="columns" :data="searchData" @on-selection-change="selectChange">
            </i-table>

            <div class="batch-action">
                <i-button type="ghost" @click.stop.prevent="markTags()">
                    批量打分类/标签
                </i-button>

                <i-button type="ghost" @click.stop.prevent="addTags()">
                    批量添加标签
                </i-button>

                <i-button type="ghost" @click.stop.prevent="removeTags()">
                    批量清除标签
                </i-button>

                <i-button type="ghost" @click.stop.prevent="verifyAll()">
                    批量审核通过
                </i-button>

            </div>

            <div class="paging-box">
                <div class="paging-container">
                    <Page :total="pageTotal" :page-size="formItem.count" :page-size-opts="[50,100,200]" show-total :current="pageCurr" show-sizer @on-change="changePage" @on-page-size-change="pageSizeChange" show-elevator></Page>
                </div>
            </div>

        </div>
    </div>
</div>
</template>

<script type="text/babel">
import config from '../config/config';
import util from '../libs/util';
import qs from 'qs';
import { setTags } from '../store/action';

let verifyStatus = [
    {
        value: -2,
        text: '已删除'
    },
    {
        value: -1,
        text: '不处理'
    },
    {
        value: 0,
        text: '已下架'
    },
    {
        value: 1,
        text: '未提交'
    },
    {
        value: 2,
        text: '编辑中'
    },
    {
        value: 3,
        text: '待审核'
    },
    {
        value: 4,
        text: '待上架'
    },
    {
        value: 5,
        text: '已上架'
    }
]
export default {
    name: "editoraudit",
    data() {
        const validateTag = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('分类不能为空'));
            }else{
                return callback();
            }
        };
        return {
            spinShow: true,
            upUrl: '',
            verifyStatus,
            self: this,
            showbox: false,
            ikeywords: '',
            //搜索返回的资源数据
            searchData: [],
            pageTotal: 0,
            pageCurr: 1,
            playStatus: [],
            catsArr: [],
            sourceArr: [],
            lock: false,
            selectTableData:[],
            reviewed: {
                begintime: '',
                endtime: ''
            },
            editor: {
                begintime: '',
                endtime: ''
            },
            iname: '',
            iid: '',
            formItem: {
                type:1,
                offset: 0,
                count: 50,
                userinfo: {
                    reviewer: '',
                    reviewed_at: [],
                    editor: '',
                    edited_at: []
                }
            },
            columns: [{
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: 'ID',
                    key: 'id',
                    align: 'center',
                    width: 100
                },
                {
                    title: '资源名称',
                    key: 'name',
                    sortable: true,
                    ellipsis: true,
                    width: 180,
                    render(row, column, index) {
                        return `<i-button type="ghost" shape="circle" :icon="playStatus[${index}].status" size="small" @click="playPause(${index})"></i-button>
                        <audio id="audio${index}" preload="none">
                        <source src="${row.content}" type="audio/mpeg"></audio>
                        <a v-link="{name:'resouredetail', params:{id:${row.id}}, query: {action: 'detail'}}" target="_blank">${row.name}</a>`;
                    }
                },
                {
                    title: '分类',
                    key: 'category',
                    align: 'center',
                    width: 100
                },
                {
                    title: '来源',
                    key: 'source',
                    align: 'center',
                    width: 100
                },
                {
                    title: '审核状态',
                    key: 'clevel',
                    align: 'center',
                    width: 120,
                    render(row) {
                        let thistag = util.getResouceStatus(row.clevel)
                        return thistag;
                    }
                },
                {
                    title: '作者/歌手',
                    key: 'artist',
                    align: 'center',
                    width: 100
                },
                {
                    title: '编辑人',
                    key: 'userinfo.editor',
                    align: 'center',
                    width: 80
                },
                {
                    title: '编辑时间',
                    align: 'center',
                    key: 'userinfo.edited_at',
                    width: 160,
                    render(row, column, index) {
                        return util.dataformat(row.userinfo.edited_at);
                    }
                },
                {
                    title: '审核人',
                    key: 'userinfo.reviewer',
                    align: 'center',
                    width: 100
                },
                {
                    title: '审核时间',
                    key: 'userinfo.reviewer_at',
                    align: 'center',
                    width: 160,
                    render(row, column, index) {
                        return util.dataformat(row.userinfo.reviewed_at);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 250,
                    align: 'center',
                    fixed: 'right',
                    render(row, column, index) {
                        let removeST= false;
                        let upST = false;
                        let editST = false;
                        let verifyST = false;
                        if (row.clevel == 5) { //已上架
                             removeST= true;
                             upST = true;
                             editST = true;
                             verifyST = true;
                        }else if (row.clevel == 4) { //待上架
                            removeST= true;
                            editST = true;
                            verifyST = true;
                        }else if (row.clevel == 0) { //已下架
                            verifyST = true;
                        }else if (row.clevel == 1) { //未提交
                            upST = true;
                            verifyST = true;
                        }else if (row.clevel == 2) { //编辑中
                            upST = true;
                        }else if (row.clevel == -1) { //不处理
                            upST = true;
                            verifyST = true;
                        }else if (row.clevel == 3){  //待审核
                            removeST= true;
                            editST = true;
                        }else if(row.clevel == -2){  //已删除
                            removeST= true;
                            upST = true;
                            editST = true;
                            verifyST = true;
                        }else{  //未知
                            removeST= true;
                            upST = true;
                            editST = true;
                            verifyST = true;
                        }

                        return `<a v-link="{name:'resouredetail', params:{id:${row.id}}, query: {action: 'edit'}}" target="_blank"><i-button :disabled="${editST}" type="primary"size="small">编辑</i-button></a>
                        <a v-link="{name:'resouredetail', params:{id:${row.id}}, query: {action: 'verify'}}" target="_blank"><i-button :disabled="${verifyST}" type="primary" size="small">审核</i-button></a>
                        <i-button :disabled="${upST}" type="warning" size="small"
                        @click="upShelves(${index})">直接上架</i-button>
                        <i-button :disabled="${removeST}" type="error" size="small" @click="removeItem(${index})">删除</i-button>
                        `;
                    }
                }
            ],
            ruleCustom: {
                tagnew: [
                    { validator: validateTag, trigger: 'change' }
                ]
            },
            tag:{
                value:[],
                data:[],
                show: true
            }
        }
    },
    ready() {
        this.getCats();
        this.getSource();
        this.searchQuery(0);
        this.getTagList();
        this.upUrl = config.ajaxUrl + '/fileinput';
    },
    vuex: {
        actions:{
            setTags
        }
    },
    methods: {
        getTagList(){   //查询联动分类
            let json = {
                type: 0
            };
            util.ajax({
                    method: 'POST',
                    url: util.getUrl('/tag/list'),
                    data: json
                })
                .then((response) => {
                    let res = response.data;
                    if (res.result == 0) {
                        console.log(res.data.children);
                        this.$set('tag.data', res.data.children)
                    } else {
                        this.$Message.warning(res.desc);
                    }

                })
                .catch(function(error) {
                    console.error(error);
                });
        },
        handleSuccess(res, file) {  //上传成功钩子
            this.$Message.success(res.msg);
        },
        handleFormatError(file) { //上传格式提示
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 excel 或 csv 格式的文件。'
            })
        },
        handleMaxSize(file) { //上传文件大小提示
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 10M。'
            })
        },
        showHighSearch() { //高级检索
            this.showbox = !this.showbox;
        },
        getSource(){    //获取来源
            this.sourceArr = util.getSource;
        },
        getCats() { //获取分类
            let json = {
                appId: '',
                id: 0,
                type: 0,
                depth: 2
            };
            util.ajax({
                    method: 'POST',
                    url: util.getUrl('/tag/list2'),
                    data: json
                })
                .then((response) => {
                    let res = response.data;
                    if (res.result == 0) {
                        this.catsArr = res.data
                    } else {
                        this.$Message.warning(res.desc);
                    }

                })
                .catch(function(error) {
                    console.error(error);
                });
        },
        parseTime(time){
            return Date.parse(new Date(time)) / 1000;
        },
        handleReset (name) {
            this.$refs[name].resetFields();
            this.editor = {
                begintime: '',
                endtime: ''
            },
            this.reviewed = {
                begintime: '',
                endtime: ''
            },
            this.ikeywords = '';
            this.iname = '';
            this.iid = '';
            this.tag.show = !this.tag.show
        },
        searchQuery(curr) { //模糊和精确搜索
            if (this.reviewed.begintime !== '') {
                this.formItem.userinfo.reviewed_at[0] = this.parseTime(this.reviewed.begintime);
            }else {
                this.formItem.userinfo.reviewed_at[0] = 0
            }
            if (this.reviewed.endtime !== '') {
                this.formItem.userinfo.reviewed_at[1] = this.parseTime(this.reviewed.endtime);
            }else {
                this.formItem.userinfo.reviewed_at[1] = 0
            }
            if (this.editor.begintime !== '') {
                this.formItem.userinfo.edited_at[0] = this.parseTime(this.editor.begintime);
            }else {
                this.formItem.userinfo.edited_at[0] = 0
            }
            if (this.editor.endtime !== '') {
                this.formItem.userinfo.edited_at[1] = this.parseTime(this.editor.endtime);
            }else {
                this.formItem.userinfo.edited_at[1] = 0
            }
            this.pageCurr = 1;
            this.formItem.offset = curr;
            if (this.ikeywords !== '') {
                this.formItem.keywords = this.ikeywords.split(/[,，]/);
            }else {
                this.formItem.keywords = null
            }
            if (this.iname !== '') {
                this.formItem.name = this.iname.split(';');
            }else {
                this.formItem.name = null
            }
            if (this.iid !== '') {
                this.formItem.id = this.iid.split(' ');
            }else {
                this.formItem.id = null
            }

            console.log(this.formItem);
            this.$Loading.start();
            util.ajax({
                    method: 'post',
                    url: config.ajaxUrl + "/airesources/query",
                    data: this.formItem
                })
                .then((response) => {
                    let res = response.data;
                    if (res.result == 0) {
                        this.$Loading.finish();
                        this.spinShow = false;
                        this.lock = true;
                        this.searchData = res.data.resources;
                        this.pageTotal = res.data.total;
                        this.searchData.forEach((val, idx, arr) => {
                            this.playStatus.$set(idx, {
                                status: 'play'
                            })
                        })
                    } else {
                        this.$Message.warning(res.desc);
                    }
                })
                .catch((error) => {
                    this.$Loading.error();
                    this.spinShow = false;
                    console.log(error);
                });
        },
        selectChange(selection) { //获取选中数据
            this.selectTableData = selection;
        },
        changePage(curr) {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
            this.searchQuery(curr);
            this.pageCurr = curr;
        },
        pageSizeChange(size){
            this.formItem.count = size;
            this.searchQuery(0);
        },
        linkDetail(index) { //资源名称跳转
            this.$router.go({
                name: "resouredetail",
                params: {
                    id: this.searchData[index].id
                },
                query: {
                    action: 'detail'
                }
            })
        },
        editItem(index) { //编辑
            this.$router.go({
                name: "resouredetail",
                params: {
                    id: this.searchData[index].id
                },
                query: {
                    action: 'edit'
                }
            })
        },
        verifyItem(index) { //审核
            this.$router.go({
                name: "resouredetail",
                params: {
                    id: this.searchData[index].id
                },
                query: {
                    action: 'verify'
                }
            })
        },
        upShelves(index) { //上架
            this.searchData[index].clevel = 5;
            let jsonData = {
                json: JSON.stringify(this.searchData[index])
            }
            util.ajax({
                    method: 'post',
                    url: config.ajaxUrl + '/airesources/' + this.searchData[index].id,
                    data: qs.stringify(jsonData)
                })
                .then((response) => {
                    let res = response.data;
                    if (res.result == 0) {
                        this.$Message.success(res.msg);

                    } else {
                        this.$Message.warning(res.desc);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        removeItem(index) { //删除行
            this.searchData[index].clevel = -2;
            let jsonData = {
                json: JSON.stringify(this.searchData[index])
            }
            util.ajax({
                    method: 'post',
                    url: config.ajaxUrl + '/airesources/' + this.searchData[index].id,
                    data: qs.stringify(jsonData)
                })
                .then((response) => {
                    let res = response.data;
                    if (res.result == 0) {
                        this.$Message.success(res.msg);
                        this.searchData.splice(index, 1);

                    } else {
                        this.$Message.warning(res.desc);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        vuexData(){
            let tagsArr = [];
            this.selectTableData.forEach((val, index, arr) => {
                tagsArr.$set(index, {
                    id: val.id
                })
            })
            this.setTags(tagsArr)
        },
        markTags() { //批量打标签
            this.vuexData();
            this.$router.go({
                name: "multitagmark"
            })
        },
        addTags() { //批量添加标签
            this.vuexData();

            this.$refs['formItem'].validateField('tagnew', (valid) => {
                console.log(valid);
                if (valid) {
                   this.$Message.error('请选择分类检索!');
                   this.showbox = true;
                   this.lock = false;
               } else{
                   if (!this.lock) {
                        this.$Message.error('请点击搜索按钮检索!');
                        return false
                   }
                   this.$router.go({
                       name: "multitagadd"
                   })
               }
           })

        },
        vuexData2(){
            let tagsArr = [];
            this.selectTableData.forEach((val, index, arr) => {
                tagsArr.$set(index,{
                    id:val.id,
                    name:val.name,
                    artist:val.artist,
                    category:val.category,
                    source:val.source,
                });
            })
            this.setTags(tagsArr);
        },
        //批量清除标签
        removeTags() {
            this.vuexData2();
            this.$router.go({
              name: "multitagclean"
            });
        },
        //批量审核
        verifyAll() {
            let vm = this;
            vm.$Modal.confirm({
                title: '',
                content: '<p>确认批量审核通过？</p>',
                onOk: () => {
                    let paramsData = {
                        res_db: "aires",
                        resources: []
                    };
                    this.selectTableData.forEach((val, index, arr) => {
                        paramsData.resources.$set(index, {
                            id: val.id,
                            clevel: 4,
                            userinfo: val.userinfo
                        })
                    })
                    util.ajax({
                            method: 'post',
                            url: config.ajaxUrl + '/airesources/batch',
                            data: paramsData
                        })
                        .then((response) => {
                            let res = response.data;
                            if (res.result == 0) {
                                this.$Message.success(res.msg);
                                setTimeout(function() {
                                    vm.searchQuery(0);
                                }, 1000);
                            } else {
                                this.$Message.warning(res.desc);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                },
                onCancel: () => {
                  return false;
                }
            });
        },
        playPause(index) {  //播放
            let target = event.target;
            let myAudio = document.getElementById('audio' + index);
            if (myAudio.paused) {

                this.playStatus.forEach((val, idx, arr)=>{
                    if(idx !== index){
                        let iAudio = document.getElementById('audio' + idx);
                        this.playStatus[idx].status = 'play';
                        iAudio.currentTime = 0;
                        iAudio.pause();
                    }
                })

                this.playStatus[index].status = 'pause';
                setTimeout(function() {
                    myAudio.play();
                }, 150);
            } else {
                this.playStatus[index].status = 'play';
                myAudio.pause();
            }
        }

    },
    filters: {
        toInt: function(v) {
            return parseInt(v);
        }
    },
    route: {
        data: function(transition) {
            transition.next();
        }
    }

}
</script>
<style lang="less" scoped>
.layout-breadcrumb {
    padding: 10px 15px 0;
}

.layout-content {
    min-height: 200px;
    margin: 15px;
    background: #fff;
    border-radius: 4px;
}

.layout-content-main {
    padding: 10px;
    min-height: 600px;
}
.resource-update {
    border-bottom: 1px solid #d7dde4;
    min-height: 32px;
    overflow: hidden;
    padding-bottom: 10px;
    margin-bottom: 20px;
    .update-btn {
        float: right;
    }
}
.normal-search {
    margin-bottom: 20px;
    .high-btn {
        margin-left: 10px;
    }
}
.search-total {
    border-top: 1px solid #d7dde4;
    padding: 20px 0;
    .page-total {
        line-height: 24px;
        text-align: right;
        & > span {
            color: #5cadff;
        }
    }
}
.batch-action {
    padding-top: 10px;
}
.paging-box {
    min-height: 32px;
    overflow: hidden;
    margin: 10px;
    padding-bottom: 30px;
    .paging-container {
        float: right;
    }
}
.fl-title {
    line-height: 24px;
    display: inline-block;
}
.center-line {
    width: 30px;
    text-align: center;
}
.search-data{
    position: relative;
}
.spin-box{
    height: 200px;
    width: 100%;
    text-align: center;
    position: relative;
}
</style>
