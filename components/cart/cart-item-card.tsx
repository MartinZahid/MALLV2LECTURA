"use client"

import { useState } from "react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Heart, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cartApi } from "@/lib/api/cart"
import { authApi } from "@/lib/api/auth"
import type { CartItem } from "@/lib/types/database"
import { Badge } from "@/components/ui/badge"

import { availabilityApi } from "@/lib/api/availability"

interface CartItemCardProps {
  item: CartItem
  isSelected: boolean
  onToggleSelect: () => void
  onRemove: () => void
  onUpdate: (item: CartItem) => void
}

export function CartItemCard({ item, isSelected, onToggleSelect, onRemove, onUpdate }: CartItemCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true)
    try {
      if (item.store && item.store.store_id) {
        // Llamamos  API de disponibilidad
        const hasStock = await availabilityApi.checkStock(
          item.store.store_id, 
          item.product_external_id, 
          newQuantity
        )

        if (!hasStock) {
          toast({
            title: "Stock insuficiente",
            description: `No hay ${newQuantity} unidades disponibles en la tienda.`,
            variant: "destructive",
          })
          return 
        }
      }


      await cartApi.updateQuantity(item.id, newQuantity)
      onUpdate({ ...item, quantity: newQuantity })
      toast({
        title: "Cantidad actualizada",
        description: "La cantidad del producto se actualizó correctamente",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la cantidad",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    try {
      await cartApi.removeItem(item.id)
      onRemove()
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó del carrito",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const handleMoveToWishlist = async () => {
    try {
      const user = await authApi.getCurrentUser()
      if (!user) throw new Error("User not authenticated")

      await cartApi.moveToWishlist(item.id, user.id)
      onRemove()
      toast({
        title: "Movido a lista de deseos",
        description: "El producto se movió a tu lista de deseos",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo mover el producto",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={`flex gap-4 p-4 rounded-lg border border-border ${!item.is_available ? "bg-muted/30" : ""}`}>
      <Checkbox
        checked={isSelected && item.is_available}
        onCheckedChange={onToggleSelect}
        disabled={!item.is_available}
      />

      <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted shrink-0">
        <Image
          src={item.product_image_url || "/placeholder.svg"}
          alt={item.product_name}
          fill
          className="object-cover"
        />
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{item.product_name}</h4>
            {item.product_description && (
              <p className="text-sm text-muted-foreground line-clamp-1">{item.product_description}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} c/u</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {item.size && (
            <Badge variant="outline" className="text-xs">
              Talla: {item.size}
            </Badge>
          )}
          {item.color && (
            <Badge variant="outline" className="text-xs">
              Color: {item.color}
            </Badge>
          )}
          {!item.is_available && (
            <Badge variant="destructive" className="text-xs">
              No Disponible
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Select
            value={item.quantity.toString()}
            onValueChange={(value) => handleQuantityChange(Number.parseInt(value))}
            disabled={isUpdating || !item.is_available}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={handleMoveToWishlist} className="h-8 px-2">
            <Heart className="h-4 w-4 mr-1" />
            <span className="text-xs">Guardar</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 px-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span className="text-xs">Eliminar</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
