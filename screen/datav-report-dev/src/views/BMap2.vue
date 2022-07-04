<template>
    <ve-map 
      :settings="chartSettings"
      :title = "title"
      width = "100%"
      height = "100%"
      ></ve-map>
</template>

<script>
export default {
  data() {
    return {
      title: {
        text: 'SKYL外卖销售数据大盘',
        subtext: '销售趋势统计',
        sublink: '',
        left: 'center'  
      },
      chartSettings: {}
    }  
  },
  mounted() {
    this.chartSettings = {
      key: 'CwGyktaKwkdnYzrarr3et3LWtPAgBrla',
        bmap: {
          center: [104.114129, 37.550339],
          zoom: 10,
          roam: true
        }
    }
  }
}
</script>
<style  lang="scss" scoped>
.map-view{
  width: 100%;
}
</style>