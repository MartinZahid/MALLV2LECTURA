"use client";

import { useEnvio } from "@/hooks/use-envio";
import { useOrderTracking } from "@/hooks/use-order-tracking";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface OrderTrackingProps {
  order: any;
}

export function OrderTracking({ order }: OrderTrackingProps) {
  // Hook que consulta/actualiza estado externo y guarda en supabase
  useEnvio(order.id);

  // Hook que obtiene el historial
  const { tracking, loading, error } = useOrderTracking(order.id);

  // ---- timeline dinámico ----
  const trackingUpdates: any[] = [];

  // 1) Estado inicial de la orden
  trackingUpdates.push({
    date: new Date(order.created_at),
    status: "Solicitud Recibida",
    description: "El pedido fue recibido por la tienda.",
  });

  // 2) Agregar todos los registros históricos
  if (tracking.length > 0) {
    tracking.forEach((t) =>
      trackingUpdates.push({
        date: new Date(t.created_at),
        status: t.status,
        description: t.description ?? t.location ?? "",
      })
    );
  }

  // ordenar del más reciente al más antiguo
  const sortedUpdates = trackingUpdates.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">Seguimiento de Pedido</h1>
          <Badge variant="secondary" className="text-sm">
            #{order.id.slice(0, 8)}
          </Badge>
        </div>

        <p className="text-muted-foreground">
          Fecha de pedido:{" "}
          {new Date(order.created_at).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* TIMELINE */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Actualizaciones</h2>

        {loading && <p className="text-muted-foreground">Cargando historial…</p>}
        {error && <p className="text-red-500 text-sm">No se pudo cargar el historial.</p>}

        <div className="space-y-4">
          {sortedUpdates.map((update, index) => (
            <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="font-medium">{update.status}</p>
                <p className="text-sm text-muted-foreground">
                  {update.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {update.date.toLocaleDateString("es-MX", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Dirección para delivery */}
      {order.delivery_type === "delivery" && (
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Dirección de Entrega</h3>
              <p className="text-sm text-muted-foreground">
                {order.shipping_address?.street}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shipping_address?.city}, {order.shipping_address?.state}{" "}
                {order.shipping_address?.postal_code}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
