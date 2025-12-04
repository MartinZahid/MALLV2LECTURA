"use client"

import { StoreCard } from "@/components/stores/store-card"
import { useStores } from "@/hooks/use-stores"
import { Spinner } from "@/components/ui/spinner"

export function StoresSection() {
  const { stores, loading } = useStores()

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </section>
    )
  }

  if (!stores || stores.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Nuestras Tiendas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra selección de tiendas y servicios premium
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stores.map((store, index) => (
            <StoreCard key={store.id} store={store} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
