"use client"

import { useState, useEffect, useMemo } from "react"

// Types for our wine collection data
export type WineType = "Red" | "White" | "Rosé" | "Sparkling" | "Dessert"
export type WineRegion =
  | "France"
  | "Italy"
  | "Spain"
  | "USA"
  | "Australia"
  | "Argentina"
  | "Chile"
  | "Portugal"
  | "Germany"
  | "New Zealand"
export type WineRating = 1 | 2 | 3 | 4 | 5

export type WineEntry = {
  id: string
  name: string
  type: WineType
  region: WineRegion
  year: number
  rating: WineRating
  price: number
  dateAdded: string // ISO date string
}

export type WineCollectionStats = {
  totalWines: number
  recentlyAdded: number
  topRated: number
  tastingNotes: number
  pairingSuggestions: number
  winesByType: Record<WineType, number>
  winesByRegion: Record<WineRegion, number>
  winesByRating: Record<WineRating, number>
  winesByYear: Record<string, number> // Decade ranges as keys
  recentEntries: WineEntry[]
}

// Generate random wine data
const generateRandomWine = (id: number): WineEntry => {
  const types: WineType[] = ["Red", "White", "Rosé", "Sparkling", "Dessert"]
  const regions: WineRegion[] = [
    "France",
    "Italy",
    "Spain",
    "USA",
    "Australia",
    "Argentina",
    "Chile",
    "Portugal",
    "Germany",
    "New Zealand",
  ]
  const ratings: WineRating[] = [1, 2, 3, 4, 5]
  const wineries = ["Château", "Domaine", "Bodegas", "Tenuta", "Weingut", "Vina"]
  const descriptors = ["Grand", "Reserve", "Estate", "Vintage", "Premium", "Select"]
  const varieties = ["Cabernet", "Merlot", "Chardonnay", "Pinot Noir", "Sauvignon Blanc", "Syrah"]

  const type = types[Math.floor(Math.random() * types.length)]
  const region = regions[Math.floor(Math.random() * regions.length)]
  const rating = ratings[Math.floor(Math.random() * ratings.length)]
  const winery = wineries[Math.floor(Math.random() * wineries.length)]
  const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)]
  const variety = varieties[Math.floor(Math.random() * varieties.length)]
  const year = Math.floor(Math.random() * 30) + 1990
  const price = Math.floor(Math.random() * 200) + 10

  // Generate a random date within the last year
  const daysAgo = Math.floor(Math.random() * 365)
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)

  return {
    id: `wine-${id}`,
    name: `${winery} ${descriptor} ${variety} ${year}`,
    type,
    region,
    year,
    rating,
    price,
    dateAdded: date.toISOString(),
  }
}

// Generate initial collection
const generateInitialCollection = (count: number): WineEntry[] => {
  return Array.from({ length: count }, (_, i) => generateRandomWine(i))
}

// Filter and sort options
export type FilterOptions = {
  type?: WineType | "All"
  region?: WineRegion | "All"
  rating?: WineRating | "All"
  yearRange?: [number, number] | "All"
  priceRange?: [number, number] | "All"
}

export type SortOptions = {
  field: "name" | "type" | "region" | "year" | "rating" | "price" | "dateAdded"
  direction: "asc" | "desc"
}

export function useWineCollectionData() {
  const [collection, setCollection] = useState<WineEntry[]>(() => generateInitialCollection(150))
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

  // Add new wines periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddWine = Math.random() > 0.7 // 30% chance to add a wine

      if (shouldAddWine) {
        setCollection((prev) => {
          const newWine = generateRandomWine(prev.length)
          return [...prev, newWine]
        })
      }
    }, 8000) // Check every 8 seconds

    return () => clearInterval(interval)
  }, [])

  // Apply filters and sorting
  const filteredAndSortedCollection = useMemo(() => {
    let result = [...collection]

    // Apply filters
    if (filters.type && filters.type !== "All") {
      result = result.filter((wine) => wine.type === filters.type)
    }

    if (filters.region && filters.region !== "All") {
      result = result.filter((wine) => wine.region === filters.region)
    }

    if (filters.rating && filters.rating !== "All") {
      result = result.filter((wine) => wine.rating === filters.rating)
    }

    if (filters.yearRange && filters.yearRange !== "All") {
      result = result.filter((wine) => wine.year >= filters.yearRange[0] && wine.year <= filters.yearRange[1])
    }

    if (filters.priceRange && filters.priceRange !== "All") {
      result = result.filter((wine) => wine.price >= filters.priceRange[0] && wine.price <= filters.priceRange[1])
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (sort.field) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "type":
          comparison = a.type.localeCompare(b.type)
          break
        case "region":
          comparison = a.region.localeCompare(b.region)
          break
        case "year":
          comparison = a.year - b.year
          break
        case "rating":
          comparison = a.rating - b.rating
          break
        case "price":
          comparison = a.price - b.price
          break
        case "dateAdded":
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
          break
      }

      return sort.direction === "asc" ? comparison : -comparison
    })

    return result
  }, [collection, filters, sort])

  // Calculate statistics
  const stats: WineCollectionStats = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const recentlyAdded = collection.filter((wine) => new Date(wine.dateAdded) >= thirtyDaysAgo).length

    const topRated = collection.filter((wine) => wine.rating >= 4).length

    // Assume 80% of wines have tasting notes and 90% have pairing suggestions
    const tastingNotes = Math.floor(collection.length * 0.8)
    const pairingSuggestions = Math.floor(collection.length * 0.9)

    // Group wines by type
    const winesByType = collection.reduce(
      (acc, wine) => {
        acc[wine.type] = (acc[wine.type] || 0) + 1
        return acc
      },
      {} as Record<WineType, number>,
    )

    // Group wines by region
    const winesByRegion = collection.reduce(
      (acc, wine) => {
        acc[wine.region] = (acc[wine.region] || 0) + 1
        return acc
      },
      {} as Record<WineRegion, number>,
    )

    // Group wines by rating
    const winesByRating = collection.reduce(
      (acc, wine) => {
        acc[wine.rating] = (acc[wine.rating] || 0) + 1
        return acc
      },
      {} as Record<WineRating, number>,
    )

    // Group wines by decade
    const winesByYear = collection.reduce(
      (acc, wine) => {
        const decade = `${Math.floor(wine.year / 10) * 10}s`
        acc[decade] = (acc[decade] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Get 5 most recent entries
    const recentEntries = [...collection]
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 5)

    return {
      totalWines: collection.length,
      recentlyAdded,
      topRated,
      tastingNotes,
      pairingSuggestions,
      winesByType,
      winesByRegion,
      winesByRating,
      winesByYear,
      recentEntries,
    }
  }, [collection])

  return {
    collection: filteredAndSortedCollection,
    stats,
    filters,
    setFilters,
    sort,
    setSort,
  }
}
