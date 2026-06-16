<template>
  <div>
  
    <div class="page-header">
      <h2><i class="bi bi-grid-1x2-fill"></i> Dashboard</h2>
      <span style="font-size: 0.8rem; color: var(--gray)">
        <i class="bi bi-clock me-1"></i>{{ currentDate }}
      </span>
    </div>

    <div
      class="mb-4 p-4"
      style="
        background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%);
        border-radius: 14px; color: #fff;
      "
    >
      <h4 style="font-weight: 700; margin: 0">
        ¡Hola, {{ currentUser?.name || 'Usuario' }}! 👋
      </h4>
      <p style="margin: 4px 0 0; opacity: 0.85; font-size: 0.9rem">
        Bienvenido al panel de administración. Gestiona usuarios y productos desde aquí.
      </p>
    </div>


    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-xl-3">
        <div class="stat-card">
          <div class="stat-icon" style="background:#ede9fe">
            <i class="bi bi-people-fill" style="color: var(--primary)"></i>
          </div>
          <div>
            <div class="stat-label">Total Usuarios</div>
            <div class="stat-value">
              <span v-if="loadingStats" class="spinner-border spinner-border-sm"></span>
              <span v-else>{{ stats.usuarios }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xl-3">
        <div class="stat-card">
          <div class="stat-icon" style="background:#d1fae5">
            <i class="bi bi-box-seam-fill" style="color: var(--success)"></i>
          </div>
          <div>
            <div class="stat-label">Total Productos</div>
            <div class="stat-value">
              <span v-if="loadingStats" class="spinner-border spinner-border-sm"></span>
              <span v-else>{{ stats.productos }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xl-3">
        <div class="stat-card">
          <div class="stat-icon" style="background:#fef3c7">
            <i class="bi bi-currency-dollar" style="color: var(--warning)"></i>
          </div>
          <div>
            <div class="stat-label">Valor en Stock</div>
            <div class="stat-value">
              <span v-if="loadingStats" class="spinner-border spinner-border-sm"></span>
              <span v-else>${{ stats.totalStock.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xl-3">
        <div class="stat-card">
          <div class="stat-icon" style="background:#fee2e2">
            <i class="bi bi-shield-check" style="color: var(--danger)"></i>
          </div>
          <div>
            <div class="stat-label">Sesión</div>
            <div class="stat-value" style="font-size: 1rem; padding-top: 4px">Activa</div>
          </div>
        </div>
      </div>
    </div>


    <div class="row g-3">
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <i class="bi bi-people text-primary"></i>
            Gestión de Usuarios
          </div>
          <div class="card-body">
            <p class="text-muted" style="font-size: 0.875rem">
              Administra los usuarios del sistema: crea, edita o elimina registros
              con formularios modales y alertas visuales.
            </p>
            <RouterLink to="/usuarios" class="btn btn-primary btn-sm">
              <i class="bi bi-arrow-right-circle me-1"></i>
              Ir a Usuarios
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <i class="bi bi-box-seam text-success"></i>
            Gestión de Productos
          </div>
          <div class="card-body">
            <p class="text-muted" style="font-size: 0.875rem">
              Controla el catálogo de productos: agrega nuevos artículos, actualiza
              información y maneja el inventario.
            </p>
            <RouterLink to="/productos" class="btn btn-success btn-sm">
              <i class="bi bi-arrow-right-circle me-1"></i>
              Ir a Productos
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import authService from '@/services/authService'
import usuariosService from '@/services/usuariosService'
import productosService from '@/services/productosService'

const currentUser = computed(() => authService.getUser())
const loadingStats = ref(true)

const stats = ref({
  usuarios: 0,
  productos: 0,
  totalStock: 0
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
})

onMounted(async () => {
  try {
    const [usuarios, productos] = await Promise.all([
      usuariosService.getAll(),
      productosService.getAll()
    ])
    stats.value.usuarios = usuarios.length
    stats.value.productos = productos.length
    stats.value.totalStock = productos.reduce(
      (sum, p) => sum + (Number(p.price) * Number(p.stock || 0)), 0
    )
  } catch (e) {
    // No critical
  } finally {
    loadingStats.value = false
  }
})
</script>
