<script setup>
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, GLTFModel } from '@tresjs/cientos'
import { BasicShadowMap, SRGBColorSpace, NoToneMapping } from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref } from 'vue'
import BaseChart from './BaseChart.vue'

gsap.registerPlugin(ScrollTrigger)

// TresJS configuration
const gl = {
  clearColor: '#000000',
  shadows: true,
  alpha: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
}

// 3D Model Path
const dougongModel = '/dougong.glb'

// References for animation
const sectionRef = ref(null)
const containerRef = ref(null)
const meshRef = ref(null)
const cameraRef = ref(null)
const controlsRef = ref(null)
let scrollTriggerInstance = null

// Radar Chart Option
const radarOption = {
  backgroundColor: 'transparent',
  radar: {
    indicator: [
      { name: '抗震性', max: 100 },
      { name: '柔韧性', max: 100 },
      { name: '规模化', max: 100 },
      { name: '承重力', max: 100 },
      { name: '耐久度', max: 100 }
    ],
    shape: 'circle',
    splitNumber: 5,
    radius: '75%',
    center: ['50%', '50%'],
    axisName: {
      color: '#fbbf24', // amber-400
      fontSize: 14,
      fontWeight: 'bold'
    },
    splitLine: {
      lineStyle: {
        color: [
          'rgba(245, 158, 11, 0.1)',
          'rgba(245, 158, 11, 0.2)',
          'rgba(245, 158, 11, 0.3)',
          'rgba(245, 158, 11, 0.4)',
          'rgba(245, 158, 11, 0.5)'
        ].reverse()
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
         color: ['rgba(245, 158, 11, 0.05)', 'transparent']
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(245, 158, 11, 0.3)'
      }
    }
  },
  series: [
    {
      name: '榫卯结构性能',
      type: 'radar',
      lineStyle: {
        width: 3,
        color: '#f59e0b', // amber-500
        type: 'solid',
        shadowBlur: 10,
        shadowColor: '#f59e0b'
      },
      data: [
        {
          value: [95, 90, 85, 92, 88],
          name: '榫卯结构',
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#fbbf24'
          },
          areaStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [{
                  offset: 0, color: 'rgba(245, 158, 11, 0.8)' // 0% 处的颜色
              }, {
                  offset: 1, color: 'rgba(245, 158, 11, 0.2)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ]
    }
  ]
}

// Reset camera function
const resetCamera = () => {
  if (cameraRef.value) {
    cameraRef.value.position.set(5, 3, 5)
    cameraRef.value.lookAt(0, 0, 0)
  }
  
  const controls = controlsRef.value?.value || controlsRef.value?.controls
  if (controls) {
    controls.target.set(0, 0, 0)
    controls.update()
  }
}

// Animation logic
onMounted(() => {
  const container = containerRef.value
  const section = sectionRef.value

  // Horizontal scroll animation
  scrollTriggerInstance = gsap.to(container, {
    xPercent: -100 * (3/4), // Move 3 screens out of 4 (total width is 400vw)
    ease: "none",
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 1,
      end: "+=4000", // Scroll distance
      snap: 1 / 3, // Snap to 4 sections (0, 0.33, 0.66, 1)
    }
  })

  // Rotate the 3D model continuously
  if (meshRef.value) {
    gsap.to(meshRef.value.rotation, {
      y: Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: "none"
    })
  }
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
    <!-- Horizontal Container (400vw) -->
    <div ref="containerRef" class="flex h-full w-[400vw]">
      
      <!-- 2-1: 金句屏 (100vw) -->
      <div class="w-screen h-full flex items-center justify-center relative border-r border-stone-800">
        <div class="max-w-4xl px-8 text-center space-y-8">
          <p class="text-3xl md:text-5xl font-serif leading-relaxed text-amber-50">
            “在唐长安的大明宫，<br>
            一根檐柱可能要承受三十种不同的力。”<br>
            <span class="block mt-8 text-2xl md:text-4xl opacity-80 text-stone-400">
              匠人们用榫卯编织出一张隐形的网，<br>
              让重力在木头的咬合中温柔地流转。
            </span>
          </p>
        </div>
      </div>

      <!-- 2-2: 场景屏 (100vw) -->
      <div class="w-screen h-full flex items-center relative border-r border-stone-800 bg-stone-900">
        <!-- Background Image Placeholder -->
        <div class="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay pointer-events-none"></div>
        
        <div class="container mx-auto px-8 relative z-10 grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          <div class="space-y-6 md:col-span-2">
            <h2 class="text-6xl font-serif text-amber-500">第二幕：进化</h2>
            <div class="text-xl font-mono text-stone-400 border-l-2 border-amber-600 pl-4">
              公元7-13世纪 · 长安 · 汴京 · 临安
            </div>
            <p class="text-xl text-stone-300 leading-loose">
              大唐的恢弘与宋代的雅致，在木构的层叠中达到巅峰。<br>
              这不是简单的放大，而是力学与美学的精密计算。
            </p>
          </div>
          
          <!-- Image Placeholder -->
          <div class="relative h-[60vh] w-full bg-stone-800 rounded-lg overflow-hidden border border-stone-700 shadow-2xl flex items-center justify-center group md:col-span-3">
              <!-- [居中全宽大图：大明宫/宋代汴京繁华示意] -->
              <img src="../assets/images/song-daminggong.jpeg" alt="" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
          </div>
        </div>
      </div>

      <!-- 2-3: 3D 互动屏 (100vw) -->
      <div class="w-screen h-full relative border-r border-stone-800 bg-black flex flex-col md:flex-row">
        <!-- Left: Text Info -->
        <div class="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-center space-y-8 z-10 bg-stone-900/80 backdrop-blur-sm">
          <div>
            <h3 class="text-2xl font-bold text-amber-500 mb-2">铺作层体系</h3>
            <p class="text-stone-400">斗与拱层层出跳，将屋檐推出4-8米。</p>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-amber-500 mb-2">材分制标准化</h3>
            <p class="text-stone-400">宋《营造法式》规范化模数，实现标准化生产。</p>
          </div>
        </div>

        <!-- Right: 3D Canvas -->
        <div class="w-full md:w-2/3 h-[50vh] md:h-full relative">
          <TresCanvas v-bind="gl">
            <TresPerspectiveCamera ref="cameraRef" :position="[5, 3, 5]" :look-at="[0, 0, 0]" />
            <OrbitControls ref="controlsRef" enable-damping :auto-rotate="false" />
            
            <TresAmbientLight :intensity="3.0" />
            <TresDirectionalLight :position="[5, 5, 5]" :intensity="5.0" cast-shadow />
            <TresDirectionalLight :position="[-5, 5, -5]" :intensity="3.0" color="#fbbf24" />
            <TresDirectionalLight :position="[0, 2, 5]" :intensity="4.0" color="#ffffff" />
            
            <!-- Dougong Placeholder -->
            <TresGroup ref="meshRef" :scale="0.03" :position="[0, -2, 0]">
              <Suspense>
                <GLTFModel :path="dougongModel" />
              </Suspense>
            </TresGroup>
            
            <TresGridHelper :args="[20, 20]" :position="[0, -2, 0]" :visible="false" />
          </TresCanvas>
          
          <!-- Interactive Instruction Overlay -->
          <div class="absolute bottom-8 right-8 pointer-events-none select-none text-right">
             <div class="bg-black/60 backdrop-blur-sm p-4 rounded border border-stone-700/50">
                <p class="text-xs text-stone-500 uppercase tracking-widest mb-1">Interactive</p>
                <p class="text-amber-500 font-bold">拖动模型查看斗拱结构</p>
             </div>
          </div>
          
          <!-- Reset Button -->
          <div class="absolute bottom-8 left-8 z-20">
            <button @click="resetCamera" class="bg-stone-800/80 hover:bg-amber-600 text-amber-500 hover:text-white px-6 py-2 rounded transition-colors shadow-lg border border-stone-700/50 font-bold tracking-wider" title="重置视角">
              还原
            </button>
          </div>
        </div>
      </div>

      <!-- 2-4: 技术细节屏 (100vw) -->
      <div class="w-screen h-full flex items-center relative bg-stone-900">
        <div class="container mx-auto px-4 md:px-0 h-full flex flex-col justify-center py-12">
          
          <!-- Content Wrapper -->
          <div class="w-full max-w-7xl mx-auto h-full flex flex-col justify-center pt-20">
            <div class="text-center mb-8">
              <h3 class="text-3xl font-serif text-stone-200">唐宋精密构件解析</h3>
            </div>

            <!-- Component Diagrams -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div class="text-center space-y-4">
                <div class="h-[25vh] bg-stone-800 rounded border border-stone-700 flex items-center justify-center text-stone-600 overflow-hidden relative group">
                  <img src="../assets/images/mantousun.png" alt="馒头榫" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                </div>
                <h4 class="text-amber-500 font-bold">馒头榫</h4>
                <p class="text-sm text-stone-400">柱头承重，垂直连接</p>
              </div>
              <div class="text-center space-y-4">
                 <div class="h-[25vh] bg-stone-800 rounded border border-stone-700 flex items-center justify-center text-stone-600 overflow-hidden relative group">
                   <img src="../assets/images/gutousun.png" alt="箍头榫" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                </div>
                <h4 class="text-amber-500 font-bold">箍头榫</h4>
                <p class="text-sm text-stone-400">梁柱拉结，稳固框架</p>
              </div>
              <div class="text-center space-y-4">
                 <div class="h-[25vh] bg-stone-800 rounded border border-stone-700 flex items-center justify-center text-stone-600 overflow-hidden relative group">
                   <img src="../assets/images/tousun.png" alt="透榫" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                </div>
                <h4 class="text-amber-500 font-bold">透榫</h4>
                <p class="text-sm text-stone-400">贯通锁定，灵活受力</p>
              </div>
            </div>

            <div class="border-t border-stone-800 my-8"></div>

            <!-- Bottom: Analysis & Data -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <!-- Left: Radar Chart -->
              <div class="aspect-square flex items-center justify-center relative max-w-sm mx-auto w-full p-4">
                <client-only>
                  <BaseChart :options="radarOption" class="w-full h-full" />
                </client-only>
              </div>

              <!-- Right: Text Analysis -->
              <div class="space-y-8">
                <div>
                  <h4 class="text-xl font-bold text-amber-100 mb-3">● 模数化设计</h4>
                  <p class="text-stone-400 leading-relaxed text-lg">
                    以“材”为基本模数，实现皇宫组件标准化生产。
                  </p>
                </div>
                <div>
                  <h4 class="text-xl font-bold text-amber-100 mb-3">● 节点逻辑</h4>
                  <p class="text-stone-400 leading-relaxed text-lg">
                    三维咬合，将重力转化为内部摩擦力与剪切力，实现“墙倒屋不塌”。
                  </p>
                </div>
                
                <!-- Data Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div class="bg-stone-800 p-6 rounded border-l-4 border-amber-700">
                    <div class="text-sm text-stone-500 mb-1">大明宫含元殿 (663年)</div>
                    <div class="text-amber-500 font-bold text-lg">唐代木构之巅</div>
                  </div>
                  <div class="bg-stone-800 p-6 rounded border-l-4 border-amber-700">
                     <div class="text-sm text-stone-500 mb-1">《营造法式》材分八等</div>
                    <div class="text-amber-500 font-bold text-lg">最早标准化体系</div>
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
/* Optional: Hide scrollbar for the container if needed */
</style>
