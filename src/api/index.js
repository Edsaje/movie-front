import axios from 'axios'

// 1. Instance Axios dédiée avec l'URL de base de l'API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2. Intercepteur de requête ("Péage automatique") :
// Injecte automatiquement le token JWT dans l'en-tête Authorization s'il existe dans le localStorage.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api

