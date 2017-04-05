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
            <div class="resource-update">
                <div class="update-btn">
                    <i-button type="primary" icon="plus" @click="newCategory">添加分类</i-button>
                    <i-button type="ghost"  @click="toggleTreeGrid">{{toggle.name}}</i-button>
                </div>
            </div>
            <div class="resource-search">
                <div class="normal-search">
                    <Row>
                       <!--
                        <i-col span="12">
                            <i-input :value.sync="searchParams.search" placeholder="请输入..." @on-enter="loadData">
                                <i-button slot="append" icon="ios-search" @click="loadData"></i-button>
                            </i-input>
                        </i-col>
                        -->
                        <i-col span="12">
                            <div class="high-btn">

                            </div>
                        </i-col>
                    </Row>
                </div>
            </div>
                <i-table style="max-width:1490px" border size="small" stripe :columns="tableColumns" :data="treedata"></i-table>
          </div>
      </div>

      <Modal :visible.sync="basicModel.show" :title.sync="basicModel.title">
            <i-form v-ref:form-custom :model="formCustom" :rules="ruleCustom" :label-width="80">
                <Form-item label="名称：" prop="title">
                    <i-input type="text" :value.sync="formCustom.title"></i-input>
                </Form-item>
            </i-form>
            <div slot="footer">
                <i-button type="ghost" @click="basicModel.show=false">取消</i-button>
                <i-button type="primary" @click="saveCateogry('formCustom');">确定</i-button>
            </div>
    </Modal>
