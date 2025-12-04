"use client"

import { ProductCard } from "./product-card"
import { Spinner } from "@/components/ui/spinner"
import { Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useProducts } from "@/hooks/use-products"
import { useEffect } from "react"

interface Product {
  id: string
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

interface ProductGridProps {
  storeId: number
  storeType: "product" | "service"
}

export function ProductGrid({ storeId, storeType }: ProductGridProps) {
  const { products, loading, error } = useProducts(storeId)
  const { toast } = useToast()

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    }
  }, [error, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-4">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="text-muted-foreground">Cargando productos...</p>
      </div>
    )
  }

  if (storeType === "service") {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">
          Esta es una tienda de servicios. Por favor, visita la sección de servicios para agendar una cita.
        </p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-4 animate-scale-in">
        <Package className="h-24 w-24 text-muted-foreground/30" />
        <p className="text-center text-muted-foreground text-lg">No hay productos disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <ProductCard product={product} storeId={storeId} />
          </div>
        ))}
      </div>
    </div>
  )
}
