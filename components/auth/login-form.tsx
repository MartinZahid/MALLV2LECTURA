"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Credenciales incorrectas",
            description: "Verifica tu correo y contraseña. Si acabas de registrarte, confirma tu email primero.",
            variant: "destructive",
          })
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email no confirmado",
            description: "Por favor revisa tu correo y confirma tu cuenta antes de iniciar sesión.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error al iniciar sesión",
            description: error.message || "Intenta de nuevo más tarde",
            variant: "destructive",
          })
        }
        return
      }

      toast({
        title: "¡Bienvenido de vuelta!",
        description: "Has iniciado sesión correctamente",
      })

      const redirect = searchParams.get("redirect") || "/"
      router.push(redirect)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: "Ocurrió un error inesperado. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  )
}
