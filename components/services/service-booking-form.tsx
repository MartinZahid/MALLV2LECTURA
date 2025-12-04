"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from 'next/navigation'
import type { Store } from "@/lib/types/database"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration_minutes: number
  category: string
}

interface TimeSlot {
  time: string
  available: boolean
}

interface ServiceBookingFormProps {
  store: Store
  preselectedServiceId?: string
}

export function ServiceBookingForm({ store, preselectedServiceId }: ServiceBookingFormProps) {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(`/api/stores/${store.slug}/services`)
        const data = await response.json()
        setServices(data.services || [])
        
        if (preselectedServiceId && data.services) {
          const preselected = data.services.find((s: Service) => s.id === preselectedServiceId)
          if (preselected) {
            setSelectedService(preselected)
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching services:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los servicios",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [store.slug, preselectedServiceId, toast])

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchAvailableSlots()
    }
  }, [selectedDate, selectedService])

  async function fetchAvailableSlots() {
    if (!selectedDate || !selectedService) return

    try {
      const dateStr = selectedDate.toISOString().split("T")[0]
      const response = await fetch(
        `/api/stores/${store.slug}/availability?date=${dateStr}&serviceId=${selectedService.id}`,
      )
      const data = await response.json()
      setAvailableSlots(data.slots || [])
    } catch (error) {
      console.error("[v0] Error fetching availability:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la disponibilidad",
        variant: "destructive",
      })
    }
  }

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Información incompleta",
        description: "Por favor selecciona un servicio, fecha y hora",
        variant: "destructive",
      })
      return
    }

    setBookingLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para agendar una cita",
          variant: "destructive",
        })
        router.push(`/auth/login?redirect=/stores/${store.slug}/book`)
        return
      }

      const confirmationCode = `${store.slug.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          store_id: store.id,
          service_external_id: selectedService.id,
          service_name: selectedService.name,
          service_description: selectedService.description,
          price: selectedService.price,
          appointment_date: selectedDate.toISOString().split("T")[0],
          appointment_time: selectedTime,
          duration_minutes: selectedService.duration_minutes,
          status: "scheduled",
          payment_status: "pending",
          confirmation_code: confirmationCode,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "¡Cita agendada!",
        description: `Tu cita ha sido agendada exitosamente. Código: ${confirmationCode}`,
      })

      router.push(`/appointments/${data.id}`)
    } catch (error: any) {
      console.error("[v0] Booking error:", error)
      toast({
        title: "Error al agendar",
        description: error.message || "No se pudo agendar la cita",
        variant: "destructive",
      })
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Service Selection */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Selecciona un Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay servicios disponibles en este momento
              </p>
            ) : (
              <RadioGroup
                value={selectedService?.id}
                onValueChange={(id) => setSelectedService(services.find((s) => s.id === id) || null)}
              >
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={service.id} id={service.id} className="mt-1" />
                      <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <p className="font-semibold text-foreground">{service.name}</p>
                            <p className="font-bold text-primary">${service.price.toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <p className="text-xs text-muted-foreground">{service.duration_minutes} minutos</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        {selectedService && (
          <Card>
            <CardHeader>
              <CardTitle>2. Selecciona Fecha y Hora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Fecha</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border border-border"
                />
              </div>

              {selectedDate && (
                <div>
                  <Label className="mb-3 block">Hora Disponible</Label>
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          className="w-full"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay horarios disponibles para esta fecha</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Resumen de Cita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedService ? (
              <>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Servicio</p>
                  <p className="font-semibold text-foreground">{selectedService.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Duración</p>
                  <p className="font-semibold text-foreground">{selectedService.duration_minutes} minutos</p>
                </div>
                {selectedDate && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-semibold text-foreground">
                      {selectedDate.toLocaleDateString("es-MX", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {selectedTime && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-semibold text-foreground">{selectedTime}</p>
                  </div>
                )}
                <div className="h-px bg-border" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">${selectedService.price.toFixed(2)}</p>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBooking}
                  disabled={!selectedService || !selectedDate || !selectedTime || bookingLoading}
                >
                  {bookingLoading ? "Agendando..." : "Confirmar Cita"}
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Selecciona un servicio para continuar</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
