<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const mapContainer = ref(null)
let mapInstance = null
const isLoaded = ref(false)
const errorMessage = ref('')

// -----------------------------------------------------------
// 高德地图配置 (AMap JSAPI v2.0)
// -----------------------------------------------------------
const AMAP_KEY = 'cc82e89f886c16728d6c86d6c5631775' // Web端(JSAPI) Key
const AMAP_SECURITY_CODE = 'd1e32d02be2b632db3fe94f7f58bfc2f' // 安全密钥

onMounted(async () => {
  // 1. 设置安全密钥
  window._AMapSecurityConfig = {
    securityJsCode: AMAP_SECURITY_CODE,
  }

  // 动态导入 AMapLoader 以避免 SSR 问题
  if (import.meta.client) {
    try {
      const AMapLoader = (await import('@amap/amap-jsapi-loader')).default
      const AMap = await AMapLoader.load({
        key: AMAP_KEY,
        version: '2.0',
        plugins: [],
      })
      initMap(AMap)
    } catch (e) {
      console.error('高德地图加载失败:', e)
      errorMessage.value = '地图服务加载失败，请检查网络或配置'
    }
  }
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.destroy()
    mapInstance = null
  }
})

const initMap = (AMap) => {
  if (!mapContainer.value) return

  // 使用 ResizeObserver 确保容器有尺寸后再初始化
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) {
        resizeObserver.disconnect()
        createMapInstance(AMap)
      }
    }
  })
  resizeObserver.observe(mapContainer.value)
}

const createMapInstance = (AMap) => {
  try {
    // 强制清理容器
    if (mapInstance) {
      mapInstance.destroy()
      mapInstance = null
    }

    // 确保 DOM 元素存在且有尺寸
    if (!mapContainer.value) return

    mapInstance = new AMap.Map(mapContainer.value, {
      zoom: 4,
      center: [108.947, 34.259], // 以西安为中心
      mapStyle: 'amap://styles/dark',
      viewMode: '3D'
    })

    // 等待地图加载完成
    mapInstance.on('complete', () => {
      console.log('地图加载完成')
      isLoaded.value = true
      
      // 添加一些示例标记
      const markers = [
        { position: [116.397, 39.918], title: '北京故宫' },
        { position: [112.550, 37.870], title: '山西佛光寺' },
        { position: [113.264, 23.129], title: '广州陈家祠' }
      ]

      markers.forEach(m => {
        if (Array.isArray(m.position) && m.position.length === 2) {
          new AMap.Marker({
            position: new AMap.LngLat(m.position[0], m.position[1]),
            title: m.title,
            map: mapInstance
          })
        }
      })
    })
    
    mapInstance.on('error', (e) => {
      console.error('地图加载出错:', e)
      errorMessage.value = '地图加载异常'
    })

  } catch (error) {
    console.error('地图初始化失败:', error)
    errorMessage.value = '地图初始化失败'
  }
}
</script>

<template>
  <div class="w-full h-screen relative">
    <!-- 地图容器 -->
    <div ref="mapContainer" class="w-full h-full"></div>

    <!-- 覆盖层：加载中或错误提示 -->
    <ConstructionOverlay 
      :show="true"
      :title="errorMessage ? '出错了' : '营造中'"
      :message="errorMessage || (isLoaded ? '地图功能持续优化中...' : '地图服务加载中...')"
    />
  </div>
</template>

<style scoped>
/* 覆盖高德地图默认样式，使其更暗 */
:deep(.amap-logo), :deep(.amap-copyright) {
  display: none !important;
}
</style>
