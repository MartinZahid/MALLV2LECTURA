import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Tu backend local (Python) que hace de puente
const NEXUS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// La URL externa para registrar la venta (Hardcoded como fallback o principal si no hay en BD)
const DEFAULT_TARGET_API_URL = "http://api-servicios-spa.rtakabinetsolutions.com/api/registrar-venta";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 1. Obtener usuario en sesión
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    
    // Validar campos requeridos
    if (!body.store_id || !body.service_external_id || !body.appointment_date || !body.appointment_time) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // 2. Obtener datos de la tienda (para obtener el ID numérico y la URL de la API externa)
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("store_id, registro_venta_api, name")
      .eq("id", body.store_id) // body.store_id es el UUID de la tienda
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    const numericStoreId = Number(store.store_id)
    // Usamos la URL de la BD si existe, si no, usamos la default (SPA)
    const targetApiUrl = store.registro_venta_api || DEFAULT_TARGET_API_URL

    // 3. Guardar cita en Supabase (Base de datos local)
    const { data: appointment, error: appError } = await supabase
      .from("appointments")
      .insert({
        user_id: user.id,
        store_id: body.store_id,
        service_external_id: body.service_external_id,
        service_name: body.service_name,
        service_description: body.service_description,
        price: body.price,
        appointment_date: body.appointment_date,
        appointment_time: body.appointment_time,
        duration_minutes: body.duration_minutes,
        status: "scheduled",
        payment_status: "pending",
        confirmation_code: body.confirmation_code
      })
      .select()
      .single()

    if (appError) {
      console.error("Error guardando en Supabase:", appError)
      return NextResponse.json({ error: "Error al guardar la cita localmente" }, { status: 500 })
    }

    // 4. Guardar cita en API Externa (vía Nexus Middleware)
    const payload = {
      id: appointment.id, // UUID de la cita local
      user_id: user.id,   // ID del usuario en sesión
      store_id: numericStoreId,
      service_external_id: body.service_external_id,
      service_name: body.service_name,
      service_description: body.service_description || "Sin descripción",
      service_price: body.price,
      appointment_date: body.appointment_date,
      appointment_time: body.appointment_time,
      duration_minutes: body.duration_minutes,
      payment_status: "PENDIENTE", 
      payment_method: "EN_SITIO", // Valor por defecto o podrías pedirlo en el form
      confirmation_code_created_at: new Date().toISOString(),
      api_url: targetApiUrl
    }

    console.log(`[BOOKING] Enviando cita a Nexus: ${JSON.stringify(payload)}`)

    try {
      // Llamada al endpoint /push_cita/ de tu API Python
      const response = await fetch(`${NEXUS_API_URL}/push_cita/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        console.error(`[BOOKING] Error en Nexus API: ${response.status} ${response.statusText}`)
        // Nota: La cita local ya se creó, así que retornamos éxito al usuario aunque falle la externa
        // Podrías actualizar el estado en Supabase a "sync_failed" si quisieras manejarlo
      } else {
        const nexusData = await response.json()
        console.log(`[BOOKING] Respuesta Nexus:`, nexusData)
      }
    } catch (apiError) {
      console.error("[BOOKING] Error de conexión con Nexus:", apiError)
    }

    return NextResponse.json(appointment)

  } catch (error) {
    console.error("[BOOKING] Error crítico:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}