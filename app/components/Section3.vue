<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BaseChart from './BaseChart.vue'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const containerRef = ref(null)
let scrollTriggerInstance = null

// Chart Options
const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
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
    data: ['徽派', '闽南', '晋商', '川西'],
    axisLine: { lineStyle: { color: '#78350f' } },
    axisTick: { show: false },
    axisLabel: { color: '#a8a29e', fontSize: 14, fontFamily: 'serif' }
  },
  yAxis: {
    type: 'value',
    name: '节点密度 (个/m²)',
    nameTextStyle: { color: '#a8a29e', align: 'right' },
    splitLine: { show: false }, // Remove grid lines
    axisLine: { show: true, lineStyle: { color: '#78350f' } },
    axisLabel: { color: '#78716c' }
  },
  series: [
    {
      name: '节点密度',
      type: 'bar',
      barWidth: '30%',
      itemStyle: {
        color: new Function("params", "const colors = ['#d97706', '#b45309', '#92400e', '#78350f']; return colors[params.dataIndex]")
      },
      data: [120, 180, 200, 150] // Mock data
    },
    {
      name: '抗震评分',
      type: 'line',
      yAxisIndex: 0,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: '#fbbf24' },
      lineStyle: { type: 'dashed' },
      data: [85, 92, 88, 75]
    }
  ]
}))

onMounted(() => {
  const container = containerRef.value
  const section = sectionRef.value

  // Horizontal scroll animation (3 screens)
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
  <section ref="sectionRef" class="relative h-screen w-full overflow-hidden bg-stone-900 text-stone-200">
    <!-- Horizontal Container (300vw) -->
    <div ref="containerRef" class="flex h-full w-[300vw]">
      
      <!-- 3-1: Golden Quote Screen -->
      <div class="w-screen h-full flex items-center justify-center relative border-r border-stone-800 bg-stone-900">
        <div class="max-w-4xl px-8 text-center space-y-12">
          <p class="text-3xl md:text-5xl font-serif leading-relaxed text-amber-50">
            “在徽州宏村的月沼边，<br>
            一位木匠不需要图纸。<br>
            <span class="block mt-8 text-2xl md:text-4xl opacity-80 text-stone-400">
              他手中的斧凿与千年的榫卯基因对话，<br>
              每一刀都落在‘理’上。<br>
              ——这是口传心授的密码，也是活态的传承。”
            </span>
          </p>
        </div>
      </div>

      <!-- 3-2: Architecture Comparison Screen -->
      <div class="w-screen h-full flex flex-col relative border-r border-stone-800 bg-stone-800">
        <div class="container mx-auto px-8 h-full flex flex-col justify-center py-12">
           <h2 class="text-4xl font-serif text-amber-500 text-center mb-16">定型 · 民间智慧</h2>
           
           <div class="flex flex-col md:flex-row gap-8 items-stretch justify-center h-[60vh]">
             <!-- North -->
             <div class="flex-1 bg-stone-900 rounded-lg overflow-hidden border border-stone-700 relative group hover:border-amber-700 transition-colors">
               <div class="absolute inset-0 bg-stone-800 flex items-center justify-center text-stone-600">
                 [抬梁式结构示意图]
               </div>
               <div class="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                 <h3 class="text-2xl font-bold text-amber-100 mb-2">北方 · 抬梁式</h3>
                 <p class="text-sm text-stone-400">柱上搁梁，梁上搁檩。空间开阔，气势恢宏。</p>
               </div>
             </div>

             <!-- Center Text -->
             <div class="w-full md:w-1/5 flex items-center justify-center text-center">
                <div class="space-y-4">
                  <div class="w-px h-24 bg-gradient-to-b from-transparent via-amber-600 to-transparent mx-auto"></div>
                  <p class="text-lg text-stone-300 font-serif leading-loose">
                    技术的民主化<br>
                    与<br>
                    文化的在地化
                  </p>
                  <div class="w-px h-24 bg-gradient-to-b from-transparent via-amber-600 to-transparent mx-auto"></div>
                </div>
             </div>

             <!-- South -->
             <div class="flex-1 bg-stone-900 rounded-lg overflow-hidden border border-stone-700 relative group hover:border-amber-700 transition-colors">
               <div class="absolute inset-0 bg-stone-800 flex items-center justify-center text-stone-600">
                 [穿斗式结构示意图]
               </div>
               <div class="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                 <h3 class="text-2xl font-bold text-amber-100 mb-2">南方 · 穿斗式</h3>
                 <p class="text-sm text-stone-400">柱子直接承檩，以穿枋串联。省工省料，抗风抗震。</p>
               </div>
             </div>
           </div>
        </div>
      </div>

      <!-- 3-3: Regional Map Chart Screen -->
      <div class="w-screen h-full flex items-center relative bg-stone-900">
        <div class="container mx-auto px-8 h-full flex flex-col justify-center py-12">
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full">
            <!-- Left: Chart -->
            <div class="w-full h-[50vh] lg:h-[60vh] bg-stone-900/50 rounded-xl border border-stone-800 p-6 shadow-2xl relative">
              <h3 class="absolute top-6 left-6 text-xl font-bold text-amber-500 z-10">地域图谱 · 节点密度分析</h3>
              <BaseChart :options="chartOption" height="100%" />
            </div>

            <!-- Right: Description & Gallery Grid -->
            <div class="space-y-12">
               <div class="grid grid-cols-2 gap-4">
                 <div class="aspect-video bg-stone-800 rounded border border-stone-700 flex items-center justify-center text-stone-500 text-xs">
                   [徽派：冬瓜梁]
                 </div>
                 <div class="aspect-video bg-stone-800 rounded border border-stone-700 flex items-center justify-center text-stone-500 text-xs">
                   [闽南：防风榫]
                 </div>
                 <div class="aspect-video bg-stone-800 rounded border border-stone-700 flex items-center justify-center text-stone-500 text-xs">
                   [晋商：防盗榫]
                 </div>
                 <div class="aspect-video bg-stone-800 rounded border border-stone-700 flex items-center justify-center text-stone-500 text-xs">
                   [川西：穿斗架]
                 </div>
               </div>

               <div class="space-y-4">
                 <p class="text-lg text-stone-300 leading-relaxed">
                   卯榫从宫廷秘技走入民间，在黄土高原、江南水乡、闽南山区演化出千般面孔。
                 </p>
                 <div class="grid grid-cols-3 gap-4 border-t border-stone-800 pt-6">
                   <div>
                     <div class="text-xs text-stone-500 mb-1">紫禁城</div>
                     <div class="text-amber-500 font-bold">1420年建成</div>
                   </div>
                   <div>
                     <div class="text-xs text-stone-500 mb-1">节点总量</div>
                     <div class="text-amber-500 font-bold">10万+</div>
                   </div>
                   <div>
                     <div class="text-xs text-stone-500 mb-1">抗震记录</div>
                     <div class="text-amber-500 font-bold">200次无恙</div>
                   </div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Optional scoped styles */
</style>
