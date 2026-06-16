import { createRouter, createWebHashHistory } from 'vue-router'
import authService from '../services/authService'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login',     component: () => import('../views/LoginView.vue') },
  { path: '/dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/usuarios',  component: () => import('../views/UsuariosView.vue') },
  { path: '/productos', component: () => import('../views/ProductosView.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  const publica = ['/login']
  const isAuthenticated = authService.isAuthenticated()
  if (!publica.includes(to.path) && !isAuthenticated) return { path: '/login' }
})

export default router