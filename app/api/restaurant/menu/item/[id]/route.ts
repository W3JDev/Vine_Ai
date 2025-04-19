import { NextResponse } from "next/server"
import { getMenuItemById, getMenuItemIngredients, getMenuItemAllergens } from "@/lib/restaurant-db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid menu item ID" }, { status: 400 })
    }

    const item = await getMenuItemById(id)

    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    const ingredients = await getMenuItemIngredients(id)
    const allergens = await getMenuItemAllergens(id)

    return NextResponse.json({ item, ingredients, allergens })
  } catch (error) {
    console.error("Error fetching menu item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
