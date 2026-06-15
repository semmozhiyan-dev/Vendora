import api from "../api/api"
import { Product, Order, User, PaginatedResponse } from "../types"

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: any[]
}

export const getDashboard = async (): Promise<{ success: boolean; data: DashboardStats }> => {
  const res = await api.get("/admin/dashboard")
  return res.data
}

export const getAdminProducts = async (
  page = 1, limit = 20
): Promise<{ success: boolean; data: Product[]; pagination: { total: number; page: number; limit: number } }> => {
  const res = await api.get("/admin/products", { params: { page, limit } })
  return res.data
}

export const createAdminProduct = async (data: {
  name: string; price: number; stock?: number; description?: string; category?: string; image?: string
}): Promise<{ success: boolean; data: Product }> => {
  const res = await api.post("/admin/products", data)
  return res.data
}

export const updateAdminProduct = async (
  id: string, data: Partial<{ name: string; price: number; stock: number; description: string; category: string; image: string }>
): Promise<{ success: boolean; data: Product }> => {
  const res = await api.put(`/admin/products/${id}`, data)
  return res.data
}

export const deleteAdminProduct = async (id: string): Promise<{ success: boolean; data: Product }> => {
  const res = await api.delete(`/admin/products/${id}`)
  return res.data
}

export const getAdminOrders = async (
  page = 1, limit = 20
): Promise<{ success: boolean; data: Order[]; pagination: { total: number; page: number; limit: number } }> => {
  const res = await api.get("/admin/orders", { params: { page, limit } })
  return res.data
}

export const updateOrderStatus = async (
  orderId: string, status: string
): Promise<{ success: boolean; data: Order }> => {
  const res = await api.put(`/admin/orders/${orderId}/status`, { status })
  return res.data
}

export const getAdminUsers = async (
  page = 1, limit = 20
): Promise<{ success: boolean; data: User[]; pagination: { total: number; page: number; limit: number } }> => {
  const res = await api.get("/admin/users", { params: { page, limit } })
  return res.data
}

export const updateUserRole = async (
  userId: string, role: string
): Promise<{ success: boolean; data: User }> => {
  const res = await api.put(`/admin/users/${userId}/role`, { role })
  return res.data
}

export const deleteUser = async (userId: string): Promise<{ success: boolean; data: User }> => {
  const res = await api.delete(`/admin/users/${userId}`)
  return res.data
}
