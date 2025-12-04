"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-secondary/30 to-background py-20 md:py-32 overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-balance text-foreground">
            Bienvenido a <span className="text-primary">Nexus Center</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance animate-slide-up animation-delay-200">
            Descubre las mejores tiendas y servicios en un solo lugar. Compra productos de calidad y agenda servicios
            profesionales desde la comodidad de tu hogar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
            <Link href="/stores">
              <Button size="lg" className="w-full sm:w-auto group">
                Explorar Tiendas
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/stores?type=service">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Ver Servicios
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
