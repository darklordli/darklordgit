<template>
<div class="layout-header">
</div>
<div class="layout-breadcrumb">
    <Breadcrumb>
        <Breadcrumb-item>首页</Breadcrumb-item>
        <Breadcrumb-item>歌单管理</Breadcrumb-item>
        <Breadcrumb-item>歌单列表</Breadcrumb-item>
    </Breadcrumb>
</div>
<div class="layout-content">
    <div class="layout-content-main">
        <Row>
            <Steps :current="2">
                <Step title="编辑专辑" content="专辑内容编辑.."></Step>
                <Step title="添加资源" content="歌单内容编辑.."></Step>
                <Step title="资源整理" content="整理已添加的资源.."></Step>
            </Steps>
        </Row>
        <div class="file-upload">
            <div>
                <Upload :format="['txt','csv']" :on-format-error="handleFormatError" :max-size="10240" :on-exceeded-size="handleMaxSize" :on-success="handleSuccess" multiple action="//jsonplaceholder.typicode.com/posts/">
                    <i-button type="primary" icon="ios-cloud-upload-outline">批量导入信息</i-button>
                </Upload>
            </div>
        </div>
        <Row type="flex" justify="start" align="middle">
            <i-col span="12">
                <Row class="detail-row">
                    <i-col span="5" class="col-right">专辑名称：</i-col>
                    <i-col span="5" class="col-left">{{songlistdata.name}}</i-col>
                </Row>
                <Row class="detail-row">
                    <i-col span="5" class="col-right">子专辑名称：</i-col>
                    <i-col span="5" class="col-left">{{songlistdata.childname}}</i-col>
                </Row>
                <Row class="detail-row">
                    <i-col span="5" class="col-right">类型：</i-col>
                    <i-col span="5" class="col-left">{{songlistdata.type}}</i-col>
                </Row>
                <Row class="detail-row">
                    <i-col span="5" class="col-right">播放形式：</i-col>
                    <i-col span="5" class="col-left">{{songlistdata.playtype}}</i-col>
                </Row>
            </i-col>
            <i-col span="6">
                <img :src="songlistdata.img_large" alt="小图" />
            </i-col>
            <i-col span="6">
                <img :src="songlistdata.img_small" alt="大图" />
            </i-col>
        </Row>
        <div class="main-hd">
            资源列表
            <!-- （<b>100</b>条） -->
        </div>
        <div class="main-table">
            <i-table :content="self" :columns="columns" :data="resList" @on-selection-change="selectChange"></i-table>
            <div style="margin: 10px;overflow: hidden">
                <div class="">
                    <i-button type="error" @click="removeAll">批量删除</i-button>
                </div>
                <div style="float: right;">
                    <Page :total="pageTotal" :page-size="20" show-total :current="1" show-sizer @on-change="changePage" show-elevator></Page>
                </div>
            </div>
        </div>
        <div class="btn-box">
            <i-button type="success" @click="createdFinish">完成</i-button>
        </div>
    </div>
