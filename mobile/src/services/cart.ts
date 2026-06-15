import api from "../api/api"
import { Cart } from "../types"

export const getCart = async (): Promise<{ success: boolean; cart: Cart }> => {
  const response = await api.get("/cart")
  return response.data
}

export const addToCart = async (
  productId: string,
  quantity = 1
): Promise<{ success: boolean; cart: Cart }> => {
  const response = await api.post("/cart", { productId, quantity })
  return response.data
}

export const updateCartItem = async (
  productId: string,
  quantity: number
): Promise<{ success: boolean; cart: Cart }> => {
  const response = await api.put(`/cart/${productId}`, { quantity })
  return response.data
}

export const removeCartItem = async (
  productId: string
): Promise<{ success: boolean; cart: Cart }> => {
  const response = await api.delete(`/cart/${productId}`)
  return response.data
}

export const clearCart = async (): Promise<{ success: boolean; cart: Cart }> => {
  const response = await api.delete("/cart/clear")
  return response.data
}
