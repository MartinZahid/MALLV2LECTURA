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

    let services: any[] = []
    
    try {
      const rawData = await servicesApi.getByStore(store.store_id)
      
      if (Array.isArray(rawData)) {
        // Asignamos id_servicio_externo a 'id' para que el frontend lo use automáticamente en la disponibilidad
        services = rawData.map((item: any) => ({
          id: item.id_servicio_externo?.toString() ?? item.id?.toString(), 
          service_external_id: item.id_servicio_externo?.toString(),
          name: item.nombre,
          description: item.description,
          price: item.precio,
          duration_minutes: item.duracion_minutos,
          category: item.category ?? "general",
          image_url: item.image_url ?? null,
        }))
      }
    } catch (apiError) {
      console.error(`[API SERVICE] Error llamando a API externa para tienda ${store.store_id}:`, apiError)
      services = [] 
    }

    console.log(`[API SERVICE] Devolviendo ${services.length} servicios al cliente.`)
    return NextResponse.json({ services })

  } catch (error) {
    console.error("[API SERVICE] Error crítico en el servidor:", error)
    return NextResponse.json({ error: "Error interno del servidor", details: String(error) }, { status: 500 })
  }
}