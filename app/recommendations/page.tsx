import type { Metadata } from "next"
import WineRecommendations from "@/components/wine-recommendations"

export const metadata: Metadata = {
  title: "Your Wine Recommendations | VinAI Match",
  description: "Personalized wine recommendations based on your taste profile",
}

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#722F37]">Your Personalized Wine Recommendations</h1>
      <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">
        Based on your taste profile, our AI has selected these wines that we believe will perfectly match your
        preferences.
      </p>
      <WineRecommendations />
    </div>
  )
}
