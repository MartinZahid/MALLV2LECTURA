export const servicesApi = {
  // Fetch services from a store's external API
  async getByStore(storeId: number): Promise<any[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    
    if (!baseUrl) {
      console.error("[LIB API] Error: NEXT_PUBLIC_API_URL no está definido en variables de entorno.")
      throw new Error("Configuration error: API URL missing")
    }

    const url = `${baseUrl}/catalogo/${storeId}`
    console.log(`[LIB API] Fetching: ${url}`)

    try {
      const response = await fetch(url, { 
        
        next: { revalidate: 0 } 
      })

      if (!response.ok) {
        throw new Error(`External API responded with status: ${response.status}`)
      }

      const data = await response.json()
      
      // Manejar si la API devuelve { "catalogo": [...] } o directamente [...]
      if (Array.isArray(data)) return data
      if (data.catalogo && Array.isArray(data.catalogo)) return data.catalogo
      if (data.products && Array.isArray(data.products)) return data.products
      if (data.services && Array.isArray(data.services)) return data.services

      console.warn("[LIB API] Formato de respuesta desconocido:", data)
      return []
    } catch (error) {
      console.error("[LIB API] Fetch error:", error)
      throw error
    }
  },

  // Check availability
  async checkAvailability(storeSlug: string, date: string, serviceId?: string): Promise<any> {
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    
    const url = new URL(`/api/stores/${storeSlug}/availability`, baseUrl)
    url.searchParams.append("date", date)
    if (serviceId) url.searchParams.append("serviceId", serviceId)

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error("Failed to fetch availability")

    const data = await response.json()
    return data.slots || []
  },
}