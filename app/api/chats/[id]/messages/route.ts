import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getChatById, createMessage, getChatMessages } from "@/lib/db-utils"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chatId = Number.parseInt(params.id)

    if (isNaN(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 })
    }

    const chat = await getChatById(chatId, session.user.id)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    const messages = await getChatMessages(chatId)

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chatId = Number.parseInt(params.id)

    if (isNaN(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 })
    }

    const chat = await getChatById(chatId, session.user.id)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    const { role, content, isStructuredOutput, structuredData } = await req.json()

    if (!role || !content || typeof role !== "string" || typeof content !== "string") {
      return NextResponse.json({ error: "Role and content are required" }, { status: 400 })
    }

    if (role !== "user" && role !== "assistant") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const message = await createMessage(chatId, role, content, isStructuredOutput || false, structuredData || null)

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
