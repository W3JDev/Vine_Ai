"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, X, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useChatHistory } from "@/hooks/use-chat-history"

interface ChatSidebarProps {
  onClose: () => void
  onSelectChat: (chatId: string) => void
}

export function ChatSidebar({ onClose, onSelectChat }: ChatSidebarProps) {
  const { chatHistory } = useChatHistory()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHistory = searchQuery
    ? chatHistory.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : chatHistory

  return (
    <div className="w-64 border-r bg-white dark:bg-gray-950 flex flex-col h-screen">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h2 className="font-semibold">Chat History</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="p-4">
        <Button className="w-full justify-start gap-2" onClick={() => onSelectChat("new")}>
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search chats"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500">
              {searchQuery ? "No chats match your search" : "No chat history yet"}
            </div>
          ) : (
            filteredHistory.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => onSelectChat(chat.id)}
              >
                <div>
                  <div className="font-medium">{chat.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{chat.date}</div>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
