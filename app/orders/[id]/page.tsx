import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { OrderTracking } from "@/components/orders/order-tracking"
import { Spinner } from "@/components/ui/spinner"

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerClient()

  const { data: order } = await supabase.from("orders").select("*, order_items(*)").eq("id", id).single()

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Suspense fallback={<Spinner />}>
          <OrderTracking order={order} />
        </Suspense>
      </div>
    </div>
  )
}
