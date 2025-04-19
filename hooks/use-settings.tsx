"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"

// Define settings type
interface Settings {
  id: number
  user_id: string
  hasApiKey: boolean
  system_prompt: string
  voice_enabled: boolean
  voice_speed: string
  voice_type: string
  created_at: string
  updated_at: string
}

// Define settings context type
interface SettingsContextType {
  settings: Settings | null
  isLoading: boolean
  error: string | null
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>
  updateApiKey: (apiKey: string) => Promise<void>
}

// Create settings context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Default settings
const DEFAULT_SETTINGS: Settings = {
  id: 0,
  user_id: "",
  hasApiKey: false,
  system_prompt:
    "You are a helpful assistant. You provide clear, concise, and accurate information to the user's questions.",
  voice_enabled: true,
  voice_speed: "1",
  voice_type: "default",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Settings provider component
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings when session changes
  useEffect(() => {
    if (session?.user) {
      fetchSettings()
    } else {
      setSettings(null)
      setIsLoading(false)
    }
  }, [session])

  // Fetch settings from API
  const fetchSettings = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/settings")

      if (!response.ok) {
        throw new Error(`Failed to fetch settings: ${response.status}`)
      }

      const data = await response.json()
      setSettings(data)
    } catch (err) {
      console.error("Error fetching settings:", err)
      setError("Failed to load settings")
      setSettings(DEFAULT_SETTINGS)
    } finally {
      setIsLoading(false)
    }
  }

  // Update settings
  const updateSettings = async (newSettings: Partial<Settings>): Promise<void> => {
    if (!session?.user) {
      setError("You must be logged in to update settings")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      })

      if (!response.ok) {
        throw new Error(`Failed to update settings: ${response.status}`)
      }

      const data = await response.json()
      setSettings(data)
    } catch (err) {
      console.error("Error updating settings:", err)
      setError("Failed to update settings")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Update API key
  const updateApiKey = async (apiKey: string): Promise<void> => {
    if (!session?.user) {
      setError("You must be logged in to update API key")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/settings/api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update API key: ${response.status}`)
      }

      // Refresh settings to get updated hasApiKey value
      await fetchSettings()
    } catch (err) {
      console.error("Error updating API key:", err)
      setError("Failed to update API key")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, isLoading, error, updateSettings, updateApiKey }}>
      {children}
    </SettingsContext.Provider>
  )
}

// Hook to use settings context
export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
