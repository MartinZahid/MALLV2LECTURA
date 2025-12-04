import { DashboardOverview } from "@/components/admin/dashboard-overview"
import { StoresSalesStats } from "@/components/admin/stores-sales-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { TopProducts } from "@/components/admin/top-products"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sand-50 to-sage-100/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="font-serif text-4xl font-bold text-charcoal-900 text-balance">Panel Administrativo</h1>
            <p className="mt-2 text-charcoal-600">Gestión y estadísticas de Nexus Center</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
            <Button size="lg" className="bg-sage-600 hover:bg-sage-700">
              <Download className="mr-2 h-4 w-4" />
              Exportar Reporte
            </Button>
          </div>
        </div>

        {/* Dashboard Overview - Métricas Principales */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <DashboardOverview />
        </div>

        {/* Ventas por Tienda */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <StoresSalesStats />
        </div>

        {/* Grid de Productos y Órdenes */}
        <div className="grid gap-8 lg:grid-cols-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <TopProducts />
          <RecentOrders />
        </div>
      </div>
    </div>
  )
}
