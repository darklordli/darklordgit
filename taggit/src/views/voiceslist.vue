<template>
<div class="layout-header">
</div>
<div class="layout-breadcrumb">
    <Breadcrumb>
        <Breadcrumb-item>首页</Breadcrumb-item>
        <Breadcrumb-item>音频资源管理</Breadcrumb-item>
        <Breadcrumb-item>音频资源列表</Breadcrumb-item>
    </Breadcrumb>
</div>
<div class="layout-content">
    <div class="layout-content-main">
        <div class="resource-update">
            <div class="update-btn">
                <Upload :format="['xls', 'xlsx', 'csv']" :on-format-error="handleFormatError" :max-size="10240" :on-exceeded-size="handleMaxSize" :on-success="handleSuccess" multiple :action="upUrl">
                    <i-button type="primary" icon="ios-cloud-upload-outline">批量更新</i-button>
                </Upload>
            </div>
        </div>
        <div class="resource-search">
            <div class="normal-search">
                <Row>
                    <i-col span="12">
                        <i-input :value.sync="formItem.search" placeholder="请输入..." @on-enter="searchQuery(0)">
                            <i-button slot="append" icon="ios-search" @click="searchQuery(0)"></i-button>
                        </i-input>
                    </i-col>
                    <i-col span="12">
                        <div class="high-btn">
                            <i-button type="primary" @click="showHighSearch">高级检索</i-button>
                        </div>
                    </i-col>
                </Row>
            </div>
            <div class="high-search" v-show="showbox">
                <i-form v-ref:form-item :model="formItem" :label-width="110" inline>
                    <Form-item label="资源名称：">
                        <i-input :value.sync="iname" placeholder="请输入"></i-input>
                    </Form-item>
                    <Form-item label="ID：">
                        <i-input :value.sync="iid" placeholder="请输入"></i-input>
                    </Form-item>
                    <Form-item label="作者/歌手：" prop="artist">
                        <i-input :value.sync="formItem.artist" placeholder="请输入"></i-input>
                    </Form-item>
                    <Form-item label="关键词：">
                        <i-input :value.sync="ikeywords" placeholder="请输入"></i-input>
                    </Form-item>
                    <Form-item label="分类：" prop="tagnew">
                        <i-select :model.sync="formItem.tagnew" placeholder="请选择" style="width:166px">
                            <template v-for="cats in catsArr">
                                <i-option :value="cats.id | toInt">{{cats.title}}</i-option>
                            </template>
                        </i-select>
                    </Form-item>
                    <Form-item label="来源：" prop="source">
                        <i-select :model.sync="formItem.source" placeholder="请选择" style="width:166px">
                            <template v-for="item in sourceArr">
                                <i-option :value="item">{{item}}</i-option>
                            </template>
                        </i-select>
                    </Form-item>
                    <Form-item label="优先级：" prop="priority">
                        <i-select :model.sync="formItem.priority" placeholder="请选择" style="width:166px">
                            <i-option :value="0 | toInt">0</i-option>
                            <i-option :value="1 | toInt">1</i-option>
                        </i-select>
                    </Form-item>
                    <Form-item label="资源状态：" prop="clevel">
                        <i-select :model.sync="iclevel" placeholder="请选择" style="width:166px">
                            <i-option :value="5 | toInt">已上架</i-option>
                            <i-option :value="0 | toInt">已下架</i-option>
                            <i-option :value="4 | toInt">待上架</i-option>
                        </i-select>
                    </Form-item>
                    <Form-item label="操作人：" prop="userinfo.editor">
                        <i-input :value.sync="formItem.userinfo.editor" placeholder="请输入"></i-input>
                    </Form-item>
                    <Form-item label="操作时间：">
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
                    <Form-item label="是否在APP显示：" prop="appshow">
                        <i-select :model.sync="formItem.appshow" placeholder="请选择" style="width:90px">
                            <i-option value="true">是</i-option>
                            <i-option value="false">否</i-option>
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
            <i-table style="max-width:1490px" :content="self" :columns="columns" :data="searchData" @on-selection-change="selectChange" size="small"></i-table>
            <div class="batch-action">
                <i-button type="ghost" @click="batchUpShelves(5)">批量上架</i-button>
                <i-button type="ghost" @click="batchDownShelves(0)">批量下架</i-button>
                <i-button type="ghost" @click="batchNo(-1)">批量不处理</i-button>
            </div>
            <div class="paging-box">
                <div class="paging-container">
                    <Page :total="pageTotal" :page-size="formItem.count" :page-size-opts="[50,100,200]" show-total :current="pageCurr" show-sizer @on-page-size-change="pageSizeChange" @on-change="changePage" show-elevator></Page>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</template>
<script type="text/babel">
import config from '../config/config';
import util from '../libs/util';
import qs from 'qs'

