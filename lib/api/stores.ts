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
  async getStoreBankAccount(storeId: string): Promise<string> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("stores")
      .select("bank_account")
      .eq("id", storeId)
      .single()

    if (error) throw error
    if (!data) throw new Error("Store bank account not found for storeCode: " + storeId)
    return data.bank_account
  },
  async getStoreUUID(storeId: number): Promise<string> {
    const supabase = createClient()
    
    // NOTA: Se recomienda remover .execute() ya que .single() lo maneja.
    const { data, error } = await supabase
      .from("stores")
      .select("id")
      .eq("store_id", storeId)
      .single() // Ejecuta la consulta

    if (error) {
        // Manejar errores de Supabase (por ejemplo, error de conexión, RLS, etc.)
        throw error;
    }
    
    if (!data) {
        // Manejar el caso donde no se encontró la tienda (si .single() no lanza error al no encontrar)
        throw new Error("Store UUID not found for storeCode: " + storeId);
    }
    
    // Si llegamos aquí, la consulta fue exitosa y data tiene el objeto { id: <UUID> }
    return data.id;
},

  // Get store by slug
  async getBySlug(slug: string): Promise<Store | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("stores").select("*").eq("slug", slug).single()

    if (error) throw error
    return data
  },
}
