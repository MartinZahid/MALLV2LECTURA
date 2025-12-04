import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { StoreCard } from "@/components/stores/store-card"
import type { Store } from "@/lib/types/database"

interface StoresPageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function StoresPage({ searchParams }: StoresPageProps) {
  const { type } = await searchParams
  const supabase = await getSupabaseServerClient()

  let query = supabase.from("stores").select("*").eq("is_active", true).order("name")

  if (type === "service") {
    query = query.eq("type", "service")
  } else if (type === "product") {
    query = query.eq("type", "product")
  }

  const { data: stores } = await query

  const title = type === "service" ? "Servicios" : type === "product" ? "Tiendas de Productos" : "Todas las Tiendas"

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">{title}</h1>
          {stores && stores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store as Store} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No se encontraron tiendas</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
