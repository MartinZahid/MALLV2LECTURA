// src/lib/api/payment.ts (Nuevo o editado)
import { createClient } from "@/lib/supabase/client"
import type { UserPaymentMethod } from "@/lib/types/database"

export const paymentApi = {
  async getPaymentDetails(paymentId: string): Promise<UserPaymentMethod> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("user_payment_methods")
      .select("*") 
      .eq("id", paymentId)
      .single()

    if (error) throw error
    if (!data) throw new Error("Método de pago no encontrado")
    return data
  },
}