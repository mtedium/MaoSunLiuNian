<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BaseChart from './BaseChart.vue'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const containerRef = ref(null)
const activeHotspot = ref(null)
let scrollTriggerInstance = null

// Hotspots Data
const hotspots = [
  { id: 1, x: '20%', y: '32%', title: '敞肩拱', desc: '大拱两端各设两个小拱，减轻自重，增加泄洪能力。' },
  { id: 2, x: '50%', y: '33%', title: '独立拱券', desc: '28道拱券独立砌筑，一道受损不影响其他，便于修缮。' },
  { id: 3, x: '75%', y: '45%', title: '腰铁', desc: '拱石间以“腰铁”横向连接，嵌入卯眼浇以生铁水，实现“以柔克刚”。' }
]

const toggleHotspot = (id) => {
  if (activeHotspot.value === id) {
    activeHotspot.value = null
  } else {
    activeHotspot.value = id
  }
}

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// Chart Options for Zhaozhou Bridge History
const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: isDark.value ? 'rgba(28, 25, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDark.value ? '#78350f' : '#d6d3d1',
    textStyle: { color: isDark.value ? '#e7e5e4' : '#1c1917' }
  },
  grid: {
    top: '15%',
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['隋', '唐', '宋', '明', '清', '现代'],
    axisLine: { lineStyle: { color: isDark.value ? '#78350f' : '#d6d3d1' } },
    axisTick: { show: false },
    axisLabel: { color: isDark.value ? '#a8a29e' : '#78716c', fontSize: 14, fontFamily: 'serif' }
  },
  yAxis: {
    type: 'value',
    name: '灾害强度等级',
    nameLocation: 'end',
    nameTextStyle: { color: isDark.value ? '#a8a29e' : '#78716c', align: 'left', padding: [0, 0, 0, 10] },
    splitLine: { show: false },
    axisLine: { show: true, lineStyle: { color: isDark.value ? '#78350f' : '#d6d3d1' } },
    axisLabel: { color: isDark.value ? '#78716c' : '#a8a29e' }
  },
  series: [
    {
      name: '洪水/地震',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: '#d97706' },
      lineStyle: { width: 3 },
      areaStyle: {
        color: new Function("return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(217, 119, 6, 0.5)'}, {offset: 1, color: 'rgba(217, 119, 6, 0)'}])")
      },
      data: [6, 7, 5, 8, 6, 9] // Mock intensity data
    }
  ]
}))

onMounted(() => {
  const container = containerRef.value
  const section = sectionRef.value

  // Horizontal scroll animation (3 screens: 4-1, 4-2, 4-3)
  scrollTriggerInstance = gsap.to(container, {
    xPercent: -100 * (2/3), // Move 2 screens out of 3
    ease: "none",
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 1,
      end: "+=3000",
      snap: 1 / 2, // Snap to 3 sections
    }
  })
})

onUnmounted(() => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.scrollTrigger?.kill()
    scrollTriggerInstance.kill()
  }
})
</script>

