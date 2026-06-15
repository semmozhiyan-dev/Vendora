import api from "../api/api"
import { Product, PaginatedResponse } from "../types"

export const getProducts = async (
  page = 1,
  limit = 20
): Promise<PaginatedResponse<Product>> => {
  const response = await api.get("/products", { params: { page, limit } })
  return response.data
}

export const getProductById = async (id: string): Promise<{ success: boolean; product: Product }> => {
  const response = await api.get(`/products/${id}`)
  return response.data
}
