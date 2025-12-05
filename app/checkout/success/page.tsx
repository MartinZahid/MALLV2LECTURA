"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Package, Home, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const total = searchParams.get("total")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-500 animate-bounce-slow" />
          </div>
          <h1 className="text-4xl font-bold text-balance mb-3">¡Pago Exitoso!</h1>
          <p className="text-lg text-muted-foreground text-pretty">Tu orden ha sido procesada correctamente</p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="text-2xl">Detalles de tu Compra</CardTitle>
            <CardDescription>Guarda esta información para tu referencia</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Número de Orden</span>
              <span className="font-mono font-semibold text-lg">
                {orderId || "NXS-" + Date.now().toString(36).toUpperCase()}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Pagado</span>
              <span className="text-2xl font-bold text-primary">${total || "0.00"}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Fecha</span>
              <span className="font-medium">
                {new Date().toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="text-xl">Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-lg mt-1">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Confirmación enviada</h4>
                <p className="text-sm text-muted-foreground">
                  Hemos enviado un correo con los detalles de tu compra y el recibo.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-lg mt-1">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Preparando tu pedido</h4>
                <p className="text-sm text-muted-foreground">
                  Las tiendas están procesando tu orden. Recibirás actualizaciones de seguimiento pronto.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Button asChild className="flex-1" size="lg">
            <Link href={`/orders/${orderId || "pending"}`}>
              <Package className="w-5 h-5 mr-2" />
              Ver Seguimiento de Orden
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-transparent" size="lg">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Volver al Inicio
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <div
          className="mt-8 p-4 bg-muted/50 rounded-lg text-center animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-sm text-muted-foreground">
            ¿Tienes preguntas sobre tu pedido?{" "}
            <Link href="/profile" className="text-primary hover:underline font-medium">
              Contacta soporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
