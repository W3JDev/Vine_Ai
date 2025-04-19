"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"

interface MenuItemDetailsProps {
  item: any
  ingredients: any[]
  allergens: any[]
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: any) => void
}

export function MenuItemDetails({ item, ingredients, allergens, isOpen, onClose, onAddToCart }: MenuItemDetailsProps) {
  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>RM {item.price.toFixed(2)}</DialogDescription>
        </DialogHeader>

        <div className="relative h-64 w-full mb-4">
          <Image
            src={item.image_url || `/placeholder.svg?height=256&width=576`}
            alt={item.name}
            fill
            className="object-cover rounded-md"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Description</h4>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>

          {item.portion_size && (
            <div>
              <h4 className="font-medium mb-1">Portion Size</h4>
              <p className="text-sm text-gray-500">{item.portion_size}</p>
            </div>
          )}

          {ingredients.length > 0 && (
            <div>
              <h4 className="font-medium mb-1">Ingredients</h4>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <Badge key={ingredient.id} variant="outline">
                    {ingredient.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {allergens.length > 0 && (
            <div>
              <h4 className="font-medium mb-1">Allergens</h4>
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen) => (
                  <Badge key={allergen.id} variant="outline" className="bg-red-50">
                    {allergen.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={() => onAddToCart(item)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
