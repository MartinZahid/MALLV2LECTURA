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

export function useStoreUUID(storeId: number) {
  const [storeUUID, setStoreUUID] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadStoreUUID() {
      try {
        setLoading(true)
        const uuid = await storesApi.getStoreUUID(storeId)
        setStoreUUID(uuid)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadStoreUUID()
  }, [storeId])

  return { storeUUID, loading, error }
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

export function useStoreRegisterApiUrl(storeId: string) {
  const [apiUrl, setApiUrl] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadApiUrl() {
      setLoading(true)
      try {
        const url = await storesApi.getRegisterApiUrl(storeId)
        setApiUrl(url)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    loadApiUrl()
  }, [storeId])

  return { apiUrl, loading, error }
}

export function useStoreBankAccount(storeId: string) {
  const [bankAccount, setBankAccount] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadBankAccount() {
      try {
        setLoading(true)
        const account = await storesApi.getStoreBankAccount(storeId)
        setBankAccount(account)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadBankAccount()
  }, [storeId])

  return { bankAccount, loading, error }
}
