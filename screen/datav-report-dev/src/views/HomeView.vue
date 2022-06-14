<template>
  <div class="home">
    <top-view></top-view>
    <sales-view></sales-view>
    <bottom-view></bottom-view>
    <map-view></map-view>
  </div>
</template>

<script>
import TopView from '../components/TopView'
import SalesView from '../components/SalesView'
import BottomView from '../components/BottomView'
import MapView from '../components/MapView'
export default {
  name: 'HomeView',
  components: {
    TopView,
    SalesView,
    BottomView,
    MapView 
  }
}
</script>
<style >
  .home {
    width: 100%;
    height: 100%;
    padding: 28px;
    background: #eee;
    box-sizing: border-box;
  }
</style>
