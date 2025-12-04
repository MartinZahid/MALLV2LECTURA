"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Store } from "@/lib/types/database"

interface StoreCardProps {
  store: Store
  index?: number
}

export function StoreCard({ store, index = 0 }: StoreCardProps) {
  const categoryLabels = {
    clothing: "Ropa",
    cafeteria: "Cafetería",
    barbershop: "Barbería",
    spa: "Spa",
  }

  const typeLabels = {
    product: "Productos",
    service: "Servicios",
  }

  return (
    <div className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <Link href={`/stores/${store.slug}`}>
        <div className="hover:-translate-y-2 transition-all duration-300">
          <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
            <div className="aspect-video relative bg-muted overflow-hidden">
              <div className="hover:scale-105 transition-transform duration-300">
                <Image
                  src={store.image_url || "/placeholder.svg?height=300&width=400"}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg text-foreground">{store.name}</h3>
                <Badge variant="secondary" className="shrink-0">
                  {typeLabels[store.type]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{store.description}</p>
              <Badge variant="outline">{categoryLabels[store.category]}</Badge>
            </CardContent>
          </Card>
        </div>
      </Link>
    </div>
  )
}
