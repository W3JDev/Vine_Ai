"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wine, Star, Calendar, MapPin, Tag } from "lucide-react"
import type { WineEntry } from "@/hooks/use-wine-collection-data"
import { cn } from "@/lib/utils"

type WineCollectionDisplayProps = {
  wines: WineEntry[]
  isLoading?: boolean
}

export function WineCollectionDisplay({ wines, isLoading = false }: WineCollectionDisplayProps) {
  const [hoveredWine, setHoveredWine] = useState<string | null>(null)

  // Wine type to color mapping
  const typeColors: Record<string, string> = {
    Red: "bg-red-500",
    White: "bg-amber-100",
    Rosé: "bg-pink-300",
    Sparkling: "bg-yellow-200",
    Dessert: "bg-amber-500",
  }

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine-500"></div>
        </div>
      ) : wines.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Wine className="h-12 w-12 text-wine-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No wines found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {wines.slice(0, 6).map((wine) => (
              <motion.div
                key={wine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-full"
                layout
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoveredWine(wine.id)}
                  onHoverEnd={() => setHoveredWine(null)}
                  className={cn(
                    "rounded-xl overflow-hidden border border-wine-100/50 dark:border-wine-800/50",
                    "bg-white/80 dark:bg-black/20 backdrop-blur-sm shadow-sm",
                    "transition-all duration-300",
                    hoveredWine === wine.id ? "shadow-lg" : "",
                  )}
                >
                  <div className="flex items-center p-4">
                    <div className="flex-shrink-0 mr-4">
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-wine-50 dark:bg-wine-900/30 flex items-center justify-center">
                        <Wine className="h-8 w-8 text-wine-500" />
                        <div className={`absolute bottom-0 left-0 right-0 h-2 ${typeColors[wine.type]}`}></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{wine.name}</h4>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Tag className="h-3 w-3 mr-1" />
                        <span>{wine.type}</span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{wine.region}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < wine.rating ? "text-wine-500 fill-wine-500" : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="mt-1 text-xs font-medium">${wine.price}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatDate(wine.dateAdded)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {wines.length > 6 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">Showing 6 of {wines.length} wines in the collection</p>
        </div>
      )}
    </div>
  )
}
