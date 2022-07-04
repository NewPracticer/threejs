import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/vcharts.js'
import Echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import VueECharts from 'vue-echarts'

Vue.config.productionTip = false
Vue.prototype.$echarts = Echarts
Vue.component('v-chart',VueECharts)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
