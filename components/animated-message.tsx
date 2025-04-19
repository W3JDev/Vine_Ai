"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChatMessage } from "@/components/chat-message"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: string
  isStructuredOutput?: boolean
  structuredData?: any
}

interface AnimatedMessageProps {
  message: Message
  index: number
}

export function AnimatedMessage({ message, index }: AnimatedMessageProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
          ease: "easeOut",
        }}
      >
        <ChatMessage message={message} />
      </motion.div>
    </AnimatePresence>
  )
}
