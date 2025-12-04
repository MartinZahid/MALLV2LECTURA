import { createClient } from "@/lib/supabase/server"
import { notFound } from 'next/navigation'
import { StoreHeader } from "@/components/stores/store-header"
import { ServiceCatalog } from "@/components/services/service-catalog"

export default async function ServicesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: store, error } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (error || !store) {
    notFound()
  }

  if (store.type !== "service") {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader store={store} showBookButton={false} />
      <ServiceCatalog store={store} />
    </div>
  )
}
