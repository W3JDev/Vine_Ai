import { NextResponse } from "next/server"
import { createOrder, addOrderItem } from "@/lib/restaurant-db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, customerPhone, items, totalAmount } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order items are required" }, { status: 400 })
    }

    if (!totalAmount || typeof totalAmount !== "number") {
      return NextResponse.json({ error: "Valid total amount is required" }, { status: 400 })
    }

    // Create the order
    const order = await createOrder({
      customerName,
      customerEmail,
      customerPhone,
      totalAmount,
    })

    if (!order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Add order items
    const orderItems = []
    for (const item of items) {
      const { menuItemId, quantity, price, specialInstructions } = item

      if (!menuItemId || !quantity || !price) {
        continue
      }

      const orderItem = await addOrderItem({
        orderId: order.id,
        menuItemId,
        quantity,
        price,
        specialInstructions,
      })

      if (orderItem) {
        orderItems.push(orderItem)
      }
    }

    return NextResponse.json({ order, orderItems })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
