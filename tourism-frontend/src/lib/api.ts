import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401, clear local auth state but do NOT forcibly
    // navigate from inside the interceptor. Let the UI layer decide how to
    // present the error (so components can show contextual messages instead
    // of a generic network error). We still logout locally to clear stale
    // tokens.
    if (error.response?.status === 401) {
      try {
        useAuthStore.getState().logout()
      } catch (e) {
        // ignore
      }
      // annotate the error so callers can detect an auth failure
      error.isAuthError = true
    }
    return Promise.reject(error)
  }
)

export default api
