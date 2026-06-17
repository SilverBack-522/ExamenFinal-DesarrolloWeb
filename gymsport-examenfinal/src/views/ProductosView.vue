<template>
  <div>
   
    <div class="page-header">
      <h2><i class="bi bi-box-seam-fill"></i> Productos</h2>
      <div class="d-flex gap-2 align-items-center">
       
        <div class="btn-group btn-group-sm">
          <button
            class="btn"
            :class="viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'"
            @click="viewMode = 'table'"
          >
            <i class="bi bi-table"></i>
          </button>
          <button
            class="btn"
            :class="viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'"
            @click="viewMode = 'grid'"
          >
            <i class="bi bi-grid-3x3-gap"></i>
          </button>
        </div>
       <button v-if="isAdmin" class="btn btn-primary" @click="openCreate">
  <i class="bi bi-plus-circle me-1"></i>
  Nuevo producto
</button>
      </div>
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
                placeholder="Buscar producto..."
              />
            </div>
          </div>
          <div class="col-md-3">
            <select v-model="filterCategory" class="form-select form-select-sm">
              <option value="">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="col-auto ms-md-auto">
            <span class="badge bg-success bg-opacity-10 text-success" style="font-size:0.8rem">
              {{ filteredProducts.length }} producto(s)
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="spinner-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="!filteredProducts.length" class="empty-state">
      <div><i class="bi bi-box-seam"></i></div>
      <p class="mb-1 fw-semibold">Sin productos registrados</p>
      <p style="font-size:0.82rem">Crea el primero haciendo clic en "Nuevo producto"</p>
    </div>


    <div v-else-if="viewMode === 'table'" class="card">
      <div class="card-header">
        <i class="bi bi-table text-success"></i>
        Catálogo de productos
      </div>
      <div class="table-responsive">
        <table class="table mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, idx) in filteredProducts" :key="product.id">
              <td class="text-muted" style="width:50px">{{ idx + 1 }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div
                    style="
                      width:32px; height:32px; border-radius:8px;
                      background:var(--primary-light);
                      display:flex; align-items:center;
                      justify-content:center; font-size:1rem;
                    "
                  >
                    {{ categoryEmoji(product.category) }}
                  </div>
                  <div>
                    <div class="fw-semibold" style="font-size:0.875rem">{{ product.name }}</div>
                    <div class="text-muted" style="font-size:0.75rem">
                      {{ truncate(product.description, 40) }}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge bg-secondary bg-opacity-10 text-secondary">
                  {{ product.category || '—' }}
                </span>
              </td>
              <td class="fw-semibold text-primary">${{ Number(product.price).toLocaleString() }}</td>
              <td>
                <span
                  class="badge"
                  :class="
                    Number(product.stock) > 10
                      ? 'bg-success bg-opacity-10 text-success'
                      : Number(product.stock) > 0
                      ? 'bg-warning bg-opacity-10 text-warning'
                      : 'bg-danger bg-opacity-10 text-danger'
                  "
                >
                  {{ product.stock }} uds.
                </span>
              </td>
              <td class="text-center">
                <div class="d-flex gap-1 justify-content-center">
                  <button
  v-if="isAdmin"
  class="btn btn-outline-primary btn-icon"
  title="Editar"
  @click="openEdit(product)"
>
  <i class="bi bi-pencil-fill"></i>
</button>
<button
  v-if="isAdmin"
  class="btn btn-outline-danger btn-icon"
  title="Eliminar"
  @click="openDelete(product)"
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


    <div v-else class="row g-3">
  <div
    v-for="product in filteredProducts"
    :key="product.id"
    class="col-sm-6 col-lg-4 col-xl-3"
  >
    <div class="product-card">
      <div class="product-card-img">
  <img
    v-if="product.image && product.image.length > 0"
    :src="product.image"
    :alt="product.name"
    style="width:100%; height:160px; object-fit:cover; display:block;"
    @error="(e) => e.target.style.display='none'"
  />
  <span v-else style="font-size:3rem;">{{ categoryEmoji(product.category) }}</span>
</div>
          <div class="product-card-body">
            <div class="d-flex justify-content-between align-items-start mb-1">
              <h6 class="mb-0 fw-bold" style="font-size:0.875rem">{{ product.name }}</h6>
              <span class="badge bg-secondary bg-opacity-10 text-secondary ms-1" style="font-size:0.7rem">
                {{ product.category }}
              </span>
            </div>
            <p class="text-muted mb-2" style="font-size:0.78rem">
              {{ truncate(product.description, 60) }}
            </p>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="product-price">${{ Number(product.price).toLocaleString() }}</span>
              <span class="product-stock">
                <i class="bi bi-box me-1"></i>{{ product.stock }} uds
              </span>
            </div>
           <div v-if="isAdmin" class="d-flex gap-1">
  <button
    class="btn btn-outline-primary btn-sm flex-fill"
    @click="openEdit(product)"
  >
    <i class="bi bi-pencil-fill me-1"></i>Editar
  </button>
  <button
    class="btn btn-outline-danger btn-sm"
    @click="openDelete(product)"
  >
    <i class="bi bi-trash-fill"></i>
  </button>
</div>
          </div>
        </div>
      </div>
    </div>


    <div
      v-if="showFormModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0,0,0,0.5)"
      @click.self="closeFormModal"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="isEditing ? 'bi bi-pencil-square' : 'bi bi-plus-circle-fill'" class="me-2"></i>
              {{ isEditing ? 'Editar producto' : 'Nuevo producto' }}
            </h5>
            <button class="btn-close" @click="closeFormModal"></button>
          </div>

          <div class="modal-body">
            <div class="row g-3">

              <div class="col-md-6">
                <label class="form-label">
                  <i class="bi bi-tag me-1"></i>Nombre del producto
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.name }"
                  placeholder="Ej: Laptop Pro 15"
                />
                <div class="invalid-feedback">{{ formErrors.name }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">
                  <i class="bi bi-grid me-1"></i>Categoría
                </label>
                <input
                  v-model="formData.category"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.category }"
                  list="categories-list"
                  placeholder="Ej: Electrónica"
                />
                <datalist id="categories-list">
                  <option v-for="cat in categories" :key="cat" :value="cat" />
                </datalist>
                <div class="invalid-feedback">{{ formErrors.category }}</div>
              </div>

              <div class="col-12">
                <label class="form-label">
                  <i class="bi bi-card-text me-1"></i>Descripción
                </label>
                <textarea
                  v-model="formData.description"
                  class="form-control"
                  rows="2"
                  placeholder="Descripción breve del producto..."
                ></textarea>
              </div>

              <div class="col-md-6">
                <label class="form-label">
                  <i class="bi bi-currency-dollar me-1"></i>Precio (USD)
                </label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input
                    v-model="formData.price"
                    type="number"
                    min="0"
                    step="0.01"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.price }"
                    placeholder="0.00"
                  />
                  <div class="invalid-feedback">{{ formErrors.price }}</div>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">
                  <i class="bi bi-box me-1"></i>Stock (unidades)
                </label>
                <input
                  v-model="formData.stock"
                  type="number"
                  min="0"
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.stock }"
                  placeholder="0"
                />
                <div class="invalid-feedback">{{ formErrors.stock }}</div>
              </div>
              <!-- URL imagen -->
