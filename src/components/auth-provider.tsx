"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

type User = {
  id: string
  username: string
  email: string
  profilePicture?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database for demo purposes
const mockUsers = new Map()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          // In a real app, you would verify the token with your backend
          // For demo purposes, we'll parse the token and get the user data
          try {
            const payload = JSON.parse(atob(token.split(".")[1]))
            const userId = payload.userId

            // Get user from mock database or localStorage
            const storedUser = localStorage.getItem(`user_${userId}`)
            if (storedUser) {
              setUser(JSON.parse(storedUser))
            } else {
              // Token is invalid, remove it
              localStorage.removeItem("token")
              setUser(null)
            }
          } catch (e) {
            // Invalid token
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
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a login

      // Find user by email
      const storedUsers = Object.keys(localStorage)
        .filter((key) => key.startsWith("user_"))
        .map((key) => JSON.parse(localStorage.getItem(key) || "{}"))

      const user = storedUsers.find((u) => u.email === email)

      if (!user || user.password !== password) {
        throw new Error("Invalid email or password")
      }

      // Create a JWT-like token
      const token = createMockToken(user)
      localStorage.setItem("token", token)

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user
      setUser(userWithoutPassword)

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
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a signup

      // Check if user already exists
      const storedUsers = Object.keys(localStorage)
        .filter((key) => key.startsWith("user_"))
        .map((key) => JSON.parse(localStorage.getItem(key) || "{}"))

      if (storedUsers.some((u) => u.email === email)) {
        throw new Error("User with this email already exists")
      }

      // Create new user
      const userId = `user_${Date.now()}`
      const newUser = {
        id: userId,
        username,
        email,
        password, // In a real app, this would be hashed
        profilePicture: null,
        createdAt: new Date().toISOString(),
      }

      // Store user in localStorage
      localStorage.setItem(`user_${userId}`, JSON.stringify(newUser))

      // Create a JWT-like token
      const token = createMockToken(newUser)
      localStorage.setItem("token", token)

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)

      navigate("/dashboard")
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/")
  }

  // Helper function to create a mock JWT token
  const createMockToken = (user: any) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    const payload = btoa(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        username: user.username,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      }),
    )
    const signature = btoa("mock_signature")

    return `${header}.${payload}.${signature}`
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }

