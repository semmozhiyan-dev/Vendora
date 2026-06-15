import api from "../api/api"
import { Order, PaginatedResponse } from "../types"

export const createOrder = async (data?: {
  shippingAddress?: Record<string, string>
  items?: { productId: string; quantity: number }[]
}): Promise<{ success: boolean; order: Order }> => {
  const response = await api.post("/orders", data || {})
  return response.data
}

export const getMyOrders = async (
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Order>> => {
  const response = await api.get("/orders/my", { params: { page, limit } })
  return response.data
}

export const getOrderById = async (id: string): Promise<{ success: boolean; order: Order }> => {
  const response = await api.get(`/orders/${id}`)
  return response.data
}

export const getOrderTracking = async (
  id: string
): Promise<{ success: boolean; tracking: { orderId: string; status: string; trackingId?: string; estimatedDelivery?: string; timeline: { status: string; timestamp: string }[] } }> => {
  const response = await api.get(`/orders/${id}/tracking`)
  return response.data
}

export const cancelOrder = async (id: string): Promise<{ success: boolean; message: string; order: Order }> => {
  const response = await api.put(`/orders/${id}/cancel`)
  return response.data
}
