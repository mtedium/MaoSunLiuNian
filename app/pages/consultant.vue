<template>
  <div class="w-full h-screen relative bg-stone-950 pt-24 px-6">
    <div class="container mx-auto text-stone-300 blur-sm pointer-events-none select-none opacity-50">
      <h1 class="text-4xl font-serif font-bold text-stone-100 mb-8">榫卯顾问</h1>
      <div class="max-w-3xl mx-auto space-y-6">
        <div class="bg-stone-900 p-6 rounded-lg border border-stone-800">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-amber-900/30 rounded-full flex items-center justify-center border border-amber-700/30 shrink-0">
              <span class="text-amber-500 font-serif text-sm">卯</span>
            </div>
            <div class="space-y-2">
              <p class="text-stone-200 text-sm">你好，我是榫卯流年的 AI 顾问，有什么关于传统木作工艺的问题可以问我。</p>
            </div>
          </div>
        </div>
        <div class="bg-stone-900 p-6 rounded-lg border border-stone-800">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center border border-stone-700 shrink-0">
              <span class="text-stone-400 text-sm">用</span>
            </div>
            <div class="space-y-2">
              <p class="text-stone-300 text-sm">燕尾榫和直榫有什么区别？</p>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="flex-1 bg-stone-900 rounded-lg border border-stone-800 px-4 py-3 text-stone-500 text-sm">
            输入你的问题...
          </div>
          <div class="px-6 py-3 bg-red-900/60 rounded-lg text-stone-300 text-sm">发送</div>
        </div>
      </div>
    </div>

    <ConstructionOverlay 
      message="AI 顾问功能正在开发中..."
    />
  </div>
</template>
