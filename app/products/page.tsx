import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AllProductsGrid } from "@/components/products/all-products-grid"

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">Todos los Productos</h1>
          <AllProductsGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}
