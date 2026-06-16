import axios from 'axios'

const BASE_URL = 'https://6a30ac99a7f8866418d64877.mockapi.io'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
})

export default api