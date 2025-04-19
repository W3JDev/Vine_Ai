import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserChats, createChat } from "@/lib/db-utils"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chats = await getUserChats(session.user.id)

    return NextResponse.json(chats)
  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title } = await req.json()

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const chat = await createChat(session.user.id, title)

    return NextResponse.json(chat)
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
