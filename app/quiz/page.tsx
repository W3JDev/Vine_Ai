import type { Metadata } from "next"
import TasteProfileQuiz from "@/components/taste-profile-quiz"

export const metadata: Metadata = {
  title: "Taste Profile Quiz | VinAI Match",
  description: "Discover your wine preferences with our interactive taste profile quiz",
}

export default function QuizPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#722F37]">Discover Your Wine Preferences</h1>
      <TasteProfileQuiz />
    </div>
  )
}
