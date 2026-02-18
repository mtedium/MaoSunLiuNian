<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const containerRef = ref(null)
let scrollTriggerInstance = null

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
  <section ref="sectionRef" class="relative h-screen w-full overflow-hidden bg-stone-900 text-stone-200">
    <!-- Horizontal Container (300vw) -->
    <div ref="containerRef" class="flex h-full w-[300vw]">
      
      <!-- 1-1: Golden Quote Screen -->
      <div class="w-screen h-full flex flex-col items-center justify-center relative px-8 bg-gradient-to-b from-stone-950 to-stone-900">
        <!-- Background: Misty Primitive Forest/Swamp atmosphere -->
        <div class="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1440557653082-e8e186733eeb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay pointer-events-none"></div>
        
        <div class="relative z-10 max-w-4xl text-center space-y-8">
          <p class="text-3xl md:text-5xl font-serif leading-relaxed tracking-wide text-stone-100 opacity-90">
            “当第一根带榫头的木柱插入地基，<br/>
            中国人对‘连接’的理解便已定型”<br/>
            <span class="block mt-6 text-2xl md:text-4xl opacity-80">
              ——不是征服，而是契合；<br/>
              &emsp;&emsp;不是焊接，而是对话。
            </span>
          </p>
        </div>
      </div>

      <!-- 1-2: Scene Screen -->
      <div class="w-screen h-full flex items-center relative bg-stone-900 border-l border-stone-800">
        <div class="container mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
          <!-- Left: Image Placeholder -->
          <div class="relative h-[60vh] w-full bg-stone-800 rounded-lg overflow-hidden shadow-2xl border border-stone-700 group">
             <!-- Placeholder for Hemudu Architecture -->
             <div class="absolute inset-0 bg-stone-700 flex items-center justify-center text-stone-500">
                [河姆渡干栏式建筑复原大图]
             </div>
             <div class="absolute bottom-4 left-4 bg-black/60 px-3 py-1 text-xs text-stone-300 backdrop-blur-sm rounded">
               干栏式建筑复原示意
             </div>
          </div>
          
          <!-- Right: Text Block -->
          <div class="space-y-8">
            <h2 class="text-4xl md:text-6xl font-serif font-bold text-stone-100 tracking-wider">
              第一幕：源起<br/>
              <span class="text-2xl md:text-4xl font-light opacity-70">河姆渡的曙光</span>
            </h2>
            
            <div class="border-l-2 border-amber-700/50 pl-6 space-y-2">
              <p class="text-amber-500 font-mono text-sm tracking-widest uppercase">
                Coordinates
              </p>
              <p class="text-lg text-stone-300">
                约公元前5000年 · 长江流域 · 河姆渡遗址
              </p>
            </div>
            
            <p class="text-xl leading-loose text-stone-400 font-light">
              7000年前的江南，沼泽密布，湿热多雨。<br/>
              先民们不愿屈从于泥泞，他们仰望森林，<br/>
              决定让房屋<span class="text-amber-200 font-medium">“生长”在空中</span>。
            </p>
          </div>
        </div>
      </div>

      <!-- 1-3: Technical Analysis Screen -->
      <div class="w-screen h-full flex items-center relative bg-stone-900 border-l border-stone-800">
        <div class="container mx-auto px-8 h-full flex flex-col justify-center">
          <!-- Top: Image/Visual -->
          <div class="flex-1 flex items-center justify-center py-8">
             <div class="relative w-full max-w-4xl aspect-video bg-stone-800 rounded-lg border border-stone-700 flex items-center justify-center">
               <span class="text-stone-600 text-lg">[考古出土的原始榫卯构件白描/实拍]</span>
               <!-- In real project, use <img src="..." /> here -->
             </div>
          </div>

          <!-- Middle: Tech Points -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
            <div class="bg-stone-800/50 p-6 rounded-lg border border-stone-700 hover:border-amber-700/50 transition-colors duration-300">
              <h3 class="text-xl font-bold text-amber-100 mb-3">01. 圆榫与卯眼</h3>
              <p class="text-stone-400 text-sm leading-relaxed">
                考古发现的木构件上，榫头直径约5-7厘米，卯眼精准对应，误差不超过2毫米。
              </p>
            </div>
            <div class="bg-stone-800/50 p-6 rounded-lg border border-stone-700 hover:border-amber-700/50 transition-colors duration-300">
              <h3 class="text-xl font-bold text-amber-100 mb-3">02. 燕尾榫雏形</h3>
              <p class="text-stone-400 text-sm leading-relaxed">
                部分构件呈现早期嵌合形态，有效防止构件水平位移。
              </p>
            </div>
            <div class="bg-stone-800/50 p-6 rounded-lg border border-stone-700 hover:border-amber-700/50 transition-colors duration-300">
              <h3 class="text-xl font-bold text-amber-100 mb-3">03. 无钉结构</h3>
              <p class="text-stone-400 text-sm leading-relaxed">
                完全依靠木材自身咬合，已具备后世卯榫的基本逻辑。
              </p>
            </div>
          </div>

          <!-- Bottom: Data Card -->
          <div class="w-full border-t border-stone-800 py-6">
            <div class="flex flex-wrap justify-between items-center text-stone-500 font-mono text-sm md:text-base">
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-amber-700 rounded-full"></span>
                <span>出土构件数千件 / 6种类型</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-amber-700 rounded-full"></span>
                <span>居住面高出地面 1.5-2 米</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-amber-700 rounded-full"></span>
                <span>有效防潮、防虫蛇</span>
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
