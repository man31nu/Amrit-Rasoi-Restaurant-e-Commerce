import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('rxUser')
  if (stored) {
    const user = JSON.parse(stored) as { token: string }
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

export default api
