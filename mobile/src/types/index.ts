export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: "user" | "admin"
  addresses: Address[]
  preferences: { emailNotifications: boolean }
  createdAt: string
  updatedAt: string
}

export interface Address {
  _id: string
  fullName: string
  phone: string
  addressLine: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  category?: string
  image?: string
  rating: number
  isActive: boolean
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  _id: string
  user: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "SHIPPED"
  | "DELIVERED"

export interface TimelineEntry {
  status: OrderStatus
  timestamp: string
}

export interface OrderItem {
  product: Product
  quantity: number
  price: number
}

export interface Order {
  _id: string
  user: string
  items: OrderItem[]
  totalAmount: number
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  paidAt?: string
  status: OrderStatus
  timeline: TimelineEntry[]
  trackingId?: string
  estimatedDelivery?: string
  shippingAddress?: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface ApiError {
  success: false
  message: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  success: boolean
  items: T[]
  page: number
  limit: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  [key: string]: unknown
}
