import { getSupabaseServerClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AppointmentDetails } from "@/components/appointments/appointment-details"

interface AppointmentPageProps {
  params: Promise<{ id: string }>
}

export default async function AppointmentPage({ params }: AppointmentPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: appointment } = await supabase
    .from("appointments")
    .select("*, store:stores(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!appointment) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <AppointmentDetails appointment={appointment} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
