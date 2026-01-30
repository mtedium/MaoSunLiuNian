<template>
  <div class="admin-container">
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <el-icon><DataLine /></el-icon>
            <span>数据概览</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><Document /></el-icon>
            <span>内容管理</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-container>
        <el-header>
          <h2>卯榫流年 - 后台管理系统</h2>
        </el-header>
        
        <el-main>
          <!-- Stats Cards -->
          <el-row :gutter="20" class="mb-4">
            <el-col :span="6">
              <el-card shadow="hover">
                <template #header>总访问量 (PV)</template>
                <div class="stat-number">12,580</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover">
                <template #header>用户数 (UV)</template>
                <div class="stat-number">3,402</div>
              </el-card>
            </el-col>
          </el-row>

          <!-- Charts -->
          <el-row :gutter="20" class="mb-4">
            <el-col :span="12">
              <el-card>
                <template #header>热门建筑 Top 10</template>
                <div ref="chartContainer" style="width: 100%; height: 300px;"></div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>用户分布</template>
                <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">
                  (Map Placeholder)
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- Data Table -->
          <el-card>
            <template #header>最近访问记录</template>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="时间" width="180" />
              <el-table-column prop="user" label="用户" width="180" />
              <el-table-column prop="action" label="行为" />
              <el-table-column prop="target" label="目标对象" />
            </el-table>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { DataLine, Document, Setting } from '@element-plus/icons-vue';

const chartContainer = ref(null);
const tableData = ref([
  { date: '2023-10-01 12:00', user: 'Guest_01', action: 'View', target: '佛光寺东大殿' },
  { date: '2023-10-01 12:05', user: 'Guest_02', action: 'Click 3D', target: '应县木塔' },
  { date: '2023-10-01 12:10', user: 'Guest_03', action: 'Read', target: '赵州桥' },
]);

const initChart = () => {
  const myChart = echarts.init(chartContainer.value);
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['佛光寺', '应县木塔', '故宫太和殿', '赵州桥', '蓬莱阁', '岳阳楼', '祈年殿'],
        axisTick: { alignWithLabel: true }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '访问热度',
        type: 'bar',
        barWidth: '60%',
        data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: {
          color: '#b13b2e' // Cinnabar color
        }
      }
    ]
  };
  myChart.setOption(option);
  
  window.addEventListener('resize', () => {
    myChart.resize();
  });
};

onMounted(() => {
  initChart();
});
</script>

<style scoped>
.admin-container {
  height: 100vh;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
}
.el-aside {
  background-color: #fff;
  border-right: 1px solid #dcdfe6;
}
.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #2b333e;
}
.mb-4 {
  margin-bottom: 20px;
}
</style>
