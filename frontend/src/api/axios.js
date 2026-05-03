import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000/api"
})

// ✅ Ajoute automatiquement le token JWT dans chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ✅ Si token expiré (401), renvoie vers /login automatiquement
// ✅ SAUF si c'est la route de login elle-même (sinon les states sont perdus)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = error.config?.url?.includes("/auth/login")
    if (error.response?.status === 401 && !isLoginRoute) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default API