</div>
</template>
<script type="text/babel">
import config from '../config/config';
import util from '../libs/util';
export default {
    data() {
        return {
            self: this,
            selectData: [],
            globalId: 0,
            pageTotal: 0,
            //专辑信息
            songlistdata: {
                name: '',
                childname: '',
                type: '',
                playtype: '',
                img_large: '',
                img_small: ''
            },
            columns: [{
                    type: 'selection',
                    width: 50,
                    align: 'center'
                },
                {
                    title: 'ID',
                    key: 'rid',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '资源名称',
                    key: 'rname',
                    sortable: true,
                    ellipsis: true
                },
                {
                    title: 'APP名称',
                    key: 'nick_name',
                    render(row, column, index) {
                        // return `<i-input placeholder="" :value.sync="resList[${index}].nick_name" @on-enter="saveItemEdit(${index})"></i-input>`                        
                        return `<i-input placeholder="" :value="resList[${index}].nick_name" @on-enter="saveItemEdit(${index}, '${column.key}')"></i-input>`;
                    }
                },
                {
                    title: '集数',
                    key: 'sort',
                    align: 'center',
                    render(row, column, index) {
                        return `<i-input class="number-input" number placeholder="" :value="resList[${index}].sort" @on-enter="saveItemEdit(${index}, '${column.key}')"></i-input>`
                    }
                },
                {
                    title: '分类',
                    key: 'category',
                    align: 'center'
                },
                {
                    title: '状态',
                    key: 'clevel',
                    align: 'center',
                    render(row) {
                        let thistag = util.getResouceStatus(row.clevel)
                        return thistag;
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render(row, column, index) {
                        return `<i-button type="error" size="small" @click="removeItem(${index})">删除</i-button>`;
                    }
                }
            ],
            resList: []
        }
    },
    ready() {
        this.getSongInfo(0);
    },
    methods: {
        showEdit() {
        },
        getSongInfo(num) { //获取歌单详情和资源列表
            util.ajax({
                    method: 'get',
                    url: config.ajaxUrl + "/album/" + this.globalId,
                    params: {
                        from: num,
                        offset: 20,
                    }
                })
                .then((response) => {
                    let res = response.data;
                    if (res.result == 0) {
                        this.songlistdata = res.data;
                        this.resList = res.data.rids;
                        this.pageTotal = res.data.total;

                        //转化属性
                        this.songlistdata.type = util.getAlbumType(this.songlistdata.type);


                    } else {
                        this.$Message.warning({title:res.desc});
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        selectChange(selection) { //获取选中数据
            this.selectData = selection;
        },
        removeAll() { //批量删除
            let vm = this;
            let paramsData = {
                res_db: 'ai',
                rids: []
            };

            vm.selectData.forEach((val, idx, arr) => {
                paramsData.rids.push(val.rid);
            })


            util.ajax({
                    method: 'post',
                    url: config.ajaxUrl + "/album/resources/unset/" + this.globalId,
                    data: paramsData
                })
                .then((response) => {
                    let res = response.data;
                    if (res.result == 0) {
                        this.$Notice.success({title:"删除成功!"});

                        vm.selectData.forEach((removeValue, removeIndex, removeArray) => {
                            vm.resList.forEach((value, index, array) => {
                                if (value.id === removeValue.id) {
                                    vm.resList.splice(index, 1);
                                }

                            })
                        })

                    } else {
                        this.$Notice.warning(res.desc);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

        },
        removeItem(index) { //删除行
            let rid = this.resList[index].rid;
            let paramsData = {
                res_db: 'ai',
                rids: [rid]
            };
            util.ajax({
                    method: 'post',
                    url: config.ajaxUrl + "/album/resources/unset/" + this.globalId,
                    data: paramsData
                })
                .then((response) => {
                    let res = response.data;
                    if (res.result == 0) {
                        this.$Notice.success({title:"删除成功!"});
                        this.resList.splice(index, 1);

                    } else {
                        this.$Notice.warning({title:res.desc});
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        mockTableData() { //分页数据
            return this.resList;
        },
        changePage(curr) {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
            this.getSongInfo(curr);

        },
        saveItemEdit(index, type) { //保存修改
            let tgrt = event.target
            console.log(type);

            let aid = this.resList[index].id;
            let rid = this.resList[index].rid;
            if(type == 'nick_name'){
                this.resList[index].nick_name = tgrt.value;
            }
            if(type == 'sort'){
                this.resList[index].sort = tgrt.value;
            }

            let paramsData = {
                nick_name: this.resList[index].nick_name,
                sort: this.resList[index].sort
            }
            util.ajax({
                    method: 'post',
                    url: config.ajaxUrl + "/album/resources/" + this.globalId + "/" + rid + "?res_db=aires",
                    data: paramsData
                })
                .then((response) => {
                    let res = response.data;
                    if (res.result == 0) {
                        this.$Notice.success({title:"修改成功!"});
                    } else {
                        this.$Notice.warning({title:res.desc});
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        outItem() {

        },
        importInfo() { //批量导入信息

        },
        createdFinish() { //完成跳转
            this.$router.go({
                name: "categorylist"
            });
        },
        handleFormatError(file) { //上传格式提示
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 txt 或 csv 格式的图片。'
            });

        },
        handleMaxSize(file) { //上传文件大小提示
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 10M。'
            });
        },
        handleSuccess(res, file) { //上传成功钩子


        },


    },
    route: {
        data: function(transition) {
            this.globalId = transition.to.params.listid;
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
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
}

.layout-content-main {
    padding: 10px;
}

.div-split {
    margin: 5px 0;
}

.ivu-table td {
    text-align: center;
}

.col-right {
    text-align: right;
}

.main-table {
    margin: 10px 0;
}

.ivu-table-cell {
    text-align: center;
}

.detail-row {
    margin: 8px 0;
    font-weight: bold;
    font-size: 10pt;
}

.col-left {
    font-weight: normal;
}

.div-table-top {
    margin: 10px 0;
}

.main-hd {
    padding: 20px 0 10px;
    font-size: 16px;
}

.file-upload {
    overflow: hidden;
    min-height: 32px;
    border-bottom: 1px solid #d7dde4;
    margin-bottom: 10px;
}

.file-upload > div {
    float: right;
}

.btn-box {
    text-align: center;
    padding: 20px 10px;
}
</style>
