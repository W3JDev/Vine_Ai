"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, ShoppingCart } from "lucide-react"

interface MenuItemCardProps {
  item: {
    id: number
    name: string
    description: string
    price: number
    image_url?: string
    is_vegetarian: boolean
    is_vegan: boolean
    is_gluten_free: boolean
  }
  onAddToCart: (item: any) => void
  onViewDetails: (item: any) => void
}

export function MenuItemCard({ item, onAddToCart, onViewDetails }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    onAddToCart({ ...item, quantity })
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={item.image_url || `/placeholder.svg?height=192&width=384`}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <div className="text-lg font-bold">RM {item.price.toFixed(2)}</div>
        </div>
        <div className="flex gap-1 mt-1">
          {item.is_vegetarian && (
            <Badge variant="outline" className="bg-green-100">
              Vegetarian
            </Badge>
          )}
          {item.is_vegan && (
            <Badge variant="outline" className="bg-green-200">
              Vegan
            </Badge>
          )}
          {item.is_gluten_free && (
            <Badge variant="outline" className="bg-yellow-100">
              Gluten-Free
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(item)}>
          <Info className="h-4 w-4 mr-2" />
          Details
        </Button>
        <Button onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
