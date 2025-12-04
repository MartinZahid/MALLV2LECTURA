"use client"

import { ShoppingBag, Calendar, Truck, Shield } from "lucide-react"

const features = [
  {
    icon: ShoppingBag,
    title: "Compra Fácil",
    description: "Navega y compra productos de múltiples tiendas en un solo carrito",
  },
  {
    icon: Calendar,
    title: "Agenda Servicios",
    description: "Reserva citas en barberías y spas con disponibilidad en tiempo real",
  },
  {
    icon: Truck,
    title: "Entrega a Domicilio",
    description: "Recibe tus productos en casa con seguimiento en tiempo real",
  },
  {
    icon: Shield,
    title: "Compra Segura",
    description: "Pagos seguros y protección de datos garantizada",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">¿Por qué Nexus Center?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">La mejor experiencia de compra y servicios en línea</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center space-y-4 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary hover:scale-110 transition-transform">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
