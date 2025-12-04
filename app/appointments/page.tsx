import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AppointmentCard } from "@/components/appointments/appointment-card"
import { Calendar } from "lucide-react"

export default async function AppointmentsPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/appointments")
  }

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, store:stores(*)")
    .eq("user_id", user.id)
    .order("appointment_date", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">Mis Citas</h1>
          {appointments && appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Calendar className="h-24 w-24 text-muted-foreground" />
              <h2 className="text-2xl font-semibold text-foreground">No tienes citas</h2>
              <p className="text-muted-foreground">Tus citas aparecerán aquí</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
