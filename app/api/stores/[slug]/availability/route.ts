import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Tu backend local (Python) que hace de puente
const NEXUS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// LA ÚNICA URL externa que se usará para validar disponibilidad
const TARGET_API_URL = "http://api-servicios-spa.rtakabinetsolutions.com/api/disponibilidad";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date")
  const serviceId = searchParams.get("serviceId")

  if (!date || !serviceId) {
    return NextResponse.json({ error: "Date and Service ID are required" }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    // 1. Obtener datos básicos de la tienda (necesario para verificar citas locales en Supabase)
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, store_id")
      .eq("slug", slug)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Usamos directamente el ID numérico de la tienda que viene de la BD
    const numericStoreId = Number(store.store_id);
    
    // Usamos directamente el serviceId que viene del frontend (ya es el externo gracias al cambio anterior)
    const realServiceId = serviceId;

    // 2. Generar horarios de 10:00 AM a 8:00 PM (20:00)
    const allSlots: string[] = []
    const startHour = 10
    const endHour = 20

    for (let hour = startHour; hour <= endHour; hour++) {
      allSlots.push(`${hour.toString().padStart(2, "0")}:00`)
      if (hour < endHour) {
        allSlots.push(`${hour.toString().padStart(2, "0")}:30`)
      }
    }

    
    const { data: bookedSlots, error: slotsError } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("store_id", store.id)
      .eq("appointment_date", date)
      .in("status", ["scheduled", "confirmed", "completed"])

    if (slotsError) {
      console.error("Error Supabase:", slotsError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    const bookedTimes = new Set(bookedSlots.map((slot) => slot.appointment_time.slice(0, 5)))

   
    console.log(`[AVAILABILITY] Consulta Directa: Tienda ${numericStoreId} | Servicio "${realServiceId}" | Fecha ${date}`);

    const availabilityChecks = allSlots.map(async (time) => {

      if (bookedTimes.has(time)) {
        return null;
      }

      try {
        const payload = {
          store_id: numericStoreId,
          service_external_id: realServiceId, // Enviamos el ID directo
          appointment_date: date,
          appointment_time: time,
          api_url: TARGET_API_URL
        };

        const response = await fetch(`${NEXUS_API_URL}/dispo_servicio/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          cache: "no-store"
        });

        if (!response.ok) {
          console.warn(`[AVAILABILITY] Error API Python [${time}]: ${response.status}`);
          return null;
        }

        const data = await response.json();
        
        // Si hay fecha_inicio, está disponible
        if (data.fecha_inicio) {
          return { time, available: true };
        }
        
        return null;

      } catch (error) {
        console.error(`[AVAILABILITY] Error conexión [${time}]:`, error);
        return null;
      }
    })

    const results = await Promise.all(availabilityChecks)
    const availableSlots = results.filter((slot) => slot !== null)

    return NextResponse.json({ slots: availableSlots })

  } catch (error) {
    console.error("Error crítico en disponibilidad:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}