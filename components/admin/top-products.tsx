"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

export function TopProducts() {
  // Datos de ejemplo - reemplazar con datos reales de tu API
  const topProducts = [
    {
      id: 1,
      name: "Jeans Slim Fit",
      store: "Urban Style",
      quantity: 32,
      revenue: 2560,
      image: "/folded-denim-stack.png",
    },
    {
      id: 2,
      name: "Masaje Relajante",
      store: "Zen Spa",
      quantity: 34,
      revenue: 2380,
      image: "/relaxing-spa-scene.png",
    },
    {
      id: 3,
      name: "Latte Grande",
      store: "Café Nexus",
      quantity: 156,
      revenue: 780,
      image: "/steaming-coffee-cup.png",
    },
    {
      id: 4,
      name: "Corte y Barba",
      store: "Barber Studio",
      quantity: 67,
      revenue: 2680,
      image: "/barber-shop.png",
    },
    {
      id: 5,
      name: "Sudadera con Capucha",
      store: "Urban Style",
      quantity: 28,
      revenue: 1680,
      image: "/cozy-hoodie.png",
    },
  ]

  return (
    <Card className="border-sage-200/50 bg-white/90 backdrop-blur-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-charcoal-900">Productos/Servicios Más Vendidos</h2>
        <Badge variant="outline" className="border-sage-600 text-sage-700">
          Top 5
        </Badge>
      </div>

      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div
            key={product.id}
            className="group flex items-center gap-4 rounded-lg border border-sage-200/50 bg-gradient-to-r from-white to-sage-50/20 p-4 transition-all duration-300 hover:shadow-md animate-slide-left"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Rank */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100 font-serif text-lg font-bold text-sage-700">
              {index + 1}
            </div>

            {/* Image */}
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="h-16 w-16 rounded-lg border border-sage-200 object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal-900">{product.name}</h3>
              <p className="text-sm text-charcoal-600">{product.store}</p>
              <p className="mt-1 text-xs text-charcoal-500">{product.quantity} vendidos</p>
            </div>

            {/* Revenue */}
            <div className="text-right">
              <p className="font-serif text-xl font-bold text-sage-700">${product.revenue.toLocaleString()}</p>
              <div className="mt-1 flex items-center justify-end gap-1">
                <TrendingUp className="h-3 w-3 text-sage-600" />
                <span className="text-xs text-sage-600">+{(Math.random() * 20 + 5).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
