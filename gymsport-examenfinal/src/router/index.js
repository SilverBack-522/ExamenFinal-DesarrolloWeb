
import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/authService'

// Lazy-load de vistas para mejor rendimiento
const LoginView    = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const UsuariosView  = () => import('@/views/UsuariosView.vue')
const ProductosView = () => import('@/views/ProductosView.vue')

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: UsuariosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/productos',
    name: 'Productos',
    component: ProductosView,
    meta: { requiresAuth: true }
  },
  {

    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {

    next({ name: 'Login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {

    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
