<template>
  <div class="home-container">
    <div ref="canvasContainer" class="sticky-canvas"></div>

    <div class="scroll-content">
      <section class="step step-1">
        <div class="text-card">
          <h1>卯榫流年</h1>
          <p>Mortise and Tenon Chronicles</p>
          <p class="subtitle">中国古建筑的智慧结晶</p>
        </div>
      </section>

      <section class="step step-2">
        <div class="text-card side-card">
          <h2>解构与重组</h2>
          <p>一凸一凹，一阴一阳。</p>
          <p>不废一钉一胶，却能屹立千年。</p>
          
          <div class="stress-analysis">
            <svg width="200" height="100" viewBox="0 0 200 100" class="stress-svg">
              <path d="M20,20 L180,20" stroke="#ccc" stroke-width="2" />
              <path d="M100,20 L100,80" stroke="#ccc" stroke-width="2" />
              <!-- Stress Flow Lines -->
              <path class="stress-flow" d="M100,20 Q140,50 180,20" fill="none" stroke="#b13b2e" stroke-width="3" />
              <path class="stress-flow" d="M100,20 Q60,50 20,20" fill="none" stroke="#b13b2e" stroke-width="3" />
            </svg>
            <p class="caption">压力传导示意</p>
          </div>
        </div>
      </section>

      <section class="step step-3">
        <div class="text-card">
          <h2>《营造法式》</h2>
          <p>“凡构屋之制，皆以材为祖”</p>
          <p>标准化模数制，不仅是建筑规范，更是科学精神的体现。</p>
        </div>
      </section>

      <section class="step step-4">
        <div class="text-card">
          <h2>时空穿梭</h2>
          <p>准备进入历史长河...</p>
          <router-link to="/map" class="enter-btn">进入时空地图</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ... existing styles ... */
.enter-btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.8rem 2rem;
  background-color: var(--color-cinnabar, #b13b2e);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}
.enter-btn:hover {
  background-color: #8a2a20;
}
</style><script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const canvasContainer = ref(null);
let scene, camera, renderer, modelGroup;
let partA, partB; // Two parts of the mortise and tenon

const initThree = () => {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  // Add some fog for depth
  scene.fog = new THREE.Fog(0xf0f0f0, 5, 20);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  // Model (Simulating Mortise and Tenon with basic geometries)
  modelGroup = new THREE.Group();

  // Material (Wood texture color)
  const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 });

  // Part A (Tenon - 凸)
  const geometryA = new THREE.BoxGeometry(1, 3, 1);
  partA = new THREE.Mesh(geometryA, woodMaterial);
  partA.position.y = 1.5;
  
  // Part B (Mortise - 凹 - simulated with 2 side pieces for visual simplicity)
  const geometryB = new THREE.BoxGeometry(3, 1, 1);
  partB = new THREE.Mesh(geometryB, woodMaterial);
  partB.position.y = -1.5;

  modelGroup.add(partA);
  modelGroup.add(partB);
  
  // Initial Rotation
  modelGroup.rotation.x = 0.5;
  modelGroup.rotation.y = 0.5;

  scene.add(modelGroup);
};

const initAnimations = () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-content',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    }
  });

  // Step 1: Initial state to Step 2 (Join/Separate)
  // Let's animate them coming together or separating
  // Initial: Separated
  partA.position.y = 2;
  partB.position.y = -2;

  // Animation to Step 2: Join
  tl.to(partA.position, { y: 0.5, duration: 2 }, 'step1')
    .to(partB.position, { y: -0.5, duration: 2 }, 'step1')
    .to(modelGroup.rotation, { y: Math.PI * 2, duration: 2 }, 'step1');

  // Step 2 to 3: Rotate and analyze
  tl.to(modelGroup.rotation, { x: Math.PI, z: Math.PI / 2, duration: 2 }, 'step2')
    .to(modelGroup.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 2 }, 'step2');

  // Step 3 to 4: Zoom in (Fly through)
  tl.to(camera.position, { z: 0, duration: 2 }, 'step3')
    .to(scene.fog, { near: 0, far: 2, duration: 2 }, 'step3'); // Fade out effect
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

const handleResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

onMounted(() => {
  initThree();
  initAnimations();
  animate();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  // Cleanup Three.js resources if needed
});
</script>

<style scoped>
.home-container {
  position: relative;
}

.sticky-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none; /* Allow scroll through */
}

.scroll-content {
  position: relative;
  z-index: 1;
}

.step {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Make sections transparent to see the 3D background */
}

.text-card {
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-width: 600px;
  text-align: center;
  backdrop-filter: blur(5px);
  border: 1px solid #ddd;
}

.side-card {
  margin-left: auto;
  margin-right: 10%;
}

h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-family: 'Noto Serif SC', serif;
  color: var(--color-lacquer);
}

h2 {
  font-size: 2rem;
  color: var(--color-cinnabar);
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  line-height: 1.6;
}

.subtitle {
  font-style: italic;
  color: #666;
}

.stress-analysis {
  margin-top: 20px;
  text-align: center;
}

.stress-svg {
  margin: 0 auto;
}

.stress-flow {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: flow 2s infinite linear;
}

@keyframes flow {
  to {
    stroke-dashoffset: 0;
  }
}

.caption {
  font-size: 0.8rem;
  color: #999;
}
</style>
