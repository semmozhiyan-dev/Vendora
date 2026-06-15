import axios from "axios"
import { API_BASE_URL } from "../constants/api"
import { getToken } from "../store/storage"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use(
  async (config) => {
    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const data = error.response.data
      let msg = data?.message || "Something went wrong"
      if (data?.errors?.length) {
        msg += ": " + data.errors.join("; ")
      }
      return Promise.reject(new Error(msg))
    }
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timed out"))
    }
    return Promise.reject(new Error("Network error"))
  }
)

export default api
