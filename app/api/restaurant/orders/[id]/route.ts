import { NextResponse } from "next/server"
import { getOrderById, getOrderItems, updateOrderStatus } from "@/lib/restaurant-db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    const order = await getOrderById(id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const items = await getOrderItems(id)

    return NextResponse.json({ order, items })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const order = await updateOrderStatus(id, status)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
