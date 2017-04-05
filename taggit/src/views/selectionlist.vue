<style scoped>
.layout-breadcrumb{
    padding: 10px 15px 0;
}
</style>
<template>
      <div class="layout-header"></div>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item href="#">首页</Breadcrumb-item>
              <Breadcrumb-item href="#">歌单管理</Breadcrumb-item>
              <Breadcrumb-item href="#">歌单列表</Breadcrumb-item>
               <i-button type="primary" style="float:right">批量导入信息</i-button>
          </Breadcrumb>
      </div>
      <div class="layout-content">
        <Card>
          <i-form :model="formRight" label-position="right" :label-width="100">
              <Form-item label="专辑名称">
                  熊出没
              </Form-item>
              <Form-item label="标题名称">
                  熊出没
              </Form-item>
              <Form-item label="标题名称对齐">
                  熊出没
              </Form-item>
          </i-form>
        </Card>

        <p>资源列表（100条）</p>

        <i-table
        stripe
        size="small"
        border
        :columns="columns7"
        :data="data7">
        </i-table>

        <i-button type="primary" v-on="show()">批量添加</i-button>
        <i-button type="primary">保存</i-button>
      </div>
</template>
<script>
    export default {
      data(){
        return {
          columns7: [
                        {
                            type: 'selection',
                            width: 40,
                            align: 'center'
                        },
                        {
                            title: '资源ID',
                            key: 'id',
                            width: 80,
                        },
                        {
                            title: '资源名称',
                            key: 'name',
                            width:150,
                        },
                        {
                            title: 'APP名称',
                            key: 'appname',
                            render (row, column, index) {
                                return `<i-input :value.sync="data7[${index}].appname"></i-input>`;
                            }
                        },
                        {
                            title: '顺序',
                            key: 'index',
                            width: 90,
                            render (row, column, index) {
                                return `<i-input :value.sync="data7[${index}].index"></i-input>`;
                            }
                        },
                        {
                            title: '类型',
                            key: 'type',
                            width: 140,
                        },
                        {
                            title: '状态',
                            key: 'status',
                            width: 100,
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 100,
                            render () {
                                return `<i-button type="primary">删除</i-button>`;
                            }
                        },
                    ],
                data7: [
                              {
                                  id: '2323',
                                  name: "李哈哈哈哈",
                                  appname:"名字名字",
                                  status: '已上架',
                                  index:8,
                                  type:"儿歌",
                                  status:"已上架"
                              },
                              {
                                  id: '2323',
                                  name: "李哈哈哈哈",
                                  appname:"2啊哈哈哈 ",
                                  status: '已上架',
                                  index:9,
                                  type:"儿歌",
                                  status:"已上架"
                              }
                          ]
        }
      },
      methods: {
        show(){
          console.log(data7)
        }
      }
    }
</script>
