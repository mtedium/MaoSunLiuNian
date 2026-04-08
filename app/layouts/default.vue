<template>
  <div class="relative min-h-screen bg-bg-base text-text-primary overflow-x-hidden font-sans">
    <!-- 全屏动态纹理背景 (z-index 最底层) -->
    <div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
      <!-- 将来放置 Canvas 或 WebGL 纹理 -->
      <!-- <div class="w-full h-full bg-[url('/assets/texture-placeholder.png')] bg-cover bg-center"></div> -->
    </div>

    <!-- 导航栏 -->
    <NavBar />

    <!-- 主内容区域 -->
    <main class="relative z-10">
      <slot />
    </main>
  </div>
</template>

<style>
/* 全局样式调整 */
html {
  scroll-behavior: smooth;
}
</style>
