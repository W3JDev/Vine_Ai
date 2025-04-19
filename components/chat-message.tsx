"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Bot, User } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: string
  isStructuredOutput?: boolean
  structuredData?: any
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("flex items-start gap-3 text-sm", isUser ? "flex-row-reverse" : "flex-row")}>
      <Avatar className={cn("h-8 w-8", isUser ? "bg-blue-500" : "bg-gray-500")}>
        <AvatarFallback>{isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 max-w-[80%] md:max-w-[70%]">
        <Card
          className={cn(
            "px-4 py-3",
            isUser ? "bg-blue-500 text-white dark:bg-blue-600" : "bg-gray-100 dark:bg-gray-800",
          )}
        >
          <div className="prose prose-sm dark:prose-invert">{message.content}</div>
        </Card>
        <div className={cn("flex items-center text-xs text-gray-500", isUser ? "justify-end" : "justify-start")}>
          {message.timestamp && <span>{message.timestamp}</span>}
          {!isUser && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-2 text-gray-500 hover:text-gray-700"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="sr-only">Copy message</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
