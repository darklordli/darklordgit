<style scoped>
.layout-breadcrumb{
    padding: 10px 15px 0;
}
</style>
<template>
      <div class="layout-header"></div>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item>首页</Breadcrumb-item>
              <Breadcrumb-item>歌单管理</Breadcrumb-item>
              <Breadcrumb-item>专辑列表</Breadcrumb-item>
          </Breadcrumb>
      </div>
      <div class="layout-content">

          <i-form v-ref:form-inline :model="formInline" :rules="ruleInline" inline>
              <Form-item>
              <i-input :value.sync="formItem.input" placeholder="系列/专辑"></i-input>
              </Form-item>

              <Form-item>
              <i-select :model.sync="formItem.select" placeholder="类型">
                      <i-option value="beijing">全部</i-option>
                      <i-option value="shanghai">专辑</i-option>
                      <i-option value="shenzhen">互动故事</i-option>
                      <i-option value="shenzhen">app专辑</i-option>
              </i-select>
              </Form-item>

              <Form-item>
                  <i-input :value.sync="formItem.input" placeholder="编辑人："></i-input>
              </Form-item>

              <Form-item>
                  <Date-picker
                  type="date"
                  placeholder="编辑时间："
                  :value.sync="formValidate.date">
                  </Date-picker>
              </Form-item>

              <i-button type="primary" shape="circle" icon="ios-search">搜索</i-button>

          </i-form>

          <i-form v-ref:form-inline :model="formInline" :rules="ruleInline" inline>
              <i-button type="info">新建专辑</i-button>
          </i-form>

          <!-- 表格-->
          <i-table stripe highlight-row :columns="columns3" :data="data1"></i-table>
      </div>
</template>
<script>
    export default {
      data(){
        return {
            columns3: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '年龄',
                    key: 'age'
                },
                {
                    title: '地址',
                    key: 'address'
                }
            ],
            data1: [
                {
                    name: '王小明',
                    age: 18,
                    address: '北京市朝阳区芍药居'
                },
                {
                    name: '张小刚',
                    age: 25,
                    address: '北京市海淀区西二旗'
                },
                {
                    name: '李小红',
                    age: 30,
                    address: '上海市浦东新区世纪大道'
                },
                {
                    name: '周小伟',
                    age: 26,
                    address: '深圳市南山区深南大道'
                }
            ]
        }
      }
    }
</script>
