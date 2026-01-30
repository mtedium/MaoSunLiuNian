import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import MapView from '../views/MapView.vue'
import DetailView from '../views/DetailView.vue'
import KnowledgeView from '../views/KnowledgeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/map',
      name: 'map',
      component: MapView
    },
    {
      path: '/building/:id',
      name: 'building-detail',
      component: DetailView
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: KnowledgeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    }
  ]
})

export default router
