<template>

  <aside class="sidebar" :class="{ open: isOpen }">

    <div class="sidebar-brand">
  <div class="d-flex align-items-center gap-2">
    <div style="
      width:38px; height:38px; border-radius:8px;
      background: var(--primary);
      display:flex; align-items:center;
      justify-content:center; font-size:1.3rem;
    ">
      🏋️
    </div>
    <div>
      <h5>GYMSPORT</h5>
      <small>Panel de administración</small>
    </div>
  </div>
</div>


    <nav class="sidebar-nav">
  <span class="nav-section-label">Principal</span>

  <RouterLink class="sidebar-link" to="/dashboard" @click="$emit('close')">
    <i class="bi bi-house-fill"></i>
    Inicio
  </RouterLink>

  <span class="nav-section-label mt-2">Recursos</span>

  <RouterLink class="sidebar-link" to="/usuarios" @click="$emit('close')">
    <i class="bi bi-people-fill"></i>
    Usuarios
  </RouterLink>

  <RouterLink class="sidebar-link" to="/productos" @click="$emit('close')">
    <i class="bi bi-bag-fill"></i>
    Productos
  </RouterLink>
</nav>

    <!-- Footer del sidebar con info del usuario -->
    <div class="sidebar-footer">
      <div class="d-flex align-items-center gap-2 mb-3">
        <div class="avatar">{{ userInitials }}</div>
        <div>
          <div style="font-size: 0.82rem; color: #fff; font-weight: 600">
            {{ currentUser?.name || 'Usuario' }}
          </div>
          <div style="font-size: 0.72rem; color: rgba(255,255,255,0.45)">
            {{ currentUser?.role || 'user' }}
          </div>
        </div>
      </div>

      <button class="btn btn-outline-light btn-sm w-100" @click="handleLogout">
        <i class="bi bi-box-arrow-right me-1"></i>
        Cerrar sesión
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'

defineProps({
  isOpen: { type: Boolean, default: false }
})

defineEmits(['close'])
const router = useRouter()

const currentUser = computed(() => authService.getUser())

const userInitials = computed(() => {
  const name = currentUser.value?.name || 'U'
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

function handleLogout() {
  authService.logout()
  router.push('/login')
}
</script>
