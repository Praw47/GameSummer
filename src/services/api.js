import axios from 'axios'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'
    : '')

if (!API_BASE) {
  throw new Error('VITE_API_BASE_URL must be configured for production builds.')
}

if (import.meta.env.PROD && !API_BASE.startsWith('https://')) {
  throw new Error('VITE_API_BASE_URL must use HTTPS in production.')
}

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
