<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BaseChart from './BaseChart.vue' // Explicit import for clarity

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const containerRef = ref(null)
let scrollTriggerInstance = null

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// Chart Options for Hemudu Mortise Types
const chartOptions = computed(() => ({
  backgroundColor: 'transparent',
  title: {
    text: '河姆渡出土榫卯类型占比',
    left: 'center',
    top: 0,
    textStyle: {
      color: isDark.value ? '#d6d3d1' : '#44403c', // text-text-secondary
      fontSize: 16,
      fontFamily: 'serif'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: isDark.value ? 'rgba(28, 25, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)', // bg-bg-surface
    borderColor: isDark.value ? '#44403c' : '#d6d3d1', // border-border-subtle
    textStyle: {
      color: isDark.value ? '#e7e5e4' : '#1c1917' // text-text-primary
    }
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      color: isDark.value ? '#a8a29e' : '#78716c' // text-text-secondary
    },
    top: 'middle'
  },
  series: [
    {
      name: '榫卯类型',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 5,
        borderColor: isDark.value ? '#1c1917' : '#ffffff', // bg-bg-surface
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#f59e0b' // text-amber-500
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: isDark.value ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 350, name: '圆榫', itemStyle: { color: '#78350f' } }, // amber-900
        { value: 280, name: '方榫', itemStyle: { color: '#92400e' } }, // amber-800
        { value: 150, name: '燕尾榫', itemStyle: { color: '#b45309' } }, // amber-700
        { value: 120, name: '企口榫', itemStyle: { color: '#d97706' } }, // amber-600
        { value: 80, name: '穿带榫', itemStyle: { color: '#f59e0b' } }, // amber-500
        { value: 60, name: '透榫', itemStyle: { color: '#fbbf24' } }   // amber-400
      ]
    }
  ]
}))

onMounted(() => {
  const container = containerRef.value
  const section = sectionRef.value

  // Horizontal scroll animation
  scrollTriggerInstance = gsap.to(container, {
    xPercent: -100 * (2/3), // Move 2 screens out of 3 (total width is 300%)
    ease: "none",
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 1,
      // Increase the scroll distance to make the horizontal scroll feel natural
      // 3000px of vertical scroll translates to the horizontal movement
      end: "+=3000", 
      snap: 1 / 2, // Snap to the 3 sections (0, 0.5, 1)
    }
  })
})

onUnmounted(() => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.scrollTrigger?.kill()
    scrollTriggerInstance.kill()
  }
  // Ideally we should kill all ScrollTriggers created in this component context
  // ScrollTrigger.getAll().forEach(t => t.kill()) // Be careful if other components use it
})
</script>

