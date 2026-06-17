import { createRouter, createWebHashHistory } from 'vue-router'
import authService from '../services/authService'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login',     name: 'Login',     component: () => import('../views/LoginView.vue') },
  { path: '/tienda',    name: 'Tienda',    component: () => import('../views/TiendaView.vue') },
  { path: '/dashboard', name: 'Dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/usuarios',  name: 'Usuarios',  component: () => import('../views/UsuariosView.vue') },
  { path: '/productos', name: 'Productos', component: () => import('../views/ProductosView.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  const publica = ['/login']
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUser()

  if (!publica.includes(to.path) && !isAuthenticated) return { path: '/login' }

  if (to.path !== '/tienda' && to.path !== '/login' && user?.role !== 'admin') {
    return { path: '/tienda' }
  }
})

export default router