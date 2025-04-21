import type { Metadata } from "next"
import Hero from "@/components/hero"
import Features from "@/components/features"

export const metadata: Metadata = {
  title: "VinAI Match | Premium Wine Pairing",
  description: "Discover your perfect wine match with our AI-powered wine pairing service",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
    </div>
  )
}
