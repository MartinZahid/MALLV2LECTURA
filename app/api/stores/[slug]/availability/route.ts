import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Tu backend local (Python) que hace de puente
const NEXUS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// LA ÚNICA URL externa que se usará para validar disponibilidad
const TARGET_API_URL = "http://api-servicios-spa.rtakabinetsolutions.com/api/disponibilidad";

// Mapa de respaldo de IDs de TIENDA
const STORE_ID_MAP: Record<string, number> = {
  "urban-style": 1,
  "cafe-nexus": 2,
  "barber-studio": 3,
  "zen-spa": 4,
  "dreams-kingdom-spa": 2 // ID 2 según tus capturas de curl
};

// NUEVO: Mapa de respaldo para IDs de SERVICIO (Traducción de ID interno a Externo)
const SERVICE_ID_MAP: Record<string, string> = {
  "1": "SPA-SERV-001", // Mapeamos el "1" que envía el frontend al código real
  "2": "SPA-SERV-002", 
  "3": "SPA-SERV-003"
};

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

    // 1. Obtener datos básicos de la tienda
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, store_id")
      .eq("slug", slug)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Convertir IDs usando los mapas de respaldo
    const numericStoreId = Number(store.store_id) || STORE_ID_MAP[slug] || 0;
    
    // FIX CLAVE: Traducir el ID del servicio (ej: "1" -> "SPA-SERV-001")
    const realServiceId = SERVICE_ID_MAP[serviceId] || serviceId;

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

    // 3. Consultar Supabase (Citas locales)
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

    // 4. Verificación con tu API de Python
    console.log(`[AVAILABILITY] Consulta: Tienda ID ${numericStoreId} | Servicio "${realServiceId}" (Original: "${serviceId}") | Fecha ${date}`);

    const availabilityChecks = allSlots.map(async (time) => {
      // Si ya está en Supabase, la descartamos
      if (bookedTimes.has(time)) {
        return null;
      }

      try {
        const payload = {
          store_id: numericStoreId,
          service_external_id: realServiceId, // Usamos el ID traducido
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
        
        // Log solo si hay error o algo inesperado para no saturar, o descomentar para debug total
        // console.log(`[AVAILABILITY] Resp [${time}]:`, JSON.stringify(data));

        // Lógica de validación exacta según tu captura:
        // Si hay una 'fecha_inicio' válida en el JSON, significa que hay disponibilidad.
        // Si está ocupado/no encontrado, 'fecha_inicio' viene null.
        if (data.fecha_inicio) {
          console.log(`[AVAILABILITY] ${time} -> DISPONIBLE ✅`);
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

    console.log(`[AVAILABILITY] Total slots disponibles: ${availableSlots.length}`);

    return NextResponse.json({ slots: availableSlots })

  } catch (error) {
    console.error("Error crítico en disponibilidad:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}