<template>
  <section ref="sectionRef" class="relative h-screen w-screen overflow-hidden bg-bg-surface text-text-primary">
    <!-- Horizontal Container (300vw) -->
    <div ref="containerRef" class="flex h-full w-[300vw]">
      
      <!-- 4-1: Golden Quote Screen -->
      <div class="w-screen h-full flex items-center justify-center relative border-r border-border-default bg-bg-surface">
        <!-- Background Image Placeholder -->
        <div class="absolute inset-0 z-0 opacity-10 dark:opacity-40 bg-[url('https://images.unsplash.com/photo-1544253372-e1d1b09b5523?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay pointer-events-none"></div>
        <div class="max-w-4xl px-8 text-center space-y-12 relative z-10">
          <p class="text-3xl md:text-5xl font-serif leading-relaxed text-text-primary drop-shadow-lg">
            “当赵州桥的第一块拱石落下，<br>
            木头教会了石头如何呼吸。”<br>
            <span class="block mt-8 text-2xl md:text-4xl opacity-90 text-text-primary">
              腰铁是石头的榫头，卯眼是拱石的承诺。<br>
              ——1400年来，它们共同承受着洨河的冲击，<br>
              从未背弃彼此。
            </span>
          </p>
        </div>
      </div>

      <!-- 4-2: Scene Screen (Parallax Background) -->
      <div class="w-screen h-full flex items-center relative border-r border-border-default overflow-hidden bg-bg-surface">
        <!-- Background Image -->
        <div class="absolute inset-0 z-0">
          <img 
            src="../assets/images/zhaozhouqiao.jpg" 
            alt="赵州桥全景" 
            class="w-full h-full object-cover opacity-20 dark:opacity-60"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-bg-surface via-bg-surface/80 dark:from-black dark:via-black/40 to-transparent"></div>
        </div>

        <div class="container mx-auto px-8 relative z-10 h-full flex flex-col justify-end pb-24 text-text-primary dark:text-white">
          <!-- Bottom Right Text -->
          <div class="self-end max-w-2xl text-right space-y-6">
            <div class="text-amber-500 font-mono text-lg uppercase tracking-widest border-r-4 border-amber-600 pr-4 drop-shadow">
              公元605-616年 · 隋代 · 河北赵县
            </div>
            <h2 class="text-5xl font-bold drop-shadow-md">第四幕：跨界 · 赵州桥的弧光</h2>
            <p class="text-2xl opacity-90 font-serif leading-loose drop-shadow-md">
              李春在洨河上建造的，不仅是一座桥，<br>
              更是一个关于<span class="text-amber-400 font-bold">“连接”</span>的哲学宣言。
            </p>
          </div>
        </div>
      </div>

      <!-- 4-3: Technical Analysis Screen -->
      <div class="w-screen h-full flex items-center relative bg-bg-surface" @click="activeHotspot = null">
        <div class="container mx-auto px-8 h-full flex flex-col justify-center py-12">
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full">
            <!-- Left: Structural Diagram with Hotspots -->
            <div class="relative w-full aspect-video flex items-center justify-center bg-bg-elevated rounded-xl border border-border-subtle shadow-2xl overflow-hidden group" @click.stop>
               <img src="../assets/images/zhaozhouqiao2.jpg" alt="赵州桥结构拆解" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
               <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-bg-surface/90 text-amber-500 px-3 py-1 rounded-full text-xs font-bold pointer-events-none backdrop-blur-sm shadow border border-amber-500/30 animate-pulse">点击红点查看详情</div>
              
              <!-- Interactive Hotspots -->
              <div 
                v-for="spot in hotspots" 
                :key="spot.id"
                class="absolute w-6 h-6 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                :style="{ top: spot.y, left: spot.x }"
                @click="toggleHotspot(spot.id)"
              >
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                
                <!-- Tooltip (Title Only) -->
                <div 
                  v-if="activeHotspot === spot.id"
                  class="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-bg-surface/90 backdrop-blur border border-red-500/50 px-4 py-2 rounded shadow-xl z-20"
                >
                  <h4 class="text-red-400 font-bold text-sm">{{ spot.title }}</h4>
                  <!-- Arrow -->
                  <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-surface/90"></div>
                </div>
              </div>
            </div>

            <!-- Right: Analysis Points & Chart -->
            <div class="space-y-12">
               <!-- Analysis List (Static) -->
               <div class="space-y-6">
                 <div 
                   class="flex items-start space-x-4 transition-all duration-300 p-4 rounded-lg cursor-pointer" 
                   v-for="(spot, index) in hotspots" 
                   :key="index"
                   :class="activeHotspot === spot.id ? 'bg-bg-elevated scale-105 shadow-lg border border-amber-900/50' : 'opacity-60 hover:opacity-100'"
                   @click="toggleHotspot(spot.id)"
                 >
                   <div class="text-amber-500 font-bold text-xl">0{{ index + 1 }}.</div>
                   <div>
                     <h4 class="text-xl font-bold mb-1" :class="activeHotspot === spot.id ? 'text-amber-600 dark:text-amber-400' : 'text-amber-600 dark:text-amber-100'">{{ spot.title }}</h4>
                     <p class="text-text-secondary text-sm">{{ spot.desc }}</p>
                   </div>
                 </div>
               </div>

               <!-- Chart Area -->
               <div class="h-64 w-full bg-bg-surface/50 rounded border border-border-default p-4 relative">
                 <div class="absolute top-2 left-4 text-xs text-text-muted">1400年抗灾史</div>
                 <BaseChart :options="chartOption" height="100%" />
               </div>

               <!-- Bottom Data -->
               <div class="flex justify-between border-t border-border-default pt-4 text-xs md:text-sm text-text-muted font-mono">
                 <span>跨径 37.02 米</span>
                 <span>10 次水灾 / 8 次战乱</span>
                 <span class="text-amber-600">1966年 7.2 级地震无恙</span>
               </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Optional: Animation delay utility if not in Tailwind config */
.animation-delay-500 {
  animation-delay: 500ms;
}
</style>
