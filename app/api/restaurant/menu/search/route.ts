import { NextResponse } from "next/server"
import { searchMenuItems } from "@/lib/restaurant-db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const items = await searchMenuItems(query)

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error searching menu items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
