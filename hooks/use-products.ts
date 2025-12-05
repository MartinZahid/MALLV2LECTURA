"use client"

import { useState, useEffect } from "react"
import { productsApi } from "@/lib/api/products"
import { storesApi } from "@/lib/api/stores"

export function useProducts(storeId?: number) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)

        let data

        if (storeId) {
          data = await productsApi.getByStore(storeId)
        } else {
          const stores = await storesApi.getProductStores()
          const storeData = stores.map(s => ({ id: s.store_id, name: s.name }))
          data = await productsApi.getAll(storeData)
        }

        console.log("API RAW DATA:", data)

        const mapped = data.map((p: any) => ({
          id: p.id,
          store_id: p.store_id,
          name: p.nombre,
          description: p.description,
          price: p.precio,
          image_url: "/placeholder.png", // Si no tienes imagen
          category: "general",
          sizes: p.talla ? [p.talla] : [],
          colors: p.color ? [p.color] : [],
          in_stock: p.stock > 0,
          discount_percentage: 0,
        }))

        console.log("MAPPED:", mapped)

        setProducts(mapped)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [storeId])

  return { products, loading, error }
}
