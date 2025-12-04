"use client"

import { useState, useEffect } from "react"
import { servicesApi } from "@/lib/api/services"

export function useServices(storeSlug: string) {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true)
        const data = await servicesApi.getByStore(storeSlug)
        setServices(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (storeSlug) {
      loadServices()
    }
  }, [storeSlug])

  return { services, loading, error }
}

export function useAvailability(storeSlug: string, date: string, serviceId?: string) {
  const [slots, setSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadAvailability() {
      if (!date) return

      try {
        setLoading(true)
        const data = await servicesApi.checkAvailability(storeSlug, date, serviceId)
        setSlots(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (storeSlug && date) {
      loadAvailability()
    }
  }, [storeSlug, date, serviceId])

  return { slots, loading, error }
}
