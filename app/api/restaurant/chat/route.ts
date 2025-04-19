import { NextResponse } from "next/server"
import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"
import {
  getMenuCategories,
  getMenuItems,
  searchMenuItems,
  getMenuItemIngredients,
  getMenuItemAllergens,
} from "@/lib/restaurant-db"

export const maxDuration = 60 // Allow up to 60 seconds for streaming responses

// Function to get menu data
async function getMenuData(params: any) {
  const { itemName, categoryName, query } = params

  if (itemName) {
    // Search for a specific menu item
    const items = await searchMenuItems(itemName)
    if (items.length > 0) {
      const item = items[0]
      const ingredients = await getMenuItemIngredients(item.id)
      const allergens = await getMenuItemAllergens(item.id)
      return { item, ingredients, allergens }
    }
    return { error: "Menu item not found" }
  } else if (categoryName) {
    // Get items by category
    const categories = await getMenuCategories()
    const category = categories.find((c: any) => c.name.toLowerCase() === categoryName.toLowerCase())
    if (category) {
      const items = await getMenuItems(category.id)
      return { category, items }
    }
    return { error: "Category not found" }
  } else if (query) {
    // Search menu items
    const items = await searchMenuItems(query)
    return { items }
  } else {
    // Get all categories and featured items
    const categories = await getMenuCategories()
    const items = await getMenuItems()
    const featuredItems = items.filter((item: any) => item.is_featured)
    return { categories, featuredItems }
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 })
    }

    // System prompt for the restaurant assistant
    const systemPrompt = `
      You are "Table & Apron Menu Assistant", an AI-powered assistant for Table & Apron restaurant.
      
      Your purpose is to act as a friendly and knowledgeable helper for customers, assisting with menu questions and providing accurate details about dishes, ingredients, and dining options.
      
      Be warm, friendly, and conversational. Provide detailed and accurate menu information (ingredients, portions, prices, dietary notes). Offer recommendations based on preferences/restrictions and answer queries about hours and specials. If unsure, refer customers to staff.
      
      Describe dishes appealingly but concisely, be precise about allergens and note alcohol content in drinks, maintaining a professional yet approachable tone. The overall goal is to enhance the dining experience by making customers feel valued and informed.
      
      When displaying menu items, use a structured format with name, description, price, allergens, and pairing suggestions. For ingredients, provide brief descriptions and suggest image searches when appropriate.
      
      Restaurant Information:
      - Name: Table & Apron
      - Address: 23, Jalan SS 20/11, Damansara Kim, 47400 Petaling Jaya, Selangor
      - Phone: 03-7733 4000
      - WhatsApp: https://wa.me/60123456789
      - Booking Link: https://tablecheck.com/en/shops/table-and-apron/reserve
      
      Operating Hours:
      - Monday: Closed
      - Tuesday: 05:30 - 22:30
      - Wednesday: 05:30 - 22:00
      - Thursday: 05:30 - 22:30
      - Friday: Lunch 11:30 - 15:00, Dinner 17:30 - 22:30
      - Saturday: Lunch 11:30 - 15:00, Dinner 17:30 - 22:30
      - Sunday: Lunch 11:30 - 15:00, Dinner 17:30 - 22:30
      
      You have access to a tool called get_menu_data that can retrieve menu information. Use this tool when you need specific menu details.
    `

    // Define the tool for getting menu data
    const tools = [
      {
        name: "get_menu_data",
        description: "Get menu data from the restaurant database",
        parameters: {
          type: "object",
          properties: {
            itemName: {
              type: "string",
              description: "The name of a specific menu item to search for",
            },
            categoryName: {
              type: "string",
              description: "The name of a menu category to get items from",
            },
            query: {
              type: "string",
              description: "A general search query for menu items",
            },
          },
          required: [],
        },
        handler: async (params: any) => {
          return await getMenuData(params)
        },
      },
    ]

    // Use the AI SDK to stream text from Groq
    const result = streamText({
      model: groq("llama-3.1-70b-versatile"),
      messages,
      system: systemPrompt,
      tools,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Return the streaming response
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in restaurant chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
