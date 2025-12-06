"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Clock, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Store } from "@/lib/types/database"
import Image from "next/image"
import { useServices } from "@/hooks/use-services"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration_minutes: number
  category: string
  image_url?: string
}

interface ServiceCatalogProps {
  store: Store
}

export function ServiceCatalog({ store }: ServiceCatalogProps) {
  const { services, loading } = useServices(store.store_id)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const router = useRouter()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-4">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="text-muted-foreground">Cargando servicios...</p>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-4 animate-scale-in">
        <Sparkles className="h-24 w-24 text-muted-foreground/30" />
        <p className="text-center text-muted-foreground text-lg">No hay servicios disponibles en este momento.</p>
      </div>
    )
  }

  // Get unique categories
  const categories = Array.from(new Set(services.map((s) => s.category)))
  const filteredServices =
    selectedCategory === "all" ? services : services.filter((s) => s.category === selectedCategory)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
          >
            Todos
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <div key={service.id} className="animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              {service.image_url && (
                <div className="relative h-56 overflow-hidden bg-muted">
                  <Image
                    src={service.image_url || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{service.name}</h3>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {service.category}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-primary ml-2">${service.price.toFixed(2)}</p>
                </div>

                <p className="text-muted-foreground mb-4 flex-1">{service.description}</p>

                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4 mr-1.5" />
                  <span>{service.duration_minutes} minutos</span>
                </div>

                <Button
                  className="w-full"
                  onClick={() => router.push(`/stores/${store.slug}/book?serviceId=${service.id}`)}
                >
                  Agendar Cita
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No hay servicios en esta categoría</p>
      )}
    </div>
  )
}
