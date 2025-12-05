"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { XCircle, AlertCircle, RefreshCw, Home, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const errorCode = searchParams.get("error_code")
  const errorMessage = searchParams.get("error_message")

  const getErrorDetails = () => {
    switch (errorCode) {
      case "insufficient_funds":
        return {
          title: "Fondos Insuficientes",
          description: "Tu tarjeta no tiene fondos suficientes para completar la transacción.",
          icon: CreditCard,
        }
      case "card_declined":
        return {
          title: "Tarjeta Rechazada",
          description: "Tu banco rechazó la transacción. Por favor, contacta a tu banco para más información.",
          icon: XCircle,
        }
      case "expired_card":
        return {
          title: "Tarjeta Expirada",
          description: "La tarjeta que intentaste usar ha expirado.",
          icon: CreditCard,
        }
      case "network_error":
        return {
          title: "Error de Conexión",
          description: "Hubo un problema con la conexión. Por favor, intenta nuevamente.",
          icon: AlertCircle,
        }
      default:
        return {
          title: "Pago Rechazado",
          description:
            errorMessage || "No pudimos procesar tu pago. Por favor, verifica tus datos e intenta nuevamente.",
          icon: XCircle,
        }
    }
  }

  const errorDetails = getErrorDetails()
  const ErrorIcon = errorDetails.icon

  const handleRetry = () => {
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Error Icon */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
            <ErrorIcon className="w-16 h-16 text-red-600 dark:text-red-500 animate-pulse-slow" />
          </div>
          <h1 className="text-4xl font-bold text-balance mb-3">Pago No Procesado</h1>
          <p className="text-lg text-muted-foreground text-pretty">Lo sentimos, no pudimos completar tu transacción</p>
        </div>

        {/* Error Details Alert */}
        <Alert variant="destructive" className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">{errorDetails.title}</AlertTitle>
          <AlertDescription className="text-base mt-2">{errorDetails.description}</AlertDescription>
        </Alert>

        {/* What Happened Card */}
        <Card className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle>¿Qué Pasó?</CardTitle>
            <CardDescription>Tu pago no pudo ser procesado por el siguiente motivo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Código de Error</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {errorCode?.toUpperCase() || "PAYMENT_FAILED"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions Card */}
        <Card className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-xl">Cómo Resolver Esto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-lg mt-1">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Verifica tus datos de pago</h4>
                  <p className="text-xs text-muted-foreground">
                    Asegúrate de que los datos de tu tarjeta sean correctos (número, fecha de expiración, CVV).
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-lg mt-1">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Intenta con otro método de pago</h4>
                  <p className="text-xs text-muted-foreground">Usa otra tarjeta o método de pago disponible.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-lg mt-1">
                  <AlertCircle className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Contacta a tu banco</h4>
                  <p className="text-xs text-muted-foreground">
                    Si el problema persiste, comunícate con tu banco para verificar que no haya restricciones.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button onClick={handleRetry} className="flex-1" size="lg">
            <RefreshCw className="w-5 h-5 mr-2" />
            Reintentar Pago
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-transparent" size="lg">
            <Link href="/cart">
              <Home className="w-5 h-5 mr-2" />
              Volver al Carrito
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <div
          className="mt-8 p-4 bg-muted/50 rounded-lg text-center animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <p className="text-sm text-muted-foreground mb-2">¿Necesitas ayuda con tu pago?</p>
          <Link href="/profile" className="text-primary hover:underline font-medium text-sm">
            Contactar Soporte de Nexus Center
          </Link>
        </div>
      </div>
    </div>
  )
}
