import { db } from "@/lib/db"
import { decrypt } from "@/lib/encryption"

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    })
    return user
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function getUserSettings(userId: string) {
  try {
    const settings = await db.userSettings.findUnique({
      where: { userId },
    })

    if (settings?.api_key) {
      return {
        ...settings,
        api_key: decrypt(settings.api_key),
      }
    }

    return settings
  } catch (error) {
    console.error("Error getting user settings:", error)
    return null
  }
}

export async function createChat(userId: string, title: string) {
  try {
    const chat = await db.chat.create({
      data: {
        userId,
        title,
      },
    })
    return chat
  } catch (error) {
    console.error("Error creating chat:", error)
    return null
  }
}

export async function createMessage(
  chatId: number,
  role: string,
  content: string,
  isStructuredOutput = false,
  structuredData: any = null,
) {
  try {
    const message = await db.message.create({
      data: {
        chatId,
        role,
        content,
        is_structured_output: isStructuredOutput,
        structured_data: structuredData,
      },
    })
    return message
  } catch (error) {
    console.error("Error creating message:", error)
    return null
  }
}

export async function getUserChats(userId: string) {
  try {
    const chats = await db.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    })
    return chats
  } catch (error) {
    console.error("Error getting user chats:", error)
    return null
  }
}

export async function createOrUpdateUserSettings(userId: string, data: any) {
  try {
    const settings = await db.userSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    })

    if (settings?.api_key) {
      return {
        ...settings,
        api_key: decrypt(settings.api_key),
      }
    }

    return settings
  } catch (error) {
    console.error("Error creating or updating user settings:", error)
    return null
  }
}

export async function getChatById(chatId: number, userId: string) {
  try {
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
        userId,
      },
    })
    return chat
  } catch (error) {
    console.error("Error getting chat by id:", error)
    return null
  }
}

export async function updateChat(chatId: number, userId: string, title: string) {
  try {
    const chat = await db.chat.update({
      where: {
        id: chatId,
        userId,
      },
      data: {
        title,
      },
    })
    return chat
  } catch (error) {
    console.error("Error updating chat:", error)
    return null
  }
}

export async function deleteChat(chatId: number, userId: string) {
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

export async function getChatMessages(chatId: number) {
  try {
    const messages = await db.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    })
    return messages
  } catch (error) {
    console.error("Error getting chat messages:", error)
    return null
  }
}
