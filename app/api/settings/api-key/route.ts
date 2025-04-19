import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createOrUpdateUserSettings } from "@/lib/db-utils"
import { encrypt } from "@/lib/encryption"

// Validate API key with the provider
async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    // Example validation with OpenAI
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    return response.status === 200
  } catch (error) {
    console.error("API key validation error:", error)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { apiKey } = await req.json()

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // Validate the API key
    const isValid = await validateApiKey(apiKey)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 400 })
    }

    // Encrypt the API key before storing
    const encryptedApiKey = encrypt(apiKey)

    // Update user settings
    await createOrUpdateUserSettings(session.user.id, { api_key: encryptedApiKey })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating API key:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
