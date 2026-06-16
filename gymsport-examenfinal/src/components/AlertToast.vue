<template>

  <div class="alert-container">
    <transition-group name="toast">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="alert-toast"
        :class="alertClass(alert.type)"
      >
        <i :class="alertIcon(alert.type)" class="fs-5"></i>
        <span>{{ alert.message }}</span>
        <button
          class="btn-close btn-close-sm ms-auto"
          @click="remove(alert.id)"
          aria-label="Cerrar"
        ></button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'


const alerts = ref([])

function show(message, type = 'success', duration = 4000) {
  const id = Date.now() + Math.random()
  alerts.value.push({ id, message, type })

  if (duration > 0) {
    setTimeout(() => remove(id), duration)
  }
}


function remove(id) {
  alerts.value = alerts.value.filter((a) => a.id !== id)
}


function alertClass(type) {
  const map = {
    success: 'alert alert-success',
    danger:  'alert alert-danger',
    warning: 'alert alert-warning',
    info:    'alert alert-info'
  }
  return map[type] || map.info
}


function alertIcon(type) {
  const map = {
    success: 'bi bi-check-circle-fill text-success',
    danger:  'bi bi-x-circle-fill text-danger',
    warning: 'bi bi-exclamation-triangle-fill text-warning',
    info:    'bi bi-info-circle-fill text-info'
  }
  return map[type] || map.info
}


defineExpose({ show })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
