"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MenuItemCard } from "@/components/restaurant/menu-item-card"
import { MenuItemDetails } from "@/components/restaurant/menu-item-details"
import { ShoppingCartComponent } from "@/components/restaurant/shopping-cart"
import { Mic, MicOff, Send } from "lucide-react"

interface MenuAssistantProps {
  initialCategories?: any[]
  initialItems?: any[]
}

export function MenuAssistant({ initialCategories = [], initialItems = [] }: MenuAssistantProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [menuItems, setMenuItems] = useState(initialItems)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [itemDetails, setItemDetails] = useState<any>(null)
  const [ingredients, setIngredients] = useState<any[]>([])
  const [allergens, setAllergens] = useState<any[]>([])
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [orderConfirmation, setOrderConfirmation] = useState<any>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize the AI chat
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/restaurant/chat",
    onFinish: () => {
      scrollToBottom()
    },
  })

  // Fetch menu data on component mount
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch("/api/restaurant/menu")
        const data = await response.json()

        if (data.categories) {
          setCategories(data.categories)
        }

        if (data.items) {
          setMenuItems(data.items)
        }
      } catch (error) {
        console.error("Error fetching menu data:", error)
      }
    }

    if (categories.length === 0 || menuItems.length === 0) {
      fetchMenuData()
    }
  }, [categories.length, menuItems.length])

  // Scroll to bottom of chat messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle category selection
  const handleCategorySelect = async (categoryId: string) => {
    setSelectedCategory(categoryId)

    try {
      const response = await fetch(`/api/restaurant/menu?category=${categoryId}`)
      const data = await response.json()

      if (data.items) {
        setMenuItems(data.items)
      }
    } catch (error) {
      console.error("Error fetching category items:", error)
    }
  }

  // Handle view item details
  const handleViewItemDetails = async (item: any) => {
    setSelectedItem(item)

    try {
      const response = await fetch(`/api/restaurant/menu/item/${item.id}`)
      const data = await response.json()

      if (data.item) {
        setItemDetails(data.item)
        setIngredients(data.ingredients || [])
        setAllergens(data.allergens || [])
        setIsDetailsOpen(true)
      }
    } catch (error) {
      console.error("Error fetching item details:", error)
    }
  }

  // Handle add to cart
  const handleAddToCart = (item: any) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) } : cartItem,
        ),
      )
    } else {
      setCartItems([...cartItems, { ...item, quantity: item.quantity || 1 }])
    }

    setIsDetailsOpen(false)
  }

  // Handle update cart item quantity
  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Handle remove cart item
  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  // Handle checkout
  const handleCheckout = async (customerInfo: any) => {
    try {
      const orderData = {
        ...customerInfo,
        items: cartItems.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }

      const response = await fetch("/api/restaurant/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (data.order) {
        setOrderConfirmation(data)
        setCartItems([])
      }
    } catch (error) {
      console.error("Error creating order:", error)
    }
  }

  // Handle voice input
  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true)

      // Check if browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          handleInputChange({ target: { value: transcript } } as any)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
        }

        recognition.start()
      } else {
        alert("Speech recognition is not supported in your browser.")
        setIsListening(false)
      }
    } else {
      setIsListening(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="order">
            Order
            {orderConfirmation && (
              <span className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                ✓
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              className={isListening ? "bg-red-100" : ""}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Input value={input} onChange={handleInputChange} placeholder="Ask about our menu..." className="flex-1" />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="menu" className="flex-1 flex flex-col">
          <div className="p-4 border-b overflow-x-auto">
            <div className="flex space-x-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => handleCategorySelect(null as any)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id.toString() ? "default" : "outline"}
                  onClick={() => handleCategorySelect(category.id.toString())}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewItemDetails}
                />
              ))}
            </div>
          </div>

          <div className="p-4 border-t flex justify-end">
            <ShoppingCartComponent
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          </div>
        </TabsContent>

        <TabsContent value="order" className="flex-1 overflow-y-auto p-4">
          {orderConfirmation ? (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Order #{orderConfirmation.order.id}</p>
                <p className="text-sm text-gray-500">{new Date(orderConfirmation.order.created_at).toLocaleString()}</p>
              </div>

              <div className="border-t border-b py-4 my-4">
                <h3 className="font-medium mb-2">Items</h3>
                {orderConfirmation.orderItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <div>
                      <span className="font-medium">{item.quantity}x </span>
                      <span>{menuItems.find((mi) => mi.id === item.menu_item_id)?.name}</span>
                    </div>
                    <span>RM {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>RM {orderConfirmation.order.total_amount.toFixed(2)}</span>
              </div>

              <div className="mt-6">
                <Button className="w-full" onClick={() => setOrderConfirmation(null)}>
                  Place Another Order
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 mb-4">No active orders</p>
              <Button variant="outline" onClick={() => document.querySelector('[data-value="menu"]')?.click()}>
                Browse Menu
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <MenuItemDetails
        item={itemDetails}
        ingredients={ingredients}
        allergens={allergens}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
