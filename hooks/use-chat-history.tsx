"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"

// Define chat history item type
interface ChatHistoryItem {
  id: number
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

// Define chat history context type
interface ChatHistoryContextType {
  chatHistory: ChatHistoryItem[]
  isLoading: boolean
  error: string | null
  addChat: (title: string) => Promise<number>
  updateChat: (id: number, title: string) => Promise<void>
  deleteChat: (id: number) => Promise<void>
  refreshHistory: () => Promise<void>
}

// Create chat history context
const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined)

// Chat history provider component
export function ChatHistoryProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load chat history when session changes
  useEffect(() => {
    if (session?.user) {
      fetchChatHistory()
    } else {
      setChatHistory([])
      setIsLoading(false)
    }
  }, [session])

  // Fetch chat history from API
  const fetchChatHistory = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chats")

      if (!response.ok) {
        throw new Error(`Failed to fetch chat history: ${response.status}`)
      }

      const data = await response.json()
      setChatHistory(data)
    } catch (err) {
      console.error("Error fetching chat history:", err)
      setError("Failed to load chat history")
      setChatHistory([])
    } finally {
      setIsLoading(false)
    }
  }

  // Add a new chat
  const addChat = async (title: string): Promise<number> => {
    if (!session?.user) {
      setError("You must be logged in to create a chat")
      return -1
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create chat: ${response.status}`)
      }

      const data = await response.json()

      // Update chat history
      await fetchChatHistory()

      return data.id
    } catch (err) {
      console.error("Error creating chat:", err)
      setError("Failed to create chat")
      return -1
    } finally {
      setIsLoading(false)
    }
  }

  // Update an existing chat
  const updateChat = async (id: number, title: string): Promise<void> => {
    if (!session?.user) {
      setError("You must be logged in to update a chat")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/chats/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update chat: ${response.status}`)
      }

      // Update chat history
      await fetchChatHistory()
    } catch (err) {
      console.error("Error updating chat:", err)
      setError("Failed to update chat")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a chat
  const deleteChat = async (id: number): Promise<void> => {
    if (!session?.user) {
      setError("You must be logged in to delete a chat")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/chats/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete chat: ${response.status}`)
      }

      // Update chat history
      await fetchChatHistory()
    } catch (err) {
      console.error("Error deleting chat:", err)
      setError("Failed to delete chat")
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh chat history
  const refreshHistory = async (): Promise<void> => {
    await fetchChatHistory()
  }

  return (
    <ChatHistoryContext.Provider
      value={{
        chatHistory,
        isLoading,
        error,
        addChat,
        updateChat,
        deleteChat,
        refreshHistory,
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  )
}

// Hook to use chat history context
export function useChatHistory() {
  const context = useContext(ChatHistoryContext)
  if (context === undefined) {
    throw new Error("useChatHistory must be used within a ChatHistoryProvider")
  }
  return context
}
