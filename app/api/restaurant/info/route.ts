import { NextResponse } from "next/server"
import { getRestaurantInfo, getOperatingHours } from "@/lib/restaurant-db"

export async function GET() {
  try {
    const info = await getRestaurantInfo()
    const hours = await getOperatingHours()

    if (!info) {
      return NextResponse.json({ error: "Restaurant information not found" }, { status: 404 })
    }

    return NextResponse.json({ info, hours })
  } catch (error) {
    console.error("Error fetching restaurant info:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
