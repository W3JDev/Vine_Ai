import { db } from "@/lib/db"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  isStructuredOutput?: boolean
  structuredData?: any
}

export interface ChatSummary {
  id: string
  title: string
  preview: string
  date: string
  messageCount: number
}

export async function getUserChats(userId: string): Promise<ChatSummary[]> {
  const chats = await db.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      messages: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return chats.map((chat) => {
    const messages = chat.messages as any[]
    return {
      id: chat.id,
      title: chat.title,
      preview: messages.length > 0 ? messages[0].content.substring(0, 50) : "",
      date: formatDate(chat.updatedAt),
      messageCount: messages.length,
    }
  })
}

export async function getChatById(
  chatId: string,
  userId: string,
): Promise<{ chat: any; messages: ChatMessage[] } | null> {
  const chat = await db.chat.findUnique({
    where: {
      id: chatId,
      userId,
    },
  })

  if (!chat) {
    return null
  }

  return {
    chat: {
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    },
    messages: chat.messages as ChatMessage[],
  }
}

export async function createChat(userId: string, title: string, messages: ChatMessage[]): Promise<string> {
  const chat = await db.chat.create({
    data: {
      userId,
      title,
      messages: messages as any,
    },
  })

  return chat.id
}

export async function updateChat(
  chatId: string,
  userId: string,
  data: { title?: string; messages?: ChatMessage[] },
): Promise<boolean> {
  try {
    await db.chat.update({
      where: {
        id: chatId,
        userId,
      },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.messages && { messages: data.messages as any }),
        updatedAt: new Date(),
      },
    })
    return true
  } catch (error) {
    console.error("Error updating chat:", error)
    return false
  }
}

export async function deleteChat(chatId: string, userId: string): Promise<boolean> {
  try {
    await db.chat.delete({
      where: {
        id: chatId,
        userId,
      },
    })
    return true
  } catch (error) {
    console.error("Error deleting chat:", error)
    return false
  }
}

// Helper function to format dates
function formatDate(date: Date): string {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === now.toDateString()) {
    return "Today"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }
}
