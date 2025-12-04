"use client"

import { useState, useEffect } from "react"
import { cartApi } from "@/lib/api/cart"
import { authApi } from "@/lib/api/auth"
import type { CartItem } from "@/lib/types/database"

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadCart = async () => {
    try {
      setLoading(true)
      const user = await authApi.getCurrentUser()
      if (user) {
        const data = await cartApi.getItems(user.id)
        setItems(data)
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const addItem = async (item: Omit<CartItem, "id" | "added_at">) => {
    try {
      await cartApi.addItem(item)
      await loadCart()
    } catch (err) {
      throw err
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await cartApi.updateQuantity(itemId, quantity)
      await loadCart()
    } catch (err) {
      throw err
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await cartApi.removeItem(itemId)
      await loadCart()
    } catch (err) {
      throw err
    }
  }

  const moveToWishlist = async (itemId: string) => {
    try {
      const user = await authApi.getCurrentUser()
      if (user) {
        await cartApi.moveToWishlist(itemId, user.id)
        await loadCart()
      }
    } catch (err) {
      throw err
    }
  }

  const clearCart = async () => {
    try {
      const user = await authApi.getCurrentUser()
      if (user) {
        await cartApi.clearCart(user.id)
        await loadCart()
      }
    } catch (err) {
      throw err
    }
  }

  return {
    items,
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    moveToWishlist,
    clearCart,
    refresh: loadCart,
  }
}
