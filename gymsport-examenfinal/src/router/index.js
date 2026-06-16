import { createRouter, createWebHashHistory } from 'vue-router'
import authService from '@/services/authService'

const LoginView     = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const UsuariosView  = () => import('@/views/UsuariosView.vue')
const ProductosView = () => import('@/views/ProductosView.vue')

const routes = [
  { path: '/',         redirect: '/dashboard' },
  { path: '/login',    name: 'Login',     component: LoginView,     meta: { requiresGuest: true } },
  { path: '/dashboard',name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/usuarios', name: 'Usuarios',  component: UsuariosView,  meta: { requiresAuth: true } },
  { path: '/productos',name: 'Productos', component: ProductosView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  const isAuthenticated = authService.isAuthenticated()
  if (to.meta.requiresAuth && !isAuthenticated) return { name: 'Login' }
  if (to.meta.requiresGuest && isAuthenticated) return { name: 'Dashboard' }
})

export default router