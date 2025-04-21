"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Info, Wine, Globe, Utensils } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import WineDetail from "@/components/wine-detail"
import { AnimatedList, AnimatedListItem } from "@/components/ui/motion"
import { cn } from "@/lib/utils"

// Enhanced mock data with additional details
const mockRecommendations = [
  {
    id: "wine1",
    name: "Château Margaux 2015",
    varietal: "Cabernet Sauvignon Blend",
    region: "Bordeaux",
    country: "France",
    year: "2015",
    tastingNotes:
      "Elegant and complex with notes of blackcurrant, cedar, and violet. The palate is refined with silky tannins and a long, persistent finish.",
    foodPairings: ["Beef tenderloin", "Lamb chops", "Aged cheeses", "Truffle dishes"],
    priceRange: "$$$",
    imageUrl: "/placeholder.svg?height=400&width=300",
    description:
      "Château Margaux 2015 is a First Growth Bordeaux and one of the most prestigious wines in the world. This vintage is particularly celebrated for its perfect balance of power and elegance, showcasing the exceptional terroir of the Margaux appellation.",
    grapes: ["Cabernet Sauvignon", "Merlot", "Petit Verdot", "Cabernet Franc"],
    alcohol: "13.5% ABV",
    acidity: 4,
    body: 5,
    tannin: 4,
    sweetness: 1,
  },
  {
    id: "wine2",
    name: "Cloudy Bay Sauvignon Blanc 2022",
    varietal: "Sauvignon Blanc",
    region: "Marlborough",
    country: "New Zealand",
    year: "2022",
    tastingNotes:
      "Vibrant with citrus, passion fruit, and a hint of fresh herbs. Crisp acidity with a refreshing mineral finish.",
    foodPairings: ["Seafood", "Goat cheese", "Asparagus dishes", "Thai cuisine"],
    priceRange: "$$",
    imageUrl: "/placeholder.svg?height=400&width=300",
    description:
      "Cloudy Bay has built a reputation for producing one of the world's most sought-after Sauvignon Blancs. This vintage showcases the distinctive character of Marlborough with its intense aromatics and vibrant acidity.",
    grapes: ["Sauvignon Blanc"],
    alcohol: "13% ABV",
    acidity: 5,
    body: 2,
    tannin: 1,
    sweetness: 2,
  },
  {
    id: "wine3",
    name: "Antinori Tignanello 2018",
    varietal: "Sangiovese Blend",
    region: "Tuscany",
    country: "Italy",
    year: "2018",
    tastingNotes:
      "Rich with dark cherries, spices, and tobacco notes. Full-bodied with velvety tannins and a long, complex finish.",
    foodPairings: ["Pasta with meat sauce", "Grilled steak", "Hard cheeses", "Wild mushroom risotto"],
    priceRange: "$$$",
    imageUrl: "/placeholder.svg?height=400&width=300",
    description:
      "Tignanello is one of Italy's most iconic wines, often credited with starting the 'Super Tuscan' revolution. This blend of Sangiovese with Cabernet Sauvignon and Cabernet Franc represents the perfect marriage of Tuscan tradition and international varieties.",
    grapes: ["Sangiovese", "Cabernet Sauvignon", "Cabernet Franc"],
    alcohol: "14% ABV",
    acidity: 4,
    body: 5,
    tannin: 4,
    sweetness: 1,
  },
]

export default function WineRecommendations() {
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [ratings, setRatings] = useState<Record<string, boolean | null>>({})
  const [selectedWine, setSelectedWine] = useState<(typeof mockRecommendations)[0] | null>(null)
  const [hoveredWine, setHoveredWine] = useState<string | null>(null)
  const { toast } = useToast()

  const handleRating = (wineId: string, liked: boolean) => {
    setRatings({ ...ratings, [wineId]: liked })

    toast({
      title: liked ? "Wine added to favorites" : "Thanks for your feedback",
      description: liked
        ? "We'll use this to improve your future recommendations"
        : "We'll find better matches for you next time",
      duration: 3000,
    })
  }

  const getPriceRangeLabel = (range: string) => {
    switch (range) {
      case "$":
        return "Under $20"
      case "$$":
        return "$20-$50"
      case "$$$":
        return "$50-$100"
      case "$$$$":
        return "Over $100"
      default:
        return range
    }
  }

  return (
    <>
      <AnimatedList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((wine, index) => (
          <AnimatedListItem key={wine.id}>
            <motion.div
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredWine(wine.id)}
              onHoverEnd={() => setHoveredWine(null)}
              className="h-full"
            >
              <Card
                className={cn(
                  "premium-card h-full overflow-hidden transition-all duration-300 flex flex-col",
                  hoveredWine === wine.id ? "shadow-xl shadow-wine-500/10" : "",
                )}
              >
                <div
                  className="aspect-[3/4] relative cursor-pointer overflow-hidden"
                  onClick={() => setSelectedWine(wine)}
                >
                  <img
                    src={wine.imageUrl || "/placeholder.svg"}
                    alt={wine.name}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <Badge className="bg-wine-500/90 hover:bg-wine-500 text-white">{wine.year}</Badge>
                    <Badge variant="outline" className="bg-black/30 backdrop-blur-sm border-white/20 text-white">
                      {getPriceRangeLabel(wine.priceRange)}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-xl mb-1 line-clamp-2">{wine.name}</h3>
                    <p className="text-sm text-white/80">{wine.varietal}</p>
                    <div className="flex items-center mt-2 text-xs text-white/70">
                      <Globe className="h-3 w-3 mr-1" />
                      <span>
                        {wine.region}, {wine.country}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-4 flex-1">
                    <div className="flex items-start gap-2 mb-3">
                      <Wine className="h-5 w-5 text-wine-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Tasting Notes</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{wine.tastingNotes}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Utensils className="h-5 w-5 text-wine-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Pairs Well With</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {wine.foodPairings.slice(0, 2).map((pairing, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {pairing}
                            </Badge>
                          ))}
                          {wine.foodPairings.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{wine.foodPairings.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-border/50">
                    <div className="flex space-x-1">
                      <Button
                        variant={ratings[wine.id] === true ? "default" : "ghost"}
                        size="icon"
                        onClick={() => handleRating(wine.id, true)}
                        className={
                          ratings[wine.id] === true
                            ? "bg-green-500 hover:bg-green-600"
                            : "hover:bg-green-500/10 hover:text-green-500"
                        }
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={ratings[wine.id] === false ? "default" : "ghost"}
                        size="icon"
                        onClick={() => handleRating(wine.id, false)}
                        className={
                          ratings[wine.id] === false
                            ? "bg-red-500 hover:bg-red-600"
                            : "hover:bg-red-500/10 hover:text-red-500"
                        }
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs rounded-full hover:bg-wine-500/10 hover:text-wine-500"
                      onClick={() => setSelectedWine(wine)}
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatedListItem>
        ))}
      </AnimatedList>

      <AnimatePresence>
        {selectedWine && <WineDetail wine={selectedWine} onClose={() => setSelectedWine(null)} />}
      </AnimatePresence>
    </>
  )
}
