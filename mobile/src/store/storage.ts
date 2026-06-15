import { Platform } from "react-native"
import * as SecureStore from "expo-secure-store"

const TOKEN_KEY = "vendora_token"
const USER_KEY = "vendora_user"

const isWeb = Platform.OS === "web"

const getItem = async (key: string): Promise<string | null> => {
  if (isWeb) return localStorage.getItem(key)
  return await SecureStore.getItemAsync(key)
}

const setItem = async (key: string, value: string): Promise<void> => {
  if (isWeb) localStorage.setItem(key, value)
  else await SecureStore.setItemAsync(key, value)
}

const deleteItem = async (key: string): Promise<void> => {
  if (isWeb) localStorage.removeItem(key)
  else await SecureStore.deleteItemAsync(key)
}

export const getToken = async (): Promise<string | null> => {
  try {
    return await getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setToken = async (token: string): Promise<void> => {
  await setItem(TOKEN_KEY, token)
}

export const removeToken = async (): Promise<void> => {
  await deleteItem(TOKEN_KEY)
}

export const getStoredUser = async (): Promise<string | null> => {
  try {
    return await getItem(USER_KEY)
  } catch {
    return null
  }
}

export const setStoredUser = async (user: string): Promise<void> => {
  await setItem(USER_KEY, user)
}

export const removeStoredUser = async (): Promise<void> => {
  await deleteItem(USER_KEY)
}

export const clearAuth = async (): Promise<void> => {
  await deleteItem(TOKEN_KEY)
  await deleteItem(USER_KEY)
}
