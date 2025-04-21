import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { groq } from "@ai-sdk/groq"

export type TasteProfile = {
  flavor: string
  body: string
  aromas: string[]
  texture: string
  dietary: string[]
}

export type WineRecommendation = {
  name: string
  varietal: string
  region: string
  tastingNotes: string
  foodPairings: string[]
  priceRange: string
  imageUrl: string
}

export async function getWineRecommendations(
  tasteProfile: TasteProfile,
  previousRatings: Record<string, boolean> = {},
  model: "openai" | "groq" = "openai",
): Promise<WineRecommendation[]> {
  const aiModel = model === "openai" ? openai("gpt-4o") : groq("llama3-70b-8192")

  const prompt = `
    Based on the following taste profile and previous ratings, recommend 3 wines that would be a good match.
    
    Taste Profile:
    - Flavor preference: ${tasteProfile.flavor}
    - Body preference: ${tasteProfile.body}
    - Aroma interests: ${tasteProfile.aromas.join(", ")}
    - Texture preference: ${tasteProfile.texture}
    - Dietary preferences: ${tasteProfile.dietary.join(", ")}
    
    Previous Ratings:
    ${Object.entries(previousRatings)
      .map(([wine, liked]) => `- ${wine}: ${liked ? "Liked" : "Disliked"}`)
      .join("\n")}
    
    For each wine, provide:
    1. Name
    2. Varietal
    3. Region
    4. Tasting notes
    5. Food pairings (3-4 suggestions)
    6. Price range ($ = under $20, $$ = $20-$50, $$$ = $50-$100, $$$$ = over $100)
    
    Format the response as a JSON array of wine objects.
  `

  try {
    const { text } = await generateText({
      model: aiModel,
      prompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    // Parse the JSON response
    const recommendations = JSON.parse(text)

    // Add placeholder images
    return recommendations.map((wine: WineRecommendation, index: number) => ({
      ...wine,
      id: `wine${index + 1}`,
      imageUrl: `/placeholder.svg?height=300&width=200`,
    }))
  } catch (error) {
    console.error("Error generating wine recommendations:", error)
    throw new Error("Failed to generate wine recommendations")
  }
}
