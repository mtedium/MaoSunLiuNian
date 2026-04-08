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
  <section ref="sectionRef" class="relative h-screen w-screen overflow-hidden bg-bg-surface text-text-primary">
    <!-- Horizontal Container (300vw) -->
    <div ref="containerRef" class="flex h-full w-[300vw]">
      
      <!-- 5-1: 尾声引言 -->
      <div class="w-screen h-full flex flex-col items-center justify-center relative border-r border-border-default bg-bg-surface">
        <div class="absolute inset-0 z-0 opacity-10 dark:opacity-30 bg-[url('https://images.unsplash.com/photo-1518998053401-b258674b8822?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay pointer-events-none"></div>
        <div class="relative z-10 max-w-4xl text-center space-y-8 px-8">
          <p class="text-3xl md:text-5xl font-serif leading-relaxed text-text-primary drop-shadow-lg">
            “当木头朽坏，建筑倒塌，<br>
            榫卯的智慧是否也会随之消亡？”<br>
            <span class="block mt-8 text-2xl md:text-4xl opacity-90 text-text-primary">
              不会。<br>
              因为它早已脱离了材质的束缚，<br>
              成为一种连接世界的算法。
            </span>
          </p>
        </div>
      </div>

      <!-- 5-2: Lineage Screen (Horizontal Timeline) -->
      <div class="w-screen h-full flex flex-col justify-center relative border-r border-border-default bg-bg-surface overflow-hidden">
        <!-- Background decorative elements -->
        <div class="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" class="w-full h-full text-text-primary" fill="currentColor">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div class="container mx-auto px-8 md:px-16 lg:px-24 relative z-10">
          <div class="mb-16 md:mb-24">
            <h2 class="text-4xl md:text-5xl font-serif text-text-primary mb-4 tracking-wider">传承<span class="text-amber-600">与</span>演进</h2>
            <p class="text-text-secondary text-lg max-w-2xl">从纸笔测绘到数字算法，榫卯的智慧在不同时代以新的载体不断重生，展现出跨越时空的生命力。</p>
          </div>
          
          <div class="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 w-full">
            <!-- Timeline Line -->
            <div class="absolute md:top-1/2 left-8 md:left-0 w-0.5 md:w-full h-full md:h-0.5 bg-border-default md:-translate-y-1/2 hidden md:block"></div>
            
            <!-- Node 1 -->
            <div class="relative z-10 flex flex-row md:flex-col items-center md:items-center group w-full md:w-1/3">
              <div class="hidden md:flex w-6 h-6 bg-bg-surface border-4 border-border-subtle group-hover:border-amber-500 rounded-full mb-8 group-hover:scale-125 transition-all duration-300 shadow-lg z-10"></div>
              <div class="bg-bg-elevated border border-border-subtle p-8 rounded-lg w-full md:w-11/12 hover:border-amber-600/50 hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-500 group-hover:-translate-y-2">
                <div class="text-amber-600/80 mb-6 w-12 h-12">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.121l-2.857.3a.75.75 0 01-.818-.818l.3-2.857a4.5 4.5 0 011.12-1.89l13.49-13.49z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125L16.862 4.487" />
                  </svg>
                </div>
                <div class="text-xs font-mono text-amber-600 mb-2 tracking-widest uppercase">1930s - 营造法式</div>
                <h3 class="text-xl font-bold text-text-primary mb-3 group-hover:text-amber-600 transition-colors">纸笔测绘与破译</h3>
                <p class="text-sm text-text-secondary leading-relaxed">在动荡年代中，通过实地测绘与《营造法式》的对读，让中国木构建筑的营造密码重新被世界认知。</p>
              </div>
            </div>

            <!-- Node 2 -->
            <div class="relative z-10 flex flex-row md:flex-col items-center md:items-center group w-full md:w-1/3">
              <div class="hidden md:flex w-6 h-6 bg-bg-surface border-4 border-border-subtle group-hover:border-amber-500 rounded-full mb-8 group-hover:scale-125 transition-all duration-300 shadow-lg z-10"></div>
              <div class="bg-bg-elevated border border-border-subtle p-8 rounded-lg w-full md:w-11/12 hover:border-amber-600/50 hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-500 group-hover:-translate-y-2">
                <div class="text-amber-600/80 mb-6 w-12 h-12">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <div class="text-xs font-mono text-amber-600 mb-2 tracking-widest uppercase">2010s - 几何逻辑</div>
                <h3 class="text-xl font-bold text-text-primary mb-3 group-hover:text-amber-600 transition-colors">参数化数字模型</h3>
                <p class="text-sm text-text-secondary leading-relaxed">将传统的经验法则转化为可计算的几何逻辑，让复杂的榫卯节点能够在虚拟空间中被无限演化与优化。</p>
              </div>
            </div>

            <!-- Node 3 -->
            <div class="relative z-10 flex flex-row md:flex-col items-center md:items-center group w-full md:w-1/3">
              <div class="hidden md:flex w-6 h-6 bg-amber-500 border-4 border-amber-200/20 group-hover:border-amber-200/40 rounded-full mb-8 group-hover:scale-125 transition-all duration-300 shadow-lg shadow-amber-500/50 z-10 animate-pulse"></div>
              <div class="bg-bg-elevated border border-amber-500/30 p-8 rounded-lg w-full md:w-11/12 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-900/20 transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -z-10"></div>
                <div class="text-amber-500 mb-6 w-12 h-12">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                  </svg>
                </div>
                <div class="text-xs font-mono text-amber-500 mb-2 tracking-widest uppercase">2020s+ - 智能制造</div>
                <h3 class="text-xl font-bold text-text-primary mb-3 group-hover:text-amber-500 transition-colors">机器人协同建造</h3>
                <p class="text-sm text-text-secondary leading-relaxed">结合多轴数控加工与机器人装配，突破传统手工限制，实现复杂互锁结构的高效预制与大规模应用。</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <!-- 5-3: Future Outlook Screen -->
      <div class="w-screen h-full flex flex-col items-center justify-center relative bg-bg-base overflow-hidden">
        <!-- Abstract background -->
        <div class="absolute inset-0 z-0 opacity-30 dark:opacity-20">
          <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl mix-blend-screen"></div>
          <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-800/20 rounded-full blur-3xl mix-blend-screen"></div>
        </div>

        <div class="container mx-auto px-8 md:px-16 h-full flex flex-col justify-center relative z-10">
          
          <div class="mb-16 text-center">
            <h2 class="text-sm font-mono text-amber-600 tracking-[0.3em] uppercase mb-4">Future Horizons</h2>
            <h3 class="text-3xl md:text-4xl font-serif text-text-primary">从传统木构到未来通用法则</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24">
            <!-- Card 1 -->
            <div class="group relative bg-bg-surface p-8 rounded-xl border border-border-default hover:border-amber-500/50 transition-all duration-500 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="text-4xl font-light text-border-strong mb-6 font-serif group-hover:text-amber-500/30 transition-colors">01</div>
              <h4 class="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                可逆式循环建筑
              </h4>
              <p class="text-text-secondary leading-relaxed text-sm">榫卯天生的可拆卸特性，使其成为当代可持续建筑的完美范本。构件无需破坏即可重组，实现建筑材料的全生命周期闭环。</p>
            </div>

            <!-- Card 2 -->
            <div class="group relative bg-bg-surface p-8 rounded-xl border border-border-default hover:border-amber-500/50 transition-all duration-500 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="text-4xl font-light text-border-strong mb-6 font-serif group-hover:text-amber-500/30 transition-colors">02</div>
              <h4 class="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                拓扑互锁新材料
              </h4>
              <p class="text-text-secondary leading-relaxed text-sm">榫卯的几何原理正被跨界应用于混凝土、3D打印陶瓷等新材料中，无需砂浆与连接件，即可实现自承重的大跨度空间结构。</p>
            </div>

            <!-- Card 3 -->
            <div class="group relative bg-bg-surface p-8 rounded-xl border border-border-default hover:border-amber-500/50 transition-all duration-500 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="text-4xl font-light text-border-strong mb-6 font-serif group-hover:text-amber-500/30 transition-colors">03</div>
              <h4 class="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                深空星际居所
              </h4>
              <p class="text-text-secondary leading-relaxed text-sm">NASA等机构研究表明，基于互锁结构的模块化拼装，是未来月球或火星基地在极端环境下利用原位资源快速部署的理想方案。</p>
            </div>
          </div>

          <!-- Final message -->
          <div class="text-center space-y-12 relative">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent -z-10"></div>
            
            <h3 class="text-4xl md:text-6xl font-serif text-text-primary leading-tight tracking-widest drop-shadow-sm">
              一凹一凸，七千年。<br>
              <span class="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">流年未逝，咬合仍在继续。</span>
            </h3>
            
            <div class="flex flex-col sm:flex-row justify-center items-center gap-6 mt-16">
              <button 
                @click="scrollToTop"
                class="group relative px-10 py-4 bg-transparent border border-amber-600 text-amber-600 font-bold tracking-[0.2em] uppercase text-sm overflow-hidden rounded transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.3)] cursor-pointer"
              >
                <div class="absolute inset-0 bg-amber-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
                <span class="relative z-10 group-hover:text-bg-base transition-colors duration-300">重读流年</span>
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
