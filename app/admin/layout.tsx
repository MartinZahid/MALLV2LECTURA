import type React from "react"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/utils/auth"
import { AlertCircle } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminAccess = await isAdmin()

  if (!adminAccess) {
    redirect("/auth/login?error=unauthorized")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sand-50 to-sage-100/30">
      <div className="container mx-auto px-4 py-4">
        <div className="mb-4 rounded-lg border border-sage-300 bg-sage-50 p-3 flex items-center gap-3 text-sm text-sage-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>Modo Administrador - Tienes acceso completo a las estadísticas del centro comercial</span>
        </div>
      </div>
      {children}
    </div>
  )
}
