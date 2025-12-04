"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle2, ArrowRight } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function SignupSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-secondary/30 via-background to-secondary/30">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-primary/20 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-scale-in animation-delay-200">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif text-foreground">¡Cuenta creada exitosamente!</CardTitle>
            <CardDescription className="text-muted-foreground">Verifica tu correo electrónico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Correo de confirmación enviado</p>
                    {email && (
                      <p className="text-sm text-muted-foreground">
                        a <span className="font-medium">{email}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium">Pasos siguientes:</p>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Revisa tu bandeja de entrada (y spam)</li>
                  <li>Haz clic en el enlace de confirmación</li>
                  <li>Inicia sesión en Nexus Center</li>
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Nota:</strong> No podrás iniciar sesión hasta que confirmes tu correo electrónico.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button asChild className="w-full group">
                <Link href="/auth/login">
                  Ir a iniciar sesión
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
