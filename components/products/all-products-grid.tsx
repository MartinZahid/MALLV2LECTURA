"use client"

import { useState } from "react"
import { ProductCard } from "./product-card"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useProducts } from "@/hooks/use-products"

export function AllProductsGrid() {
  const { products, loading, error } = useProducts()
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  if (error) {
    toast({
      title: "Error",
      description: "No se pudieron cargar los productos",
      variant: "destructive",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  // Get unique store names for tabs
  const storeNames = Array.from(new Set(products.map((p) => p.storeName)))

  const filteredProducts = activeTab === "all" ? products : products.filter((p) => p.storeName === activeTab)

  return (
    <div className="space-y-6">
      {storeNames.length > 1 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            {storeNames.map((name) => (
              <TabsTrigger key={name} value={name}>
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={`${product.storeId}-${product.id}`} product={product} storeId={product.storeId} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No se encontraron productos</p>
      )}
    </div>
  )
}
