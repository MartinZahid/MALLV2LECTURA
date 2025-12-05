import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckoutForm } from "@/components/checkout/checkout-form"

export default async function CheckoutPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/checkout")
  }

  const [{ data: cartItems }, { data: addresses }, { data: paymentMethods }] = await Promise.all([
    supabase.from("cart_items").select("*, store:stores(*)").eq("user_id", user.id).eq("is_available", true),
    supabase.from("user_addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
    supabase.from("user_payment_methods").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
  ])

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">Finalizar Compra</h1>
          <CheckoutForm cartItems={cartItems} addresses={addresses || []} paymentMethods={paymentMethods || []} storeId={cartItems[0]?.store.id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
