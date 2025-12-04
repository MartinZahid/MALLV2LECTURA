"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, CheckCircle, Download } from "lucide-react"
import type { Appointment } from "@/lib/types/database"
import Link from "next/link"

interface AppointmentDetailsProps {
  appointment: Appointment
}

export function AppointmentDetails({ appointment }: AppointmentDetailsProps) {
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Detalles de la Cita</h1>
          <p className="text-muted-foreground">Código: {appointment.confirmation_code}</p>
        </div>
        <Badge variant={statusColors[appointment.status]}>{statusLabels[appointment.status]}</Badge>
      </div>

      <div className="animate-slide-up animation-delay-200">
        <Card>
          <CardHeader className="bg-primary/5">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              <CardTitle className="text-primary">Cita Confirmada</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Establecimiento</p>
                    <p className="font-semibold text-foreground">{appointment.store?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-semibold text-foreground">
                      {appointmentDate.toLocaleDateString("es-MX", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-semibold text-foreground">
                      {appointment.appointment_time} ({appointment.duration_minutes} min)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Servicio</p>
                  <p className="font-semibold text-foreground">{appointment.service_name}</p>
                  {appointment.service_description && (
                    <p className="text-sm text-muted-foreground mt-1">{appointment.service_description}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Precio</p>
                  <p className="text-2xl font-bold text-primary">${appointment.price.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estado de Pago</p>
                  <Badge variant={appointment.payment_status === "paid" ? "secondary" : "outline"}>
                    {appointment.payment_status === "paid" ? "Pagado" : "Pendiente"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex flex-col sm:flex-row gap-3">
              {appointment.payment_status === "pending" && appointment.status !== "cancelled" && (
                <Link href={`/checkout/appointment/${appointment.id}`} className="flex-1">
                  <Button className="w-full" size="lg">
                    Pagar Ahora
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Descargar Comprobante
              </Button>
            </div>

            {appointment.status === "scheduled" && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-semibold text-foreground">Recordatorio</p>
                <p className="text-sm text-muted-foreground">
                  Te enviaremos un recordatorio por correo electrónico 24 horas antes de tu cita.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Link href="/appointments">
          <Button variant="outline" className="bg-transparent">
            Ver Todas Mis Citas
          </Button>
        </Link>
      </div>
    </div>
  )
}
