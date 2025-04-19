import { MenuAssistant } from "@/components/restaurant/menu-assistant"

export default function RestaurantPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Table & Apron</h1>
          <p className="text-sm text-gray-500">Interactive Menu Assistant</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-8rem)]">
          <MenuAssistant />
        </div>
      </main>

      <footer className="bg-white border-t p-4">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© 2023 Table & Apron. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
