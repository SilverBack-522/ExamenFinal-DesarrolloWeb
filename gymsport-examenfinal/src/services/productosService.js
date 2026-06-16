
import api from './api'

const RESOURCE = '/productos'

const productosService = {
  
  getAll() {
    return api.get(RESOURCE).then((r) => r.data)
  },

  
  getById(id) {
    return api.get(`${RESOURCE}/${id}`).then((r) => r.data)
  },

 
  create(producto) {
    return api.post(RESOURCE, producto).then((r) => r.data)
  },

  
  update(id, datos) {
    return api.put(`${RESOURCE}/${id}`, datos).then((r) => r.data)
  },

  /** Elimina un producto por ID */
  remove(id) {
    return api.delete(`${RESOURCE}/${id}`).then((r) => r.data)
  }
}

export default productosService
