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
        <Breadcrumb-item>音频资源管理</Breadcrumb-item>
        <Breadcrumb-item>上传音频资源</Breadcrumb-item>
    </Breadcrumb>
</div>

<div class="layout-content">
    <div class="layout-content-main">
      <i-form id="uploadform" enctype="multipart/form-data">
        <input type="file" class="ivu-upload-input"
        v-on:change.stop.prevent="choosefiles()"
        id="choosebtn"
        accept="audio/basic,
        audio/mid,audio/mpeg,
        audio/x-pn-realaudio,
        audio/x-wav,
        audio/x-pn-realaudio
        audio/x-mpegurl"
        multiple>
    </i-form>

        <div class="main-table">
            <i-table :content="self"
            :columns="uploadtable"
            :data="tabledata"
            @on-selection-change="selectChange">
            </i-table>
        </div>
        <div class="btn-box">
            <i-button type="primary" @click.stop.prevent="createdFinish()">保存</i-button>
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
            //已经选择的文件信息
            selectedfiles:[],

            //表格调用的数据
            tabledata:[],

            //表格中选取的数据
            selectData:null,
            nickname:[],
            type:[],
            names:[],
            //表格中选取的数据
            uploadtable: [
                {
                    title: '资源名称',
                    key: 'name',
                    render(row,column,index){
                        return `<i-input :value.sync="names[${index}]"></i-input>`;
                    }
                },
                {
                    title: '文件名称',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '大小',
                    key: 'size',
                    align: 'center',
                    render(row,column,index){
                        let thissize=util.formatFileSize(row.size)
                        return thissize
                    }
                },
                {
                    title: '别名',
                    key: 'nickname',
                    align: 'center',
                    render(row,column,index){
                        return `<i-input :value.sync="nickname[${index}]"></i-input>`;
                    }
                },
                {
                    title: '分类',
                    key: 'type',
                    align: 'center',
                    render(row,column,index){
                        return `<i-select :model.sync="type[${index}]">
                          <i-option value="music">音乐</i-option>
                          <i-option value="song">儿歌</i-option>
                        </i-select>`;
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    width: 150,
                    render(row,column,index){
                        let statusName=util.getUploadStatus(row.status);
                        return statusName;
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render(row, column, index) {

                return  `<i-button type="error" icon="trash-a"
                        @click="removeItem(${index})">删除</i-button>`;

                    }
                }
            ]
        }
    },
    ready() {
        this.getSongInfo();
    },
    methods: {

        //选择本地文件，解析
        choosefiles(){
          this.tabledata=[];
          let files = document.getElementById('choosebtn').files;
            //解析nodelist,放在数组中
          for (let i=0; i < files.length; i++) {
              let nodeobj={
                name:files[i].name,
                size:files[i].size,
                lastModified:files[i].lastModified,
                webkitRelativePath:files[i].webkitRelativePath,
                status:-1,
                nickname:"",
                type:"music",
              };
              this.tabledata.push(nodeobj);
              this.type.push("music");
          }
        },
        getSongInfo(){

        },
        //获取选中数据
        selectChange(selection) {
          this.selectData = selection;
        },

        //单个删除
        removeItem(index){
          this.tabledata.splice(index,1);
          this.nickname.splice(index,1);
          this.type.splice(index,1);
        },
        //保存并上传
        createdFinish() {
            console.log(this.type)
            //构造资源信息并上传
            let formdata = new FormData(document.getElementById("uploadform"));
            //formdata.append("file",document.getElementById('choosebtn').files);

            var mediaFiles = document.getElementById('choosebtn').files;
            for(let i=0;i<mediaFiles.length;i++){
                 formdata.append("file"+i,mediaFiles[i]);
            }
            //合并数组
             for(let i=0;i<this.tabledata.length;i++){
                this.tabledata[i].name = this.names[i];
                this.tabledata[i].nickname = this.nickname[i];
                this.tabledata[i].type = this.type[i];

                this.tabledata[i].userinfo = {
                    editor:util.getCurrentEditor()[0],
                    editor_email:util.getCurrentEditor()[1]
                };
            }

            formdata.append('json',JSON.stringify(this.tabledata));

            this.$Loading.start();
            util.ajax({
                    method: 'POST',
                    url: util.getUrl('/airesources'),
                    data: formdata
                })
                .then((res) => {
                  this.$Loading.finish();
                  let uploadFailed = res.data.data.failed;
                  this.updateUploadState(uploadFailed);
                  this.info("上传完成!");
                })
                .catch(function(error) {
                    console.error(error);
                });

        },
        updateUploadState(fs){

            for(let i=0;i<this.tabledata.length;i++){
                this.tabledata[i].status = 1;
                if(!fs){
                    continue;
                }
                for(let j=0;j<fs.length;j++){
                    if(this.tabledata[i].name === fs[j]){
                        this.tabledata[i].status = 0;
                    }
                }
            }

        },
         //保存修改
        saveItemEdit(index) {

        },
        info (title) {
            this.$Notice.info({
                title:title,
                desc: ''
            });
        },

        //批量导入信息
        importInfo(){

        }
    }

}
</script>
