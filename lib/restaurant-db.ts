import { sql } from "@/lib/db"

// Restaurant Info
export async function getRestaurantInfo() {
  try {
    const result = await sql`SELECT * FROM restaurant_info LIMIT 1`
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error getting restaurant info:", error)
    return null
  }
}

// Operating Hours
export async function getOperatingHours() {
  try {
    const result = await sql`
      SELECT * FROM operating_hours 
      ORDER BY 
        CASE 
          WHEN day_of_week = 'Monday' THEN 1
          WHEN day_of_week = 'Tuesday' THEN 2
          WHEN day_of_week = 'Wednesday' THEN 3
          WHEN day_of_week = 'Thursday' THEN 4
          WHEN day_of_week = 'Friday' THEN 5
          WHEN day_of_week = 'Saturday' THEN 6
          WHEN day_of_week = 'Sunday' THEN 7
        END
    `
    return result
  } catch (error) {
    console.error("Error getting operating hours:", error)
    return []
  }
}

// Menu Categories
export async function getMenuCategories() {
  try {
    const result = await sql`
      SELECT * FROM menu_categories 
      ORDER BY display_order ASC, name ASC
    `
    return result
  } catch (error) {
    console.error("Error getting menu categories:", error)
    return []
  }
}

// Menu Items
export async function getMenuItems(categoryId?: number) {
  try {
    let query
    if (categoryId) {
      query = sql`
        SELECT * FROM menu_items 
        WHERE category_id = ${categoryId} AND is_available = true
        ORDER BY name ASC
      `
    } else {
      query = sql`
        SELECT * FROM menu_items 
        WHERE is_available = true
        ORDER BY name ASC
      `
    }
    return await query
  } catch (error) {
    console.error("Error getting menu items:", error)
    return []
  }
}

// Get Menu Item by ID
export async function getMenuItemById(id: number) {
  try {
    const result = await sql`
      SELECT * FROM menu_items 
      WHERE id = ${id}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error getting menu item by id:", error)
    return null
  }
}

// Search Menu Items
export async function searchMenuItems(query: string) {
  try {
    const result = await sql`
      SELECT * FROM menu_items 
      WHERE 
        is_available = true AND 
        (
          name ILIKE ${"%" + query + "%"} OR 
          description ILIKE ${"%" + query + "%"}
        )
      ORDER BY name ASC
    `
    return result
  } catch (error) {
    console.error("Error searching menu items:", error)
    return []
  }
}

// Get Menu Item Ingredients
export async function getMenuItemIngredients(menuItemId: number) {
  try {
    const result = await sql`
      SELECT i.* FROM ingredients i
      JOIN menu_item_ingredients mii ON i.id = mii.ingredient_id
      WHERE mii.menu_item_id = ${menuItemId}
      ORDER BY i.name ASC
    `
    return result
  } catch (error) {
    console.error("Error getting menu item ingredients:", error)
    return []
  }
}

// Get Menu Item Allergens
export async function getMenuItemAllergens(menuItemId: number) {
  try {
    const result = await sql`
      SELECT a.* FROM allergens a
      JOIN menu_item_allergens mia ON a.id = mia.allergen_id
      WHERE mia.menu_item_id = ${menuItemId}
      ORDER BY a.name ASC
    `
    return result
  } catch (error) {
    console.error("Error getting menu item allergens:", error)
    return []
  }
}

// Create Order
export async function createOrder(orderData: {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  totalAmount: number
}) {
  try {
    const { customerName, customerEmail, customerPhone, totalAmount } = orderData
    const result = await sql`
      INSERT INTO orders (
        customer_name, customer_email, customer_phone, total_amount, status
      ) VALUES (
        ${customerName || null}, ${customerEmail || null}, ${customerPhone || null}, ${totalAmount}, 'pending'
      )
      RETURNING *
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error creating order:", error)
    return null
  }
}

// Add Order Item
export async function addOrderItem(orderItemData: {
  orderId: number
  menuItemId: number
  quantity: number
  price: number
  specialInstructions?: string
}) {
  try {
    const { orderId, menuItemId, quantity, price, specialInstructions } = orderItemData
    const result = await sql`
      INSERT INTO order_items (
        order_id, menu_item_id, quantity, price, special_instructions
      ) VALUES (
        ${orderId}, ${menuItemId}, ${quantity}, ${price}, ${specialInstructions || null}
      )
      RETURNING *
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error adding order item:", error)
    return null
  }
}

// Get Order by ID
export async function getOrderById(id: number) {
  try {
    const result = await sql`
      SELECT * FROM orders 
      WHERE id = ${id}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error getting order by id:", error)
    return null
  }
}

// Get Order Items
export async function getOrderItems(orderId: number) {
  try {
    const result = await sql`
      SELECT oi.*, mi.name, mi.description, mi.image_url
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ${orderId}
      ORDER BY oi.id ASC
    `
    return result
  } catch (error) {
    console.error("Error getting order items:", error)
    return []
  }
}

// Update Order Status
export async function updateOrderStatus(orderId: number, status: string) {
  try {
    const result = await sql`
      UPDATE orders
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
      RETURNING *
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error updating order status:", error)
    return null
  }
}
