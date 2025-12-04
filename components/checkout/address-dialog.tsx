"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { UserAddress } from "@/lib/types/database"

interface AddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddressAdded: (address: UserAddress) => void
}

export function AddressDialog({ open, onOpenChange, onAddressAdded }: AddressDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    address_name: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    is_default: false,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Usuario no autenticado")

      const { data, error } = await supabase
        .from("user_addresses")
        .insert({
          user_id: user.id,
          ...formData,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Dirección agregada",
        description: "La dirección se guardó correctamente",
      })

      onAddressAdded(data)
      onOpenChange(false)
      setFormData({
        address_name: "",
        street: "",
        city: "",
        state: "",
        postal_code: "",
        is_default: false,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la dirección",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Dirección</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address_name">Nombre de la dirección</Label>
            <Input
              id="address_name"
              placeholder="Casa, Oficina, etc."
              value={formData.address_name}
              onChange={(e) => setFormData({ ...formData, address_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="street">Calle y número</Label>
            <Input
              id="street"
              placeholder="Av. Principal #123"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                placeholder="Ciudad"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                placeholder="Estado"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">Código Postal</Label>
            <Input
              id="postal_code"
              placeholder="12345"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked as boolean })}
            />
            <Label htmlFor="is_default" className="cursor-pointer">
              Establecer como dirección predeterminada
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Dirección"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
