"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { GlassWater, Grape, ThumbsUp, UserCircle, Brain, Wine, Star, Clock, BookOpen, Utensils } from "lucide-react"
import { AnimatedList, AnimatedListItem } from "@/components/ui/motion"
import { ParallaxContainer, ParallaxItem } from "@/components/ui/parallax"
import { useWineCollectionData } from "@/hooks/use-wine-collection-data"
import type { FilterOptions, SortOptions } from "@/hooks/use-wine-collection-data"
import { WineCollectionFilters } from "@/components/wine-collection-filters"
import { WineCollectionDisplay } from "@/components/wine-collection-display"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: "-100px 0px" })
  const { scrollYProgress } = useScroll()
  const wineCollectionData = useWineCollectionData()
  const [activeTab, setActiveTab] = useState<"stats" | "collection">("stats")
  const [filters, setFilters] = useState<FilterOptions>({
    type: "All",
    region: "All",
    rating: "All",
    yearRange: "All",
    priceRange: "All",
  })
  const [sort, setSort] = useState<SortOptions>({
    field: "dateAdded",
    direction: "desc",
  })

  // Parallax effects for background elements
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, -150])
  const bgY3 = useTransform(scrollYProgress, [0, 1], [0, -200])

  // Animation for counter
  const [displayedStats, setDisplayedStats] = useState({
    totalWines: wineCollectionData.stats.totalWines,
    recentlyAdded: wineCollectionData.stats.recentlyAdded,
    topRated: wineCollectionData.stats.topRated,
    tastingNotes: wineCollectionData.stats.tastingNotes,
    pairingSuggestions: wineCollectionData.stats.pairingSuggestions,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedStats((prev) => {
        return {
          totalWines: animateValue(prev.totalWines, wineCollectionData.stats.totalWines),
          recentlyAdded: animateValue(prev.recentlyAdded, wineCollectionData.stats.recentlyAdded),
          topRated: animateValue(prev.topRated, wineCollectionData.stats.topRated),
          tastingNotes: animateValue(prev.tastingNotes, wineCollectionData.stats.tastingNotes),
          pairingSuggestions: animateValue(prev.pairingSuggestions, wineCollectionData.stats.pairingSuggestions),
        }
      })
    }, 50) // Update animation every 50ms

    return () => clearInterval(interval)
  }, [wineCollectionData.stats])

  // Helper function to animate counter values
  const animateValue = (current: number, target: number) => {
    if (current === target) return current
    const increment = (target - current) * 0.1
    return Math.abs(increment) < 1 ? target : Math.floor(current + increment)
  }

  const resetFilters = () => {
    setFilters({
      type: "All",
      region: "All",
      rating: "All",
      yearRange: "All",
      priceRange: "All",
    })
    setSort({
      field: "dateAdded",
      direction: "desc",
    })
  }

  const features = [
    {
      icon: <GlassWater className="h-10 w-10 text-wine-500" />,
      title: "Taste Profile Quiz",
      description: "Discover your unique wine preferences through our interactive quiz",
      animation: "wine-glass",
    },
    {
      icon: <Brain className="h-10 w-10 text-wine-500" />,
      title: "AI Wine Matcher",
      description: "Our sophisticated AI analyzes your preferences to find perfect wine matches",
      animation: "brain-pulse",
    },
    {
      icon: <Grape className="h-10 w-10 text-wine-500" />,
      title: "Personalized Suggestions",
      description: "Get detailed wine recommendations tailored to your taste profile",
      animation: "grape-bounce",
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-wine-500" />,
      title: "Pairing Feedback",
      description: "Rate your wine experiences to improve future recommendations",
      animation: "thumbs-up",
    },
    {
      icon: <UserCircle className="h-10 w-10 text-wine-500" />,
      title: "Rating History",
      description: "Track your wine journey and see how your preferences evolve",
      animation: "profile-rotate",
    },
  ]

  // Animation variants for the icons
  const iconAnimations = {
    "wine-glass": {
      animate: {
        y: [0, -5, 0],
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      },
    },
    "brain-pulse": {
      animate: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
        transition: {
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      },
    },
    "grape-bounce": {
      animate: {
        rotate: [0, 5, 0, -5, 0],
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      },
    },
    "thumbs-up": {
      animate: {
        rotate: [0, 10, 0],
        transition: {
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          repeatDelay: 1,
        },
      },
    },
    "profile-rotate": {
      animate: {
        rotateY: [0, 360],
        transition: {
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          repeatDelay: 2,
        },
      },
    },
  }

  // Stats cards with icons
  const statsCards = [
    {
      icon: <Wine className="h-6 w-6 text-wine-500" />,
      label: "Wines in Collection",
      value: displayedStats.totalWines,
      color: "from-wine-500 to-wine-700",
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-500" />,
      label: "Recently Added",
      value: displayedStats.recentlyAdded,
      color: "from-emerald-500 to-emerald-700",
    },
    {
      icon: <Star className="h-6 w-6 text-amber-500" />,
      label: "Top Rated",
      value: displayedStats.topRated,
      color: "from-amber-500 to-amber-700",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      label: "Tasting Notes",
      value: displayedStats.tastingNotes,
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: <Utensils className="h-6 w-6 text-purple-500" />,
      label: "Pairing Suggestions",
      value: displayedStats.pairingSuggestions,
      color: "from-purple-500 to-purple-700",
    },
  ]

  // Section entrance animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <ParallaxContainer className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div
        style={{ y: bgY1 }}
        className="absolute top-0 right-[10%] w-72 h-72 bg-wine-500/5 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: bgY2 }}
        className="absolute bottom-0 left-[10%] w-96 h-96 bg-wine-700/5 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: bgY3 }}
        className="absolute top-1/2 left-[30%] w-64 h-64 bg-wine-300/5 rounded-full blur-3xl"
      />

      <div className="container px-4 md:px-6" ref={ref}>
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center justify-center space-y-12 text-center"
        >
          <motion.div variants={itemVariants} className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient">
              Premium Features
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Experience the perfect blend of technology and wine expertise
            </p>
          </motion.div>

          {/* Dynamic Wine Collection Stats */}
          <motion.div
            variants={itemVariants}
            className="w-full overflow-hidden rounded-2xl border border-wine-100/50 dark:border-wine-800/50 bg-white/80 dark:bg-black/20 backdrop-blur-sm shadow-lg"
          >
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "stats" | "collection")}>
              <div className="border-b border-border/50 p-4">
                <div className="flex items-center justify-between">
                  <TabsList className="grid w-[400px] grid-cols-2">
                    <TabsTrigger
                      value="stats"
                      className="data-[state=active]:bg-wine-500 data-[state=active]:text-white"
                    >
                      Collection Stats
                    </TabsTrigger>
                    <TabsTrigger
                      value="collection"
                      className="data-[state=active]:bg-wine-500 data-[state=active]:text-white"
                    >
                      Browse Wines
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Simulate adding a new wine
                        wineCollectionData.collection.push({
                          ...wineCollectionData.collection[0],
                          id: `wine-${Date.now()}`,
                          dateAdded: new Date().toISOString(),
                        })
                      }}
                      className="text-xs"
                    >
                      <Wine className="h-3 w-3 mr-1" />
                      Live Demo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <TabsContent value="stats" className="mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {statsCards.map((stat, index) => (
                      <ParallaxItem key={index} offset={10} className="h-full">
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br bg-opacity-10 h-full"
                        >
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} mb-3`}
                          >
                            {stat.icon}
                          </div>
                          <motion.span
                            className="text-2xl font-bold"
                            key={stat.value} // Force re-render on value change
                            initial={{ opacity: 0.5, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {stat.value.toLocaleString()}
                          </motion.span>
                          <span className="text-xs text-muted-foreground mt-1">{stat.label}</span>
                        </motion.div>
                      </ParallaxItem>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="collection" className="mt-0 space-y-6">
                  <WineCollectionFilters
                    filters={filters}
                    setFilters={setFilters}
                    sort={sort}
                    setSort={setSort}
                    onReset={resetFilters}
                  />

                  <WineCollectionDisplay wines={wineCollectionData.collection} />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>

          <AnimatedList className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 mt-8 w-full">
            {features.map((feature, index) => (
              <AnimatedListItem key={index}>
                <ParallaxItem offset={20 + index * 5}>
                  <motion.div
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 30px -15px rgba(114, 47, 55, 0.2)",
                      scale: 1.02,
                    }}
                    className={cn(
                      "flex h-full flex-col items-center space-y-4 rounded-2xl p-6 shadow-lg",
                      "bg-white/80 dark:bg-black/20 backdrop-blur-sm",
                      "border border-wine-100/50 dark:border-wine-800/50",
                      "transition-all duration-300",
                    )}
                  >
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-wine-50 dark:bg-wine-900/30"
                      variants={iconAnimations[feature.animation]}
                      animate="animate"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-wine-700 dark:text-wine-300">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                </ParallaxItem>
              </AnimatedListItem>
            ))}
          </AnimatedList>
        </motion.div>
      </div>
    </ParallaxContainer>
  )
}
