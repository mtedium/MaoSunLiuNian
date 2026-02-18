<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const containerRef = ref(null)
let scrollTriggerInstance = null

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  const container = containerRef.value
  const section = sectionRef.value

  // Horizontal scroll animation (3 screens)
  scrollTriggerInstance = gsap.to(container, {
    xPercent: -100 * (2/3), // Move 2 screens out of 3 (total width is 300%)
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
      
      <!-- 5-1: Golden Quote Screen -->
      <div class="w-screen h-full flex items-center justify-center relative border-r border-stone-800 bg-stone-900">
        <div class="max-w-4xl px-8 text-center space-y-12">
          <p class="text-3xl md:text-5xl font-serif leading-relaxed text-amber-50">
            “今天的建筑师在屏幕上拖动滑块，<br>
            生成的曲线与7000年前的榫头，<br>
            共享着同一个数学本质。”<br>
            <span class="block mt-8 text-2xl md:text-4xl opacity-80 text-stone-400">
              ——卯榫从未过时。
            </span>
          </p>
        </div>
      </div>

      <!-- 5-2: Lineage Screen (Horizontal Timeline) -->
      <div class="w-screen h-full flex flex-col justify-center relative border-r border-stone-800 bg-stone-800">
        <div class="container mx-auto px-8">
          <h2 class="text-4xl font-serif text-amber-500 text-center mb-24">传承谱系</h2>
          
          <div class="relative flex justify-between items-center max-w-5xl mx-auto">
            <!-- Timeline Line -->
            <div class="absolute top-1/2 left-0 w-full h-px bg-stone-600"></div>
            
            <!-- Nodes -->
            <!-- 1. Liang Sicheng -->
            <div class="relative z-10 flex flex-col items-center group">
              <div class="w-4 h-4 bg-stone-900 border-2 border-amber-500 rounded-full mb-8 group-hover:scale-125 transition-transform"></div>
              <div class="bg-stone-900 border border-stone-700 p-6 rounded text-center w-64 hover:border-amber-600 transition-colors">
                <div class="text-3xl mb-2">📐</div>
                <h3 class="text-lg font-bold text-amber-100">梁思成测绘图</h3>
                <p class="text-xs text-stone-400 mt-2">图笔下的重生</p>
              </div>
            </div>

            <!-- Arrow -->
            <div class="text-stone-500 text-2xl">➔</div>

            <!-- 2. Parametric Design -->
            <div class="relative z-10 flex flex-col items-center group">
              <div class="w-4 h-4 bg-stone-900 border-2 border-amber-500 rounded-full mb-8 group-hover:scale-125 transition-transform"></div>
              <div class="bg-stone-900 border border-stone-700 p-6 rounded text-center w-64 hover:border-amber-600 transition-colors">
                <div class="text-3xl mb-2">💻</div>
                <h3 class="text-lg font-bold text-amber-100">当代参数化模型</h3>
                <p class="text-xs text-stone-400 mt-2">代码中的进化</p>
              </div>
            </div>

            <!-- Arrow -->
            <div class="text-stone-500 text-2xl">➔</div>

            <!-- 3. Robotic Fab -->
            <div class="relative z-10 flex flex-col items-center group">
              <div class="w-4 h-4 bg-stone-900 border-2 border-amber-500 rounded-full mb-8 group-hover:scale-125 transition-transform"></div>
              <div class="bg-stone-900 border border-stone-700 p-6 rounded text-center w-64 hover:border-amber-600 transition-colors">
                <div class="text-3xl mb-2">🤖</div>
                <h3 class="text-lg font-bold text-amber-100">机械臂3D打印</h3>
                <p class="text-xs text-stone-400 mt-2">未来的通用语言</p>
              </div>
            </div>
          </div>
          
          <div class="text-center mt-16 text-stone-400 italic">
            “它在代码中进化，成为连接未来的通用语言。”
          </div>
        </div>
      </div>

      <!-- 5-3: Future Outlook Screen -->
      <div class="w-screen h-full flex items-center justify-center relative bg-stone-900">
        <div class="container mx-auto px-8 h-full flex flex-col justify-center">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <div class="bg-stone-800/50 p-8 rounded border border-stone-700 hover:bg-stone-800 transition-colors">
              <h4 class="text-xl font-bold text-amber-500 mb-4">01. 可逆建筑</h4>
              <p class="text-stone-400 leading-relaxed">基于榫卯的可逆性，实现建筑构件的循环利用，回归环保本质。</p>
            </div>
            <div class="bg-stone-800/50 p-8 rounded border border-stone-700 hover:bg-stone-800 transition-colors">
              <h4 class="text-xl font-bold text-amber-500 mb-4">02. 机器人建造</h4>
              <p class="text-stone-400 leading-relaxed">传统工艺与现代工业化的完美结合，实现复杂节点的精确加工。</p>
            </div>
            <div class="bg-stone-800/50 p-8 rounded border border-stone-700 hover:bg-stone-800 transition-colors">
              <h4 class="text-xl font-bold text-amber-500 mb-4">03. 太空建筑</h4>
              <p class="text-stone-400 leading-relaxed">NASA研究显示，互锁结构是月球基地建设的理想选择。</p>
            </div>
          </div>

          <div class="text-center space-y-12">
            <h3 class="text-4xl md:text-6xl font-serif text-stone-100 leading-normal tracking-widest">
              一凹一凸，七千年。<br>
              <span class="text-amber-600">流年未逝，咬合仍在继续。</span>
            </h3>
            
            <div class="flex justify-center space-x-8">
              <button 
                @click="scrollToTop"
                class="px-8 py-3 border border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-white transition-all duration-300 rounded uppercase tracking-wider text-sm cursor-pointer"
              >
                重读流年
              </button>
              <button class="px-8 py-3 border border-stone-600 text-stone-400 hover:border-stone-400 hover:text-stone-200 transition-all duration-300 rounded uppercase tracking-wider text-sm cursor-not-allowed opacity-50">
                分享链接
              </button>
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
