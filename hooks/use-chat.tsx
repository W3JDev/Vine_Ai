"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { useSettings } from "@/hooks/use-settings"
import { useChatHistory } from "@/hooks/use-chat-history"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: string
  isStructuredOutput?: boolean
  structuredData?: any
}

export function useChat() {
  const { settings } = useSettings()
  const { addChat, updateChat } = useChatHistory()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<number | null>(null)

  const formatTimestamp = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  const startNewChat = useCallback((chatId?: number) => {
    if (chatId && chatId !== -1) {
      // Load existing chat
      setIsLoading(true)
      fetch(`/api/chats/${chatId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.messages) {
            setMessages(
              data.messages.map((msg: any) => ({
                id: msg.id.toString(),
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isStructuredOutput: msg.is_structured_output,
                structuredData: msg.structured_data,
              })),
            )
            setCurrentChatId(chatId)
          }
        })
        .catch((err) => {
          console.error("Error loading chat:", err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      // Start a new chat
      setMessages([])
      setCurrentChatId(null)
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!input.trim() || isLoading) return

      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        role: "user",
        content: input,
        timestamp: formatTimestamp(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)

      try {
        // Prepare messages for the API
        const apiMessages = [
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: userMessage.role,
            content: userMessage.content,
          },
        ]

        // Call the chat API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: apiMessages,
            chatId: currentChatId,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        // Process the streaming response
        const reader = response.body?.getReader()
        let assistantMessage = ""

        if (reader) {
          // Create a placeholder for the assistant's message
          const assistantPlaceholder: Message = {
            id: uuidv4(),
            role: "assistant",
            content: "",
            timestamp: formatTimestamp(),
          }

          setMessages((prev) => [...prev, assistantPlaceholder])

          // Read the stream
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              break
            }

            // Decode the chunk
            const chunk = new TextDecoder().decode(value)
            const lines = chunk.split("\n").filter((line) => line.trim() !== "")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(5).trim()

                if (data === "[DONE]") {
                  continue
                }

                try {
                  const parsed = JSON.parse(data)
                  if (parsed.type === "text-delta") {
                    assistantMessage += parsed.text

                    // Update the assistant's message
                    setMessages((prev) => {
                      const updated = [...prev]
                      const lastMessage = updated[updated.length - 1]
                      if (lastMessage.role === "assistant") {
                        lastMessage.content = assistantMessage
                      }
                      return updated
                    })
                  }
                } catch (e) {
                  console.error("Error parsing chunk:", e)
                }
              }
            }
          }
        }

        // If we don't have a chat ID yet, the API would have created one
        if (!currentChatId) {
          // Refresh the chat list
          router.refresh()
        }
      } catch (error) {
        console.error("Error sending message:", error)
        // Handle error
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: "assistant",
            content: "Sorry, there was an error processing your request. Please try again.",
            timestamp: formatTimestamp(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [input, messages, isLoading, currentChatId, router],
  )

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    startNewChat,
  }
}
