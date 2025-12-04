import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProfileForm } from "@/components/profile/profile-form"
import { AddressList } from "@/components/profile/address-list"
import { PaymentMethodList } from "@/components/profile/payment-method-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ProfilePage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/profile")
  }

  const [{ data: profile }, { data: addresses }, { data: paymentMethods }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
    supabase.from("user_payment_methods").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">Mi Perfil</h1>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Información Personal</TabsTrigger>
              <TabsTrigger value="addresses">Direcciones</TabsTrigger>
              <TabsTrigger value="payments">Métodos de Pago</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileForm profile={profile} />
            </TabsContent>
            <TabsContent value="addresses">
              <AddressList addresses={addresses || []} />
            </TabsContent>
            <TabsContent value="payments">
              <PaymentMethodList paymentMethods={paymentMethods || []} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
