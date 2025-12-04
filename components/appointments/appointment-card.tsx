import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Calendar, Clock } from "lucide-react"
import type { Appointment } from "@/lib/types/database"

interface AppointmentCardProps {
  appointment: Appointment
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const statusLabels = {
    scheduled: "Agendada",
    confirmed: "Confirmada",
    completed: "Completada",
    cancelled: "Cancelada",
    rescheduled: "Reagendada",
  }

  const statusColors = {
    scheduled: "default",
    confirmed: "default",
    completed: "secondary",
    cancelled: "destructive",
    rescheduled: "outline",
  } as const

  const appointmentDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`)

  return (
    <Link href={`/appointments/${appointment.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-semibold text-lg text-foreground">{appointment.store?.name}</h3>
                <Badge variant={statusColors[appointment.status]}>{statusLabels[appointment.status]}</Badge>
              </div>
              <p className="text-foreground font-medium">{appointment.service_name}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {appointmentDate.toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {appointment.appointment_time}
                </div>
              </div>
              <p className="text-lg font-bold text-primary">${appointment.price.toFixed(2)}</p>
            </div>
            <Button variant="ghost" size="sm">
              Ver Detalles
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
