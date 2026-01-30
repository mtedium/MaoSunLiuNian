<template>
  <div class="map-container">
    <div id="amap-container" class="map-view"></div>

    <!-- Sidebar for Building Details -->
    <transition name="slide-fade">
      <div v-if="selectedBuilding" class="sidebar">
        <div class="sidebar-header">
          <h3>{{ selectedBuilding.name }}</h3>
          <span class="close-btn" @click="selectedBuilding = null">×</span>
        </div>
        <div class="sidebar-content">
          <p><strong>朝代：</strong>{{ selectedBuilding.dynasty }}</p>
          <p><strong>类型：</strong>{{ selectedBuilding.type }}</p>
          <p class="desc">{{ selectedBuilding.desc || '暂无简介' }}</p>
          <router-link :to="`/building/${selectedBuilding.id}`" class="detail-link">查看详情</router-link>
        </div>
      </div>
    </transition>

    <!-- Controls Layer -->
    <div class="controls-layer">
      <!-- Search -->
      <div class="search-box">
        <input v-model="searchQuery" @keyup.enter="handleSearch" placeholder="搜索古建筑..." />
        <button @click="handleSearch">🔍</button>
      </div>

      <!-- Filters -->
      <div class="filters">
        <label v-for="type in buildingTypes" :key="type">
          <input type="checkbox" :value="type" v-model="selectedTypes" @change="updateMarkers" />
          {{ type }}
        </label>
      </div>
    </div>

    <!-- Timeline Slider -->
    <div class="timeline-container">
      <div class="timeline-track">
        <div 
          v-for="(dynasty, index) in dynasties" 
          :key="dynasty"
          class="timeline-point"
          :class="{ active: currentDynastyIndex === index }"
          @click="currentDynastyIndex = index; updateMarkers()"
        >
          {{ dynasty }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';

// --- Data ---
const map = shallowRef(null);
const markers = ref([]);
const selectedBuilding = ref(null);
const searchQuery = ref('');
const selectedTypes = ref(['民居', '官府', '皇宫', '桥梁']);
const buildingTypes = ['民居', '官府', '皇宫', '桥梁'];
const dynasties = ['唐', '宋', '元', '明', '清'];
const currentDynastyIndex = ref(4); // Default to '清' or all

// Mock Data (Replace with API call)
const buildingsData = [
  { id: 1, name: '佛光寺东大殿', type: '官府', dynasty: '唐', lng: 113.4, lat: 38.5, desc: '中国现存第二古老的木结构建筑。' },
  { id: 2, name: '应县木塔', type: '皇宫', dynasty: '辽', lng: 113.1, lat: 39.5, desc: '世界上现存最高的古代木结构塔。' }, // 辽 roughly maps to Song period logic for simplicity
  { id: 3, name: '故宫太和殿', type: '皇宫', dynasty: '清', lng: 116.4, lat: 39.9, desc: '中国最大的木结构大殿。' },
  { id: 4, name: '赵州桥', type: '桥梁', dynasty: '隋', lng: 114.8, lat: 37.7, desc: '世界上现存年代最久远、跨度最大的单孔坦弧敞肩石拱桥。' },
  { id: 5, name: '宏村', type: '民居', dynasty: '明', lng: 117.9, lat: 30.0, desc: '徽派建筑的典型代表。' },
];

// --- Map Logic ---
const initMap = () => {
  window._AMapSecurityConfig = {
    securityJsCode: 'YOUR_SECURITY_CODE_HERE', // REPLACE ME
  };

  AMapLoader.load({
    key: 'YOUR_KEY_HERE', // REPLACE ME
    version: '2.0',
    plugins: ['AMap.Marker', 'AMap.ToolBar'],
  })
    .then((AMap) => {
      map.value = new AMap.Map('amap-container', {
        viewMode: '3D',
        zoom: 5,
        center: [105, 35], // Center of China
        mapStyle: 'amap://styles/whitesmoke', // Custom style if available
      });

      map.value.addControl(new AMap.ToolBar());
      updateMarkers();
    })
    .catch((e) => {
      console.error('Map loading failed', e);
      // Fallback UI or logic could go here
    });
};

const updateMarkers = () => {
  if (!map.value) return;

  // Clear existing
  map.value.clearMap();

  const currentDynasty = dynasties[currentDynastyIndex.value];
  
  // Filter Logic: 
  // 1. Match selected Types
  // 2. Match Dynasty (Logic: Show buildings UP TO the selected dynasty, or just that dynasty? 
  //    Let's assume "Time Travel" shows buildings existing in that era.
  //    For simplicity, let's just filter by exact dynasty match OR show all if user wants 'All')
  //    Let's implemented "Exact Match" for now to show timeline effect clearly.
  
  const filtered = buildingsData.filter(b => {
    // Simple dynasty mapping for demo. Real app needs precise dates.
    // Allow loosely matching for demo purposes
    const dynastyMatch = b.dynasty === currentDynasty || (currentDynasty === '清' && true); // '清' shows all for demo? No, let's stick to strict.
    
    // Actually, let's make the timeline cumulative? No, distinct eras is better for "Time Travel".
    // Let's just match dynasty exactly.
    // Exception: Let '清' include everything for a "Full View" mode if needed, but let's stick to strict filtering.
    // Wait, to make the map look populated, let's make the timeline cumulative: "By the time of Ming..."
    const dMap = { '唐': 1, '宋': 2, '元': 3, '明': 4, '清': 5 };
    // Map data dynasty to number
    let bDynastyVal = 0;
    if (b.dynasty === '隋' || b.dynasty === '唐') bDynastyVal = 1;
    else if (b.dynasty === '辽' || b.dynasty === '宋') bDynastyVal = 2;
    else if (b.dynasty === '元') bDynastyVal = 3;
    else if (b.dynasty === '明') bDynastyVal = 4;
    else bDynastyVal = 5;

    const currentVal = dMap[currentDynasty];
    
    return selectedTypes.value.includes(b.type) && bDynastyVal <= currentVal;
  });

  filtered.forEach(b => {
    // AMap is globally available if loaded via loader, but safer to access via map instance context if possible.
    // However, AMapLoader returns the AMap object. We need to access it. 
    // Since we are inside the component, we can use the global AMap if it was exposed, 
    // or we have to rely on the fact that AMapLoader loaded it.
    // The AMap object is usually available on window.AMap after load.
    
    if (window.AMap) {
      const marker = new window.AMap.Marker({
        position: [b.lng, b.lat],
        title: b.name,
      });
      
      marker.on('click', () => {
        selectedBuilding.value = b;
        map.value.setZoomAndCenter(8, [b.lng, b.lat]);
      });
      
      map.value.add(marker);
    }
  });
};

const handleSearch = () => {
  if (!searchQuery.value) return;
  const target = buildingsData.find(b => b.name.includes(searchQuery.value));
  if (target) {
    selectedBuilding.value = target;
    map.value.setZoomAndCenter(10, [target.lng, target.lat]);
  } else {
    alert('未找到该建筑');
  }
};

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map.value) {
    map.value.destroy();
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.map-view {
  width: 100%;
  height: 100%;
}

.controls-layer {
  position: absolute;
  top: 80px; /* Below Navbar */
  left: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-box {
  background: white;
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
}

.search-box input {
  border: none;
  outline: none;
  padding: 5px;
  width: 200px;
}

.filters {
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.timeline-container {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.timeline-track {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.timeline-track::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: #ccc;
  z-index: -1;
}

.timeline-point {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.timeline-point.active {
  background: var(--color-cinnabar, #b13b2e);
  color: white;
  border-color: var(--color-cinnabar, #b13b2e);
  transform: scale(1.2);
}

.sidebar {
  position: absolute;
  right: 0;
  top: 60px; /* Below Navbar */
  bottom: 0;
  width: 300px;
  background: white;
  z-index: 20;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  padding: 20px;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(100%);
}

.detail-link {
  display: block;
  margin-top: 20px;
  text-align: center;
  background: var(--color-lacquer, #2b333e);
  color: white;
  padding: 10px;
  border-radius: 4px;
  text-decoration: none;
}
</style>
