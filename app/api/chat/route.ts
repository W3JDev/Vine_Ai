import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserSettings, createChat, createMessage } from "@/lib/db-utils"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 60 // Allow up to 60 seconds for streaming responses

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const { messages, chatId } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 })
    }

    // Get user settings
    const settings = await getUserSettings(session.user.id)

    if (!settings?.api_key) {
      return NextResponse.json({ error: "API key not configured" }, { status: 400 })
    }

    // Create a new chat if chatId is not provided
    let currentChatId = chatId
    if (!currentChatId) {
      const userMessage = messages[0]
      const title = userMessage.content.length > 30 ? `${userMessage.content.substring(0, 30)}...` : userMessage.content

      const chat = await createChat(session.user.id, title)
      currentChatId = chat.id

      // Save the user message
      await createMessage(currentChatId, "user", userMessage.content)
    }

    // Use the AI SDK to stream text from the AI provider
    const result = streamText({
      model: openai("gpt-4o"),
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      apiKey: settings.api_key,
      temperature: 0.7,
      systemPrompt: settings.system_prompt || undefined,
    })

    // Save the assistant's response when the stream completes
    result.text
      .then(async (content) => {
        try {
          await createMessage(currentChatId, "assistant", content)
        } catch (error) {
          console.error("Error saving assistant message:", error)
        }
      })
      .catch(console.error)

    // Return the streaming response
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
