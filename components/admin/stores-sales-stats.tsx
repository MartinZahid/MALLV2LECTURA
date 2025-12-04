"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Package, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StoresSalesStats() {
  // Datos de ejemplo - reemplazar con datos reales de tu API
  const storesData = [
    {
      id: 1,
      name: "Urban Style",
      type: "Tienda de Ropa",
      totalSales: 18450.5,
      ordersCount: 156,
      topProducts: [
        { name: "Camiseta Básica", quantity: 45, revenue: 1350 },
        { name: "Jeans Slim Fit", quantity: 32, revenue: 2560 },
        { name: "Sudadera con Capucha", quantity: 28, revenue: 1680 },
      ],
      growth: "+18.2%",
      icon: "👔",
    },
    {
      id: 2,
      name: "Café Nexus",
      type: "Cafetería",
      totalSales: 12890.75,
      ordersCount: 432,
      topProducts: [
        { name: "Latte Grande", quantity: 156, revenue: 780 },
        { name: "Cappuccino", quantity: 134, revenue: 670 },
        { name: "Croissant", quantity: 98, revenue: 294 },
      ],
      growth: "+24.5%",
      icon: "☕",
    },
    {
      id: 3,
      name: "Barber Studio",
      type: "Barbería",
      totalSales: 8640.0,
      ordersCount: 216,
      topProducts: [
        { name: "Corte Clásico", quantity: 89, revenue: 2670 },
        { name: "Corte y Barba", quantity: 67, revenue: 2680 },
        { name: "Afeitado Tradicional", quantity: 34, revenue: 1020 },
      ],
      growth: "+12.8%",
      icon: "✂️",
    },
    {
      id: 4,
      name: "Zen Spa",
      type: "Spa",
      totalSales: 5250.64,
      ordersCount: 87,
      topProducts: [
        { name: "Masaje Relajante", quantity: 34, revenue: 2380 },
        { name: "Facial Hidratante", quantity: 28, revenue: 1960 },
        { name: "Manicure y Pedicure", quantity: 25, revenue: 1000 },
      ],
      growth: "+8.4%",
      icon: "🌿",
    },
  ]

  return (
    <Card className="border-sage-200/50 bg-white/90 backdrop-blur-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">Ventas por Negocio</h2>
          <p className="mt-1 text-sm text-charcoal-600">Resumen de ventas y productos más vendidos</p>
        </div>
        <Badge variant="outline" className="border-sage-600 text-sage-700">
          Últimos 30 días
        </Badge>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-4 bg-sage-100/50">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="comparison">Comparación</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {storesData.map((store, index) => (
            <div
              key={store.id}
              className="group rounded-xl border border-sage-200/50 bg-gradient-to-r from-white to-sage-50/30 p-6 transition-all duration-300 hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                {/* Store Info */}
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sage-100 text-2xl transition-transform duration-300 group-hover:scale-110">
                    {store.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-charcoal-900">{store.name}</h3>
                    <p className="text-sm text-charcoal-600">{store.type}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8">
                  <div className="text-right">
                    <p className="text-sm text-charcoal-600">Ventas Totales</p>
                    <p className="mt-1 font-serif text-2xl font-bold text-sage-700">
                      ${store.totalSales.toLocaleString()}
                    </p>
                    <div className="mt-1 flex items-center justify-end gap-1">
                      <TrendingUp className="h-3 w-3 text-sage-600" />
                      <span className="text-xs font-medium text-sage-600">{store.growth}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-charcoal-600">Órdenes</p>
                    <p className="mt-1 font-serif text-2xl font-bold text-charcoal-800">{store.ordersCount}</p>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="mt-6 border-t border-sage-200/50 pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-sage-600" />
                  <h4 className="text-sm font-semibold text-charcoal-700">Top Productos/Servicios</h4>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {store.topProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-sage-200/50 bg-white/80 p-3 transition-colors hover:bg-sage-50/50"
                    >
                      <p className="text-sm font-medium text-charcoal-800">{product.name}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-charcoal-600">{product.quantity} vendidos</span>
                        <span className="text-sm font-semibold text-sage-700">${product.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Ver Detalles
                </Button>
                <Button variant="ghost" size="sm">
                  Exportar
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="products">
          <div className="rounded-lg border border-sage-200 bg-sage-50/30 p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-sage-400" />
            <p className="mt-4 text-sm text-charcoal-600">Vista de productos - Implementar con tu API</p>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="rounded-lg border border-sage-200 bg-sage-50/30 p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-sage-400" />
            <p className="mt-4 text-sm text-charcoal-600">Vista de servicios - Implementar con tu API</p>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="rounded-lg border border-sage-200 bg-sage-50/30 p-8 text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-sage-400" />
            <p className="mt-4 text-sm text-charcoal-600">Vista de comparación - Implementar con tu API</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
