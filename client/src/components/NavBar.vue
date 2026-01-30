<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="logo">
      <router-link to="/">卯榫流年</router-link>
    </div>
    <ul class="nav-links">
      <li><router-link to="/map">时空地图</router-link></li>
      <li><router-link to="/knowledge">科普基因库</router-link></li>
      <li><router-link to="/login">用户中心</router-link></li>
      <li><router-link to="/admin" class="admin-link">后台管理</router-link></li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  transition: background-color 0.3s ease, padding 0.3s ease;
  box-sizing: border-box;
}

.navbar.scrolled {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.8rem 2rem;
}

.logo a {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-lacquer, #2b333e);
  text-decoration: none;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: #555;
  font-size: 1rem;
  transition: color 0.3s;
}

.nav-links a:hover, .nav-links a.router-link-active {
  color: var(--color-cinnabar, #b13b2e);
}

.admin-link {
  border: 1px solid #ddd;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
}
</style>
