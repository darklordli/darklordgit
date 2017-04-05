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
        cursor: pointer!important;
    }
    .normal-search {
        margin-bottom: 20px;
        .high-btn {
            margin-left: 10px;
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
              <Breadcrumb-item>标签管理</Breadcrumb-item>
              <Breadcrumb-item>分类标签列表</Breadcrumb-item>
          </Breadcrumb>
      </div>
      <div class="layout-content">
          <div class="layout-content-main">
            <div style="margin-bottom:10px;">
                <Card>
                    <p slot="title">所选资源(共{{tagsData.length}}条记录)</p>
                    <p><i-table height="200" size="small" :columns="columns1" :data="tagsData"></i-table></p>
                </Card>
            </div>

            <Row>
                <i-col span="17">
                    <Card>
                        <p slot="title">分类标签源</p>
                        <p><i-table border :content="self" size="small" stripe :columns="tableColumns" :data="treedata" @on-row-dblclick="onAddDblclick"></i-table></p>
                    </Card>
                </i-col>
                <i-col span="6" offset="1">
                    <Card>
                        <p slot="title">已选择的标签</p>
                        <p><i-table border size="small" stripe :columns="tableColumns2" :data="tabledata" @on-row-dblclick="onRemobeDblclick"></i-table></p>
                    </Card>
                </i-col>
            </Row>
            <div style="margin:10px;text-align:center;">
                <i-button type="ghost" size="large" style="margin-right:10px;width:120px;" @click="goBack">返回</i-button>
                <i-button type="primary" size="large" style="width:120px;" @click="doSave">提交</i-button>
            </div>
          </div>
      </div>
</template>
<script>
    import util from '../libs/util';
    import qs from 'qs';
    import { getTags } from '../store/getters'

    export default {
        data() {
            return {
                columns1:[
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '资源名称',
                        key: 'name',
                    },
                    {
                        title: '作者/歌手',
                        key: 'artist',
                        align: 'center',
                        width: 100
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
                ],
                self:this,
                toggle:{
                    state :false,
                    name:"展开全部"
                },
                //表格定义
                tableColumns: [{
                    title: '分类名称',
                    key: 'title',
                    render(row, column, index) {
                        let opIcon = "";
                        if (row.open) {
                            opIcon = `<Icon type="chevron-down" @click.stop.prevent="close(${index},${row.depth})"></Icon>`;
                        } else {
                            opIcon = `<Icon type="chevron-right" @click.stop.prevent="open(${index},${row.depth})"></Icon>`;
                        }

                        let depthLength = 20 * row.depth;
                        let depthTag = `<span style="display: inline-block;width:${depthLength}px">&nbsp;</span>`;

                        let cd = JSON.stringify(row);
                        let hiddenTag = `<span style="display:none;">${cd}</span>`;
                        if(row.childrenCount === 0){
                            return `${depthTag}${row.title}${hiddenTag}`;
                        } else {
                            return `${depthTag}${opIcon} ${row.title}${hiddenTag}`;
                        }
                    }
                },
                {
                    title: '所属类别',
                    key: 'type',
                    width: 150,
                    align: 'center',
                    render(row){
                        switch(row.type){
                            case 1:
                            return "标签组";
                            case 2:
                            return "标签";
                            case 0:
                            default:
                            return "分类";
                        }
                    }
                }],
                //原始表格数据
                treedata: [],
                searchParams: {
                    from: 1,
                    offset: 10,
                    pids2:0,
                    res_total:1,
                },
                //表格展示用数据
                tabledata: [],
                tableColumns2:[{
                      title: '分类名称',
                    key: 'title',
                },{
                    title: '所属类别',
                    key: 'type',
                    width: 150,
                    align: 'center',
                    render(row){
                        switch(row.type){
                            case 1:
                            return "标签组";
                            case 2:
                            return "标签";
                            case 0:
                            default:
                            return "分类";
                        }
                    }
                }],
            }
        },
        ready() {
            this.loadData();
        },
        vuex: {
            getters: {
                tagsData: getTags
            }
        },
        methods: {
            loadData() {
                this.$Loading.start();

                util.ajax({
                        method: 'POST',
                        url: util.getUrl("/tag/list"),
                        data:[]
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
                    let tagList = resData.children;

                    for(let i=0;i<tagList.length;i++){
                        tagList[i].open = false;
                        tagList[i].depth = 0;
                        tagList[i].parentId = 0;
                        tagList[i].childrenCount = tagList[i].children.length;
                    }

                    this.treedata = tagList;
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

                let childs =  currentNode.children;
                for(let i=0;i<childs.length;i++){
                    let newChildNode = childs[i];
                    newChildNode.depth = depth;
                    newChildNode.open = false;
                    newChildNode.parentId = currentNode.id;
                    newChildNode.childrenCount = newChildNode.children.length;
                    this.treedata.splice(rowIndex+1,0,newChildNode);
                }
            },
            showDetail(id){
                this.$router.go({
                    name: "tagsongs",
                    params: {
                        id: id
                    }
                });
            },
            onAddDblclick(row){
                let has = false;
                for(let i=0;i<this.tabledata.length;i++){
                    if(this.tabledata[i].id === row.id){
                        has = true;
                        break;
                    }
                }

                if(!has)this.tabledata.splice(0,0,row);
            },
            onRemobeDblclick(row){
                console.log(row);
                for(let i=0;i<this.tabledata.length;i++){
                    if(this.tabledata[i].id === row.id){
                        this.tabledata.splice(i,1);
                    }
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
            getTableData(rid,k){
                let v = "";
                for(let i=0;i<this.treedata.length;i++){
                    if(this.treedata[i].id === rid){
                        v =this.treedata[i][k];
                        break;
                    }
                }
                return v;
            },
            updateTableData(rid,k,v){
                for(let i=0;i<this.treedata.length;i++){
                    if(this.treedata[i].id === rid){
                        this.treedata[i][k] = v;
                        break;
                    }
                }
            },
            goBack(){
                this.$router.go({name: "editoraudit"});
            },
            doSave(){
                if(this.tagsData.length === 0){
                    this.$Notice.warning({title:"所选资源为空",desc:"请偿试返回列表页面重新选择资源!"});
                    return;
                }

                if(this.tabledata.length === 0){
                    this.$Notice.warning({title:"至少选择一个分类标签!"});
                    return;
                }
                
                let categoryIds= [], resouceIds =[];
                this.tabledata.forEach((category) =>{
                    categoryIds.push(category.id);
                });
                this.tagsData.forEach((res) =>{
                    resouceIds.push(res.id);
                });
                
                let postData = {
                    id:categoryIds,
                    data:[
                        {
                            res_db:"aires",
                            resources:resouceIds
                        }
                    ],
                    clevel:1,
                    userinfo:{editor:"wangfeng"}
                };
                
                util.ajax({
                    method: 'POST',
                    url: util.getUrl(`/tag/resources/unset`),
                    data: postData
                })
                .then((response) => {
                    let res = response.data;
                    if (res.result == 0) {
                        this.$Notice.success({title: "操作成功!"});
                        this.goBack();
                    } else {
                        this.$Notice.warning({title: "操作失败!",desc:res.desc});
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

            }
        }
    }

</script>
