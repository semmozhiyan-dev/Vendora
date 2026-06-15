import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { User } from "../types"
import { getToken, setToken, removeToken, getStoredUser, setStoredUser, removeStoredUser, clearAuth } from "./storage"
import api from "../api/api"

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (token: string, user: User) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restore = async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([getToken(), getStoredUser()])
        if (savedToken && savedUser) {
          setTokenState(savedToken)
          setUser(JSON.parse(savedUser))
        }
      } catch {
        await clearAuth()
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  const login = useCallback(async (newToken: string, newUser: User) => {
    await Promise.all([setToken(newToken), setStoredUser(JSON.stringify(newUser))])
    setTokenState(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(async () => {
    await clearAuth()
    setTokenState(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser)
    setStoredUser(JSON.stringify(updatedUser))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