export default {
    data() {
        return {
            spinShow: true,
            upUrl: '',
            self: this,
            showbox: false,
            pageTotal: 0,
            pageCurr: 1,
            selectTableData: [],
            editor: {
                begintime: '',
                endtime: ''
            },
            playStatus:[],
            ikeywords: '',
            iname: '',
            iid: '',
            iclevel: '',
            formItem: {
                offset: 0,
                count: 50,
                clevel: [5, 4, 0],
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
                    sortable: true,
                    width: 100
                },
                {
                    title: '资源名称',
                    key: 'name',
                    sortable: true,
                    ellipsis: true,
                    width: 200,
                    render(row, column, index) {
                        return `<i-button type="ghost" shape="circle" :icon="playStatus[${index}].status" size="small" @click="playPause(${index})"></i-button> <audio id="audio${index}" preload="none"><source src="${row.content}" type="audio/mpeg"></audio>
                        <a v-link="{name:'resouredetail', params:{id:${row.id}}, query: {action: 'detail'}}" target="_blank">${row.name}</a>`;
                    }
                },
                {
                    title: '类型',
                    key: 'category',
                    align: 'center',
                    width: 80
                },
                {
                    title: '来源',
                    key: 'source',
                    align: 'center',
                    width: 100
                },
                {
                    title: '优先级',
                    key: 'priority',
                    align: 'center',
                    width: 80
                },
                {
                    title: '资源状态',
                    key: 'clevel',
                    align: 'center',
                    width: 100,
                    render(row, column, index) {
                        return util.getResouceStatus(row.clevel)
                    }
                },
                {
                    title: '作者/歌手',
                    key: 'artist',
                    align: 'center',
                    width: 100
                },
                {
                    title: 'APP显示',
                    key: 'appshow',
                    align: 'center',
                    width: 150,
                    render(row, column, index) {
                        switch (row.appshow) {
                            case false:
                                return '否';
                                break;
                            case true:
                                return '是';
                                break;

                        }
                    }
                },
                {
                    title: '编辑人',
                    key: 'userinfo.editor',
                    align: 'center',
                    width: 120
                },
                {
                    title: '编辑时间',
                    key: 'userinfo.edited_at',
                    align: 'center',
                    width: 270,
                    render(row, column, index) {
                        let ctTime = util.dataformat(row.created_at)
                        return ctTime;
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    fixed: 'right',
                    width: 150,
                    render(row, column, index) {
                        let downStatus = false;
                        let upStatus = false;
                        if (row.clevel == 5) { //已上架
                            upStatus = true;
                        }else if (row.clevel == 4) { //待上架
                            //TODO
                        }else if (row.clevel == 0) { //已下架
                            downStatus = true;
                        }else if (row.clevel == 1) { //未提交
                            downStatus = true;
                            upStatus = true;
                        }else if (row.clevel == 2) { //编辑中
                            downStatus = true;
                            upStatus = true;
                        }else if (row.clevel == -1) { //不处理
                            downStatus = true;
                            upStatus = true;
                        }else if (row.clevel == 3){  //待审核
                            downStatus = true;
                        }else if(row.clevel == -2){  //已删除
                            downStatus = true;
                            upStatus = true;
                        }else{  //未知
                            downStatus = true;
                            upStatus = true;
                        }
                        return `<i-button :disabled="${upStatus}" type="primary" size="small" @click="upShelves(${index})">上架</i-button> <i-button :disabled="${downStatus}" type="primary" size="small" @click="downShelves(${index})">下架</i-button>`;
                    }
                }
            ],
            searchData: [],
            catsArr: [],
            sourceArr: []

        }
    },
    ready() {
        this.getCats();
        this.getSource();
        this.searchQuery(0);
        this.upUrl = config.ajaxUrl + '/fileinput';
    },
    methods: {
        getSource(){
            this.sourceArr = util.getSource;
        },
        getCats() {
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
        handleSuccess(res, file) { //上传成功钩子
            this.$Message.success(res.msg);
        },
        handleFormatError(file) { //上传格式提示
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 excel 或 csv 格式的文件。'
            });

        },
        handleMaxSize(file) { //上传文件大小提示
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 10M。'
            });
        },
        handleReset (name) {
            this.$refs[name].resetFields();
            this.editor = {
                begintime: '',
                endtime: ''
            },
            this.ikeywords = '';
            this.iname = '';
            this.iid = '';
            this.iclevel = '';
        },
        showHighSearch() {
            this.showbox = !this.showbox;
        },
        parseTime(time) {
            return Date.parse(new Date(time)) / 1000;
        },
        searchQuery(curr) { //搜索
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
            this.pageCurr=1;
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
            if (this.iclevel !== '') {
                this.formItem.clevel.splice(0, this.formItem.clevel.length);
                this.formItem.clevel[0] = this.iclevel;
                console.log(this.formItem.clevel);
            }else{
                this.formItem.clevel = [5, 4, 0]
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
                        this.searchData = res.data.resources;
                        this.pageTotal = res.data.total;
                        this.searchData.forEach((val, idx, arr ) => {
                            this.playStatus.$set(idx, {
                                status: 'play'
                            })
                        })

                    } else {
                        this.$Message.warning(res.desc);
                    }
                })
                .catch((error) => {
                    this.spinShow = false;
                    this.$Loading.error();
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
                        this.$Notice.success({title: "上架成功!"});
                    } else {
                        this.$Notice.success({title: res.desc});
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        downShelves(index) { //下架
            this.searchData[index].clevel = 0;
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
                        this.$Notice.success({title: "下架成功!"});
                    } else {
                        this.$Notice.success({title: res.desc});
                    }
                })
                .catch((error) => {
                    console.log(error);
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
        },
        linkDetail(index) {
            this.$router.go({
                name: "resouredetail",
                params: {
                    id: this.searchData[index].id
                }
            })
        },
        batchUpShelves(num) { //批量上架
            let vm = this;
            let paramsData = {
                res_db: "aires",
                resources: []
            };
            this.selectTableData.forEach((val, index, arr) => {
                paramsData.resources.$set(index, {
                    id: val.id,
                    clevel: num,
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
                        }, 1500);
                    } else {
                        this.$Message.warning(res.desc);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        batchDownShelves(num) { //批量下架
            this.batchUpShelves(num)
        },
        batchNo(num) { //批量不处理
            this.batchUpShelves(num)
        }



    },
    filters: {
        toInt: function (v) {
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
