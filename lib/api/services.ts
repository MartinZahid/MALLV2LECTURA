// API layer for services - calls external APIs configured in stores
export const servicesApi = {
  // Fetch services from a store's external API
  async getByStore(storeSlug: string): Promise<any[]> {
    const response = await fetch(`/api/stores/${storeSlug}/services`)
    if (!response.ok) throw new Error("Failed to fetch services")

    const data = await response.json()
    return data.services || []
  },

  // Check availability for a specific service and date
  async checkAvailability(storeSlug: string, date: string, serviceId?: string): Promise<any> {
    const url = new URL(`/api/stores/${storeSlug}/availability`, window.location.origin)
    url.searchParams.append("date", date)
    if (serviceId) url.searchParams.append("serviceId", serviceId)

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error("Failed to fetch availability")

    const data = await response.json()
    return data.slots || []
  },
}
