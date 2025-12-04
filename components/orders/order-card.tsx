import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import type { Order } from "@/lib/types/database"

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const statusLabels = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    preparing: "Preparando",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  }

  const statusColors = {
    pending: "outline",
    confirmed: "default",
    preparing: "default",
    shipped: "default",
    delivered: "secondary",
    cancelled: "destructive",
  } as const

  const orderDate = new Date(order.created_at)

  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-semibold text-lg text-foreground">{order.order_number}</h3>
                <Badge variant={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {orderDate.toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-lg font-bold text-primary">${order.total_amount.toFixed(2)}</p>
            </div>
            <Button variant="ghost" size="sm">
              Ver Detalles
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
