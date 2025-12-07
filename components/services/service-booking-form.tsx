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
  const [slotsLoading, setSlotsLoading] = useState(false) // Nuevo estado para carga de horarios
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchServices() {
      if (!store?.slug) return;

      try {
        const url = `/api/stores/${store.slug}/service`
        console.log(`[DEBUG] Fetching services from: ${url}`)
        
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`)
        }

        const data = await response.json()
        setServices(data.services || [])
        
        if (preselectedServiceId && data.services) {
          const preselected = data.services.find((s: Service) => s.id === preselectedServiceId)
          if (preselected) {
            setSelectedService(preselected)
          }
        }
      } catch (error) {
        console.error("[DEBUG] Error fetching services:", error)
        toast({
          title: "Error de conexión",
          description: "No se pudieron cargar los servicios. Intenta recargar.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [store.slug, preselectedServiceId, toast, store])

  useEffect(() => {
    if (selectedDate && selectedService) {
      setSelectedTime("")
      fetchAvailableSlots()
    } else {
      setAvailableSlots([]) // Limpiar slots si no hay fecha/servicio
    }
  }, [selectedDate, selectedService])

  async function fetchAvailableSlots() {
    if (!selectedDate || !selectedService) return

    setSlotsLoading(true) // Iniciar carga
    setAvailableSlots([]) // Limpiar slots anteriores mientras carga

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
    } finally {
      setSlotsLoading(false) // Finalizar carga
    }
  }

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Faltan datos",
        description: "Por favor selecciona servicio, fecha y hora",
        variant: "destructive",
      })
      return
    }

    setBookingLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({ title: "Inicia sesión", description: "Requerido para agendar", variant: "destructive" })
        router.push(`/auth/login?redirect=/stores/${store.slug}/book`)
        return
      }

      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

      const confirmationCode = `${store.slug.substring(0,3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          store_id: store.id,
          service_external_id: selectedService.id,
          service_name: selectedService.name,
          service_description: selectedService.description,
          price: selectedService.price,
          appointment_date: dateStr,
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
        description: `Código: ${confirmationCode}`,
      })

      router.push(`/appointments/${data.id}`)
    } catch (error: any) {
      console.error("[DEBUG] Booking error:", error)
      toast({
        title: "Error al agendar",
        description: error.message || "Intenta nuevamente",
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

  const visibleSlots = availableSlots.filter(slot => slot.available);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Selecciona un Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay servicios disponibles
              </p>
            ) : (
              <RadioGroup
                value={selectedService?.id}
                onValueChange={(id) => setSelectedService(services.find((s) => s.id === id) || null)}
              >
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={service.id} id={service.id} className="mt-1" />
                      <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <p className="font-semibold text-foreground">{service.name}</p>
                            <p className="font-bold text-primary">${service.price.toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <p className="text-xs text-muted-foreground">⏱ {service.duration_minutes} min</p>
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
          <Card className="animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle>2. Selecciona Fecha y Hora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block font-medium">Fecha</Label>
                <div className="flex justify-center border rounded-md p-4 bg-card">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        // Solo bloqueamos días estrictamente en el pasado
                        return date < today;
                    }}
                    className="rounded-md"
                  />
                </div>
              </div>

              {selectedDate && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <Label className="mb-3 block font-medium">Hora Disponible</Label>
                  
                  {/* Mostrar spinner mientras carga, o los slots, o mensaje de vacío */}
                  {slotsLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner className="h-8 w-8" />
                    </div>
                  ) : availableSlots.length > 0 ? (
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

      <div className="lg:col-span-1">
        <Card className="sticky top-24 shadow-lg border-primary/10">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle>Resumen de Cita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {selectedService ? (
              <>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Servicio</p>
                  <p className="font-medium text-foreground">{selectedService.name}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Duración</p>
                  <p className="font-medium text-foreground">{selectedService.duration_minutes} min</p>
                </div>

                <div className="h-px bg-border my-2" />

                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Fecha</p>
                    {selectedDate ? (
                        <p className="font-medium text-foreground capitalize">
                            {selectedDate.toLocaleDateString("es-MX", { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    ) : <span className="text-sm text-muted-foreground italic">--</span>}
                </div>

                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Hora</p>
                    {selectedTime ? (
                        <p className="font-medium text-foreground">{selectedTime}</p>
                    ) : <span className="text-sm text-muted-foreground italic">--</span>}
                </div>

                <div className="h-px bg-border my-2" />
                
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">${selectedService.price.toFixed(2)}</p>
                </div>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={handleBooking}
                  disabled={!selectedService || !selectedDate || !selectedTime || bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Procesando...
                    </>
                  ) : "Confirmar Cita"}
                </Button>
              </>
            ) : (
              <div className="text-center py-10 opacity-50">
                <p>Selecciona un servicio</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}