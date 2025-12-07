"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation" // Importar useRouter para la navegación manual
import { CartItemCard } from "./cart-item-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingBag, Sparkles, Loader2 } from "lucide-react" // Importar Loader2 para indicar carga
import Link from "next/link"
import type { CartItem } from "@/lib/types/database"
import { availabilityApi } from "@/lib/api/availability" // Importar la API de disponibilidad
import { useToast } from "@/hooks/use-toast" // Importar hook para notificaciones

interface CartContentProps {
  initialCartItems: CartItem[]
}

export function CartContent({ initialCartItems }: CartContentProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(initialCartItems.map((item) => item.id)))
  

  const [isCheckingStock, setIsCheckingStock] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()

  // Group items by store
  const itemsByStore = useMemo(() => {
    const grouped = new Map<string, CartItem[]>()
    cartItems.forEach((item) => {
      const storeId = item.store_id
      if (!grouped.has(storeId)) {
        grouped.set(storeId, [])
      }
      grouped.get(storeId)!.push(item)
    })
    return grouped
  }, [cartItems])

  const handleItemRemoved = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const handleItemUpdated = (updatedItem: CartItem) => {
    setCartItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const toggleStoreSelection = (storeId: string) => {
    const storeItems = itemsByStore.get(storeId) || []
    const storeItemIds = storeItems.map((item) => item.id)
    const allSelected = storeItemIds.every((id) => selectedItems.has(id))

    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (allSelected) {
        storeItemIds.forEach((id) => newSet.delete(id))
      } else {
        storeItemIds.forEach((id) => newSet.add(id))
      }
      return newSet
    })
  }

  //proceso de validacion de stcok 
  const handleProceedToCheckout = async () => {
    if (availableSelectedItems.length === 0) return

    setIsCheckingStock(true)
    const outOfStockItems: string[] = []

    try {
    
      await Promise.all(
        availableSelectedItems.map(async (item) => {
          if (item.store && item.store.store_id) {
            const hasStock = await availabilityApi.checkStock(
              item.store.store_id,
              item.product_external_id,
              item.quantity
            )

            if (!hasStock) {
              outOfStockItems.push(item.product_name)
            }
          }
        })
      )

      if (outOfStockItems.length > 0) {
      
        toast({
          title: "Stock insuficiente",
          description: `Los siguientes productos ya no tienen stock suficiente: ${outOfStockItems.join(", ")}. Por favor ajusta las cantidades.`,
          variant: "destructive",
        })
      } else {
       
        router.push("/checkout")
      }
    } catch (error) {
      console.error("Error verificando stock:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al verificar la disponibilidad. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingStock(false)
    }
  }

  const selectedCartItems = cartItems.filter((item) => selectedItems.has(item.id))
  const availableSelectedItems = selectedCartItems.filter((item) => item.is_available)

  const subtotal = availableSelectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.16 // 16% IVA
  const total = subtotal + tax

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in">
        <div className="relative animate-bounce-slow">
          <ShoppingBag className="h-32 w-32 text-muted-foreground/30" />
          <div className="absolute -top-2 -right-2 animate-pulse">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-serif font-bold text-foreground">Tu carrito está vacío</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Descubre productos increíbles en nuestras tiendas y comienza tu experiencia de compra
        </p>
        <Link href="/stores">
          <Button size="lg" className="group">
            Explorar Tiendas
            <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        {Array.from(itemsByStore.entries()).map(([storeId, items], index) => {
          const store = items[0]?.store
          if (!store) return null

          const storeItemIds = items.map((item) => item.id)
          const allStoreItemsSelected = storeItemIds.every((id) => selectedItems.has(id))
          const someStoreItemsSelected = storeItemIds.some((id) => selectedItems.has(id))

          return (
            <div key={storeId} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  {/* Store Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <Checkbox
                      checked={allStoreItemsSelected}
                      onCheckedChange={() => toggleStoreSelection(storeId)}
                      className={
                        someStoreItemsSelected && !allStoreItemsSelected ? "data-[state=checked]:bg-primary/50" : ""
                      }
                    />
                    <h3 className="font-semibold text-lg text-foreground">{store.name}</h3>
                  </div>

                  {/* Store Items */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        isSelected={selectedItems.has(item.id)}
                        onToggleSelect={() => toggleItemSelection(item.id)}
                        onRemove={() => handleItemRemoved(item.id)}
                        onUpdate={handleItemUpdated}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="animate-slide-left">
          <Card className="sticky top-20 border-2 border-primary/10 shadow-lg">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-xl text-foreground">Resumen del Pedido</h3>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Productos seleccionados:</span>
                  <span className="font-semibold text-foreground">{availableSelectedItems.length}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>IVA (16%):</span>
                  <span className="font-semibold text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="flex justify-between text-xl font-bold animate-pulse-slow">
                  <span className="gradient-text">Total:</span>
                  <span className="gradient-text">${total.toFixed(2)}</span>
                </div>
              </div>

              {selectedCartItems.length > 0 && availableSelectedItems.length === 0 && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg animate-fade-in">
                  Los productos seleccionados no están disponibles
                </p>
              )}

              {/* Botón modificado para usar onClick y validar stock */}
              <Button 
                className="w-full group" 
                size="lg" 
                disabled={availableSelectedItems.length === 0 || isCheckingStock}
                onClick={handleProceedToCheckout}
              >
                {isCheckingStock ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando stock...
                  </>
                ) : (
                  <>
                    Proceder al Pago
                    <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </Button>

              <Link href="/stores">
                <Button variant="outline" className="w-full bg-transparent hover:bg-primary/5">
                  Continuar Comprando
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}