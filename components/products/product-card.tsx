"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { ProductQuickView } from "./product-quick-view"

interface Product {
  id: string
  store_id: number
  name: string
  description: string
  price: number
  image_url: string
  category: string
  sizes?: string[]
  colors?: string[]
  in_stock: boolean
  discount_percentage?: number
}

interface ProductCardProps {
  product: Product
  storeId: number
}

export function ProductCard({ product, storeId }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false)

  const finalPrice = product.discount_percentage
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price

  return (
    <>
      <div className="hover:-translate-y-2 transition-all duration-300">
        <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
          <div className="aspect-square relative bg-muted overflow-hidden">
            <div className="hover:scale-110 transition-transform duration-300">
              <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            {product.discount_percentage && (
              <div className="animate-scale-in animation-delay-200">
                <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                  -{product.discount_percentage}%
                </Badge>
              </div>
            )}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary">No Disponible</Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{product.description}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {product.discount_percentage ? (
                  <>
                    <span className="text-lg font-bold text-primary">${finalPrice.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                )}
              </div>
              <div className="hover:scale-105 active:scale-95 transition-transform">
                <Button
                  className="w-full"
                  onClick={() => setShowQuickView(true)}
                  disabled={!product.in_stock}
                  variant={product.in_stock ? "default" : "secondary"}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.in_stock ? "Agregar al Carrito" : "No Disponible"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

     <ProductQuickView
        product={product}
        storeId={storeId}  
        open={showQuickView}
        onOpenChange={setShowQuickView}
      />
    </>
  )
}
