<style lang="less" scoped>
    .center-line {
        width: 30px;
        text-align: center;
    }
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

    .inset1 {
        display: inline-block;
        width: 10px;
    }

    .inset2 {
        display: inline-block;
        width: 20px;
    }

    .inset3 {
        display: inline-block;
        width: 30px;
    }

    .inset4 {
        display: inline-block;
        width: 40px;
    }

    .inset5 {
        display: inline-block;
        width: 50px;
    }

    .ivu-icon {
        cursor: pointer;
    }
    .paging-box {
        min-height: 32px;
        overflow: hidden;
        margin: 10px;
        .paging-container {
            float: right;
        }
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
</style>
<template>
      <div class="layout-header"></div>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item>首页</Breadcrumb-item>
              <Breadcrumb-item>专辑管理</Breadcrumb-item>
              <Breadcrumb-item>专辑列表</Breadcrumb-item>
          </Breadcrumb>
      </div>
      <div class="layout-content">
          <div class="layout-content-main">
          <div class="resource-update">
                <div class="update-btn">
                    <i-button type="primary" icon="plus" @click="newCategory">新建专辑</i-button>
                    <i-button type="info" icon="ios-download-outline" @click="exportData">导出本页数据</i-button>
                </div>
            </div>
          <div class="high-search">
                <i-form v-ref:form-item :model="searchParams" :label-width="110" inline>
                    <Form-item label="专辑名称：">
                        <i-input :value.sync="searchParams.name" placeholder="请输入"></i-input>
                    </Form-item>
                    <Form-item label="分类：" >
                        <i-select :model.sync="searchParams.type" placeholder="请选择" style="width:166px">
                            <template v-for="cats in catsArr">
                                <i-option :value="cats.value">{{cats.label}}</i-option>
                            </template>
                        </i-select>
                    </Form-item>
                    <Form-item label="编辑人：">
                        <i-input :value.sync="searchParams.editor" placeholder="请输入"></i-input>
                    </Form-item>

                    <Form-item :label-width="10">
                        <i-button type="primary" @click="loadData()">搜索</i-button>
                    </Form-item>
                </i-form>
            </div>
                <i-table style="max-width:1490px" size="small" border stripe :columns="tableColumns" :data="treedata" v-ref:table></i-table>
                <div class="paging-box">
                    <div class="paging-container">
                        <Page :total="pageTotal" :page-size="searchParams.offset" :page-size-opts="[50,100,200]" show-total :current="1" @on-page-size-change="pageSizeChange"  show-sizer @on-change="changePage" show-elevator></Page>
                    </div>
                </div>
          </div>
      </div>

</template>
<script>
    import util from '../libs/util';
    import qs from 'qs';

    export default {
        data() {
            return {
                modaladdroot: false,
                rootname: "",
                toggle:{
                    state :false,
                    name:"展开全部"
                },
                //表格定义
                tableColumns: [{
                    title: '专辑ID',
                    key: 'id',
                    width: 80,
                    align: 'center'
                },{
                    title: '专辑名称',
                    key: 'name',
                    width: 280,
                    ellipsis: true,
                    render(row, column, index) {
                        let opIcon = "";
                        if (row.open) {
                            opIcon = `<Icon type="chevron-down" @click.stop.prevent="close(${index},${row.depth})"></Icon>`;
                        } else {
                            opIcon = `<Icon type="chevron-right" @click.stop.prevent="open(${index},${row.depth})"></Icon>`;
                        }

                        let depthLength = 20 * row.depth;
                        let depthTag = `<span style="display: inline-block;width:${depthLength}px">&nbsp;</span>`;

                        let hiddenTag = `<span style="display:none;">id:${row.id},parentId:${row.parentId}</span>`;

                        let linkname = `<a href="###" @click.stop.prevent="gostep3(${row.id});">${row.name}</a>`;


                        if(row.childrenCount === 0){
                            return `${depthTag}${linkname}${hiddenTag}`;
                        } else {
                            return `${depthTag}${opIcon} ${linkname}${hiddenTag}`;
                        }
                    }
                },
                {
                    title: '季数',
                    key: 'sort',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '规约词',
                    key: 'nickname',
                    width: 200,
                    align: 'center'
                },
                {
                    title: '资源数量(个)',
                    key: 'res_total',
                    width: 120,
                    align: 'center',
                },
                {
                    title: '类型',
                    key: 'type',
                    width: 120,
                    align: 'center',
                    render(row){
                        return util.getAlbumType(row.type);
                    }
                },
                 {
                    title: '编辑人',
                    key: 'editor',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '编辑时间',
                    key: 'updated_at',
                    width: 310,
                    align: 'center',
                    render(row){
                        let ctTime = util.dataformat(row.updated_at);
                        return ctTime;
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    fixed: 'right',
                    width: 260,
                    render(row){
                        let isDisabled = row.childrenCount > 0 ? "disabled" : "";

                        let isOnline = (row.online === 0 ? "上线" : "下线");
                        let btnOp = `<i-button type="info" ${isDisabled} size="small" @click="changeOnline(${row.id},${row.online});">${isOnline}</i-button>&nbsp;&nbsp;`;
                        btnOp += `<i-button type="primary" size="small" @click="newChild(${row.id},'${row.name}');">添加子辑</i-button>&nbsp;&nbsp;`;
                        btnOp += `<i-button type="primary" size="small" @click="goEdit(${row.id});">编辑</i-button>&nbsp;&nbsp;`;
                        btnOp += `<i-button type="error" ${isDisabled} size="small" @click="del(${row.id});">删除</i-button>`;
                        return btnOp;
                    }
                }],
                //表格展示用数据
                tabledata: [],
                //原始表格数据
                treedata: [],
                searchParams: {
                    from: 1,
                    offset: 50,
                    pids2:0,
                    res_total:1,
                    name:"",
                    type:"",
                },
                pageTotal:0,
                catsArr:[],
                currentPage:1,
            }
        },
        ready() {
            //this.getCats();
            this.catsArr = util.albumTypeList;
            this.loadData();
        },
        methods: {
            loadData(curr) {
                this.searchParams.from = (this.currentPage - 1) * this.searchParams.offset;
                this.$Loading.start();

                util.ajax({
                        method: 'GET',
                        url: util.getUrl("/album/albumlist"),
                        params: this.searchParams
                    })
                    .then((res) => {
                        if(res.data.result !== 0){
                            this.$Notice.error({
                                title: res.data.msg,
                                desc: res.data.desc,
                                duration:0
                        });
                        this.$Loading.error();
                        return;
                    }
                    let resData = res.data.data;
                    this.pageTotal = resData.total;
                    let albumList = resData.albums;

                    for(let i=0;i<albumList.length;i++){
                        albumList[i].open = false;
                        albumList[i].depth = 0;
                        albumList[i].parentId = 0;
                        albumList[i].childrenCount = albumList[i].children.total;
                    }

                    this.treedata = albumList;
                    this.$Loading.finish();
                })
                .catch(function(error) {
                    console.error(error);
                });
            },
            changePage(curr){
                this.currentPage = curr;
                this.loadData();
            },
            pageSizeChange(size){
                this.searchParams.offset = size;
                this.loadData();
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
            getChildData(pid) {//废弃的方法
                let p = new Promise((resolve, reject) =>{
                    let cp = {
                        from: 1,
                        offset: 10,
                        pid: pid
                    };
                    util.ajax({
                        method: 'GET',
                        url: util.getUrl("/albumlist"),
                        params: cp
                    })
                    .then((res) => {
                        resolve(res.data.data.albums);
                    })
                    .catch(function(error) {
                        console.error(error);
                        reject(error);
                    });
                });
                return p;
            },
            toggleTreeGrid(){
                if(!this.toggle.state){
                    this.expandAll();
                    this.toggle.name = "折叠全部";
                }else{
                    this.collapseAll();
                    this.toggle.name = "展开全部";
                }
                this.toggle.state = !this.toggle.state;
            },
            expandAll(){
                for(let i=0;i<this.treedata.length;i++){
                    this.open(i,this.treedata[i].depth);
                }
            },
            collapseAll(){
                for(let i=0;i<this.treedata.length;i++){
                    this.close(i);
                }
            },
            open(rowIndex,depth) {
                depth++;
                let currentNode = this.treedata[rowIndex];
                currentNode.open = true;

                let childs =  currentNode.children.albums;
                for(let i=0;i<childs.length;i++){
                    let newChildNode = childs[i];
                    newChildNode.depth = depth;
                    newChildNode.open = false;
                    newChildNode.parentId = currentNode.id;
                    newChildNode.childrenCount = newChildNode.children.total;
                    this.treedata.splice(rowIndex+1,0,newChildNode);
                }
            },
            close(rowIndex) {
                let currentNode = this.treedata[rowIndex];
                currentNode.open = false;
                this.removeData(currentNode.id);
            },
            removeData(parentId){
                for(let i=0,flag=true,len=this.treedata.length;i<len;flag?i++:i){
                    if(this.treedata[i] && this.treedata[i].parentId === parentId){
                        if(this.treedata[i].childrenCount > 0){
                            this.removeData(this.treedata[i].id);
                        }
                        this.treedata.splice(i,1);
                        flag = false;
                    }else{
                        flag = true;
                    }
                }
            },
            changeOnline(rid,online){
                let msg = (online === 0 ?"确认切换至【下线】?" : "确认切换至【上线】?");
                if(!window.confirm(msg)){
                    return;
                }
                let onlineState = (online === 0 ? 1:0);
                let jsonData = {
                    json: JSON.stringify({online:onlineState})
                };

                util.ajax({
                        method: 'post',
                        url: util.getUrl(`/album/${rid}`),
                        data: qs.stringify(jsonData)
                    })
                    .then((response) => {
                        let res = response.data;
                        if (res.result == 0) {
                            this.$Notice.success({title: "状态切换成功!"});
                            //this.loadData();
                            this.updateTableData(rid,"online",onlineState);//直接更新数据状态
                        } else {
                            this.$$Notice.warning(res.desc);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            del(rid){
                if(!window.confirm("确认删除?")){
                    return;
                }

                let u = util.getCurrentEditor();
                let delData = {
                    editor:u[0],
                    editor_email:u[1]
                };


                util.ajax({
                    method: 'POST',
                    url: util.getUrl(`/album/unset/${rid}`),
                    params:delData
                })
                .then((res) => {
                    this.$Notice.success({title: "删除成功!"});
                    this.loadData();
                })
                .catch(function(error) {
                    console.error(error);
                });
            },
            newChild(rid,name){
                this.$router.go({
                    name: "newliststep1",
                    params: {
                        listid: rid
                    },
                    query:{
                        p:name
                    }
                });
            },
            goEdit(rid){
                this.$router.go({
                    name: "newliststep1",
                    params: {
                        listid: rid
                    }
                });
            },
            gostep3(rid){
                this.$router.go({
                    name: "newliststep4",
                    params: {
                        listid: rid
                    }
                });
            },
            updateTableData(rid,k,v){
                for(let i=0;i<this.treedata.length;i++){
                    if(this.treedata[i].id === rid){
                        this.treedata[i][k] = v;
                        break;
                    }
                }
            },
            newCategory(){
                this.$router.go({
                    name: "newliststep1",
                    params: {
                        listid: 0
                    },
                });
            },
            exportData(){
                this.$refs.table.exportCsv({
                    filename: '专辑列表',
                    original:false,
                });
            }
        }
    }

</script>
