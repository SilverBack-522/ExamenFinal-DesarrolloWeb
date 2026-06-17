<template>
  <div style="min-height:100vh; background:var(--dark); color:var(--text)">

    <!-- Navbar tienda -->
    <nav style="background:var(--dark2); border-bottom:1px solid var(--border); padding:16px 28px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:50;">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.8rem">🏋️</span>
        <span style="font-family:'Barlow Condensed',sans-serif; font-size:1.8rem; font-weight:900; color:var(--primary); letter-spacing:2px;">GYMSPORT</span>
      </div>
      <div style="display:flex; align-items:center; gap:16px;">
        <span style="font-size:0.85rem; color:var(--gray)">Hola, {{ currentUser?.name }}</span>
        <button class="btn btn-outline-secondary btn-sm" @click="handleLogout">
          <i class="bi bi-box-arrow-right me-1"></i>Salir
        </button>
        <button class="btn btn-primary position-relative" @click="showCart = true">
          <i class="bi bi-cart-fill me-1"></i>Carrito
          <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {{ cartCount }}
          </span>
        </button>
      </div>
    </nav>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg, #111 0%, #1a1a1a 100%); padding:60px 28px; text-align:center; border-bottom:1px solid var(--border);">
      <h1 style="font-family:'Barlow Condensed',sans-serif; font-size:3.5rem; font-weight:900; text-transform:uppercase; letter-spacing:3px; color:var(--text);">
        ENTRENA SIN <span style="color:var(--primary)">LÍMITES</span>
      </h1>
      <p style="color:var(--gray); font-size:1rem; margin-top:8px;">Equipamiento y ropa deportiva de alto rendimiento</p>
    </div>

    <!-- Filtros -->
    <div style="padding:20px 28px; background:var(--dark2); border-bottom:1px solid var(--border);">
      <div class="row g-2 align-items-center">
        <div class="col-md-5">
          <div class="search-bar">
            <i class="bi bi-search"></i>
            <input v-model="search" type="text" class="form-control" placeholder="Buscar productos..." />
          </div>
        </div>
        <div class="col-md-3">
          <select v-model="filterCategory" class="form-select">
            <option value="">Todas las categorías</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div class="col-auto ms-md-auto">
          <span style="font-size:0.82rem; color:var(--gray)">{{ filteredProducts.length }} productos</span>
        </div>
      </div>
    </div>

    <!-- Productos -->
    <div style="padding:28px;">
      <div v-if="loading" class="spinner-overlay">
        <div class="spinner-border" role="status"></div>
      </div>

      <div v-else-if="!filteredProducts.length" class="empty-state">
        <i class="bi bi-box-seam"></i>
        <p>No hay productos disponibles</p>
      </div>

      <div v-else class="row g-4">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="col-sm-6 col-lg-4 col-xl-3"
        >
          <div class="product-card" style="cursor:pointer;">
            <!-- Imagen -->
            <div class="product-card-img">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                style="width:100%; height:100%; object-fit:cover;"
                @error="(e) => e.target.style.display='none'"
              />
              <span v-else>{{ categoryEmoji(product.category) }}</span>
            </div>

            <div class="product-card-body">
              <span class="badge bg-secondary bg-opacity-10 text-secondary mb-1" style="font-size:0.7rem;">
                {{ product.category }}
              </span>
              <h6 style="font-weight:700; margin:4px 0;">{{ product.name }}</h6>
              <p style="font-size:0.78rem; color:var(--gray); margin-bottom:10px;">
                {{ truncate(product.description, 60) }}
              </p>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="product-price">${{ Number(product.price).toLocaleString() }}</span>
                <span style="font-size:0.75rem; color:var(--gray);">
                  <i class="bi bi-box me-1"></i>{{ product.stock }} disponibles
                </span>
              </div>
              <button
                class="btn btn-primary w-100"
                :disabled="Number(product.stock) === 0"
                @click="addToCart(product)"
              >
                <i class="bi bi-cart-plus me-1"></i>
                {{ Number(product.stock) === 0 ? 'Sin stock' : 'Agregar al carrito' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── CARRITO (panel lateral) ── -->
    <div v-if="showCart" style="position:fixed; inset:0; z-index:200; display:flex; justify-content:flex-end;">
      <!-- Overlay -->
      <div style="position:absolute; inset:0; background:rgba(0,0,0,0.6);" @click="showCart = false"></div>

      <!-- Panel -->
      <div style="position:relative; width:380px; max-width:100%; background:var(--dark2); border-left:1px solid var(--border); display:flex; flex-direction:column; height:100vh; overflow:hidden;">

        <!-- Header carrito -->
        <div style="padding:20px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between;">
          <h5 style="margin:0; font-family:'Barlow Condensed',sans-serif; letter-spacing:1px;">
            <i class="bi bi-cart-fill me-2" style="color:var(--primary)"></i>
            MI CARRITO
          </h5>
          <button class="btn-close btn-close-white" @click="showCart = false"></button>
        </div>

        <!-- Items -->
        <div style="flex:1; overflow-y:auto; padding:16px;">
          <div v-if="cart.length === 0" class="empty-state">
            <i class="bi bi-cart-x"></i>
            <p>Tu carrito está vacío</p>
          </div>

          <div v-for="item in cart" :key="item.id" style="display:flex; gap:12px; padding:12px 0; border-bottom:1px solid var(--border);">
            <!-- Imagen mini -->
            <div style="width:60px; height:60px; border-radius:8px; overflow:hidden; background:var(--dark3); flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
              <img v-if="item.image" :src="item.image" style="width:100%; height:100%; object-fit:cover;" />
              <span v-else>{{ categoryEmoji(item.category) }}</span>
            </div>

            <div style="flex:1;">
              <div style="font-weight:600; font-size:0.875rem;">{{ item.name }}</div>
              <div style="color:var(--primary); font-weight:700; font-size:0.9rem;">${{ Number(item.price).toLocaleString() }}</div>
              <!-- Cantidad -->
              <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
                <button class="btn btn-outline-secondary btn-sm" style="width:28px; height:28px; padding:0;" @click="decreaseQty(item)">
                  <i class="bi bi-dash"></i>
                </button>
                <span style="font-weight:600; min-width:20px; text-align:center;">{{ item.qty }}</span>
                <button class="btn btn-outline-secondary btn-sm" style="width:28px; height:28px; padding:0;" @click="increaseQty(item)">
                  <i class="bi bi-plus"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm ms-auto" style="width:28px; height:28px; padding:0;" @click="removeFromCart(item)">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer carrito -->
        <div style="padding:16px; border-top:1px solid var(--border);">
          <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
            <span style="color:var(--gray);">Subtotal ({{ cartCount }} items)</span>
            <span style="font-weight:700; font-size:1.1rem; color:var(--primary);">${{ cartTotal.toLocaleString() }}</span>
          </div>
          <button class="btn btn-primary w-100" style="padding:12px;" :disabled="cart.length === 0" @click="checkout">
            <i class="bi bi-lightning-charge-fill me-1"></i>
            Finalizar compra
          </button>
          <button class="btn btn-outline-secondary w-100 mt-2" @click="clearCart" :disabled="cart.length === 0">
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>

    <!-- Modal checkout -->
    <div v-if="showCheckout" class="modal fade show d-block" style="background:rgba(0,0,0,0.6);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              ¡Compra realizada!
            </h5>
          </div>
          <div class="modal-body text-center" style="padding:30px;">
            <div style="font-size:3rem; margin-bottom:16px;">🎉</div>
            <h5>¡Gracias, {{ currentUser?.name }}!</h5>
            <p style="color:var(--gray);">Tu pedido por <strong style="color:var(--primary)">${{ cartTotal.toLocaleString() }}</strong> ha sido recibido.</p>
            <p style="color:var(--gray); font-size:0.85rem;">Te contactaremos pronto para confirmar tu entrega.</p>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button class="btn btn-primary" @click="confirmCheckout">
              <i class="bi bi-house me-1"></i>Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'
import productosService from '../services/productosService'

const router = useRouter()
const currentUser = authService.getUser()

const products = ref([])
const loading = ref(true)
const search = ref('')
const filterCategory = ref('')
const showCart = ref(false)
const showCheckout = ref(false)
const cart = ref([])

const categories = computed(() => [
  ...new Set(products.value.map((p) => p.category).filter(Boolean))
])

const filteredProducts = computed(() => {
  let list = products.value
  const q = search.value.toLowerCase()
  if (q) list = list.filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
  if (filterCategory.value) list = list.filter(p => p.category === filterCategory.value)
  return list
})

const cartCount = computed(() => cart.value.reduce((sum, i) => sum + i.qty, 0))
const cartTotal = computed(() => cart.value.reduce((sum, i) => sum + i.price * i.qty, 0))

function truncate(str = '', len = 60) {
  return str.length > len ? str.slice(0, len) + '…' : str
}

function categoryEmoji(cat = '') {
  const map = { electrónica: '💻', ropa: '👕', alimentos: '🥗', hogar: '🏠', deportes: '⚽', default: '📦' }
  return map[cat.toLowerCase()] || map.default
}

function addToCart(product) {
  const existing = cart.value.find(i => i.id === product.id)
  if (existing) {
    existing.qty++
  } else {
    cart.value.push({ ...product, qty: 1 })
  }
  showCart.value = true
}

function increaseQty(item) { item.qty++ }
function decreaseQty(item) {
  if (item.qty > 1) item.qty--
  else removeFromCart(item)
}
function removeFromCart(item) {
  cart.value = cart.value.filter(i => i.id !== item.id)
}
function clearCart() { cart.value = [] }

function checkout() {
  showCart.value = false
  showCheckout.value = true
}

function confirmCheckout() {
  clearCart()
  showCheckout.value = false
}

function handleLogout() {
  authService.logout()
  router.push('/login')
}

onMounted(async () => {
  try {
    products.value = await productosService.getAll()
  } finally {
    loading.value = false
  }
})
</script>