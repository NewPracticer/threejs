<template>
  <div class="bottom-view">
    <div class="view">
      <el-card shadow="hover">
        <template>
          <div class="title-wrapper">关键词搜索</div>
        </template>
        <template>
          <div class="chart-wrapper">
            <div class="chart-inner">
              <div class="chart">
                <div class="chart-title">搜索用户数</div>
                <div class="chart-data">{{userCount | format}}</div>
                <v-chart :options="searchUserOption" />
              </div>
              <div class="chart">
                <div class="chart-title">搜索量</div>
                <div class="chart-data">{{searchCount | format}}</div>
                <v-chart :options="searchUserOption" />
              </div>
            </div>
            <div class="table-wrapper">
              <el-table :data="tableData">
                <el-table-column prop="rank" label="排名" />
                <el-table-column prop="keyword" label="关键词" />
                <el-table-column prop="count" label="总搜索量" />
                <el-table-column prop="users" label="搜索用户数" />
                <el-table-column prop="range" label="搜索占比" />
              </el-table>
              <el-pagination
                layout="prev, pager, next"
                :total="total"
                :page-size="pageSize"
                background
              />
            </div>
          </div>
        </template>
      </el-card>
    </div>
    <div class="view">
      <el-card shadow="hover">
        <template >
          <div class="title-wrapper">
            <div class="title">分类销售排行</div>
            <div class="radio-wrapper">
              <el-radio-group v-model="radioSelect" size="small">
                <el-radio-button label="品类"></el-radio-button>
                <el-radio-button label="商品"></el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </template>
        <template>
          <div class="chart-wrapper">
            <v-chart :options="categoryOptions" />
          </div>
        </template>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
 data() {
   return {
     searchUserOption: {
       xAxis: {
         type: 'category'    
       },
       yAxis: {
         show: false    
       },
       series: [{
         type: 'line',
         data: [100,150,200,250,200,150,100,50,100],
         areaStyle: {
           color: 'rgba(95,187,255,.5)'    
         },
         lineStyle: {
           color: 'rgb(95,187,255)'    
         },
         itemStyle: {
           opacity: 0
         }
       }],
       grid: {
         top: 0,
         left: 0,
         bottom: 0,
         right: 0    
       }    
     },
     searchNumberOption: {},
     tableData: [
       {id:1,rank:1,keyword:'北京',count:100,user:90,range:'90%'},
       {id:1,rank:1,keyword:'北京',count:100,user:90,range:'90%'}, 
       {id:1,rank:1,keyword:'北京',count:100,user:90,range:'90%'}, 
       {id:1,rank:1,keyword:'北京',count:100,user:90,range:'90%'}, 
       {id:1,rank:1,keyword:'北京',count:100,user:90,range:'90%'},     
     ],
     radioSelect: '品类',
     totalData: [],
        total: 0,
        pageSize: 4,
        userCount: 0,
        searchCount: 0,
     categoryOptions:{}    
   }    
 },
 methods: {
   renderPieChart() {
   const mockData = [
     {
       legendname: '粉面糊店',
       value: 67,
       percent: '15.40%',
       itemStyle: {
         color: '#e7e702'
       },
       name: '粉面糊店 | 15.40%'    
     },
     {
       legendname: '简餐便当',
       value: 97,
       percent: '22.30%', 
       itemStyle: {
         color: '#8d7fec'
       },
       name: '简餐便当 | 22.30%'   
     },
     {
       legendname: '汉堡批萨',
       value: 92,
       percent: '21.15%',
       itemStyle: {
         color: '#5085f2'
       },
       name: '汉堡批萨 | 21.15%'    
     },    
   ]
   this.categoryOptions = {
     title:[{
       text:'品类分布',
       textStyle:{
         fontSize: 14,
         color: '#666'    
       },
       left: 20,
       top: 20   
     },{
       text: '累计订单量',
       subtext: '320',
       x: '34.5%',
       y: '42.5%',
       textStyle: {
         fontSize: 14,
         color: '#999'
       },
       subtextStyle: {
         fontSize: 28,
         color: '#333'
       },
       textAlign:'center'
     }
],
     series: [{
       type:'pie',
       data: mockData,
       label: {
         normal: {
           show: true,
           position: 'outter',
           formatter: function(params){
             return params.data.legendname  ;    
           }  
         }    
       },
       center: ['35%','50%'],
       radius: ['45%','60%'],
       labelLine: {
         normal: {
           length: 5,
           length2: 3,
           smooth: true    
         }    
       }    
     }],
     legend: {
       type: 'scroll',
       orient: 'vertical',
       height: 250,
       left : '70%',
       top: 'middle'    
     },
     tooltip: {
       trigger: 'item',
       formatter: function(params){
         const str = 
           params.marker + params.data.legendname + '<br />' +
           '数量：' + params.data.value + '<br />' +
           '占比：' + params.data.percent + '%'
         return str    
       }    
     }    
   }  
 }
 },
 mounted() {
   this.renderPieChart();    
 }
 
}
</script>
<style lang="scss" scoped>
  .echarts {
    width: 100%;
    height: 100%;
  }
  .bottom-view {
    display: flex;
    margin-top: 20px;

    .view {
      flex: 1;
      width: 50%;
      box-sizing: border-box;

      &:first-child {
        padding: 0 10px 0 0;
      }

      &:last-child {
        padding: 0 0 0 10px;
      }

      .title-wrapper {
        display: flex;
        align-items: center;
        height: 60px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        font-weight: 500;
        padding: 0 0 0 20px;

        .radio-wrapper {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          padding-right: 20px;
        }
      }

      .chart-wrapper {
        display: flex;
        flex-direction: column;
        height: 452px;

        .chart-inner {
          display: flex;
          padding: 0 10px;
          margin-top: 20px;

          .chart {
            flex: 1;
            padding: 0 10px;

            .chart-title {
              color: #999;
              font-size: 14px;
            }

            .chart-data {
              font-size: 22px;
              color: #333;
              font-weight: 500;
              letter-spacing: 2px;
            }

            .echarts {
              height: 50px;
            }
          }
        }

        .table-wrapper {
          flex: 1;
          margin-top: 20px;
          padding: 0 20px 20px;

          .el-pagination {
            display: flex;
            justify-content: flex-end;
            margin-top: 15px;
          }
        }
      }
    }
  }
</style>