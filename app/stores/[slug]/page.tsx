import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from 'next/navigation'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/products/product-grid"
import { StoreHeader } from "@/components/stores/store-header"

interface StorePageProps {
  params: Promise<{ slug: string }>
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: store } = await supabase.from("stores").select("*").eq("slug", slug).eq("is_active", true).single()

  if (!store) {
    notFound()
  }

  if (store.type === "service") {
    redirect(`/stores/${slug}/services`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <StoreHeader store={store} />
        <ProductGrid storeId={store.storeId} storeType={store.type} />
      </main>
      <Footer />
    </div>
  )
}
