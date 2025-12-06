import { createClient, getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { CartItem } from "@/lib/types/database"

export const cartApi = {
  // Get user's cart items
  async getItems(userId: string): Promise<CartItem[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, store:stores(*)")
      .eq("user_id", userId)
      .order("added_at", { ascending: false })

    if (error) throw error
    return data || []
  },
  

  // Add item to cart
  async addItem(item: Omit<CartItem, "id" | "added_at">): Promise<CartItem> {
    const supabase = createClient()
    console.log("Adding item to cart:", item)
    const { data, error } = await supabase.from("cart_items").insert(item).select().single()

    if (error) throw error
    return data
  },

  // Update cart item quantity
// Agrega esta nueva función:
  updateQuantity: async (itemId: string, quantity: number) => {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("cart_items") // Asegúrate que tu tabla se llame así
      .update({ quantity: quantity })
      .eq("id", itemId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Remove item from cart
  async removeItem(itemId: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

    if (error) throw error
  },

  // Clear all cart items for user
  async clearCart(userId: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from("cart_items").delete().eq("user_id", userId)

    if (error) throw error
  },

  // Move item to wishlist
  async moveToWishlist(itemId: string, userId: string): Promise<void> {
    const supabase = createClient()

    // Get cart item details
    const { data: cartItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("id", itemId)
      .single()

    if (fetchError) throw fetchError

    // Add to wishlist
    const { error: insertError } = await supabase.from("wishlists").insert({
      user_id: userId,
      store_id: cartItem.store_id,
      product_external_id: cartItem.product_external_id,
      product_name: cartItem.product_name,
      product_image_url: cartItem.product_image_url,
      price: cartItem.price,
    })

    if (insertError) throw insertError

    // Remove from cart
    await this.removeItem(itemId)
  },
}