<template>
  <section ref="sectionRef" class="relative h-screen w-full overflow-hidden bg-bg-surface text-text-primary">
    <!-- Horizontal Container (300vw) -->
    <div ref="containerRef" class="flex h-full w-[300vw]">
      
      <!-- 1-1: Golden Quote Screen -->
      <div class="w-screen h-full flex flex-col items-center justify-center relative px-8 bg-gradient-to-b from-bg-elevated to-bg-surface">
        <!-- Background: Misty Primitive Forest/Swamp atmosphere -->
        <div class="absolute inset-0 z-0 opacity-20 dark:opacity-100 bg-[url('https://images.unsplash.com/photo-1440557653082-e8e186733eeb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay pointer-events-none"></div>
        
        <div class="relative z-10 max-w-4xl text-center space-y-8">
          <p class="text-3xl md:text-5xl font-serif leading-relaxed tracking-wide text-text-primary opacity-90 drop-shadow-lg">
            “当第一根带榫头的木柱插入地基，<br/>
            中国人对‘连接’的理解便已定型”<br/>
            <span class="block mt-6 text-2xl md:text-4xl text-text-primary opacity-80">
              ——不是征服，而是契合；<br/>
              &emsp;&emsp;不是焊接，而是对话。
            </span>
          </p>
        </div>
      </div>

      <!-- 1-2: Scene Screen -->
      <div class="w-screen h-full flex items-center relative bg-bg-surface border-l border-border-default">
        <div class="container mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
          <!-- Left: Image Placeholder -->
          <div class="relative h-[60vh] w-full bg-bg-elevated rounded-lg overflow-hidden shadow-2xl border border-border-subtle group">
             <!-- Placeholder for Hemudu Architecture -->
             <div class="absolute inset-0 bg-border-subtle flex items-center justify-center text-text-muted">
                <img src="../assets/images/hemudu-architecture.jpg" alt="河姆渡干栏式建筑复原大图" class="w-full h-full object-cover">
             </div>
             <div class="absolute bottom-4 left-4 bg-bg-surface/80 px-3 py-1 text-xs text-text-primary backdrop-blur-sm rounded border border-border-subtle shadow">
               干栏式建筑复原示意
             </div>
          </div>
          
          <!-- Right: Text Block -->
          <div class="space-y-8">
            <h2 class="text-4xl md:text-6xl font-serif font-bold text-text-primary tracking-wider">
              第一幕：源起<br/>
              <span class="text-2xl md:text-4xl font-light opacity-70">河姆渡的曙光</span>
            </h2>
            
            <div class="border-l-2 border-amber-700/50 pl-6 space-y-2">
              <p class="text-amber-500 font-mono text-sm tracking-widest uppercase">
                Coordinates
              </p>
              <p class="text-lg text-text-secondary">
                约公元前5000年 · 长江流域 · 河姆渡遗址
              </p>
            </div>
            
            <p class="text-xl leading-loose text-text-secondary font-light">
              7000年前的江南，沼泽密布，湿热多雨。<br/>
              先民们不愿屈从于泥泞，他们仰望森林，<br/>
              决定让房屋<span class="text-amber-200 font-medium">“生长”在空中</span>。
            </p>
          </div>
        </div>
      </div>

      <!-- 1-3: Technical Analysis Screen -->
      <div class="w-screen h-full flex items-center justify-center relative bg-bg-surface border-l border-border-default p-4 md:p-8">
        
        <!-- Dashboard Content (Clean Layout) -->
        <div class="w-full h-full max-h-[85vh] flex flex-col relative z-10 pt-16 pb-8">
          
          <!-- Header Section -->
          <div class="flex flex-col md:flex-row items-center justify-between pb-8 mb-6 shrink-0 border-b border-border-default/30">
             <div>
                <h2 class="text-4xl font-serif font-bold text-text-primary tracking-wider mb-2">
                  <span class="text-amber-600 mr-2">/</span>技术解析
                </h2>
                <p class="text-text-muted font-light tracking-widest text-sm pl-8 uppercase">
                  The Wisdom of Mortise and Tenon
                </p>
             </div>
             <!-- Decorative Line (Replaces Mode Indicator) -->
             <!-- <div class="hidden md:block h-[1px] w-32 bg-gradient-to-l from-transparent to-stone-700"></div> -->
          </div>

          <!-- Main Content Grid (3 Columns) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 min-h-0">
            
            <!-- Left Column: Tech Points (30%) -->
            <div class="lg:col-span-4 flex flex-col justify-center space-y-4 overflow-y-auto pr-2">
               <div class="group/item flex gap-4 p-5 rounded-xl bg-bg-elevated/20 hover:bg-bg-elevated/60 border border-border-default hover:border-amber-700/30 transition-all duration-300">
                  <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-bg-elevated flex items-center justify-center text-amber-600 font-mono text-xl font-bold border border-border-subtle group-hover/item:text-amber-500 transition-colors shadow-lg">
                    01
                  </div>
                  <div>
                    <h4 class="text-xl font-bold text-text-primary mb-2 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-100 transition-colors">圆榫与卯眼</h4>
                    <p class="text-text-secondary text-sm leading-relaxed">
                      考古发现的木构件上，榫头直径约5-7厘米，卯眼精准对应，<span class="text-text-secondary font-medium">误差不超过2毫米</span>。
                    </p>
                  </div>
               </div>

               <div class="group/item flex gap-4 p-5 rounded-xl bg-bg-elevated/20 hover:bg-bg-elevated/60 border border-border-default hover:border-amber-700/30 transition-all duration-300">
                  <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-bg-elevated flex items-center justify-center text-amber-600 font-mono text-xl font-bold border border-border-subtle group-hover/item:text-amber-500 transition-colors shadow-lg">
                    02
                  </div>
                  <div>
                    <h4 class="text-xl font-bold text-text-primary mb-2 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-100 transition-colors">燕尾榫雏形</h4>
                    <p class="text-text-secondary text-sm leading-relaxed">
                      部分构件呈现早期嵌合形态，有效防止构件<span class="text-text-secondary font-medium">水平位移</span>，展现了对受力的深刻理解。
                    </p>
                  </div>
               </div>

               <div class="group/item flex gap-4 p-5 rounded-xl bg-bg-elevated/20 hover:bg-bg-elevated/60 border border-border-default hover:border-amber-700/30 transition-all duration-300">
                  <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-bg-elevated flex items-center justify-center text-amber-600 font-mono text-xl font-bold border border-border-subtle group-hover/item:text-amber-500 transition-colors shadow-lg">
                    03
                  </div>
                  <div>
                    <h4 class="text-xl font-bold text-text-primary mb-2 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-100 transition-colors">无钉结构</h4>
                    <p class="text-text-secondary text-sm leading-relaxed">
                      完全依靠木材自身咬合，已具备后世卯榫的<span class="text-text-secondary font-medium">基本逻辑</span>，开启了中国木构建筑的先河。
                    </p>
                  </div>
               </div>
            </div>

            <!-- Center Column: Hero Image (40%) -->
            <div class="lg:col-span-5 relative flex flex-col items-center justify-center bg-bg-surface/30 rounded-2xl border border-border-default p-4 group/image overflow-hidden">
               <!-- Background Grid -->
               <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
               
               <div class="relative w-full h-full flex items-center justify-center p-6 transition-transform duration-700 group-hover/image:scale-105">
                  <img src="../assets/images/hemudu-sunmao.png" alt="原始榫卯构件白描" class="w-full h-full object-contain drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity">
               </div>
               
               <div class="absolute bottom-4 right-4 bg-bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded text-xs text-text-primary border border-border-subtle font-mono shadow">
                 河姆渡出土原始榫卯构件白描
               </div>
            </div>

            <!-- Right Column: Chart (30%) -->
            <div class="lg:col-span-3 flex flex-col gap-4">
               <div class="flex-1 bg-bg-surface/50 rounded-2xl border border-border-default p-4 flex flex-col relative shadow-inner min-h-[250px]">
                 <div class="absolute top-4 left-4 text-xs text-amber-500/80 font-mono uppercase tracking-wider">Type Distribution</div>
                 <div class="flex-1 flex items-center justify-center w-full">
                    <BaseChart :options="chartOptions" height="100%" width="100%" />
                 </div>
               </div>
               
               <!-- Data Stats Mini-Cards (Enhanced) -->
               <div class="grid grid-cols-1 gap-3 shrink-0">
                 <div class="bg-bg-elevated/40 p-4 rounded-xl border border-border-subtle/50 flex flex-col justify-center group hover:bg-bg-elevated/60 transition-colors">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-text-muted text-xs font-mono">出土规模 / Artifacts</span>
                      <span class="w-1.5 h-1.5 bg-amber-700 rounded-full"></span>
                    </div>
                    <div class="flex items-end gap-2">
                       <span class="text-text-primary font-bold font-serif text-2xl">数千件</span>
                       <span class="text-text-muted text-xs mb-1">木构件</span>
                    </div>
                 </div>
                 
                 <div class="bg-bg-elevated/40 p-4 rounded-xl border border-border-subtle/50 flex flex-col justify-center group hover:bg-bg-elevated/60 transition-colors">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-text-muted text-xs font-mono">榫卯类型 / Types</span>
                      <span class="w-1.5 h-1.5 bg-amber-700 rounded-full"></span>
                    </div>
                    <div class="flex items-end gap-2">
                       <span class="text-text-primary font-bold font-serif text-2xl">6种</span>
                       <span class="text-text-muted text-xs mb-1">主要形制</span>
                    </div>
                 </div>

                 <div class="bg-bg-elevated/40 p-4 rounded-xl border border-border-subtle/50 flex flex-col justify-center group hover:bg-bg-elevated/60 transition-colors">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-text-muted text-xs font-mono">防潮高度 / Elevation</span>
                      <span class="w-1.5 h-1.5 bg-amber-700 rounded-full"></span>
                    </div>
                    <div class="flex items-end gap-2">
                       <span class="text-text-primary font-bold font-serif text-2xl">1.5-2m</span>
                       <span class="text-text-muted text-xs mb-1">离地间距</span>
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
/* Optional: Hide scrollbar for the container if needed, though overflow-hidden on parent handles it */
</style>
