import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ShoppingBag } from 'lucide-react'
import type { Store } from "@/lib/types/database"

interface StoreHeaderProps {
  store: Store
  showBookButton?: boolean
}

export function StoreHeader({ store, showBookButton = true }: StoreHeaderProps) {
  return (
    <div className="bg-muted/30 border-b border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden bg-muted shrink-0">
            <Image
              src={store.image_url || "/placeholder.svg?height=200&width=200"}
              alt={store.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{store.name}</h1>
            <p className="text-muted-foreground text-lg">{store.description}</p>
            <div className="flex flex-wrap gap-3">
              {store.type === "service" && (
                <>
                  <Link href={`/stores/${store.slug}/services`}>
                    <Button size="lg" variant="outline">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Ver Servicios
                    </Button>
                  </Link>
                  {showBookButton && (
                    <Link href={`/stores/${store.slug}/book`}>
                      <Button size="lg">
                        <Calendar className="mr-2 h-5 w-5" />
                        Agendar Cita
                      </Button>
                    </Link>
                  )}
                </>
              )}
              {store.type === "product" && (
                <Link href={`/stores/${store.slug}`}>
                  <Button size="lg">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Ver Productos
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
