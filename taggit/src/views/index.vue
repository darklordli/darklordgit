<style scoped>
  #chartid{
    width: 100%;
    height:500px;
  }
</style>

<template>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item>首页</Breadcrumb-item>
              <Breadcrumb-item>dashboard</Breadcrumb-item>
          </Breadcrumb>
      </div>
      <div class="layout-content">
      <div class="layout-content-main">
        <div id="chartid"></div>
      </div>
    </div>
    <Back-top></Back-top>
</template>
<script>
    import util from '../libs/util';
    import echarts from 'echarts'
    export default {
      name:"index",
      data() {
        return {
          chart: null,
          chartdata:{
            line1data:[120, 132, 101, 134, 90, 230, 210],
            line2data:[220, 182, 191, 234, 290, 330, 310],
            line3data:[150, 232, 201, 154, 190, 330, 410],
            line4data:[320, 332, 301, 334, 390, 330, 320],
            line5data:[820, 932, 901, 934, 1290, 1330, 1320]
          }
        }
      },
      computed: {

      },
      ready(){
        this.initchart();
      },
      methods: {
        initchart () {
          this.chart = echarts.init(document.getElementById('chartid'))
          this.chart.setOption({
            title: {
                 text: '分类资源访问量',
                 left: 'center'
             },
             tooltip : {
                 trigger: 'axis'
             },
             legend: {
                data:['儿歌','故事','音乐','国学','其它'],
                bottom: 0,
                left: 'center',
             },
             toolbox: {
                 feature: {
                     saveAsImage: {}
                 }
             },
             grid: {
                 left: '3%',
                 right: '4%',
                 bottom: '3%',
                 containLabel: true
             },
             xAxis : [
                 {
                     type : 'category',
                     boundaryGap : false,
                     data : ['周一','周二','周三','周四','周五','周六','周日']
                 }
             ],
             yAxis : [
                 {
                     type : 'value'
                 }
             ],
             series : [
                 {
                     name:'儿歌',
                     type:'line',
                     stack: '总量',
                     areaStyle: {normal: {}},
                     data:this.chartdata.line1data
                 },
                 {
                     name:'故事',
                     type:'line',
                     stack: '总量',
                     areaStyle: {normal: {}},
                     data:this.chartdata.line2data
                 },
                 {
                     name:'音乐',
                     type:'line',
                     stack: '总量',
                     areaStyle: {normal: {}},
                     data:this.chartdata.line3data
                 },
                 {
                     name:'国学',
                     type:'line',
                     stack: '总量',
                     areaStyle: {normal: {}},
                     data:this.chartdata.line4data
                 },
                 {
                     name:'其它',
                     type:'line',
                     stack: '总量',
                     label: {
                         normal: {
                             show: true,
                             position: 'top'
                         }
                     },
                     areaStyle: {normal: {}},
                     data:this.chartdata.line5data
                 }
             ]
          })
        }
      }
    }
</script>
