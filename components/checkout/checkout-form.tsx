"use client"

import { useState } from "react"
import { bankApi } from "@/lib/api/bank"
import { paymentApi } from "@/lib/api/payment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, CreditCard } from "lucide-react"
import { AddressDialog } from "./address-dialog"
import { PaymentMethodDialog } from "./payment-method-dialog"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { CartItem, UserAddress, UserPaymentMethod } from "@/lib/types/database"
import Image from "next/image"
import { TransactionRequest, TransactionResponse } from "@/lib/types/transaction"
import { storesApi } from "@/lib/api/stores"

interface CheckoutFormProps {
  cartItems: CartItem[]
  addresses: UserAddress[]
  paymentMethods: UserPaymentMethod[]
  storeId: string
}

export function CheckoutForm({
  cartItems: initialCartItems,
  addresses: initialAddresses,
  paymentMethods: initialPaymentMethods,
  storeId,
}: CheckoutFormProps) {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods)
  const [selectedAddress, setSelectedAddress] = useState(initialAddresses.find((a) => a.is_default)?.id || "")
  const [selectedPayment, setSelectedPayment] = useState(initialPaymentMethods.find((p) => p.is_default)?.id || "")
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery")
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  
  const subtotal = initialCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.16
  const shipping = deliveryType === "delivery" ? 5.0 : 0
  const total = subtotal + tax + shipping

  const handlePlaceOrder = async () => {
    if (deliveryType === "delivery" && !selectedAddress) {
      toast({
        title: "Dirección requerida",
        description: "Por favor selecciona una dirección de entrega",
        variant: "destructive",
      })
      return
    }

    if (!selectedPayment) {
      toast({
        title: "Método de pago requerido",
        description: "Por favor selecciona un método de pago",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuario no autenticado")

      // 1. OBTENER DETALLES COMPLETOS DEL MÉTODO DE PAGO
      // NOTA: Asegúrate de que UserPaymentMethod tenga los campos de tarjeta requeridos
      const paymentDetails = await paymentApi.getPaymentDetails(selectedPayment)

      const numeroDestino = await storesApi.getStoreBankAccount(storeId);
      console.log("DESTINO:", numeroDestino);

      
      // 2. PREPARAR LA SOLICITUD DE TRANSACCIÓN (Nexus API)
      const transactionData: TransactionRequest = {
        numero_tarjeta_origen: paymentDetails.card_number || "", // Debe ser el número completo
        numero_tarjeta_destino: numeroDestino || "", // Reemplazar con el valor real
        nombre_cliente: paymentDetails.cardholder_name,
        mes_exp: paymentDetails.card_exp_month,
        anio_exp: paymentDetails.card_exp_year,
        cvv: paymentDetails.cvv || "", // Debe ser el CVV
        monto: total,
      }

      // 3. PROCESAR EL PAGO (Llamada a Nexus API)
      const transactionResponse: TransactionResponse = await bankApi.createTransaction(transactionData)

      // 4. VERIFICAR LA RESPUESTA DE PAGO
      if (transactionResponse.NombreEstado !== "APROBADA") { // Asumiendo que 'APROBADA' es el estado de éxito
        toast({
          title: "Pago Rechazado",
          description: `La transacción fue rechazada: ${transactionResponse.Descripcion}`,
          variant: "destructive",
        })
        return
      }

      // El pago fue exitoso, ahora creamos la orden en Supabase

      const orderNumber = `NX-${Date.now().toString(36).toUpperCase()}`
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: total,
          status: "processing", // Cambia a processing si el pago es exitoso
          payment_status: "paid", // Cambia a 'paid'
          payment_method_id: selectedPayment,
          shipping_address_id: deliveryType === "delivery" ? selectedAddress : null,
          delivery_type: deliveryType,
          estimated_delivery:
            deliveryType === "delivery" ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() : null,
          // Guardar referencia de pago
          transaction_id: transactionResponse.IdTransaccion, 
          authorization_code: transactionResponse.NumeroAutorizacion,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // ... (Creación de order items, tracking y limpieza de carrito) ...

      toast({
        title: "Pedido realizado y pagado",
        description: `Tu pedido ${orderNumber} ha sido procesado y el pago ha sido exitoso.`,
      })

      router.push(`/orders/${order.id}`)
    } catch (error: any) {
      toast({
        title: "Error al procesar pedido",
        description: error.message || "Intenta de nuevo más tarde",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Delivery Type */}
        <Card>
          <CardHeader>
            <CardTitle>Tipo de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={deliveryType} onValueChange={(value: any) => setDeliveryType(value)}>
              <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                  <p className="font-semibold">Entrega a domicilio</p>
                  <p className="text-sm text-muted-foreground">Recibe tu pedido en casa (+$5.00)</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                  <p className="font-semibold">Recoger en tienda</p>
                  <p className="text-sm text-muted-foreground">Sin costo de envío</p>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        {deliveryType === "delivery" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dirección de Entrega</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowAddressDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </CardHeader>
            <CardContent>
              {addresses.length > 0 ? (
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                        <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                        <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <p className="font-semibold">{address.address_name}</p>
                            {address.is_default && <Badge variant="secondary">Predeterminada</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.street}, {address.city}, {address.state} {address.postal_code}
                          </p>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tienes direcciones guardadas. Agrega una para continuar.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment Method */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Método de Pago</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowPaymentDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </CardHeader>
          <CardContent>
            {paymentMethods.length > 0 ? (
              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                      <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <p className="font-semibold capitalize">{method.card_brand}</p>
                          {method.is_default && <Badge variant="secondary">Predeterminada</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">•••• •••• •••• {method.card_number?.slice(-4)}</p>
                        <p className="text-sm text-muted-foreground">{method.cardholder_name}</p>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tienes métodos de pago guardados. Agrega uno para continuar.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {initialCartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                    <Image
                      src={item.product_image_url || "/placeholder.svg"}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                    <p className="text-sm font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>IVA (16%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {deliveryType === "delivery" && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
              )}
              <div className="h-px bg-border" />
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessing}>
              {isProcessing ? "Procesando..." : "Realizar Pedido"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AddressDialog
        open={showAddressDialog}
        onOpenChange={setShowAddressDialog}
        onAddressAdded={(address) => setAddresses([...addresses, address])}
      />

      <PaymentMethodDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onPaymentMethodAdded={(method) => setPaymentMethods([...paymentMethods, method])}
      />
    </div>
  )
}
