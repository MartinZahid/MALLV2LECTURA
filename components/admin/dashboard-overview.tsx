"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Calendar } from "lucide-react"

export function DashboardOverview() {
  // Datos de ejemplo - reemplazar con datos reales de tu API
  const stats = [
    {
      title: "Ventas Totales",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "sage",
    },
    {
      title: "Órdenes",
      value: "2,350",
      change: "+15.3%",
      trend: "up",
      icon: ShoppingBag,
      color: "sage",
    },
    {
      title: "Clientes",
      value: "1,432",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "sand",
    },
    {
      title: "Citas",
      value: "348",
      change: "-2.4%",
      trend: "down",
      icon: Calendar,
      color: "sand",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className="group relative overflow-hidden border-sage-200/50 bg-white/90 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal-600">{stat.title}</p>
                <h3 className="mt-2 font-serif text-3xl font-bold text-charcoal-900">{stat.value}</h3>
                <div className="mt-2 flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-sage-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-sage-600" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-charcoal-500">vs último mes</span>
                </div>
              </div>
              <div
                className={`rounded-xl bg-${stat.color}-100 p-3 transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
