"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

// Define user type
interface User {
  id: string
  name: string
  email: string
}

// Define auth context type
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy users for testing
const DUMMY_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
  },
]

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user with matching credentials
      const foundUser = DUMMY_USERS.find((u) => u.email === email && u.password === password)

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))
        return true
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if email already exists
      if (DUMMY_USERS.some((u) => u.email === email)) {
        return false
      }

      // Create new user
      const newUser = {
        id: String(DUMMY_USERS.length + 1),
        name,
        email,
      }

      // Set as current user
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))

      return true
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
