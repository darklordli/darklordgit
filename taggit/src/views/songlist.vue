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

.ivu-table td {
    text-align: center;
}

.col-right {
    text-align: right;
}

.main-table {
    margin: 10px 0px;
}

.ivu-table-cell {
    text-align: center;
}

.detail-row {
    margin: 8px 0px;
    font-weight: bold;
    font-size: 10pt;
}

.col-left {
    font-weight: normal;
}

.div-table-top {
    margin: 10px 0px;
}

.main-hd {
    padding: 20px 0 10px;
    font-size: 16px;
}

.file-upload {
    overflow: hidden;
    min-height: 32px;
    border-bottom: 1px solid #d7dde4;
    margin-bottom: 10px
}

.file-upload>div {
    float: right;
}

.btn-box {
    text-align: center;
}
</style>
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
                <Upload multiple action="//jsonplaceholder.typicode.com/posts/">
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
                <img src="https://dummyimage.com/100x100/ccc/fff" alt="小图" />
            </i-col>
            <i-col span="6">
                <img src="https://dummyimage.com/200x200/ccc/fff" alt="大图" />
            </i-col>
        </Row>
        <div class="main-hd">
            资源列表（<b>100</b>条）
        </div>
        <div class="main-table">
            <i-table :content="self" :columns="columns" :data="resList" @on-selection-change="selectChange"></i-table>
            <div style="margin: 10px;overflow: hidden">
                <div class="">
                    <i-button type="error" @click="removeAll">批量删除</i-button>
                </div>
                <div style="float: right;">
                    <Page :total="100" :current="1" @on-change="changePage"></Page>
                </div>
            </div>
        </div>
        <div class="btn-box">
            <i-button type="primary" @click="saveEdit">保存</i-button>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data() {
        return {
            self: this,
            selectData: [],
            //专辑信息
            songlistdata: {
                name: null,
                childname: null,
                type: null,
                playtype: null
            },
            columns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'ID',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '资源名称',
                    key: 'name'
                },
                {
                    title: 'APP名称',
                    key: 'appName',
                    render(row, column, index) {
                        return `<i-input size="small" placeholder="" :value.sync="'${row.appName}'"></i-input>`
                    }
                },
                {
                    title: '顺序',
                    key: 'sequence',
                    align: 'center',
                    render(row, column, index) {
                        return `<i-input size="small" placeholder="" :value.sync="'${row.sequence}'"></i-input>`
                    }
                },
                {
                    title: '类型',
                    key: 'type',
                    align: 'center'
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center'
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
            resList: [{
                    id: 111,
                    name: "小毛驴",
                    appName: "小毛驴",
                    sequence: "1",
                    type: "儿歌",
                    status: "已上架"
                }, {
                    id: 222,
                    name: "小红帽",
                    appName: "小红帽",
                    sequence: "2",
                    type: "故事",
                    status: "未上架"
                }, {
                    id: 333,
                    name: "两只考虑",
                    appName: "两只考虑",
                    sequence: "3",
                    type: "儿歌",
                    status: "已下架"
                },
                {
                    id: 444,
                    name: "两只考虑",
                    appName: "两只考虑",
                    sequence: "6",
                    type: "儿歌",
                    status: "已下架"
                }
            ]
        }
    },
    ready() {
        this.getsonglistinfo();
    },
    methods: {
        getsonglistinfo() {

        },
        selectChange(selection) { //获取选中数据
            this.selectData = selection;
        },
        removeAll() { //批量删除
            let vm = this;
            vm.selectData.forEach((removeValue, removeIndex, removeArray) => {
                vm.resList.forEach((value, index, array) => {
                    if (value.id === removeValue.id) {
                        vm.resList.splice(index, 1);
                    }

                })
            })
        },
        removeItem(index) { //删除行
            this.resList.splice(index, 1);
        },
        mockTableData() { //分页数据
            return this.resList;
        },
        changePage() {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
            this.resList = this.mockTableData();
        },
        saveEdit() { //保存修改
            // TODO
            this.$http.get('http://www.roobo.com/roobo-interface/web/banner/getPcPic', {
                    params: {

                    }
                })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }

}
</script>
