import { createClient } from "@/lib/supabase/client"
import type { Store } from "@/lib/types/database"

export const storesApi = {
  // Get all active stores
  async getAll(): Promise<Store[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from("stores").select("*").eq("is_active", true).order("name")

    if (error) throw error
    return data || []
  },

  // Get all product stores
  async getProductStores(): Promise<Store[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from("stores").select("*").eq("type", "product").eq("is_active", true)

    if (error) throw error
    return data || []
  },

  // Get all service stores
  async getServiceStores(): Promise<Store[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from("stores").select("*").eq("type", "service").eq("is_active", true)

    if (error) throw error
    return data || []
  },

  // Get store by slug
  async getBySlug(slug: string): Promise<Store | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("stores").select("*").eq("slug", slug).single()

    if (error) throw error
    return data
  },
}
