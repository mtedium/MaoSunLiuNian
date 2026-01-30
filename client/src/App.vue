<template>
  <NavBar />
  <router-view></router-view>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
  background-color: #f0f0f0;
  overflow-x: hidden;
}
</style>
