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

    .div-left {
        float: left;
        width: 40%;
        margin: 5px 10px;
    }

    .div-ops {
        clear: both;
        text-align: center;
    }

    .btn-batch {
        margin: 5px 0px;
    }

    .form1 {
        width: 100%;
    }

    .div-splitop {
        width: 10%;
        margin: 0px;
        text-align: center;
        padding-top: 60px;
    }
</style>

<template>
      <div class="layout-header"></div>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item>首页</Breadcrumb-item>
              <Breadcrumb-item>歌单管理</Breadcrumb-item>
              <Breadcrumb-item>新建歌单</Breadcrumb-item>
          </Breadcrumb>
      </div>
      <div class="layout-content">
        <div class="layout-content-main">
        <Row>
          <Steps :current="1">
                <Step title="新建专辑" content="专辑内容编辑.."></Step>
                <Step title="添加资源" content="歌单内容编辑.."></Step>
                <Step title="资源整理" content="整理已添加的资源.."></Step>
            </Steps>
       </Row>
       <div class="div-split">&nbsp;</div>
       <div class="div-left">
           <div class="btn-batch">
                <i-input :value.sync="paraValueLeft">
                    <i-select :model.sync="paraNameLeft" slot="prepend"  style="width: 80px">
                        <i-option value="id">资源ID</i-option>
                        <i-option value="name">资源名称</i-option>
                        <i-option value="keyword">关键字</i-option>
                    </i-select>
                    <i-button type="primary" slot="append" icon="ios-search" @click="searchLeft(1)"></i-button>
                </i-input>
           </div>
                <i-table size="small"
                border stripe :columns="serachtable"
                :data="serachdata"
                @on-selection-change="addselection"
                @on-sort-change="lefttablesort"
                no-data-text="没有可显示的数据.."
                highlight-row
                >
                </i-table>
                <div style="margin-top:5px; float: right;">
                <Page :total="pagerLeft.total" :page-size="searchParamsLeft.count" :current="currentLeft" simple @on-change="onpagingLeft"></Page>
                </div>

       </div>
       <div class="div-left div-splitop">
         <i-button type="info" @click.stop.prevent="addmulti()" class="btn-batch" icon="arrow-right-a">添加</i-button><br/>
         <i-button type="error" @click.stop.prevent="delmulti()" class="btn-batch" icon="arrow-left-a">删除</i-button>
       </div>
       <div class="div-left div-right2">
            <div class="btn-batch">
                <i-input :value.sync="paraValueRight" disabled>
                    <i-select :model.sync="paraNameRight" slot="prepend" style="width: 80px">
                        <i-option value="id">资源ID</i-option>
                        <i-option value="name">资源名称</i-option>
                        <i-option value="keyword">关键字</i-option>
                    </i-select>
                    <i-button type="primary" slot="append" icon="ios-search"></i-button>
                </i-input>
           </div>
            <i-table size="small"
            border stripe :columns="addedtable"
            :data="addeddata"
            @on-selection-change="delselection"
            @on-sort-change="righttablesort"
            no-data-text="没有可显示的数据.."
            highlight-row
            ></i-table>
             <div style="margin-top:5px; float: right;">
                <Page :total="pagerRight.total" :page-size="searchParamsRight.offset" simple @on-change="onpagingRight"></Page>
            </div>

        </div>
          <div class="div-ops">
              <i-button type="ghost" @click="goBack">返回</i-button>&nbsp;
              <i-button type="primary" @click="goNext">下一步</i-button>
          </div>
        </div>
      </div>
