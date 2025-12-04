import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OrderCard } from "@/components/orders/order-card"
import { Package } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/orders")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">Mis Pedidos</h1>
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Package className="h-24 w-24 text-muted-foreground" />
              <h2 className="text-2xl font-semibold text-foreground">No tienes pedidos</h2>
              <p className="text-muted-foreground">Tus pedidos aparecerán aquí</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
