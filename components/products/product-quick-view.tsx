"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cartApi } from "@/lib/api/cart"
import { authApi } from "@/lib/api/auth"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { storesApi } from "@/lib/api/stores"


import { availabilityApi } from "@/lib/api/availability";




interface Product {
  id: string
  name: string
  store_id: number
  description: string
  price: number
  image_url: string
  category: string
  sizes?: string[]
  colors?: string[]
  in_stock: boolean
  discount_percentage?: number
}

interface ProductQuickViewProps {
  product: Product
  storeId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}
export function ProductQuickView({ product, storeId, open, onOpenChange }: ProductQuickViewProps) {
  // ... (tus estados se mantienen igual)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const finalPrice = product.discount_percentage
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price

 const handleAddToCart = async () => {
    try {
      console.log("1. Iniciando addToCart...");
      const user = await authApi.getCurrentUser()

      if (!user) {
        toast({
          title: "Inicia sesión",
          description: "Debes iniciar sesión para agregar productos al carrito",
          variant: "destructive",
        })
        router.push("/auth/login?redirect=/cart")
        return
      }

      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        toast({
          title: "Selecciona una talla",
          description: "Por favor selecciona una talla antes de agregar al carrito",
          variant: "destructive",
        })
        return
      }

   
      const storeIdToUse = product.store_id; 
      console.log('Objeto completo:', product);
      console.log("2. ID de tienda detectado:", storeIdToUse);

      if (!storeIdToUse) {
        toast({ title: "Error", description: "No se identificó la tienda.", variant: "destructive" });
        return;
      }

      setIsLoading(true)

      // CORRECCIÓN 2: Agregamos la validación de stock que faltaba
      console.log("3. Verificando stock con API...");
      const hasStock = await availabilityApi.checkStock(storeIdToUse, product.id, quantity);
      console.log("4. ¿Hay stock?:", hasStock);

      if (!hasStock) {
        toast({
          title: "Stock insuficiente",
          description: `Lo sentimos, la tienda no cuenta con ${quantity} unidades disponibles.`,
          variant: "destructive",
        })
        setIsLoading(false) // Apagamos la carga
        return; // Detenemos el proceso
      }

      console.log("5. Stock OK. Obteniendo UUID...");
      const storeUUID = await storesApi.getStoreUUID(storeIdToUse);

      await cartApi.addItem({
        user_id: user.id,
        store_id: storeUUID,
        product_external_id: product.id,
        product_name: product.name,
        product_description: product.description,
        product_image_url: product.image_url,
        price: finalPrice,
        quantity,
        size: selectedSize || null,
        color: selectedColor || null,
        is_available: product.in_stock,
      })

      toast({
        title: "Producto agregado",
        description: `${product.name} se agregó a tu carrito`,
      })

      onOpenChange(false)
      router.refresh()

    } catch (error: any) {
      console.error("ERROR FINAL:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar el producto al carrito",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleAddToWishlist = async () => {
    const supabase = getSupabaseBrowserClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar productos",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    try {
      const { error } = await supabase.from("wishlist_items").insert({
        user_id: user.id,
        store_id: storeId,
        product_external_id: product.id,
        product_name: product.name,
        product_image_url: product.image_url,
        price: finalPrice,
      })

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Ya está en tu lista",
            description: "Este producto ya está en tu lista de deseos",
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Guardado",
          description: "Producto agregado a tu lista de deseos",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el producto",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
            <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-center gap-3">
              {product.discount_percentage ? (
                <>
                  <span className="text-3xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
                  <span className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                  <span className="text-sm font-semibold text-destructive">-{product.discount_percentage}%</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <Label>Talla</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <div key={size} className="flex items-center">
                        <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                        <Label
                          htmlFor={`size-${size}`}
                          className="flex items-center justify-center px-4 py-2 border border-border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted transition-colors"
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <Label>Color</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <div key={color} className="flex items-center">
                        <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                        <Label
                          htmlFor={`color-${color}`}
                          className="flex items-center justify-center px-4 py-2 border border-border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted transition-colors"
                        >
                          {color}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="space-y-3">
              <Label>Cantidad</Label>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
                <SelectTrigger>
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
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleAddToCart} disabled={isLoading || !product.in_stock}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isLoading ? "Agregando..." : "Agregar al Carrito"}
              </Button>
              <Button variant="outline" size="icon" onClick={handleAddToWishlist}>
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}