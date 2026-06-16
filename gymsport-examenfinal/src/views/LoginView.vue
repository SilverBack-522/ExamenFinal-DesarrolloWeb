<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <i class="bi bi-lightning-charge-fill"></i>
      </div>

      <h2 class="mb-1">GYMSPORT</h2>
      <p class="mb-4">Ingresa tus credenciales para continuar</p>

      <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center gap-2 mb-3">
        <i class="bi bi-exclamation-triangle-fill"></i>
        {{ errorMsg }}
      </div>

      <div>
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-envelope me-1"></i>Correo electrónico
          </label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            placeholder="correo@ejemplo.com"
            @keyup.enter="handleLogin"
          />
          <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
        </div>

        <div class="mb-4">
          <label class="form-label">
            <i class="bi bi-lock me-1"></i>Contraseña
          </label>
          <div class="input-group">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              placeholder="••••••••"
              @keyup.enter="handleLogin"
            />
            <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
          </div>
        </div>

        <button
          class="btn btn-primary w-100"
          style="padding: 11px;"
          :disabled="loading"
          @click="handleLogin"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-box-arrow-in-right me-2"></i>
          {{ loading ? 'Verificando...' : 'Iniciar sesión' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'

const router = useRouter()
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const errorMsg = ref('')
const loading = ref(false)
const showPassword = ref(false)

function validate() {
  let valid = true
  errors.email = ''
  errors.password = ''
  if (!form.email) { errors.email = 'El correo es requerido.'; valid = false }
  if (!form.password) { errors.password = 'La contraseña es requerida.'; valid = false }
  return valid
}

async function handleLogin() {
  errorMsg.value = ''
  if (!validate()) return
  loading.value = true
  try {
    await authService.login(form.email, form.password)
    router.push({ path: '/dashboard' })
  } catch (err) {
    errorMsg.value = err.message || 'Error al iniciar sesión.'
  } finally {
    loading.value = false
  }
}
</script>