<div class="col-12">
  <label class="form-label">
    <i class="bi bi-image me-1"></i>URL de imagen (opcional)
  </label>
  <input
    v-model="formData.image"
    type="text"
    class="form-control"
    placeholder="https://ejemplo.com/imagen.jpg"
  />
  <div v-if="formData.image" class="mt-2">
    <img
      :src="formData.image"
      style="height:80px; border-radius:8px; object-fit:cover; border:1px solid var(--border);"
      @error="(e) => e.target.style.display='none'"
    />
  </div>
</div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeFormModal">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button class="btn btn-primary" :disabled="savingForm" @click="saveProduct">
              <span v-if="savingForm" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-check-circle me-1"></i>
              {{ isEditing ? 'Guardar cambios' : 'Crear producto' }}
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
              Eliminar producto
            </h5>
            <button class="btn-close" @click="showDeleteModal = false"></button>
          </div>

          <div class="modal-body pt-2">
            <div class="danger-zone">
              <div><i class="bi bi-trash3-fill"></i></div>
              <p class="mb-1 fw-semibold">¿Confirmar eliminación?</p>
              <p class="mb-0" style="font-size:0.82rem;color:var(--gray)">
                El producto <strong>{{ selectedProduct?.name }}</strong> será eliminado
                permanentemente.
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
import productosService from '@/services/productosService'

const toast = inject('toast')
import authService from '../services/authService'
const currentUser = authService.getUser()
const isAdmin = computed(() => currentUser?.role === 'admin')


