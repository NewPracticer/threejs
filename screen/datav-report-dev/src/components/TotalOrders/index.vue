<template>
  <common-card
    title="累计订单量"
    value="2,157,420"
  >
    <template>
      <v-chart :options="getOptions()"/>
    </template>
    <template v-slot:footer>
      <span>昨日销售额</span>
      <span class="emphasis">￥30,000,000</span>
    </template>
  </common-card>
</template>
<script>
import commonCardMixin from '../../mixins/commonCardMixin'
export default {
  mixins: [commonCardMixin],
  methods: {
    getOptions() {
      return {
        xAxis:{
        type: 'category',
        show: false,
        boundaryGap: false
      },
      yAxis:{
        show: false
      },
      grid: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
      series:[{
        type: 'line',
        data: [620,432,220,534,790,430,220,320,532,834,690,530,220,620],
        areaStyle: {
          color: 'purple'
        },
        smooth: true,
        lineStyle: {
          width: 0
        },
        itemStyle: {
          opacity: 0
        }
      }]
      }
    }
  }
}
</script>
<style lang = "scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>