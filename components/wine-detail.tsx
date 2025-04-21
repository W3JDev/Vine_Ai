"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ThumbsUp, ThumbsDown, X, Globe, Grape, Utensils, DollarSign, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type WineDetailProps = {
  wine: {
    id: string
    name: string
    varietal: string
    region: string
    country: string
    year: string
    tastingNotes: string
    foodPairings: string[]
    priceRange: string
    imageUrl: string
    description: string
    grapes: string[]
    alcohol: string
    acidity: number
    body: number
    tannin: number
    sweetness: number
  }
  onClose: () => void
}

export default function WineDetail({ wine, onClose }: WineDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  const handleRating = (liked: boolean) => {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl w-full bg-background rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="relative aspect-square md:aspect-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-wine-500/20 to-wine-900/20" />
              <img src={wine.imageUrl || "/placeholder.svg"} alt={wine.name} className="object-cover w-full h-full" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-24" />
            </div>

            <div className="p-6 md:p-8 flex flex-col">
              <div className="mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-1">{wine.name}</h2>
                    <p className="text-muted-foreground">{wine.varietal}</p>
                  </div>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {wine.year}
                  </Badge>
                </div>

                <div className="flex items-center mt-4 space-x-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {wine.region}, {wine.country}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {getPriceRangeLabel(wine.priceRange)}
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="flex-1">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tasting">Tasting Notes</TabsTrigger>
                  <TabsTrigger value="pairing">Food Pairing</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="overview" className="mt-0 space-y-4">
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-muted-foreground mb-6">{wine.description}</p>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Grape Varieties</h3>
                          <div className="flex flex-wrap gap-2">
                            {wine.grapes.map((grape, index) => (
                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                <Grape className="h-3 w-3" />
                                {grape}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Characteristics</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Body</p>
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-wine-500 rounded-full"
                                    style={{ width: `${wine.body * 20}%` }}
                                  />
                                </div>
                                <span className="text-xs">{wine.body}/5</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Acidity</p>
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-wine-500 rounded-full"
                                    style={{ width: `${wine.acidity * 20}%` }}
                                  />
                                </div>
                                <span className="text-xs">{wine.acidity}/5</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Tannin</p>
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-wine-500 rounded-full"
                                    style={{ width: `${wine.tannin * 20}%` }}
                                  />
                                </div>
                                <span className="text-xs">{wine.tannin}/5</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Sweetness</p>
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-wine-500 rounded-full"
                                    style={{ width: `${wine.sweetness * 20}%` }}
                                  />
                                </div>
                                <span className="text-xs">{wine.sweetness}/5</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-1">Alcohol Content</h3>
                          <p>{wine.alcohol}</p>
                        </div>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="tasting" className="mt-0">
                    <motion.div
                      key="tasting"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-sm font-medium mb-2">Tasting Notes</h3>
                        <p className="text-muted-foreground">{wine.tastingNotes}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-wine-50/50 dark:bg-wine-900/20 border border-wine-100 dark:border-wine-800">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-wine-500 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-sm">
                            <span className="font-medium">Sommelier's Note:</span> This wine is best enjoyed at 16-18°C
                            (60-64°F). Consider decanting for 30 minutes before serving to allow the aromas to fully
                            develop.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-wine-50/50 dark:bg-wine-900/20 border-wine-100 dark:border-wine-800">
                          <CardContent className="p-4">
                            <h4 className="text-sm font-medium mb-2">Aroma Profile</h4>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>Primary: Black cherry, plum, blackberry</li>
                              <li>Secondary: Vanilla, cedar, tobacco</li>
                              <li>Tertiary: Leather, earth, truffle</li>
                            </ul>
                          </CardContent>
                        </Card>
                        <Card className="bg-wine-50/50 dark:bg-wine-900/20 border-wine-100 dark:border-wine-800">
                          <CardContent className="p-4">
                            <h4 className="text-sm font-medium mb-2">Palate Structure</h4>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>Entry: Smooth with ripe fruit</li>
                              <li>Mid-palate: Rich and complex</li>
                              <li>Finish: Long with fine tannins</li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="pairing" className="mt-0">
                    <motion.div
                      key="pairing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-sm font-medium mb-2">Recommended Food Pairings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {wine.foodPairings.map((pairing, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 rounded-lg border border-wine-100 dark:border-wine-800 bg-wine-50/50 dark:bg-wine-900/20"
                            >
                              <Utensils className="h-5 w-5 text-wine-500 mr-3" />
                              <span>{pairing}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Card className="bg-wine-50/50 dark:bg-wine-900/20 border-wine-100 dark:border-wine-800">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium mb-2">Pairing Principles</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            This wine pairs well with dishes that complement its{" "}
                            {wine.body > 3 ? "full body and rich flavors" : "lighter body and delicate flavors"}.
                            {wine.tannin > 3 ? " The high tannin content pairs excellently with fatty meats." : ""}
                            {wine.acidity > 3 ? " Its bright acidity makes it versatile with many dishes." : ""}
                          </p>
                          <div className="text-sm space-y-2">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                Complement
                              </Badge>
                              <span className="text-muted-foreground">Match intensity and flavor profiles</span>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                Contrast
                              </Badge>
                              <span className="text-muted-foreground">Balance rich dishes with acidity</span>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                Regional
                              </Badge>
                              <span className="text-muted-foreground">
                                Consider traditional pairings from {wine.country}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>

              <div className="flex justify-between items-center mt-6 pt-6 border-t">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRating(true)}
                    className="rounded-full hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRating(false)}
                    className="rounded-full hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Dislike
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
