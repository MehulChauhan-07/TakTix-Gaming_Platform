"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthService } from "../services/auth.service"

type User = {
  id: string
  username: string
  email: string
  profilePicture?: string | null
}

type AuthContextType = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          try {
            const userData = await AuthService.getUser()
            setUser(userData.user)
          } catch (error) {
            // Invalid token or API error
            localStorage.removeItem("token")
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { user, token } = await AuthService.login(email, password)
      localStorage.setItem("token", token)
      setUser(user)
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true)
    try {
      const { user, token } = await AuthService.register(username, email, password)
      localStorage.setItem("token", token)
      setUser(user)
      navigate("/dashboard")
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
      navigate("/")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

