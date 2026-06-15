import api from "../api/api"
import { Order } from "../types"

export interface CreateOrderResponse {
  success: boolean
  razorpayOrderId: string
  amount: number
  currency: string
  orderId?: string
  key: string
}

export const createRazorpayOrder = async (
  orderId: string
): Promise<CreateOrderResponse> => {
  const response = await api.post("/payments/create-order", { orderId })
  return response.data
}

export const verifyPayment = async (data: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}): Promise<{ success: boolean; message: string; order: Order }> => {
  const response = await api.post("/payments/verify", data)
  return response.data
}
