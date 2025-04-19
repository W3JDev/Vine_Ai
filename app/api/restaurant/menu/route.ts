import { NextResponse } from "next/server"
import { getMenuCategories, getMenuItems } from "@/lib/restaurant-db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("category")

    const categories = await getMenuCategories()
    let items = []

    if (categoryId) {
      items = await getMenuItems(Number.parseInt(categoryId))
    } else {
      items = await getMenuItems()
    }

    return NextResponse.json({ categories, items })
  } catch (error) {
    console.error("Error fetching menu:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
