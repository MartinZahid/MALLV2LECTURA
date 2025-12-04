"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, Trash2 } from "lucide-react"
import { PaymentMethodDialog } from "@/components/checkout/payment-method-dialog"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { UserPaymentMethod } from "@/lib/types/database"

interface PaymentMethodListProps {
  paymentMethods: UserPaymentMethod[]
}

export function PaymentMethodList({ paymentMethods: initialMethods }: PaymentMethodListProps) {
  const [paymentMethods, setPaymentMethods] = useState(initialMethods)
  const [showDialog, setShowDialog] = useState(false)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("user_payment_methods").delete().eq("id", id)

      if (error) throw error

      setPaymentMethods(paymentMethods.filter((m) => m.id !== id))
      toast({
        title: "Método eliminado",
        description: "El método de pago se eliminó correctamente",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el método de pago",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Métodos de Pago</CardTitle>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Método
        </Button>
      </CardHeader>
      <CardContent>
        {paymentMethods.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="p-4 border border-border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold text-foreground capitalize">{method.card_brand}</p>
                  </div>
                  {method.is_default && <Badge variant="secondary">Predeterminada</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  •••• •••• •••• {method.card_last_four}
                  <br />
                  {method.cardholder_name}
                </p>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(method.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No tienes métodos de pago guardados</p>
        )}
      </CardContent>

      <PaymentMethodDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onPaymentMethodAdded={(method) => setPaymentMethods([...paymentMethods, method])}
      />
    </Card>
  )
}
