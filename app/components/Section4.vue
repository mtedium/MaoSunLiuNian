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
  { id: 1, x: '25%', y: '30%', title: '敞肩拱', desc: '大拱两端各设两个小拱，减轻自重，增加泄洪能力。' },
  { id: 2, x: '50%', y: '60%', title: '独立拱券', desc: '28道拱券独立砌筑，一道受损不影响其他，便于修缮。' },
  { id: 3, x: '70%', y: '40%', title: '腰铁', desc: '拱石间以“腰铁”横向连接，嵌入卯眼浇以生铁水，实现“以柔克刚”。' }
]

const toggleHotspot = (id) => {
  if (activeHotspot.value === id) {
    activeHotspot.value = null
  } else {
    activeHotspot.value = id
  }
}

// Chart Options for Zhaozhou Bridge History
const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(28, 25, 23, 0.9)',
    borderColor: '#78350f',
    textStyle: { color: '#e7e5e4' }
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
    axisLine: { lineStyle: { color: '#78350f' } },
    axisTick: { show: false },
    axisLabel: { color: '#a8a29e', fontSize: 14, fontFamily: 'serif' }
  },
  yAxis: {
    type: 'value',
    name: '灾害强度等级',
    nameTextStyle: { color: '#a8a29e', align: 'right' },
    splitLine: { show: false },
    axisLine: { show: true, lineStyle: { color: '#78350f' } },
    axisLabel: { color: '#78716c' }
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
  <section ref="sectionRef" class="relative h-screen w-screen overflow-hidden bg-stone-900 text-stone-200">
    <!-- Horizontal Container (300vw) -->
    <div ref="containerRef" class="flex h-full w-[300vw]">
      
      <!-- 4-1: Golden Quote Screen -->
      <div class="w-screen h-full flex items-center justify-center relative border-r border-stone-800 bg-stone-900">
        <div class="max-w-4xl px-8 text-center space-y-12">
          <p class="text-3xl md:text-5xl font-serif leading-relaxed text-amber-50">
            “当赵州桥的第一块拱石落下，<br>
            木头教会了石头如何呼吸。<br>
            <span class="block mt-8 text-2xl md:text-4xl opacity-80 text-stone-400">
              腰铁是石头的榫头，卯眼是拱石的承诺。<br>
              ——1400年来，它们共同承受着洨河的冲击，<br>
              从未背弃彼此。”
            </span>
          </p>
        </div>
      </div>

      <!-- 4-2: Scene Screen (Parallax Background) -->
      <div class="w-screen h-full flex items-center relative border-r border-stone-800 overflow-hidden">
        <!-- Background Image -->
        <div class="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548625361-9877077510d5?q=80&w=2070&auto=format&fit=crop" 
            alt="赵州桥全景" 
            class="w-full h-full object-cover opacity-60"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent"></div>
        </div>

        <div class="container mx-auto px-8 relative z-10 h-full flex flex-col justify-between py-24">
          <!-- Top Left Coordinates -->
          <div class="text-amber-500 font-mono text-lg uppercase tracking-widest border-l-4 border-amber-600 pl-4">
            公元605-616年 · 隋代 · 河北赵县
          </div>

          <!-- Bottom Right Text -->
          <div class="self-end max-w-2xl text-right space-y-6">
            <h2 class="text-5xl font-bold text-stone-100">跨界 · 赵州桥的弧光</h2>
            <p class="text-2xl text-stone-300 font-serif leading-loose">
              李春在洨河上建造的，不仅是一座桥，<br>
              更是一个关于<span class="text-amber-400">“连接”</span>的哲学宣言。
            </p>
          </div>
        </div>
      </div>

      <!-- 4-3: Technical Analysis Screen -->
      <div class="w-screen h-full flex items-center relative bg-stone-900" @click="activeHotspot = null">
        <div class="container mx-auto px-8 h-full flex flex-col justify-center py-12">
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full">
            <!-- Left: Structural Diagram with Hotspots -->
            <div class="relative w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center bg-stone-800 rounded-full border border-stone-700 shadow-2xl p-8 group" @click.stop>
              <div class="text-center space-y-2 pointer-events-none">
                <span class="text-stone-500 text-lg block">[中央主图：赵州桥结构拆解]</span>
                <span class="text-amber-600 text-sm block">点击红点查看详情</span>
              </div>
              
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
                
                <!-- Tooltip -->
                <div 
                  v-if="activeHotspot === spot.id"
                  class="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 bg-stone-900/90 backdrop-blur border border-red-500/50 p-4 rounded shadow-xl z-20"
                >
                  <h4 class="text-red-400 font-bold mb-1">{{ spot.title }}</h4>
                  <p class="text-xs text-stone-300 leading-relaxed">{{ spot.desc }}</p>
                  <!-- Arrow -->
                  <div class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-stone-900/90"></div>
                </div>
              </div>
            </div>

            <!-- Right: Analysis Points & Chart -->
            <div class="space-y-12">
               <!-- Analysis List (Static) -->
               <div class="space-y-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
                 <div class="flex items-start space-x-4" v-for="(spot, index) in hotspots" :key="index">
                   <div class="text-amber-500 font-bold text-xl">0{{ index + 1 }}.</div>
                   <div>
                     <h4 class="text-xl font-bold text-amber-100 mb-1">{{ spot.title }}</h4>
                     <p class="text-stone-400">{{ spot.desc }}</p>
                   </div>
                 </div>
               </div>

               <!-- Chart Area -->
               <div class="h-64 w-full bg-stone-900/50 rounded border border-stone-800 p-4 relative">
                 <div class="absolute top-2 left-4 text-xs text-stone-500">1400年抗灾史</div>
                 <BaseChart :options="chartOption" height="100%" />
               </div>

               <!-- Bottom Data -->
               <div class="flex justify-between border-t border-stone-800 pt-4 text-xs md:text-sm text-stone-500 font-mono">
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
