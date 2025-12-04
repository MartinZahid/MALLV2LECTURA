import { HeroSection } from "@/components/home/hero-section"
import { StoresSection } from "@/components/home/stores-section"
import { FeaturesSection } from "@/components/home/features-section"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StoresSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
