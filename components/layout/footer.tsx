"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-serif text-2xl font-bold gradient-text">Nexus Center</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu centro comercial digital con las mejores tiendas y servicios. Experiencia de compra premium desde la
              comodidad de tu hogar.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Av. Principal 123, Ciudad</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+52 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@nexuscenter.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 animate-fade-in animation-delay-100">
            <h4 className="font-semibold text-foreground text-lg">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/stores", label: "Tiendas" },
                { href: "/stores?type=service", label: "Servicios" },
                { href: "/products", label: "Productos" },
                { href: "/orders", label: "Mis Pedidos" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 animate-fade-in animation-delay-200">
            <h4 className="font-semibold text-foreground text-lg">Atención al Cliente</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/help", label: "Centro de Ayuda" },
                { href: "/contact", label: "Contacto" },
                { href: "/terms", label: "Términos y Condiciones" },
                { href: "/privacy", label: "Política de Privacidad" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 animate-fade-in animation-delay-300">
            <h4 className="font-semibold text-foreground text-lg">Síguenos</h4>
            <p className="text-sm text-muted-foreground">Mantente al día con nuestras últimas ofertas y novedades</p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Twitter, label: "Twitter", href: "#" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:-translate-y-1 transition-all duration-300"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center animate-fade-in animation-delay-400">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Nexus Center. Todos los derechos reservados. Hecho con{" "}
            <span className="text-primary">♥</span> en México
          </p>
        </div>
      </div>
    </footer>
  )
}
