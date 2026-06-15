import * as SecureStore from "expo-secure-store"

const TOKEN_KEY = "vendora_token"
const USER_KEY = "vendora_user"

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}

export const getStoredUser = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(USER_KEY)
  } catch {
    return null
  }
}

export const setStoredUser = async (user: string): Promise<void> => {
  await SecureStore.setItemAsync(USER_KEY, user)
}

export const removeStoredUser = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(USER_KEY)
}

export const clearAuth = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
  await SecureStore.deleteItemAsync(USER_KEY)
}
