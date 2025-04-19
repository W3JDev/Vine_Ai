export interface RestaurantInfo {
  id: number
  name: string
  description: string
  address: string
  phone: string
  whatsapp: string
  booking_link: string
  map_link: string
  logo_url: string
  banner_url: string
  created_at: string
  updated_at: string
}

export interface OperatingHour {
  id: number
  restaurant_id: number
  day_of_week: string
  opening_time: string
  closing_time: string
  is_closed: boolean
  meal_period: string | null
  created_at: string
  updated_at: string
}

export interface MenuCategory {
  id: number
  name: string
  description: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: number
  category_id: number
  name: string
  description: string
  price: number
  portion_size: string | null
  image_url: string | null
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
  is_available: boolean
  is_featured: boolean
  takeaway_available: boolean
  created_at: string
  updated_at: string
}

export interface Ingredient {
  id: number
  name: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Allergen {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  total_amount: number
  status: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  menu_item_id: number
  quantity: number
  price: number
  special_instructions: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}