</template>
<script>
    import config from '../config/config';
    import util from '../libs/util';

    export default {
        data() {
            return {
                albumId: 0,
                //批量添加暂存数据
                mulitadddata: [],
                //批量删除暂存数据
                mulitdeldata: [],
                currentLeft: 1,
                paraNameLeft: "id",
                paraValueLeft: "",
                searchParamsLeft: {
                    offset: 1,
                    count: 10,
                    id: "",
                    keywords: [],
                    sort: null,
                    name:[]
                },
                pagerLeft: {
                    total: 0,
                },
                //资源搜索表定义
                serachtable: [{
                    type: 'selection',
                    width: 40,
                    align: 'center'
                }, {
                    title: '资源ID',
                    key: 'id',
                    width: 100,
                    align: 'center',
                    sortable: 'custom',
                    render(row, column, index) {
                        return `<a target="_black" href="/operation/voice/toDetail?id=${row.id}">${row.id}</a>`;
                    }
                }, {
                    title: '资源名',
                    key: 'name',
                    align: 'center'
                }, {
                    title: '关键词',
                    key: 'keywords',
                    width: 120,
                }],
                //资源搜索表数据
                serachdata: [],
                //---------------------------------------------
                //-------------以下为右侧表格---------------
                //已添加资源表定义
                addedtable: [{
                    type: 'selection',
                    width: 40,
                    align: 'center'
                }, {
                    title: '资源ID',
                    key: 'rid',
                    width: 100,
                    align: 'center',
                    sortable: 'custom',
                    render(row, column, index) {
                        return `<a target="_black" href="/operation/voice/toDetail?id=${row.rid}">${row.rid}</a>`;
                    }
                }, {
                    title: '资源名',
                    key: 'nick_name',
                    align: 'center'
                }, {
                    title: '状态',
                    key: 'clevel',
                    width: 120,
                    render(row) {
                        let thistag = util.getResouceStatus(row.clevel)
                        return thistag;
                    }
                }],
                currentRight: 1,
                paraNameRight: "id",
                paraValueRight: "",
                searchParamsRight: {
                    from: 1,
                    offset: 10,
                },
                pagerRight: {
                    total: 0,
                },
                //已添加资源数据
                addeddata: [],
            }
        },
        ready() {
            this.albumId = this.$route.params.listid;
            this.searchLeft(1);
            this.searchRigth();
        },
        methods: {
            //搜索资源库
            searchLeft(cur) {
                this.currentLeft = cur;
                this.searchParamsLeft.offset = (this.currentLeft - 1) * this.searchParamsLeft.count;

                if (this.paraValueLeft !== '') {
                    if (this.paraNameLeft === 'id') {
                        let idarr = this.paraValueLeft.split(" ");
                        this.searchParamsLeft.id = idarr;
                        this.searchParamsLeft.keywords=[];
                        this.searchParamsLeft.name = [];
                    }else if(this.paraNameLeft === "name"){
                        let namearr = this.paraValueLeft.split(";");
                        this.searchParamsLeft.id=null;
                        this.searchParamsLeft.keywords=[];
                        this.searchParamsLeft.name = namearr;
                    }else {
                        let karr = this.paraValueLeft.split(";");
                        this.searchParamsLeft.keywords = karr;
                        this.searchParamsLeft.id = null;
                        this.searchParamsLeft.name = [];

                    }
                } else {
                    this.searchParamsLeft.id = "";
                    this.searchParamsLeft.keywords = [];
                    this.searchParamsLeft.name = [];
                }

                util.ajax({
                        method: 'POST',
                        url: util.getUrl("/airesources/query"),
                        data: this.searchParamsLeft
                    })
                    .then((res) => {
                        let resData = res.data.data;
                        this.serachdata = resData.resources;
                        this.pagerLeft.total = resData.total;
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
            },
            lefttablesort(evt) {
                if (evt.order === "normal") {
                    return;
                }
                let co = `${evt.key},${evt.order}`;
                this.searchParamsLeft.sort = co;
                this.searchLeft(1);
            },
            onpagingLeft(num) {
                this.searchLeft(num);
            },
            searchRigth() {
                this.searchParamsRight.from = (this.currentRight - 1) * this.searchParamsRight.offset;
                if (this.paraValueRight !== '') {
                    if (this.paraNameRight === 'id') {
                        this.searchParamsRight.id = this.paraValueRight;
                    } else {
                        let karr = [];
                        karr.push(this.paraValueRight);
                        this.searchParamsRight.keywords = karr;
                    }
                } else {
                    this.searchParamsRight.id = "";
                    this.searchParamsRight.keywords = [];
                }

                let albumUrl = util.getUrl(`/album/${this.albumId}?from=${this.searchParamsRight.from}&offset=${this.searchParamsRight.offset}`);

                util.ajax({
                        method: 'GET',
                        url: albumUrl
                    })
                    .then((res) => {
                        let resData = res.data.data;
                        this.addeddata = resData.rids;
                        this.pagerRight.total = resData.total;
                    })
                    .catch(function(error) {
                        console.log(error);
                    });

            },
            righttablesort(evt) {
                if (evt.order === "normal") {
                    return;
                }
                let co = `${evt.key},${evt.order}`;
                this.searchParamsRight.sort = co;
                this.searchRigth();
            },
            onpagingRight(num) {
                this.currentRight = num;
                this.searchRigth();
            },
            //批量添加
            addmulti: function() {
                let batchRids = {
                    res_db: "aires",
                    rids: [],
                    append: 1
                };

                if (this.mulitadddata && this.mulitadddata.length === 0) {
                    this.warning("至少选择一项数据!");
                    return;
                }

                //依次添加
                this.mulitadddata.forEach((res, index, arr) => {
                    let rid = {
                        rid: res.id,
                        nick_name: res.name,
                        sort: index
                    };
                    batchRids.rids.push(rid);
                });

                let self = this;
                util.ajax({
                        method: 'POST',
                        url: util.getUrl(`/album/resources/${this.albumId}`),
                        data: batchRids
                    })
                    .then((res) => {
                        if(res.data.result !== 0){
                            this.$Notice.error({title:"添加失败!",desc:res.data.desc});
                            console.log(this.mulitadddata);
                            return;
                        }

                        this.success("添加成功!");
                        //延时处理
                        setTimeout(function(){
                            self.searchLeft();
                            self.searchRigth();
                        },500);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            success(title) {
                this.$Notice.success({
                    title: title,
                    desc: ''
                });
            },
            goBack() {
                this.$router.go({
                    name: "newliststep1",
                    params: {
                        id: this.albumId
                    }
                });
            },
            goNext() {
                this.$router.go({
                    name: "newliststep4",
                    params: {
                        id: this.albumId
                    }
                });
            },
            warning(title) {
                this.$Notice.warning({
                    title: title,
                    desc: ''
                });
            },
            //批量删除
            delmulti: function() {
                var batchRids = {
                    res_db: "aires",
                    rids: []
                };

                if (this.mulitdeldata && this.mulitdeldata.length === 0) {
                    this.warning("至少选择一项数据!");
                    return;
                }

                //依次删除
                this.mulitdeldata.forEach((res, index, arr) => {
                    batchRids.rids.push(res.rid);
                });

                let self = this;

                util.ajax({
                        method: 'POST',
                        url: util.getUrl(`/album/resources/unset/${this.albumId}`),
                        data: batchRids
                    })
                    .then((res) => {
                        this.success("删除成功!");
                        //延时处理
                        setTimeout(function(){
                            self.searchLeft();
                            self.searchRigth();
                        },500);
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
            },
            //获取批量添加数据
            addselection: function(selection) {
                this.mulitadddata = selection;
            },
            //获取批量删除数据
            delselection: function(selection) {
                this.mulitdeldata = selection;
            }
        }
    }
</script>
