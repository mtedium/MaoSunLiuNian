<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const mapContainer = ref(null)
let mapInstance = null
let AMapLib = null

// 地图与数据状态
const isLoaded = ref(false)
const errorMessage = ref('')
const architectures = ref([])

// 侧边栏状态管理
const isSidebarOpen = ref(true)
const sidebarMode = ref('explorer') // 'explorer' | 'detail'
const selectedArch = ref(null)

// -----------------------------------------------------------
// 高德地图配置 (AMap JSAPI v2.0)
// -----------------------------------------------------------
const config = useRuntimeConfig()
const AMAP_KEY = config.public.amapKey // Web端(JSAPI) Key
const AMAP_SECURITY_CODE = config.public.amapSecurityCode // 安全密钥

// 获取所有建筑列表数据
const fetchArchitectures = async () => {
  try {
    const res = await $fetch('/api/map/list')
    if (res && res.code === 200) {
      architectures.value = res.data
    }
  } catch (error) {
    console.error('获取古建列表失败:', error)
  }
}

// 获取具体建筑的详情（包含AI缓存逻辑）
const fetchArchDetail = async (id) => {
  try {
    const res = await $fetch('/api/map/detail', {
      params: { id }
    })
    if (res && res.code === 200) {
      // 只要选中的 ID 还是刚点开的那个，才更新内容，防止高频切换覆盖
      if (selectedArch.value && selectedArch.value.id === id) {
        selectedArch.value = res.data
      }
    }
  } catch (error) {
    console.error('获取古建AI详情失败:', error)
  }
}

// 初始化地图
onMounted(async () => {
  // 先获取点数据
  await fetchArchitectures()

  // 1. 设置安全密钥
  window._AMapSecurityConfig = {
    securityJsCode: AMAP_SECURITY_CODE,
  }

  if (import.meta.client) {
    try {
      const AMapLoader = (await import('@amap/amap-jsapi-loader')).default
      AMapLib = await AMapLoader.load({
        key: AMAP_KEY,
        version: '2.0',
        plugins: [],
      })
      initMap()
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

const initMap = () => {
  if (!mapContainer.value) return

  // 确保DOM已有尺寸
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) {
        resizeObserver.disconnect()
        createMapInstance()
      }
    }
  })
  resizeObserver.observe(mapContainer.value)
}

const createMapInstance = () => {
  try {
    if (mapInstance) {
      mapInstance.destroy()
      mapInstance = null
    }
    if (!mapContainer.value) return

    mapInstance = new AMapLib.Map(mapContainer.value, {
      zoom: 5,
      center: [108.947, 34.259], // 暂以中心地带为视图主中心
      mapStyle: 'amap://styles/dark', // 暗色样式配合工业风
      viewMode: '3D'
    })

    mapInstance.on('complete', () => {
      isLoaded.value = true
      renderMarkers()
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

let mapMarkerInstances = {} // 存储 { id: Marker }

// 渲染 Marker 点位
const renderMarkers = () => {
  if (!mapInstance || !AMapLib) return
  
  // 清理旧的
  Object.values(mapMarkerInstances).forEach(m => m.setMap(null))
  mapMarkerInstances = {}

  architectures.value.forEach(arch => {
    if (arch.lng && arch.lat) {
      // 工业古风暗黑图标样式
      const markerContent = `
        <div class="relative w-8 h-8 flex items-center justify-center cursor-pointer group hover:scale-110 transition-transform">
          <div class="absolute inset-0 bg-[#ffbf00]/20 rounded-full animate-ping"></div>
          <div class="w-6 h-6 bg-black border-2 border-[#ffbf00] rounded-full flex items-center justify-center z-10 shadow-[0_0_10px_rgba(255,191,0,0.6)]">
             <div class="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
          </div>
        </div>
      `

      const marker = new AMapLib.Marker({
        position: new AMapLib.LngLat(arch.lng, arch.lat),
        content: markerContent,
        offset: new AMapLib.Pixel(-16, -16), // 让点居中
        title: arch.name,
        map: mapInstance,
        extData: arch // 将原数据绑上去
      })

      mapMarkerInstances[arch.id] = marker

      // 地图点位点击交互
      marker.on('click', () => {
        handleArchSelect(arch)
      })
    }
  })
}

// 侧边栏筛选变化时增删地图点显隐
const updateMapMarkers = (visibleIds) => {
  if (!mapInstance || !AMapLib) return
  Object.keys(mapMarkerInstances).forEach(id => {
    const numId = Number(id)
    if (visibleIds.includes(numId)) {
      mapMarkerInstances[id].show()
    } else {
      mapMarkerInstances[id].hide()
    }
  })
}

// 从地图或侧边栏点击一个建筑时触发的联动
const handleArchSelect = (arch) => {
  // 平滑移动地图至目标点
  if (mapInstance && AMapLib) {
    mapInstance.setZoomAndCenter(7, new AMapLib.LngLat(arch.lng, arch.lat), false, 1000)
  }
  
  // 设置侧边栏过渡
  // 浅拷贝设置，description为空意味着还在查询，触发MapSidebar里面的Loading态
  selectedArch.value = { ...arch, description: '' } 
  sidebarMode.value = 'detail'
  isSidebarOpen.value = true

  // 发起获取或触发 AI
  fetchArchDetail(arch.id)
}
</script>

<template>
  <div class="w-full h-screen relative flex overflow-hidden">
    
    <!-- 侧边栏：工业风多功能面板 -->
    <MapSidebar 
      :is-open="isSidebarOpen"
      :mode="sidebarMode"
      :architectures="architectures"
      :selected-arch="selectedArch"
      @close="isSidebarOpen = false"
      @toggle="isSidebarOpen = !isSidebarOpen"
      @select="handleArchSelect"
      @back="sidebarMode = 'explorer'"
      @filter-change="updateMapMarkers"
    />

    <!-- 地图容器区 -->
    <div class="flex-1 relative w-full h-full">
      <div ref="mapContainer" class="w-full h-full bg-black"></div>
      
      <!-- 加载提示：如果数据没回来或高德没加载完毕 -->
      <div 
        v-if="!isLoaded && !errorMessage" 
        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 text-[#ffbf00] space-y-4"
      >
        <svg class="animate-spin h-8 w-8 text-[#ffbf00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>地图引擎加载中...</span>
      </div>
      <div 
        v-else-if="errorMessage" 
        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 text-red-500 space-y-4"
      >
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 覆盖高德地图默认水印等杂项，使其更暗更沉浸 */
:deep(.amap-logo), :deep(.amap-copyright) {
  display: none !important;
}

:deep(.amap-map) {
  background-color: #000 !important;
}
</style>
