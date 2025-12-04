import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartContent } from "@/components/cart/cart-content"

export default async function CartPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/cart")
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, store:stores(*)")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">Mi Carrito</h1>
          <CartContent initialCartItems={cartItems || []} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
