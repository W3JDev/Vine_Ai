import { type NextRequest, NextResponse } from "next/server"
import { getWineRecommendations, type TasteProfile } from "@/lib/wine-matcher"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tasteProfile, previousRatings, model = "openai" } = body

    if (!tasteProfile) {
      return NextResponse.json({ error: "Taste profile is required" }, { status: 400 })
    }

    const recommendations = await getWineRecommendations(tasteProfile as TasteProfile, previousRatings || {}, model)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error in recommendations API:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
