<template>
  <div>

    <div class="page-header">
      <h2><i class="bi bi-people-fill"></i> Usuarios</h2>
      <button v-if="isAdmin" class="btn btn-primary" @click="openCreate">
  <i class="bi bi-plus-circle me-1"></i>
  Nuevo usuario
</button>
    </div>

    <div class="card mb-3">
      <div class="card-body py-2">
        <div class="row g-2 align-items-center">
          <div class="col-md-5">
            <div class="search-bar">
              <i class="bi bi-search"></i>
              <input
                v-model="search"
                type="text"
                class="form-control"
                placeholder="Buscar por nombre, email o rol..."
              />
            </div>
          </div>
          <div class="col-auto ms-md-auto">
            <span class="badge bg-primary bg-opacity-10 text-primary" style="font-size:0.8rem">
              {{ filteredUsers.length }} registro(s)
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <i class="bi bi-table text-primary"></i>
        Listado de usuarios
      </div>

      <div v-if="loading" class="spinner-overlay">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-else-if="!filteredUsers.length" class="empty-state">
        <div><i class="bi bi-people"></i></div>
        <p class="mb-1 fw-semibold">Sin usuarios registrados</p>
        <p style="font-size:0.82rem">Crea el primero haciendo clic en "Nuevo usuario"</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, idx) in filteredUsers" :key="user.id">
              <td class="text-muted" style="width:50px">{{ idx + 1 }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div
                    class="avatar"
                    style="width:30px;height:30px;font-size:0.72rem"
                  >
                    {{ initials(user.name) }}
                  </div>
                  <span class="fw-semibold">{{ user.name }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span
                  class="badge-role"
                  :class="user.role === 'admin' ? 'bg-primary text-white' : 'bg-secondary bg-opacity-10 text-secondary'"
                >
                  <i class="bi" :class="user.role === 'admin' ? 'bi-shield-fill' : 'bi-person-fill'"></i>
                  {{ user.role || 'user' }}
                </span>
              </td>
              <td class="text-center">
                <div class="d-flex gap-1 justify-content-center">
  <button
    v-if="isAdmin"
    class="btn btn-outline-primary btn-icon"
    title="Editar usuario"
    @click="openEdit(user)"
  >
    <i class="bi bi-pencil-fill"></i>
  </button>
  <button
    v-if="isAdmin"
    class="btn btn-outline-danger btn-icon"
    title="Eliminar usuario"
    @click="openDelete(user)"
  >
    <i class="bi bi-trash-fill"></i>
  </button>
</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="showFormModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0,0,0,0.5)"
      @click.self="closeFormModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="isEditing ? 'bi bi-pencil-square' : 'bi bi-person-plus-fill'" class="me-2"></i>
              {{ isEditing ? 'Editar usuario' : 'Nuevo usuario' }}
            </h5>
            <button class="btn-close" @click="closeFormModal"></button>
          </div>

          <div class="modal-body">

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-person me-1"></i>Nombre completo
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': formErrors.name }"
                placeholder="Ej: Juan Pérez"
              />
              <div class="invalid-feedback">{{ formErrors.name }}</div>
            </div>

            
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-envelope me-1"></i>Correo electrónico
              </label>
              <input
                v-model="formData.email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': formErrors.email }"
                placeholder="correo@ejemplo.com"
              />
              <div class="invalid-feedback">{{ formErrors.email }}</div>
            </div>

           
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-lock me-1"></i>
                Contraseña
                <span v-if="isEditing" class="text-muted" style="font-weight:400;font-size:0.78rem">
                  (dejar vacío para no cambiar)
                </span>
              </label>
              <input
                v-model="formData.password"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': formErrors.password }"
                placeholder="••••••••"
              />
              <div class="invalid-feedback">{{ formErrors.password }}</div>
            </div>

           
            <div class="mb-1">
              <label class="form-label">
                <i class="bi bi-shield me-1"></i>Rol
              </label>
              <select v-model="formData.role" class="form-select">
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeFormModal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button class="btn btn-primary" :disabled="savingForm" @click="saveUser">
              <span v-if="savingForm" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-check-circle me-1"></i>
              {{ isEditing ? 'Guardar cambios' : 'Crear usuario' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showDeleteModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0,0,0,0.5)"
      @click.self="showDeleteModal = false"
    >
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title text-danger">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              Eliminar usuario
            </h5>
            <button class="btn-close" @click="showDeleteModal = false"></button>
          </div>

          <div class="modal-body pt-2">
            <div class="danger-zone">
              <div><i class="bi bi-trash3-fill"></i></div>
              <p class="mb-1 fw-semibold">¿Confirmar eliminación?</p>
              <p class="mb-0" style="font-size:0.82rem;color:var(--gray)">
                El usuario <strong>{{ selectedUser?.name }}</strong> será eliminado
                permanentemente y no podrá recuperarse.
              </p>
            </div>
          </div>

          <div class="modal-footer border-0 pt-0">
            <button class="btn btn-secondary btn-sm" @click="showDeleteModal = false">
              Cancelar
            </button>
            <button class="btn btn-danger btn-sm" :disabled="deleting" @click="confirmDelete">
              <span v-if="deleting" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-trash me-1"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import usuariosService from '@/services/usuariosService'


const toast = inject('toast')
import authService from '../services/authService'
const currentUser = authService.getUser()
const isAdmin = computed(() => currentUser?.role === 'admin')

const users       = ref([])
const loading     = ref(true)
const search      = ref('')

const showFormModal = ref(false)
const isEditing     = ref(false)
const savingForm    = ref(false)
const selectedUser  = ref(null)

const formData = reactive({ name: '', email: '', password: '', role: 'user' })
const formErrors = reactive({ name: '', email: '', password: '' })

const showDeleteModal = ref(false)
const deleting        = ref(false)

const filteredUsers = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return users.value
  return users.value.filter(
    (u) =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
  )
})

function initials(name = '') {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

function resetForm() {
  formData.name     = ''
  formData.email    = ''
  formData.password = ''
  formData.role     = 'user'
  formErrors.name     = ''
  formErrors.email    = ''
  formErrors.password = ''
}

function validateForm() {
  let valid = true
  formErrors.name     = ''
  formErrors.email    = ''
  formErrors.password = ''

  if (!formData.name.trim()) {
    formErrors.name = 'El nombre es requerido.'
    valid = false
  }
  if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    formErrors.email = 'Ingresa un correo válido.'
    valid = false
  }
  if (!isEditing.value && !formData.password) {
    formErrors.password = 'La contraseña es requerida.'
    valid = false
  }

  return valid
}

async function loadUsers() {
  loading.value = true
  try {
    users.value = await usuariosService.getAll()
  } catch {
    toast.error('Error al cargar los usuarios.')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  isEditing.value    = false
  selectedUser.value = null
  resetForm()
  showFormModal.value = true
}

function openEdit(user) {
  isEditing.value    = true
  selectedUser.value = user
  formData.name     = user.name
  formData.email    = user.email
  formData.password = ''
  formData.role     = user.role || 'user'
  formErrors.name = formErrors.email = formErrors.password = ''
  showFormModal.value = true
}

function openDelete(user) {
  selectedUser.value  = user
  showDeleteModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  resetForm()
}

async function saveUser() {
  if (!validateForm()) return

  savingForm.value = true
  try {
    const payload = {
      name:     formData.name,
      email:    formData.email,
      role:     formData.role,
      ...(formData.password && { password: formData.password })
    }

    if (isEditing.value) {
      const updated = await usuariosService.update(selectedUser.value.id, payload)
      const idx = users.value.findIndex((u) => u.id === updated.id)
      if (idx !== -1) users.value[idx] = updated
      toast.success(`Usuario "${updated.name}" actualizado correctamente.`)
    } else {
      const created = await usuariosService.create(payload)
      users.value.unshift(created)
      toast.success(`Usuario "${created.name}" creado exitosamente.`)
    }

    closeFormModal()
  } catch {
    toast.error('Error al guardar el usuario. Intenta de nuevo.')
  } finally {
    savingForm.value = false
  }
}

async function confirmDelete() {
  deleting.value = true
  try {
    await usuariosService.remove(selectedUser.value.id)
    users.value = users.value.filter((u) => u.id !== selectedUser.value.id)
    toast.success(`Usuario "${selectedUser.value.name}" eliminado.`)
    showDeleteModal.value = false
  } catch {
    toast.error('Error al eliminar el usuario.')
  } finally {
    deleting.value = false
  }
}

onMounted(loadUsers)
</script>
