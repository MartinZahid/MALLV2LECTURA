"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from "lucide-react"

interface OrderTrackingProps {
  order: any
}

const trackingSteps = [
  { id: "pending", label: "Pedido Recibido", icon: Clock },
  { id: "processing", label: "En Preparación", icon: Package },
  { id: "shipped", label: "En Camino", icon: Truck },
  { id: "delivered", label: "Entregado", icon: CheckCircle },
]

const statusMap: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
}

export function OrderTracking({ order }: OrderTrackingProps) {
  const [currentStep, setCurrentStep] = useState(statusMap[order.status] || 0)
  const [trackingUpdates, setTrackingUpdates] = useState([
    {
      date: new Date(order.created_at),
      status: "Pedido confirmado",
      description: "Tu pedido ha sido recibido y confirmado",
    },
  ])

  useEffect(() => {
    // Simulate tracking updates based on order status
    const updates = [
      {
        date: new Date(order.created_at),
        status: "Pedido confirmado",
        description: "Tu pedido ha sido recibido y confirmado",
      },
    ]

    if (currentStep >= 1) {
      updates.push({
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "En preparación",
        description: "La tienda está preparando tu pedido",
      })
    }

    if (currentStep >= 2) {
      updates.push({
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: "En camino",
        description: "Tu pedido está en camino",
      })
    }

    if (currentStep >= 3) {
      updates.push({
        date: new Date(),
        status: "Entregado",
        description: "Tu pedido ha sido entregado exitosamente",
      })
    }

    setTrackingUpdates(updates.reverse())
  }, [currentStep, order.created_at])

  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">Seguimiento de Pedido</h1>
          <Badge variant="secondary" className="text-sm">
            #{order.id.slice(0, 8)}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Fecha de pedido:{" "}
          {new Date(order.created_at).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Tracking Progress */}
      <div className="animate-slide-up animation-delay-100">
        <Card className="p-8">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-muted">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-in-out"
                style={{ width: `${(currentStep / (trackingSteps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {trackingSteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index <= currentStep
                const isCurrent = index === currentStep

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                        isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "animate-pulse-slow" : ""}`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <p
                      className={`text-sm font-medium text-center ${
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Estimated Delivery */}
          {order.delivery_type === "delivery" && currentStep < 3 && (
            <div className="mt-8 p-4 bg-accent rounded-lg animate-fade-in animation-delay-400">
              <p className="text-sm text-muted-foreground mb-1">Fecha estimada de entrega</p>
              <p className="text-lg font-semibold text-foreground">
                {estimatedDelivery.toLocaleDateString("es-MX", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Tracking Updates */}
        <div className="animate-slide-up animation-delay-200">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Actualizaciones</h2>
            <div className="space-y-4">
              {trackingUpdates.map((update, index) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b last:border-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{update.status}</p>
                    <p className="text-sm text-muted-foreground">{update.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {update.date.toLocaleDateString("es-MX", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Delivery Information */}
        <div className="space-y-6 animate-slide-left animation-delay-300">
          {/* Shipping Address */}
          {order.delivery_type === "delivery" && (
            <Card className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Dirección de Entrega</h3>
                  <p className="text-sm text-muted-foreground">{order.shipping_address?.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_address?.city}, {order.shipping_address?.state}{" "}
                    {order.shipping_address?.postal_code}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Order Items */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Artículos del Pedido</h3>
            <div className="space-y-3">
              {order.order_items?.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                    {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                    <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-foreground">Total</p>
                <p className="text-lg font-bold text-primary">${order.total_amount.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          {/* Contact Support */}
          <Card className="p-6 bg-accent">
            <h3 className="font-semibold text-foreground mb-3">¿Necesitas ayuda?</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+52 123 456 7890</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>soporte@nexuscenter.com</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
