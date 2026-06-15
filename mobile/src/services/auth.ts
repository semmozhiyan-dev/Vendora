import api from "../api/api"
import { AuthResponse, User } from "../types"

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", { email, password })
  return response.data
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", { name, email, password })
  return response.data
}

export const getProfile = async (): Promise<{ success: boolean; data: User }> => {
  const response = await api.get("/users/profile")
  return response.data
}

export const updateProfile = async (data: { name?: string; phone?: string }): Promise<{ success: boolean; data: User }> => {
  const response = await api.put("/users/profile", data)
  return response.data
}

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put("/users/change-password", { currentPassword, newPassword })
  return response.data
}

export const updatePreferences = async (
  emailNotifications: boolean
): Promise<{ success: boolean; data: { emailNotifications: boolean } }> => {
  const response = await api.put("/users/preferences", { emailNotifications })
  return response.data
}

export const getAddresses = async (): Promise<{ success: boolean; data: import("../types").Address[] }> => {
  const response = await api.get("/users/addresses")
  return response.data
}

export const addAddress = async (
  address: Omit<import("../types").Address, "_id">
): Promise<{ success: boolean; data: import("../types").Address }> => {
  const response = await api.post("/users/addresses", address)
  return response.data
}

export const updateAddress = async (
  id: string,
  address: Partial<import("../types").Address>
): Promise<{ success: boolean; data: import("../types").Address }> => {
  const response = await api.put(`/users/addresses/${id}`, address)
  return response.data
}

export const deleteAddress = async (
  id: string
): Promise<{ success: boolean; data: import("../types").Address[] }> => {
  const response = await api.delete(`/users/addresses/${id}`)
  return response.data
}
