"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Clock, CheckCircle, XCircle } from "lucide-react"

export function RecentOrders() {
  // Datos de ejemplo - reemplazar con datos reales de tu API
  const recentOrders = [
    {
      id: "ORD-2024-001",
      customer: "María García",
      store: "Urban Style",
      items: 3,
      total: 156.5,
      status: "completed",
      date: "2024-01-15 14:32",
    },
    {
      id: "ORD-2024-002",
      customer: "Juan Pérez",
      store: "Café Nexus",
      items: 2,
      total: 15.0,
      status: "processing",
      date: "2024-01-15 13:45",
    },
    {
      id: "ORD-2024-003",
      customer: "Ana Martínez",
      store: "Barber Studio",
      items: 1,
      total: 40.0,
      status: "completed",
      date: "2024-01-15 12:20",
    },
    {
      id: "ORD-2024-004",
      customer: "Carlos López",
      store: "Urban Style",
      items: 5,
      total: 245.75,
      status: "pending",
      date: "2024-01-15 11:15",
    },
    {
      id: "ORD-2024-005",
      customer: "Laura Sánchez",
      store: "Zen Spa",
      items: 1,
      total: 70.0,
      status: "cancelled",
      date: "2024-01-15 10:30",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-sage-100 text-sage-700 border-sage-300"
      case "processing":
        return "bg-sand-100 text-sand-700 border-sand-300"
      case "pending":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      case "processing":
        return <Clock className="h-3 w-3" />
      case "pending":
        return <Package className="h-3 w-3" />
      case "cancelled":
        return <XCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: "Completada",
      processing: "Procesando",
      pending: "Pendiente",
      cancelled: "Cancelada",
    }
    return labels[status] || status
  }

  return (
    <Card className="border-sage-200/50 bg-white/90 backdrop-blur-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-charcoal-900">Órdenes Recientes</h2>
        <Button variant="ghost" size="sm">
          Ver Todas
        </Button>
      </div>

      <div className="space-y-3">
        {recentOrders.map((order, index) => (
          <div
            key={order.id}
            className="group rounded-lg border border-sage-200/50 bg-gradient-to-r from-white to-sage-50/20 p-4 transition-all duration-300 hover:shadow-md animate-slide-right"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-charcoal-900">{order.id}</h3>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{getStatusLabel(order.status)}</span>
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-charcoal-700">{order.customer}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-charcoal-600">
                  <span>{order.store}</span>
                  <span>•</span>
                  <span>{order.items} items</span>
                  <span>•</span>
                  <span>{order.date}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif text-lg font-bold text-sage-700">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
