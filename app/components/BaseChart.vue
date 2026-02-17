<script setup>
import { onMounted, onUnmounted, ref, watch, markRaw } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  height: {
    type: String,
    default: '400px'
  },
  width: {
    type: String,
    default: '100%'
  }
})

const chartRef = ref(null)
const chartInstance = ref(null)
let resizeObserver = null

const initChart = () => {
  if (!chartRef.value) return
  
  // Use markRaw to prevent Vue from making the echarts instance reactive
  chartInstance.value = markRaw(echarts.init(chartRef.value))
  
  if (props.options) {
    chartInstance.value.setOption(props.options)
  }
}

const resizeChart = () => {
  chartInstance.value?.resize()
}

// Watch for options changes
watch(
  () => props.options,
  (newOptions) => {
    chartInstance.value?.setOption(newOptions, true) // second arg true = not merge, replace components if needed, or false to merge. Usually false is default but for full updates sometimes true is better. Let's stick to default merge behavior unless specific issues arise, or maybe deep watch?
    // Actually, simple setOption merge is usually what's expected.
    chartInstance.value?.setOption(newOptions)
  },
  { deep: true }
)

onMounted(() => {
  initChart()

  // Use ResizeObserver for more robust resizing (detects container size changes, not just window)
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      resizeChart()
    })
    resizeObserver.observe(chartRef.value)
  }
  
  // Also listen to window resize as a backup/standard behavior
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
  
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  
  window.removeEventListener('resize', resizeChart)
})
</script>

<template>
  <div 
    ref="chartRef" 
    :style="{ height: height, width: width }"
    class="base-chart"
  ></div>
</template>

<style scoped>
.base-chart {
  overflow: hidden;
}
</style>
