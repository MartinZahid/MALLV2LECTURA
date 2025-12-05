"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { UserPaymentMethod } from "@/lib/types/database"

interface PaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPaymentMethodAdded: (method: UserPaymentMethod) => void
}

export function PaymentMethodDialog({ open, onOpenChange, onPaymentMethodAdded }: PaymentMethodDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    cardholder_name: "",
    card_number: "",
    cvv: "",
    card_exp_month: "",
    card_exp_year: "",
    card_brand: "visa",
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

      // In production, this would tokenize the card with a payment processor
      const { data, error } = await supabase
        .from("user_payment_methods")
        .insert({
          user_id: user.id,
          payment_type: "card",
          card_number: formData.card_number,
          cvv: formData.cvv,
          card_exp_month: formData.card_exp_month, // Placeholder
          card_exp_year: formData.card_exp_year, // Placeholder
          card_brand: formData.card_brand,
          cardholder_name: formData.cardholder_name,
          is_default: formData.is_default,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Método de pago agregado",
        description: "El método de pago se guardó correctamente",
      })

      onPaymentMethodAdded(data)
      onOpenChange(false)
      setFormData({
        cardholder_name: "",
        card_number: "",
        cvv: "",
        card_exp_month: "",
        card_exp_year: "",
        card_brand: "visa",
        is_default: false,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el método de pago",
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
          <DialogTitle>Agregar Método de Pago</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardholder_name">Nombre del titular</Label>
            <Input
              id="cardholder_name"
              placeholder="Juan Pérez"
              value={formData.cardholder_name}
              onChange={(e) => setFormData({ ...formData, cardholder_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card_number">Número de tarjeta</Label>
            <Input
              id="card_number"
              placeholder="1234 5678 9012 3456"
              value={formData.card_number}
              onChange={(e) => setFormData({ ...formData, card_number: e.target.value.replace(/\s/g, "") })}
              maxLength={16}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={formData.cvv}
              onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
              maxLength={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card_exp_month">Mes de expiración</Label>
            <Input
              id="card_exp_month"
              placeholder="MM"
              value={formData.card_exp_month}
              onChange={(e) => setFormData({ ...formData, card_exp_month: e.target.value })}
              maxLength={2}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card_exp_year">Año de expiración</Label>
            <Input
              id="card_exp_year"
              placeholder="YYYY"
              value={formData.card_exp_year}
              onChange={(e) => setFormData({ ...formData, card_exp_year: e.target.value })}
              maxLength={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card_brand">Tipo de tarjeta</Label>
            <Select
              value={formData.card_brand}
              onValueChange={(value) => setFormData({ ...formData, card_brand: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="mastercard">Mastercard</SelectItem>
                <SelectItem value="amex">American Express</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default_payment"
              checked={formData.is_default}
              onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked as boolean })}
            />
            <Label htmlFor="is_default_payment" className="cursor-pointer">
              Establecer como método predeterminado
            </Label>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Nota: Esta es una demostración. En producción, los datos de la tarjeta se procesarían de forma segura.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Método de Pago"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
