import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getChatById, updateChat, deleteChat, getChatMessages } from "@/lib/db-utils"

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

    return NextResponse.json({ chat, messages })
  } catch (error) {
    console.error("Error fetching chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chatId = Number.parseInt(params.id)

    if (isNaN(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 })
    }

    const { title } = await req.json()

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const chat = await updateChat(chatId, session.user.id, title)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json(chat)
  } catch (error) {
    console.error("Error updating chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chatId = Number.parseInt(params.id)

    if (isNaN(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 })
    }

    const success = await deleteChat(chatId, session.user.id)

    if (!success) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
