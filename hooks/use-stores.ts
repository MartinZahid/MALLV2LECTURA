"use client"

import { useState, useEffect } from "react"
import { storesApi } from "@/lib/api/stores"
import type { Store } from "@/lib/types/database"

export function useStores() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadStores() {
      try {
        setLoading(true)
        const data = await storesApi.getAll()
        setStores(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadStores()
  }, [])

  return { stores, loading, error }
}

export function useProductStores() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadStores() {
      try {
        setLoading(true)
        const data = await storesApi.getProductStores()
        setStores(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadStores()
  }, [])

  return { stores, loading, error }
}

export function useServiceStores() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadStores() {
      try {
        setLoading(true)
        const data = await storesApi.getServiceStores()
        setStores(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadStores()
  }, [])

  return { stores, loading, error }
}
