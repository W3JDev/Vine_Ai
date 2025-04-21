"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Wine, User, BarChart3, History } from "lucide-react"
import { AnimatedList, AnimatedListItem } from "@/components/ui/motion"

// Mock data - in a real app, this would come from a database
const mockUserProfile = {
  name: "Wine Enthusiast",
  tasteProfile: {
    flavor: "Fruity",
    body: "Medium-bodied",
    aromas: ["Floral", "Berry"],
    texture: "Smooth and velvety",
    dietary: ["Organic wines preferred"],
  },
  favoriteWines: [
    {
      id: "wine1",
      name: "Château Margaux 2015",
      varietal: "Cabernet Sauvignon Blend",
      region: "Bordeaux, France",
      rating: 5,
      dateRated: "2023-10-15",
      imageUrl: "/placeholder.svg?height=100&width=80",
    },
    {
      id: "wine3",
      name: "Antinori Tignanello 2018",
      varietal: "Sangiovese Blend",
      region: "Tuscany, Italy",
      rating: 4,
      dateRated: "2023-11-02",
      imageUrl: "/placeholder.svg?height=100&width=80",
    },
  ],
  dislikedWines: [
    {
      id: "wine2",
      name: "Cloudy Bay Sauvignon Blanc 2022",
      varietal: "Sauvignon Blanc",
      region: "Marlborough, New Zealand",
      rating: 2,
      dateRated: "2023-10-20",
      imageUrl: "/placeholder.svg?height=100&width=80",
    },
  ],
  preferences: {
    red: 65,
    white: 20,
    rosé: 10,
    sparkling: 5,
  },
  recentActivity: [
    { action: "Rated", wine: "Château Margaux 2015", date: "2023-10-15", rating: 5 },
    { action: "Viewed", wine: "Dom Pérignon 2010", date: "2023-10-18", rating: null },
    { action: "Rated", wine: "Cloudy Bay Sauvignon Blanc 2022", date: "2023-10-20", rating: 2 },
    { action: "Rated", wine: "Antinori Tignanello 2018", date: "2023-11-02", rating: 4 },
  ],
}

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("taste-profile")

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Card className="premium-card border-wine-200 dark:border-wine-800 overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-wine-500 to-wine-800">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-background bg-wine-100 dark:bg-wine-900 flex items-center justify-center">
                <User className="h-16 w-16 text-wine-500" />
              </div>
            </div>
          </div>
          <div className="pt-20 pb-6 px-8">
            <h2 className="text-2xl font-bold">{mockUserProfile.name}</h2>
            <p className="text-muted-foreground">Wine enthusiast since October 2023</p>
          </div>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 premium-card p-1 h-auto">
          <TabsTrigger
            value="taste-profile"
            className="py-3 data-[state=active]:bg-wine-500 data-[state=active]:text-white"
          >
            <User className="h-4 w-4 mr-2" />
            Taste Profile
          </TabsTrigger>
          <TabsTrigger
            value="rating-history"
            className="py-3 data-[state=active]:bg-wine-500 data-[state=active]:text-white"
          >
            <History className="h-4 w-4 mr-2" />
            Rating History
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="py-3 data-[state=active]:bg-wine-500 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Wine Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="taste-profile">
          <Card className="premium-card border-wine-200 dark:border-wine-800">
            <CardHeader>
              <CardTitle className="text-gradient">Your Taste Profile</CardTitle>
              <CardDescription>Based on your quiz responses and rating history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Flavor Preference</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-wine-100 dark:bg-wine-900 flex items-center justify-center">
                        <Wine className="h-6 w-6 text-wine-500" />
                      </div>
                      <div>
                        <p className="text-xl font-medium">{mockUserProfile.tasteProfile.flavor}</p>
                        <p className="text-sm text-muted-foreground">Primary taste preference</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Body Preference</h3>
                    <div className="p-4 rounded-xl bg-wine-50/50 dark:bg-wine-900/20 border border-wine-100 dark:border-wine-800">
                      <p className="text-xl font-medium">{mockUserProfile.tasteProfile.body}</p>
                      <p className="text-sm text-muted-foreground">You prefer wines with a balanced mouthfeel</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Texture Preference</h3>
                    <div className="p-4 rounded-xl bg-wine-50/50 dark:bg-wine-900/20 border border-wine-100 dark:border-wine-800">
                      <p className="text-xl font-medium">{mockUserProfile.tasteProfile.texture}</p>
                      <p className="text-sm text-muted-foreground">You enjoy wines with a silky texture</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Aroma Interests</h3>
                    <div className="p-4 rounded-xl bg-wine-50/50 dark:bg-wine-900/20 border border-wine-100 dark:border-wine-800">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {mockUserProfile.tasteProfile.aromas.map((aroma, index) => (
                          <Badge key={index} className="bg-wine-500 hover:bg-wine-600">
                            {aroma}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">You're drawn to these aromatic profiles</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Dietary Preferences</h3>
                    <div className="p-4 rounded-xl bg-wine-50/50 dark:bg-wine-900/20 border border-wine-100 dark:border-wine-800">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {mockUserProfile.tasteProfile.dietary.map((pref, index) => (
                          <Badge key={index} variant="outline" className="border-wine-500 text-wine-500">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Special considerations for your recommendations</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">AI Recommendation Focus</h3>
                    <div className="p-4 rounded-xl bg-wine-50/50 dark:bg-wine-900/20 border border-wine-100 dark:border-wine-800">
                      <p className="text-sm text-muted-foreground mb-2">Based on your profile, our AI will focus on:</p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-wine-500 mr-2"></span>
                          Medium-bodied, fruity red wines
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-wine-500 mr-2"></span>
                          Wines with floral and berry notes
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-wine-500 mr-2"></span>
                          Organic options when available
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rating-history">
          <Card className="premium-card border-wine-200 dark:border-wine-800">
            <CardHeader>
              <CardTitle className="text-gradient">Your Wine Ratings</CardTitle>
              <CardDescription>Wines you've rated in the past</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center mb-4">
                    <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-medium">Wines You Liked</h3>
                  </div>
                  <AnimatedList className="space-y-4">
                    {mockUserProfile.favoriteWines.map((wine, index) => (
                      <AnimatedListItem key={wine.id}>
                        <div className="flex items-start p-4 rounded-xl bg-wine-50/50 dark:bg-wine-900/20 border border-wine-100 dark:border-wine-800">
                          <div className="w-20 h-24 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                            <img
                              src={wine.imageUrl || "/placeholder.svg"}
                              alt={wine.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{wine.name}</h4>
                                <p className="text-sm text-muted-foreground">{wine.varietal}</p>
                                <p className="text-xs text-muted-foreground mt-1">{wine.region}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Wine
                                      key={i}
                                      className={`h-4 w-4 ${i < wine.rating ? "text-wine-500" : "text-gray-300 dark:text-gray-600"}`}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Rated on {wine.dateRated}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AnimatedListItem>
                    ))}
                  </AnimatedList>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <ThumbsDown className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-medium">Wines You Disliked</h3>
                  </div>
                  <AnimatedList className="space-y-4">
                    {mockUserProfile.dislikedWines.map((wine) => (
                      <AnimatedListItem key={wine.id}>
                        <div className="flex items-start p-4 rounded-xl bg-wine-50/50 dark:bg-wine-900/20 border border-wine-100 dark:border-wine-800">
                          <div className="w-20 h-24 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                            <img
                              src={wine.imageUrl || "/placeholder.svg"}
                              alt={wine.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{wine.name}</h4>
                                <p className="text-sm text-muted-foreground">{wine.varietal}</p>
                                <p className="text-xs text-muted-foreground mt-1">{wine.region}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Wine
                                      key={i}
                                      className={`h-4 w-4 ${i < wine.rating ? "text-wine-500" : "text-gray-300 dark:text-gray-600"}`}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Rated on {wine.dateRated}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AnimatedListItem>
                    ))}
                  </AnimatedList>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="premium-card border-wine-200 dark:border-wine-800">
            <CardHeader>
              <CardTitle className="text-gradient">Wine Type Preferences</CardTitle>
              <CardDescription>Based on your ratings and selections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-red-700 mr-2"></div>
                          <span>Red Wine</span>
                        </div>
                        <span className="font-medium">{mockUserProfile.preferences.red}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${mockUserProfile.preferences.red}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-red-700 rounded-full"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-amber-100 mr-2"></div>
                          <span>White Wine</span>
                        </div>
                        <span className="font-medium">{mockUserProfile.preferences.white}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${mockUserProfile.preferences.white}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-amber-100 rounded-full"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-pink-300 mr-2"></div>
                          <span>Rosé Wine</span>
                        </div>
                        <span className="font-medium">{mockUserProfile.preferences.rosé}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${mockUserProfile.preferences.rosé}%` }}
                          transition={{ duration: 1, delay: 0.4 }}
                          className="h-full bg-pink-300 rounded-full"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-yellow-200 mr-2"></div>
                          <span>Sparkling Wine</span>
                        </div>
                        <span className="font-medium">{mockUserProfile.preferences.sparkling}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${mockUserProfile.preferences.sparkling}%` }}
                          transition={{ duration: 1, delay: 0.6 }}
                          className="h-full bg-yellow-200 rounded-full"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <motion.circle
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: mockUserProfile.preferences.red / 100 }}
                          transition={{ duration: 1, delay: 0.2 }}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#be123c"
                          strokeWidth="20"
                          strokeDasharray="251.2"
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-300"
                        />
                        <motion.circle
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: mockUserProfile.preferences.white / 100 }}
                          transition={{ duration: 1, delay: 0.4 }}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#fef9c3"
                          strokeWidth="20"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * mockUserProfile.preferences.red) / 100}
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-300"
                        />
                        <motion.circle
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: mockUserProfile.preferences.rosé / 100 }}
                          transition={{ duration: 1, delay: 0.6 }}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#fbcfe8"
                          strokeWidth="20"
                          strokeDasharray="251.2"
                          strokeDashoffset={
                            251.2 -
                            (251.2 * (mockUserProfile.preferences.red + mockUserProfile.preferences.white)) / 100
                          }
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-300"
                        />
                        <motion.circle
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: mockUserProfile.preferences.sparkling / 100 }}
                          transition={{ duration: 1, delay: 0.8 }}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#fef08a"
                          strokeWidth="20"
                          strokeDasharray="251.2"
                          strokeDashoffset={
                            251.2 -
                            (251.2 *
                              (mockUserProfile.preferences.red +
                                mockUserProfile.preferences.white +
                                mockUserProfile.preferences.rosé)) /
                              100
                          }
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-300"
                        />
                        <circle cx="50" cy="50" r="30" fill="var(--background)" />
                        <text
                          x="50"
                          y="50"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-medium"
                          fill="currentColor"
                        >
                          Wine Preferences
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-wine-50/50 dark:bg-wine-900/20 border border-wine-100 dark:border-wine-800">
                  <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockUserProfile.recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-wine-100 dark:bg-wine-900 flex items-center justify-center mr-3">
                            {activity.action === "Rated" ? (
                              <ThumbsUp className="h-4 w-4 text-wine-500" />
                            ) : (
                              <Wine className="h-4 w-4 text-wine-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm">
                              {activity.action} <span className="font-medium">{activity.wine}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                        </div>
                        {activity.rating && (
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Wine
                                key={i}
                                className={`h-3 w-3 ${i < activity.rating ? "text-wine-500" : "text-gray-300 dark:text-gray-600"}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
