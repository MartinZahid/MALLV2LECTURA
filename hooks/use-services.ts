"use client"

import { useState, useEffect } from "react"
import { servicesApi } from "@/lib/api/services"

export function useServices(storeId: number) {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true)
        const data = await servicesApi.getByStore(storeId)

        // 🔥 MAPEO IMPORTANTE
        const mapped = data.map((item: any) => ({
          id: item.id?.toString(),
          name: item.nombre,
          description: item.description,
          price: item.precio,
          duration_minutes: item.duracion_minutos,
          category: item.category ?? "general",
          image_url: item.image_url ?? null,
        }))

        console.log("Mapped Services:", mapped) // Debug log

        setServices(mapped)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (storeId) {
      loadServices()
    }
  }, [storeId])

  return { services, loading, error }
}