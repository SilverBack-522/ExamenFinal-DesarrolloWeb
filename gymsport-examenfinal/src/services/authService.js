
import api from './api'

const TOKEN_KEY = 'auth_token'
const USER_KEY  = 'auth_user'

const authService = {

  async login(email, password) {
  // Limpia sesión anterior antes de iniciar nueva
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)

  const { data: users } = await api.get('/usuarios')

  const user = users.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) {
    throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.')
  }

  const token = btoa(`${user.id}:${user.email}:${Date.now()}`)
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))

  return user
},


  logout() {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
  },


  isAuthenticated() {
    return !!sessionStorage.getItem(TOKEN_KEY)
  },


  getUser() {
    const raw = sessionStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  }
}

export default authService
