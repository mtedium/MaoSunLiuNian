<template>
  <div class="detail-container">
    <div class="split-layout">
      <!-- Left: Visual Center (3D or Panorama) -->
      <div class="visual-panel">
        <div class="visual-header">
          <div class="tabs">
            <button :class="{ active: visualMode === '3d' }" @click="visualMode = '3d'">3D 结构</button>
            <button :class="{ active: visualMode === 'pano' }" @click="visualMode = 'pano'">720° 全景</button>
          </div>
        </div>
        
        <div class="canvas-wrapper">
          <div v-show="visualMode === '3d'" ref="threeContainer" class="three-container"></div>
          <div v-show="visualMode === 'pano'" class="pano-placeholder">
            <p>全景图资源加载区 (Placeholder)</p>
            <div class="hotspot" @click="scrollToSection('principle')">🔵 点击查看斗拱原理</div>
          </div>
        </div>
      </div>

      <!-- Right: Content Center -->
      <div class="content-panel">
        <div class="content-scroll">
          <h1 class="building-title">{{ building.name }}</h1>
          <p class="meta">{{ building.dynasty }} | {{ building.type }}</p>

          <section id="principle" class="content-section">
            <h2>科学原理</h2>
            <p>
              斗拱是中国古代建筑独特的结构构件，它由方形的斗、升、拱、翘、昂等构件纵横交错叠加而成。
              其主要作用是支撑屋檐，将屋顶的重量传递到柱子上，同时具有抗震功能。
            </p>
            <div class="diagram">
              <!-- SVG Diagram Placeholder -->
              <svg width="100%" height="150" viewBox="0 0 300 150">
                <path d="M50,140 L150,50 L250,140" fill="none" stroke="#b13b2e" stroke-width="2" />
                <circle cx="150" cy="50" r="5" fill="#b13b2e" />
                <text x="120" y="40" fill="#333" font-size="12">受力点</text>
              </svg>
            </div>
          </section>

          <section class="content-section">
            <h2>科学家与匠人</h2>
            <p>
              《营造法式》作者李诫，详细规定了斗拱的模数制（材分制）。
              在{{ building.dynasty }}代，匠人们通过精密的计算，实现了力学与美学的完美统一。
            </p>
          </section>

          <section class="content-section">
            <h2>古籍引用</h2>
            <blockquote class="quote">
              “凡构屋之制，皆以材为祖。材有八等，度屋之大小，因而用之。” —— 《营造法式》
            </blockquote>
          </section>

          <section class="content-section">
            <h2>文化传承</h2>
            <p>
              这座建筑不仅是技术的载体，更是礼制与等级的象征。
              它见证了千年的风雨，承载着中华民族对“天人合一”的追求。
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const route = useRoute();
const buildingId = route.params.id;

// Mock Data
const building = ref({
  id: buildingId,
  name: '佛光寺东大殿',
  dynasty: '唐',
  type: '官府'
});

const visualMode = ref('3d');
const threeContainer = ref(null);
let scene, camera, renderer, controls, cube;

const initThree = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);

  camera = new THREE.PerspectiveCamera(75, threeContainer.value.clientWidth / threeContainer.value.clientHeight, 0.1, 1000);
  camera.position.set(3, 3, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight);
  threeContainer.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // Model Placeholder (Complex Geometry to look like Dougong)
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
  
  // Base Block (Dou)
  const base = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), material);
  group.add(base);
  
  // Arm (Gong)
  const arm = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 0.4), material);
  arm.position.y = 0.5;
  group.add(arm);

  // Top Blocks
  const top1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), material);
  top1.position.set(-1.2, 0.8, 0);
  const top2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), material);
  top2.position.set(1.2, 0.8, 0);
  group.add(top1);
  group.add(top2);

  scene.add(group);

  animate();
};

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const handleResize = () => {
  if (camera && renderer && threeContainer.value) {
    camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight);
  }
};

onMounted(() => {
  initThree();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.detail-container {
  height: 100vh;
  padding-top: 60px; /* Navbar height */
  box-sizing: border-box;
}

.split-layout {
  display: flex;
  height: 100%;
}

.visual-panel {
  flex: 1;
  background: #333;
  position: relative;
  display: flex;
  flex-direction: column;
}

.visual-header {
  padding: 10px;
  background: rgba(0,0,0,0.5);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.tabs button {
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  padding: 5px 15px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 20px;
}

.tabs button.active {
  background: var(--color-cinnabar, #b13b2e);
  border-color: var(--color-cinnabar, #b13b2e);
}

.canvas-wrapper {
  flex: 1;
  position: relative;
}

.three-container {
  width: 100%;
  height: 100%;
}

.pano-placeholder {
  width: 100%;
  height: 100%;
  background: url('https://placeholder.com/pano') no-repeat center center;
  background-size: cover;
  background-color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
}

.hotspot {
  position: absolute;
  top: 40%;
  left: 60%;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 5px 10px;
  border-radius: 15px;
  cursor: pointer;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

.content-panel {
  flex: 0 0 450px;
  background: white;
  border-left: 1px solid #ddd;
  overflow-y: auto;
  padding: 40px;
}

.building-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 2.5rem;
  margin-bottom: 5px;
  color: var(--color-lacquer, #2b333e);
}

.meta {
  color: #888;
  margin-bottom: 30px;
  font-size: 0.9rem;
}

.content-section {
  margin-bottom: 50px;
}

.content-section h2 {
  font-family: 'Noto Serif SC', serif;
  color: var(--color-cinnabar, #b13b2e);
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.quote {
  border-left: 4px solid #ddd;
  padding-left: 15px;
  color: #666;
  font-style: italic;
  margin: 20px 0;
}

.diagram {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  text-align: center;
}
</style>
