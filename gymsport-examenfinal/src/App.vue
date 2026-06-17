<template>
  <div>
    <AlertToast ref="toastRef" />

    <template v-if="isAuthenticated && isAdmin && !['Login', 'Tienda', null].includes(route.name)">
      <div class="app-layout">
        <div
          v-if="sidebarOpen"
          class="d-md-none"
          style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99;"
          @click="sidebarOpen = false"
        ></div>

        <AppSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

        <main class="main-content">
          <header class="topbar">
            <button class="btn btn-sm btn-outline-secondary d-md-none me-2" @click="sidebarOpen = !sidebarOpen">
              <i class="bi bi-list fs-5"></i>
            </button>
            <span class="topbar-title">
              <i class="bi bi-lightning-charge-fill me-2" style="color:var(--primary)"></i>
              {{ currentRouteName }}
            </span>
            <div class="topbar-right">
              <div class="user-badge">
                <div class="avatar">{{ userInitials }}</div>
                <span class="d-none d-sm-inline">{{ currentUser?.name }}</span>
              </div>
            </div>
          </header>
          <div class="page-content">
            <RouterView />
          </div>
        </main>
      </div>
    </template>

    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, provide, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AlertToast from './components/AlertToast.vue'
import authService from './services/authService'

const route = useRoute()
const sidebarOpen = ref(false)
const toastRef = ref(null)

const isAuthenticated = computed(() => authService.isAuthenticated())
const currentUser = computed(() => authService.getUser())
const isAdmin = computed(() => authService.getUser()?.role === 'admin')

const userInitials = computed(() => {
  const name = currentUser.value?.name || 'U'
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
})

const routeNames = {
  Dashboard: 'Dashboard',
  Usuarios:  'Gestión de Usuarios',
  Productos: 'Gestión de Productos'
}

const currentRouteName = computed(() => routeNames[route.name] || route.name)

watchEffect(() => {
  console.log('isAuthenticated:', isAuthenticated.value)
  console.log('isAdmin:', isAdmin.value)
  console.log('route.name:', route.name)
})

provide('toast', {
  success: (msg) => toastRef.value?.show(msg, 'success'),
  error:   (msg) => toastRef.value?.show(msg, 'danger'),
  warning: (msg) => toastRef.value?.show(msg, 'warning'),
  info:    (msg) => toastRef.value?.show(msg, 'info')
})
</script>