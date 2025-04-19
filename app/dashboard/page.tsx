"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@/hooks/use-chat"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/components/chat-message"
import { ChatSidebar } from "@/components/chat-sidebar"
import { VoiceInput } from "@/components/voice-input"
import { VoiceOutput } from "@/components/voice-output"
import { Mic, Send, Settings, Plus } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useSettings } from "@/hooks/use-settings"
import { StructuredOutputDisplay } from "@/components/structured-output-display"

export default function DashboardPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, startNewChat } = useChat()
  const { settings } = useSettings()
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const [lastMessageRead, setLastMessageRead] = useState<string | null>(null)

  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false)
    }
  }, [isMobile])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

    // Check if there's a new assistant message to read aloud
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant" && lastMessage.id !== lastMessageRead && settings.voiceEnabled) {
        setLastMessageRead(lastMessage.id)
      }
    }
  }, [messages, lastMessageRead, settings.voiceEnabled])

  const handleVoiceInput = (transcript: string) => {
    handleInputChange({ target: { value: transcript } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {showSidebar && <ChatSidebar onClose={() => setShowSidebar(false)} onSelectChat={startNewChat} />}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b bg-white px-4 dark:bg-gray-950">
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => setShowSidebar(!showSidebar)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
          <h1 className="text-lg font-semibold">AI Chat</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={startNewChat}>
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </a>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col overflow-hidden">
          <Tabs defaultValue="chat" className="flex flex-1 flex-col" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b bg-white dark:bg-gray-950">
              <div className="container flex h-12 items-center px-4">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="voice">Voice</TabsTrigger>
                </TabsList>
              </div>
            </div>
            <TabsContent value="chat" className="flex-1 overflow-hidden p-4 md:p-6">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4 pb-4">
                  {messages.length === 0 ? (
                    <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                        <svg
                          className="h-6 w-6 text-blue-600 dark:text-blue-400"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Start a conversation</h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Ask a question or start a conversation with the AI assistant.
                      </p>
                    </div>
                  ) : (
                    messages.map((message) =>
                      message.isStructuredOutput ? (
                        <StructuredOutputDisplay key={message.id} data={message.structuredData} />
                      ) : (
                        <ChatMessage key={message.id} message={message} />
                      ),
                    )
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="voice" className="flex-1 overflow-hidden p-4 md:p-6">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4 pb-4">
                  {messages.length === 0 ? (
                    <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                        <Mic className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Voice Interaction</h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Speak to the AI assistant using your microphone.
                      </p>
                      <VoiceInput onTranscript={handleVoiceInput} />
                    </div>
                  ) : (
                    <>
                      {messages.map((message) =>
                        message.isStructuredOutput ? (
                          <StructuredOutputDisplay key={message.id} data={message.structuredData} />
                        ) : (
                          <ChatMessage key={message.id} message={message} />
                        ),
                      )}
                      <div className="flex justify-center py-4">
                        <VoiceInput onTranscript={handleVoiceInput} />
                      </div>
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <div className="border-t bg-white p-4 dark:bg-gray-950">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <div className="flex-1">
                <Textarea
                  placeholder="Type your message..."
                  value={input}
                  onChange={handleInputChange}
                  className="min-h-[60px] resize-none"
                />
              </div>
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </main>
      </div>
      {lastMessageRead && messages.length > 0 && settings.voiceEnabled && (
        <VoiceOutput
          text={messages[messages.length - 1].content}
          voiceType={settings.voiceType}
          voiceSpeed={settings.voiceSpeed}
        />
      )}
    </div>
  )
}
