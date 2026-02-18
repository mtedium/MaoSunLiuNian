<template>
  <div class="w-full h-screen relative bg-stone-950 pt-24 px-6">
    <div class="container mx-auto text-stone-300 blur-sm pointer-events-none select-none opacity-50">
      <h1 class="text-4xl font-serif font-bold text-stone-100 mb-8">用户中心</h1>
      <div class="flex flex-col md:flex-row gap-8">
        <div class="w-full md:w-1/3 bg-stone-900 p-8 rounded-lg border border-stone-800 text-center">
          <div class="w-24 h-24 bg-stone-800 rounded-full mx-auto mb-4 flex items-center justify-center text-stone-600">
            Avatar
          </div>
          <h2 class="text-2xl font-bold text-stone-100">访客用户</h2>
          <p class="text-stone-500 mt-2">加入时间：2026-02-18</p>
        </div>
        <div class="w-full md:w-2/3 space-y-6">
          <div class="bg-stone-900 p-6 rounded-lg border border-stone-800">
            <h3 class="text-xl font-bold text-stone-200 mb-4">我的收藏</h3>
            <p class="text-stone-500">暂无收藏内容。</p>
          </div>
          <div class="bg-stone-900 p-6 rounded-lg border border-stone-800">
            <h3 class="text-xl font-bold text-stone-200 mb-4">浏览历史</h3>
            <p class="text-stone-500">暂无浏览记录。</p>
          </div>
        </div>
      </div>
    </div>
    
    <ConstructionOverlay 
      message="用户中心正在升级中..."
    />
  </div>
</template>
