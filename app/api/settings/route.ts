import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserSettings, createOrUpdateUserSettings } from "@/lib/db-utils"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await getUserSettings(session.user.id)

    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 })
    }

    // Don't return the API key directly to the client
    const { api_key, ...safeSettings } = settings
    const hasApiKey = api_key !== null && api_key !== ""

    return NextResponse.json({ ...safeSettings, hasApiKey })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate input
    if (data.voice_enabled !== undefined && typeof data.voice_enabled !== "boolean") {
      return NextResponse.json({ error: "Invalid voice_enabled value" }, { status: 400 })
    }

    const settings = await createOrUpdateUserSettings(session.user.id, data)

    // Don't return the API key directly to the client
    const { api_key, ...safeSettings } = settings
    const hasApiKey = api_key !== null && api_key !== ""

    return NextResponse.json({ ...safeSettings, hasApiKey })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
