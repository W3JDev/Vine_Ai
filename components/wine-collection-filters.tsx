"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, SortAsc, SortDesc, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { FilterOptions, SortOptions, WineType, WineRegion, WineRating } from "@/hooks/use-wine-collection-data"

type WineCollectionFiltersProps = {
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  sort: SortOptions
  setSort: (sort: SortOptions) => void
  onReset: () => void
}

export function WineCollectionFilters({ filters, setFilters, sort, setSort, onReset }: WineCollectionFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [yearRange, setYearRange] = useState<[number, number]>([1990, 2023])

  const wineTypes: (WineType | "All")[] = ["All", "Red", "White", "Rosé", "Sparkling", "Dessert"]
  const wineRegions: (WineRegion | "All")[] = [
    "All",
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
  const wineRatings: (WineRating | "All")[] = ["All", 1, 2, 3, 4, 5]
  const sortFields = [
    { value: "name", label: "Name" },
    { value: "type", label: "Type" },
    { value: "region", label: "Region" },
    { value: "year", label: "Year" },
    { value: "rating", label: "Rating" },
    { value: "price", label: "Price" },
    { value: "dateAdded", label: "Date Added" },
  ]

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
    setFilters({
      ...filters,
      priceRange: value as [number, number],
    })
  }

  const handleYearRangeChange = (value: number[]) => {
    setYearRange([value[0], value[1]])
    setFilters({
      ...filters,
      yearRange: value as [number, number],
    })
  }

  const toggleSortDirection = () => {
    setSort({
      ...sort,
      direction: sort.direction === "asc" ? "desc" : "asc",
    })
  }

  const handleSortFieldChange = (value: string) => {
    setSort({
      ...sort,
      field: value as SortOptions["field"],
    })
  }

  const handleTypeChange = (value: string) => {
    setFilters({
      ...filters,
      type: value as WineType | "All",
    })
  }

  const handleRegionChange = (value: string) => {
    setFilters({
      ...filters,
      region: value as WineRegion | "All",
    })
  }

  const handleRatingChange = (value: string) => {
    setFilters({
      ...filters,
      rating: value === "All" ? "All" : (Number(value) as WineRating),
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.type !== "All") count++
    if (filters.region !== "All") count++
    if (filters.rating !== "All") count++
    if (filters.yearRange !== "All") count++
    if (filters.priceRange !== "All") count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 rounded-full border-wine-200 dark:border-wine-800"
              >
                <Filter className="h-4 w-4 mr-1" />
                <span>Filter</span>
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1 bg-wine-500 hover:bg-wine-600 text-white">{activeFiltersCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2 text-xs">
                    Reset All
                  </Button>
                </div>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="type">
                  <AccordionTrigger className="px-4">Wine Type</AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {wineTypes.map((type) => (
                        <Button
                          key={type}
                          variant={filters.type === type ? "default" : "outline"}
                          size="sm"
                          className={`text-xs h-8 ${filters.type === type ? "bg-wine-500 hover:bg-wine-600" : ""}`}
                          onClick={() => handleTypeChange(type)}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="region">
                  <AccordionTrigger className="px-4">Region</AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {wineRegions.map((region) => (
                        <Button
                          key={region}
                          variant={filters.region === region ? "default" : "outline"}
                          size="sm"
                          className={`text-xs h-8 ${filters.region === region ? "bg-wine-500 hover:bg-wine-600" : ""}`}
                          onClick={() => handleRegionChange(region)}
                        >
                          {region}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="rating">
                  <AccordionTrigger className="px-4">Rating</AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="grid grid-cols-3 gap-2">
                      {wineRatings.map((rating) => (
                        <Button
                          key={rating}
                          variant={filters.rating === rating ? "default" : "outline"}
                          size="sm"
                          className={`text-xs h-8 ${filters.rating === rating ? "bg-wine-500 hover:bg-wine-600" : ""}`}
                          onClick={() => handleRatingChange(String(rating))}
                        >
                          {rating === "All" ? "All" : `${rating} ★`}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="year">
                  <AccordionTrigger className="px-4">Year</AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[1990, 2023]}
                        min={1950}
                        max={2023}
                        step={1}
                        value={yearRange}
                        onValueChange={handleYearRangeChange}
                        className="my-6"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{yearRange[0]}</span>
                        <span className="text-sm">{yearRange[1]}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                  <AccordionTrigger className="px-4">Price Range</AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[0, 200]}
                        min={0}
                        max={200}
                        step={5}
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        className="my-6"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">${priceRange[0]}</span>
                        <span className="text-sm">${priceRange[1]}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="p-4 border-t flex justify-end">
                <Button size="sm" className="bg-wine-500 hover:bg-wine-600" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <AnimatePresence>
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-wrap gap-2"
              >
                {filters.type !== "All" && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-wine-50 dark:bg-wine-900/30 text-wine-700 dark:text-wine-300"
                  >
                    Type: {filters.type}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, type: "All" })} />
                  </Badge>
                )}
                {filters.region !== "All" && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-wine-50 dark:bg-wine-900/30 text-wine-700 dark:text-wine-300"
                  >
                    Region: {filters.region}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, region: "All" })} />
                  </Badge>
                )}
                {filters.rating !== "All" && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-wine-50 dark:bg-wine-900/30 text-wine-700 dark:text-wine-300"
                  >
                    Rating: {filters.rating} ★
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, rating: "All" })} />
                  </Badge>
                )}
                {filters.yearRange !== "All" && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-wine-50 dark:bg-wine-900/30 text-wine-700 dark:text-wine-300"
                  >
                    Year: {yearRange[0]}-{yearRange[1]}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        setFilters({ ...filters, yearRange: "All" })
                        setYearRange([1990, 2023])
                      }}
                    />
                  </Badge>
                )}
                {filters.priceRange !== "All" && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-wine-50 dark:bg-wine-900/30 text-wine-700 dark:text-wine-300"
                  >
                    Price: ${priceRange[0]}-${priceRange[1]}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        setFilters({ ...filters, priceRange: "All" })
                        setPriceRange([0, 200])
                      }}
                    />
                  </Badge>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={sort.field} onValueChange={handleSortFieldChange}>
            <SelectTrigger className="w-[140px] h-9 rounded-full border-wine-200 dark:border-wine-800">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortFields.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={toggleSortDirection} className="h-9 w-9 rounded-full">
            {sort.direction === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
