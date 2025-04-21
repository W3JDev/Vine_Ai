import type { Metadata } from "next"
import UserProfile from "@/components/user-profile"

export const metadata: Metadata = {
  title: "Your Profile | VinAI Match",
  description: "View your wine preferences and rating history",
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#722F37]">Your Wine Profile</h1>
      <UserProfile />
    </div>
  )
}
