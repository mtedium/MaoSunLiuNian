<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['complete'])
const containerRef = ref(null)
const topPieceRef = ref(null)
const bottomPieceRef = ref(null)
const textRef = ref(null)
const hintRef = ref(null)
const pieceContainerRef = ref(null)

const isVisible = ref(true)

onMounted(() => {
  const tl = gsap.timeline()

  // 1. 初始状态设置
  gsap.set([topPieceRef.value, bottomPieceRef.value], {
    opacity: 0,
    y: (i) => i === 0 ? -50 : 50 // 上方构件向上偏移，下方构件向下偏移
  })
  gsap.set(textRef.value, { opacity: 0, scale: 0.8 })
  gsap.set(hintRef.value, { opacity: 0 })
  gsap.set(pieceContainerRef.value, { opacity: 1 })

  // 2. 构件显现并缓慢靠近 (时长 2s)
  tl.to([topPieceRef.value, bottomPieceRef.value], {
    opacity: 1,
    y: 0,
    duration: 2,
    ease: "power2.inOut",
    stagger: 0.2
  })
  
  // 3. 咬合瞬间的轻微震动/发光效果
  .to([topPieceRef.value, bottomPieceRef.value], {
    scale: 0.98,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: "power1.inOut"
  })

  // 4. 构件淡出 (让位给文字)
  .to(pieceContainerRef.value, {
    opacity: 0,
    scale: 0.9,
    duration: 1.5,
    ease: "power2.inOut"
  }, "+=0.2")

  // 5. 文字浮现 (与构件淡出有轻微重叠，平滑过渡)
  .to(textRef.value, {
    opacity: 1,
    scale: 1,
    duration: 2,
    ease: "power3.out"
  }, "-=1.0")

  // 6. 引导提示浮现
  .to(hintRef.value, {
    opacity: 1,
    duration: 1,
    delay: 0.5
  })
})

const handleInteraction = () => {
  if (!isVisible.value) return
  
  // 退场动画：整体向上滑动
  gsap.to(containerRef.value, {
    yPercent: -100,
    duration: 1.2,
    ease: "power3.inOut",
    onComplete: () => {
      isVisible.value = false
      emit('complete')
    }
  })
}

// 监听滚轮和触摸
const handleWheel = (e) => {
  if (e.deltaY > 0) handleInteraction()
}
</script>

<template>
  <div 
    v-if="isVisible"
    ref="containerRef"
    class="fixed inset-0 z-[100] bg-bg-surface flex flex-col items-center justify-center overflow-hidden cursor-pointer"
    @wheel="handleWheel"
    @click="handleInteraction"
    @touchstart="handleInteraction"
  >
    <!-- 背景纹理 -->
    <div class="absolute inset-0 opacity-15 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
    
    <!-- 核心视觉区域：榫卯构件 (动画结束后淡出) -->
    <div ref="pieceContainerRef" class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div class="relative w-64 h-64 md:w-80 md:h-80 flex flex-col items-center justify-center scale-150 md:scale-[2.0]">
        
        <!-- 上方凸形构件 (榫) -->
        <div ref="topPieceRef" class="relative z-10 mb-[-2px]"> <!-- 负边距确保严丝合缝 -->
          <!-- 主体 -->
          <div class="w-32 h-24 bg-bg-elevated/90 backdrop-blur-sm border border-border-subtle/50 rounded-t-lg relative shadow-lg">
             <!-- 凸出部分 -->
             <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-8 bg-bg-elevated/90 border-l border-r border-b border-border-subtle/50"></div>
             <!-- 装饰线 -->
             <div class="absolute top-4 left-4 right-4 h-[1px] bg-border-default/30"></div>
          </div>
        </div>

        <!-- 下方凹形构件 (卯) -->
        <div ref="bottomPieceRef" class="relative z-10 mt-[-2px]">
          <!-- 主体 -->
          <div class="w-32 h-24 bg-bg-elevated/90 backdrop-blur-sm border border-border-subtle/50 rounded-b-lg relative shadow-lg flex justify-center">
             <!-- 凹进部分 -->
             <div class="absolute top-0 left-0 w-[calc(50%-1.5rem)] h-8 bg-bg-elevated/90 border-t border-l border-border-subtle/50"></div>
             <div class="absolute top-0 right-0 w-[calc(50%-1.5rem)] h-8 bg-bg-elevated/90 border-t border-r border-border-subtle/50"></div>
             <div class="absolute top-8 left-0 right-0 bottom-0 bg-bg-elevated/90 border-l border-r border-b border-border-subtle/50 rounded-b-lg"></div>
             
             <!-- 装饰线 -->
             <div class="absolute bottom-4 left-4 right-4 h-[1px] bg-border-default/30"></div>
          </div>
        </div>

        <!-- 光效/咬合点 -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>

      </div>
    </div>

    <!-- 文字区域 (绝对居中，初始隐藏) -->
    <div ref="textRef" class="absolute inset-0 flex flex-col items-center justify-center z-20 px-6">
      <h1 class="text-7xl md:text-9xl font-serif font-bold text-text-primary tracking-[0.2em] md:tracking-[0.3em] drop-shadow-2xl text-center leading-tight">
        榫卯流年
      </h1>
      
      <!-- 副标题 / 诗句 -->
      <div class="mt-8 md:mt-12 text-center space-y-3 opacity-80">
        <p class="text-lg md:text-xl text-text-secondary font-serif tracking-widest leading-loose">
          一凹一凸，阴阳咬合
        </p>
        <p class="text-sm md:text-base text-text-secondary font-light tracking-wider leading-relaxed max-w-2xl mx-auto">
          不用一钉一铆，让木头与木头对话，让时间与时间相连
        </p>
      </div>
    </div>

    <!-- 引导提示 -->
    <div ref="hintRef" class="absolute bottom-12 left-0 w-full text-center z-30">
      <div class="text-text-secondary text-base tracking-widest animate-bounce flex flex-col items-center gap-2 font-light opacity-60 hover:opacity-100 transition-opacity duration-300">
        <span>向上滑动开启</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 可以在这里添加更细腻的材质纹理 */
</style>