const products       = ref([])
const loading        = ref(true)
const search         = ref('')
const filterCategory = ref('')
const viewMode       = ref('table')

const showFormModal  = ref(false)
const isEditing      = ref(false)
const savingForm     = ref(false)
const selectedProduct = ref(null)

const formData = reactive({
  name: '', description: '', price: '', stock: '', category: '', image: ''
})
const formErrors = reactive({
  name: '', price: '', stock: '', category: ''
})


const showDeleteModal = ref(false)
const deleting        = ref(false)


const categories = computed(() => [
  ...new Set(products.value.map((p) => p.category).filter(Boolean))
])

const filteredProducts = computed(() => {
  let list = products.value
  const q = search.value.toLowerCase()
  if (q) {
    list = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    )
  }
  if (filterCategory.value) {
    list = list.filter((p) => p.category === filterCategory.value)
  }
  return list
})


function truncate(str = '', len = 50) {
  return str.length > len ? str.slice(0, len) + '…' : str
}

function categoryEmoji(cat = '') {
  const map = {
    electrónica: '💻', electronica: '💻',
    ropa: '👕', alimentos: '🥗',
    hogar: '🏠', deportes: '⚽',
    libros: '📚', juguetes: '🎲',
    salud: '💊', default: '📦'
  }
  return map[cat.toLowerCase()] || map.default
}

function resetForm() {
  formData.name = formData.description = formData.price = ''
  formData.stock = formData.category = formData.image = ''
}  

function validateForm() {
  let valid = true
  formErrors.name = formErrors.price = formErrors.stock = formErrors.category = ''

  if (!formData.name.trim()) {
    formErrors.name = 'El nombre es requerido.'
    valid = false
  }
  if (!formData.category.trim()) {
    formErrors.category = 'La categoría es requerida.'
    valid = false
  }
  if (formData.price === '' || Number(formData.price) < 0) {
    formErrors.price = 'Ingresa un precio válido.'
    valid = false
  }
  if (formData.stock === '' || Number(formData.stock) < 0) {
    formErrors.stock = 'Ingresa un stock válido.'
    valid = false
  }

  return valid
}


async function loadProducts() {
  loading.value = true
  try {
    products.value = await productosService.getAll()
  } catch {
    toast.error('Error al cargar los productos.')
  } finally {
    loading.value = false
  }
}


function openCreate() {
  isEditing.value      = false
  selectedProduct.value = null
  resetForm()
  showFormModal.value = true
}

function openEdit(product) {
  isEditing.value       = true
  selectedProduct.value = product
  formData.name         = product.name
  formData.description  = product.description || ''
  formData.price        = product.price
  formData.stock        = product.stock
  formData.category     = product.category || ''
  formData.image        = product.image || ''
  formErrors.name = formErrors.price = formErrors.stock = formErrors.category = ''
  showFormModal.value   = true
}

function openDelete(product) {
  selectedProduct.value = product
  showDeleteModal.value  = true
}

function closeFormModal() {
  showFormModal.value = false
  resetForm()
}


async function saveProduct() {
  if (!validateForm()) return

  savingForm.value = true
  try {
    const payload = {
      name:        formData.name,
      description: formData.description,
      price:       Number(formData.price),
      stock:       Number(formData.stock),
      category:    formData.category,
      image:       formData.image
    }

    if (isEditing.value) {
      const updated = await productosService.update(selectedProduct.value.id, payload)
      const idx = products.value.findIndex((p) => p.id === updated.id)
      if (idx !== -1) products.value[idx] = updated
      toast.success(`Producto "${updated.name}" actualizado correctamente.`)
    } else {
      const created = await productosService.create(payload)
      products.value.unshift(created)
      toast.success(`Producto "${created.name}" creado exitosamente.`)
    }

    closeFormModal()
  } catch {
    toast.error('Error al guardar el producto. Intenta de nuevo.')
  } finally {
    savingForm.value = false
  }
}

async function confirmDelete() {
  deleting.value = true
  try {
    await productosService.remove(selectedProduct.value.id)
    products.value = products.value.filter((p) => p.id !== selectedProduct.value.id)
    toast.success(`Producto "${selectedProduct.value.name}" eliminado.`)
    showDeleteModal.value = false
  } catch {
    toast.error('Error al eliminar el producto.')
  } finally {
    deleting.value = false
  }
}


onMounted(loadProducts)
</script>
