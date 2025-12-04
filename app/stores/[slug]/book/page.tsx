import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from 'next/navigation'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ServiceBookingForm } from "@/components/services/service-booking-form"

interface BookServicePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ serviceId?: string }>
}

export default async function BookServicePage({ params, searchParams }: BookServicePageProps) {
  const { slug } = await params
  const { serviceId } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/stores/${slug}/book`)
  }

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("type", "service")
    .single()

  if (!store) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Agendar Cita</h1>
            <p className="text-muted-foreground mb-8">{store.name}</p>
            <ServiceBookingForm store={store} preselectedServiceId={serviceId} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
