import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { servicesApi } from "@/lib/api/services"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const supabase = await createClient()

    // 1. Obtener el ID numérico de la tienda usando el slug
    const { data: store, error } = await supabase
      .from("stores")
      .select("store_id")
      .eq("slug", slug)
      .single()

    if (error || !store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    // 2. Obtener los servicios "crudos" desde tu API Python
    const rawServices = await servicesApi.getByStore(store.store_id)

    // 3. Mapear los datos al formato que espera tu componente React
    // (Convierte 'nombre' -> 'name', 'precio' -> 'price', etc.)
    const services = rawServices.map((item: any) => ({
      id: item.id?.toString(),
      name: item.nombre,
      description: item.description || item.descripcion,
      price: item.precio,
      duration_minutes: item.duracion_minutos,
      category: item.category || item.categoria || "general",
    }))

    // 4. Devolver el JSON con la estructura { services: [...] }
    return NextResponse.json({ services })

  } catch (error) {
    console.error("[API Services] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}