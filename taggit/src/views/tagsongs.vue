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
</style>
<template>
    <div class="layout-header"></div>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item>首页</Breadcrumb-item>
              <Breadcrumb-item>标签管理</Breadcrumb-item>
              <Breadcrumb-item href="#" v-link="{name:'tagmanger'}">分类标签列表</Breadcrumb-item>
              <Breadcrumb-item>分类标签资源</Breadcrumb-item>
          </Breadcrumb>
      </div>
      <div class="layout-content">
        <div class="layout-content-main">
            <Row type="flex" align="middle">
                <i-col :gutter="16" span="20">
                    <h3>标签资源列表（安全、哄睡、1-3岁）</h3>
                </i-col>
                <i-col span="3" offset="1">
                    <i-button type="info" icon="ios-download">导出列表</i-button>
                </i-col>
            </Row>
            <div>&nbsp;</div>
            <!--标签资源列表-->
            <div class="main-table">
                <i-table stripe
                :columns="resouretable"
                :data="resouredata"
                @on-sort-change="onTableSortting">
              </i-table>
            </div>
            <div style="float: right;margin-bottom:10px;">
                    <Page :total="pager.total"
                    :page-size="searchParams.count"
                    :page-size-opts="[15,50,100]" 
                     @on-page-size-change="pageSizeChange"
                    show-sizer
                    show-total show-elevator @on-change="onpaging">
                  </Page>
            </div>


            <div>
                <i-button type="dashed" @click="goback" long>返回</i-button>
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
                resouretable: [{
                    title: 'ID',
                    key: 'id',
                    align: 'center',
                    sortable: 'custom',
                    render(row, column, index) {
                        return `<a href="http://ecp.roobo.com/resources/operation/voice/toDetail?id=${row.id}" >${row.id}</a>`;
                    }
                }, {
                    title: '资源名称',
                    key: 'name',
                    align: 'center',
                    sortable: 'custom',
                }, {
                    title: '类型',
                    key: 'tag',
                    //sortable: 'custom',
                }, {
                    title: '来源',
                    key: 'source',
                    sortable: 'custom',
                }, {
                    title: '状态',
                    key: 'clevel',
                    sortable: 'custom',
                    render(row) {
                        let thistag = util.getResouceStatus(row.clevel)
                        return thistag;
                    }
                }],
                resouredata: [],
                current: 1,
                //查询资源参数
                searchParams: {
                    offset: 1,
                    count: 15,
                    sort: null,
                    tagnew:0
                },
                pager: {
                    total: 0,
                }
            }
        },
        ready() {
            this.searchParams.tagnew = this.$route.params.id;
            this.initTable();
        },
        methods: {
            initTable() {

                //this.searchParams.tag[0] = null; //this.$route.params.id;
                this.searchParams.offset = (this.current - 1) * this.searchParams.count;
                util.ajax({
                        method: 'POST',
                        url: util.getUrl("/airesources/query"),
                        data: this.searchParams
                    })
                    .then((res) => {
                        let resData = res.data.data;
                        if (resData.resources.length) {
                            this.resouredata = resData.resources;
                            this.pager.total = resData.total;
                        } else {
                            this.$Notice.warning({
                                title: '此标签下没有资源'
                            });
                        }
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
            },
            onpaging(num) {
                this.current = num;
                this.initTable();
            },
            pageSizeChange(size){
                this.searchParams.offset = size;
                this.initTable();
            },
            onTableSortting(evt) {
                if (evt.order === "normal") {
                    return;
                };
                let co = `${evt.key},${evt.order}`;
                this.searchParams.sort = co;
                this.initTable();
            },
            goback(){
                this.$router.go({name: "tagmanger"});
            }
        }

    }
</script>