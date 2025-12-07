import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { servicesApi } from "@/lib/api/services"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  console.log(`[API SERVICE] Iniciando petición para slug: ${slug}`)

  try {
    const supabase = await createClient()

    // 1. Obtener la tienda
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("store_id, name")
      .eq("slug", slug)
      .single()

    if (storeError || !store) {
      console.error(`[API SERVICE] Error: Tienda no encontrada para slug '${slug}'`, storeError)
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    console.log(`[API SERVICE] Tienda encontrada: ${store.name} (ID: ${store.store_id})`)

    // 2. Obtener servicios desde la API externa
    // Usamos un bloque try-catch específico para la llamada externa
    // CORRECCIÓN AQUÍ: Agregamos el tipo explícito ': any[]'
    let services: any[] = []
    
    try {
      const rawData = await servicesApi.getByStore(store.store_id)
      console.log(`[API SERVICE] Servicios crudos recibidos: ${Array.isArray(rawData) ? rawData.length : 'No array'}`)
      
      // Mapeo seguro de datos
      if (Array.isArray(rawData)) {
        services = rawData.map((item: any) => ({
          id: item.id?.toString() || item.servicio_id?.toString() || `temp-${Math.random()}`,
          name: item.nombre || item.name || "Servicio sin nombre",
          description: item.description || item.descripcion || "",
          price: Number(item.precio || item.price || 0),
          duration_minutes: Number(item.duracion_minutos || item.duration || 60),
          category: item.category || item.categoria || "General",
        }))
      }
    } catch (apiError) {
      console.error(`[API SERVICE] Error llamando a API externa para tienda ${store.store_id}:`, apiError)
      // No fallamos toda la petición, devolvemos array vacío para que el front no explote
      services = [] 
    }

    console.log(`[API SERVICE] Devolviendo ${services.length} servicios al cliente.`)
    return NextResponse.json({ services })

  } catch (error) {
    console.error("[API SERVICE] Error crítico en el servidor:", error)
    return NextResponse.json({ error: "Error interno del servidor", details: String(error) }, { status: 500 })
  }
}