</template>
<script>
    import util from '../libs/util';
    import qs from 'qs';


    export default {
        data() {
            const validateTitle = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('必填项不能为空!'));
                }else{
                    callback();
                }
            };

            return {
                basicModel:{
                    title:"abc",
                    show:false,
                    action:"newCategory"
                },
                toggle:{
                    state :false,
                    name:"展开全部"
                },
                //表格定义
                tableColumns: [
                    {
                    title: '分类名称',
                    key: 'title',
                    width: 250,
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
                            return `${depthTag}${row.title}(${row.res_count})${hiddenTag}`;
                        } else {
                            return `${depthTag}${opIcon} ${row.title}(${row.res_count})${hiddenTag}`;
                        }
                    }
                },
                {
                    title: '语义',
                    align: 'center',
                    width: 150,
                    render(row,column,index){
                        let wordTags = "";

                        if(!row.nickname[0]){
                            wordTags = `<Tag color="blue" @click="editWord(${row.id},'nickname');">规约词</Tag>`;
                        }else{
                            wordTags = `<Poptip trigger="hover" title="${row.nickname.length}个规约词" placement="bottom">
                                        <tag color="blue" @click="editWord(${row.id},'nickname');">规约词</tag>
                                        <div slot="content">
                                            <ul><li v-for="item in treedata[${index}].nickname" style="text-align: center;padding: 4px">{{ item }}</li></ul>
                                        </div>
                                    </Poptip>`;

                        }

                        if(!row.directname[0]){
                            wordTags += `<Tag color="green" @click="editWord(${row.id},'directname');">直达词</Tag>`;
                        }else{
                            wordTags += `<Poptip trigger="hover" title="${row.directname.length}个直达词" placement="bottom">
                                        <tag color="green" @click="editWord(${row.id},'directname');">直达词</tag>
                                        <div slot="content">
                                            <ul><li v-for="item in treedata[${index}].directname" style="text-align: center;padding: 4px">{{ item }}</li></ul>
                                        </div>
                                    </Poptip>`;
                        }



                        return wordTags;
                    }
                },
                {
                    title: '所属类别',
                    key: 'type',
                    align: 'center',
                    width: 100,
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
                },
                {
                    title: '资源',
                    key: 'id',
                    align: 'center',
                    width: 100,
                    render(row){
                        let a = `<a href="###" @click.stop.prevent="showDetail(${row.id});">查看资源</a>`;
                        return a;
                    }
                },
                 {
                    title: '编辑人',
                    key: 'editor',
                    align: 'center',
                    width: 120,
                },
                {
                    title: '编辑时间',
                    key: 'updated_at',
                    align: 'center',
                    width: 350,
                    render(row){
                        return "";
                    }
                }, {
                    title: '操作1',
                    key: 'action',
                    align: 'center',
                    width: 280,
                    fixed: 'right',
                    render(row){
                        let isDisabled = "";

                        let btnOp = `<i-button type="info" ${isDisabled} size="small" @click="newChild(${row.id},0);">添加子分类</i-button>&nbsp;&nbsp;`;
                        btnOp += `<i-button type="info" ${isDisabled} size="small" @click="newChild(${row.id},1);">添加标签组</i-button>&nbsp;&nbsp;`;
                        btnOp += `<i-button type="info" ${isDisabled} size="small" @click="newChild(${row.id},2);">添加子标签</i-button>`;

                        return btnOp;
                    }
                }, {
                    title: '操作2',
                    key: 'action',
                    align: 'center',
                    width: 140,
                    fixed: 'right',
                    render(row){
                       let btnOp ="";
                        btnOp += `<i-button type="primary" size="small" @click="goEdit(${row.id});">编辑</i-button>&nbsp;&nbsp;`;
                        btnOp += `<i-button type="error" size="small" @click="del(${row.id});">删除</i-button>`;
                        return btnOp;
                    }
                }],
                //表格展示用数据
                tabledata: [],
                //原始表格数据
                treedata: [],
                searchParams: {
                    from: 1,
                    offset: 10,
                    pids2:0,
                    res_total:1,
                },
                formCustom:{
                    title:"",
                    id:0,
                    type:0,
                },
                ruleCustom:{
                    title:[
                        { validator: validateTitle, trigger: 'blur' }
                    ]
                },
            }
        },
        ready() {
            this.loadData();
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

                let postData = {
                    id:[rid],
                    editor: "aiai"
                };

                util.ajax({
                    method: 'POST',
                    url: util.getUrl(`/tag/unset`),
                    data:postData
                })
                .then((res) => {
                    if(res.data.result !== 0){
                        this.$Notice.warning({title: "删除失败!",desc:res.data.desc});
                        return;
                    }
                    this.$Notice.success({title: "删除成功!"});
                    this.loadData();
                })
                .catch(function(error) {
                    console.error(error);
                });
            },
            goEdit(rid){
                this.basicModel.title = "编辑分类";
                this.basicModel.show = true;
                this.basicModel.action = "editCategory";

                this.formCustom.id = rid;
                this.formCustom.title = this.getTableData(rid,"title");
            },
            editWord(rid,field){
                if(field === "nickname"){
                    this.basicModel.title = "编辑规约词";
                    this.basicModel.action = "editNickname";
                }else if(field === "directname"){
                    this.basicModel.title = "编辑直达词";
                    this.basicModel.action = "editDirectname";
                }

                this.basicModel.show = true;

                this.formCustom.id = rid;
                let wordArray = this.getTableData(rid,field);
                if(wordArray instanceof Array){
                    wordArray = wordArray.join(",");
                }

                this.formCustom.title = wordArray;
            },
            newCategory(){
                this.basicModel.title = "添加分类";
                this.basicModel.show = true;
                this.basicModel.action = "newCategory";
            },
            newChild(rid,childType){
                if(childType === "childTagGroup"){
                    this.basicModel.title = "添加标签组";
                }else if(childType === "childTag"){
                    this.basicModel.title = "添加子标签";
                }else{
                    this.basicModel.title = "添加子分类";
                }

                this.basicModel.show = true;
                this.basicModel.action = "newCategory";
                this.formCustom.id = rid;
                this.formCustom.title = "";
                this.formCustom.type = childType;
            },
            saveCateogry(name){
                //this.$Modal.confirm({title:"系统提示",content:"确认提交?"});
                let tagEdit = (postData,callback) =>{

                    util.ajax({
                        method: 'POST',
                        url: util.getUrl(`/tag/modify`),
                        data:postData
                    })
                    .then((res) => {
                        if(res.data.result !== 0){
                            this.$Notice.warning({title: "操作失败!",desc:res.data.desc});
                            return;
                        }
                        this.$Notice.success({title: "操作成功!"});
                        this.basicModel.show = false;
                        if(callback){
                            callback();
                        }
                    })
                    .catch(function(error) {
                        console.error(error);
                    });

                };

                this.$refs[name].validate((valid) => {
                    if(valid) {
                        let self = this;
                        if(this.basicModel.action === "newCategory"){
                            let postData = {
                                appId:"roobo",
                                pid:this.formCustom.id,
                                name:this.formCustom.title,
                                type:this.formCustom.type
                            };

                            util.ajax({
                                method: 'POST',
                                url: util.getUrl(`/tag/new`),
                                data:postData
                            })
                            .then((res) => {
                                if(res.data.result !== 0){
                                    this.$Notice.warning({title: "添加失败!",desc:res.data.desc});
                                    return;
                                }
                                this.$Notice.success({title: "添加成功!"});
                                this.basicModel.show = false;
                                this.loadData();
                            })
                            .catch(function(error) {
                                console.error(error);
                            });
                        }else if(this.basicModel.action === "editCategory"){
                            let postData = {
                                id:this.formCustom.id,
                                name:this.formCustom.title
                            };

                            tagEdit(postData,function(){
                                self.updateTableData(postData.id,"title",postData.name);
                            });
                        }else if(this.basicModel.action === "editNickname"){
                            let arr = this.formCustom.title.split(",");
                            let postData = {
                                id:this.formCustom.id,
                                nickname:arr
                            };

                            tagEdit(postData,function(){
                                self.updateTableData(postData.id,"nickname",arr);
                            });
                        }else if(this.basicModel.action === "editDirectname"){
                            let arr = this.formCustom.title.split(",");
                            let postData = {
                                id:this.formCustom.id,
                                directname:arr
                            };

                            tagEdit(postData,function(){
                                self.updateTableData(postData.id,"directname",arr);
                            });
                        }
                    }
                });
            },
            cancel(){

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
            }
        }
    }

</script>
