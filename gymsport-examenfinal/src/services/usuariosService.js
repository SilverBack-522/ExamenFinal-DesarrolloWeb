
import api from './api'

const RESOURCE = '/usuarios'

const usuariosService = {

  getAll() {
    return api.get(RESOURCE).then((r) => r.data)
  },


  getById(id) {
    return api.get(`${RESOURCE}/${id}`).then((r) => r.data)
  },


  create(usuario) {
    return api.post(RESOURCE, usuario).then((r) => r.data)
  },

  update(id, datos) {
    return api.put(`${RESOURCE}/${id}`, datos).then((r) => r.data)
  },

  remove(id) {
    return api.delete(`${RESOURCE}/${id}`).then((r) => r.data)
  }
}

export default usuariosService
