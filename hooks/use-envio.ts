"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { enviosApi } from "@/lib/api/envios"
import type { EstadoEnvioResponse } from "@/lib/types/estado_envio"

export function useEnvio(orderId?: string) {
  const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvioResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    console.log("🔄 useEnvio ejecutado. orderId recibido:", orderId)

    if (!orderId) {
      console.warn("⚠️ orderId es undefined, no se ejecutará la carga.")
      setLoading(false)
      return
    }

    async function load() {
      console.log("🚀 Iniciando carga de envío…")

      const supabase = createClient()
      setLoading(true)

      try {
        // 1️⃣ Buscar store_id en order_items usando el UUID
        const { data: orderItem, error: orderItemErr } = await supabase
          .from("order_items")
          .select("store_id")
          .eq("order_id", orderId)
          .limit(1)
          .single()

        if (orderItemErr) throw orderItemErr
        if (!orderItem?.store_id) throw new Error("No se encontró store_id para esta orden")

        const storeId = orderItem.store_id

        // 2️⃣ Obtener API URL y número de orden
        const { data: store, error: storeErr } = await supabase
          .from("stores")
          .select("consulta_envio")
          .eq("id", storeId)
          .single()

        const { data: order, error: orderErr } = await supabase
          .from("orders")
          .select("order_number")
          .eq("id", orderId)
          .single()

        if (storeErr) throw storeErr
        if (orderErr) throw orderErr
        if (!store?.consulta_envio) throw new Error("La tienda no tiene API configurada")

        const apiUrl = store.consulta_envio

        // 3️⃣ Consultar tu API
        const estado = await enviosApi.getByOrder({
          api_url: apiUrl,
          order_id: order.order_number, // número visible, NO uuid
        })

        console.log("📦 Estado recibido:", estado)

        // 4️⃣ Obtener último tracking guardado
        const { data: ultimo, error: ultimoErr } = await supabase
          .from("order_tracking")
          .select("status, description, location")
          .eq("order_id", orderId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (ultimoErr && ultimoErr.code !== "PGRST116") {
          // PGRST116 significa "no existe registro" → ignorable
          throw ultimoErr
        }

        const nuevoStatus = estado.estado_actual ?? null
        const nuevaDescription = estado.description ?? null
        const nuevaLocation = estado.ubicacion_actual ?? null

        // 5️⃣ Comparación: si NO cambió nada → no guardar
        if (
          ultimo &&
          ultimo.status === nuevoStatus &&
          ultimo.description === nuevaDescription &&
          ultimo.location === nuevaLocation
        ) {
          console.log("⏹️ El estado es igual al último. No se insertará tracking.")
          setEstadoEnvio(estado)
          return
        }

        // 6️⃣ Insertar nuevo tracking solo si cambió
        console.log("💾 Guardando nuevo tracking...")

        const { error: trackingErr } = await supabase
          .from("order_tracking")
          .insert({
            order_id: orderId,
            status: nuevoStatus,
            description: nuevaDescription,
            location: nuevaLocation,
          })

        if (trackingErr) throw trackingErr

        console.log("💾 Tracking guardado correctamente")

        setEstadoEnvio(estado)

      } catch (err: any) {
        console.error("❌ Error en useEnvio:", err)
        setError(err)
      } finally {
        console.log("🏁 Finalizando carga")
        setLoading(false)
      }
    }

    load()
  }, [orderId])

  return { estadoEnvio, loading, error }
}
