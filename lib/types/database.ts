export type Store = {
  id: string
  store_id: number
  name: string
  slug: string
  description: string | null
  type: "product" | "service"
  category: "clothing" | "cafeteria" | "barbershop" | "spa"
  image_url: string | null
  api_endpoint: string | null
  is_active: boolean
  created_at: string
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: "customer" | "admin" | "super_admin"
  created_at: string
  updated_at: string
}

export type UserAddress = {
  id: string
  user_id: string
  address_name: string
  street: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
}

export type UserPaymentMethod = {
  id: string
  user_id: string
  payment_type: string
  card_number: string | null
  card_brand: string | null
  cardholder_name: string
  cvv: string
  card_exp_month: number
  card_exp_year: number
  is_default: boolean
  created_at: string
}

export type CartItem = {
  id: string
  user_id: string
  store_id: string
  product_external_id: string
  product_name: string
  product_description: string | null
  product_image_url: string | null
  price: number
  quantity: number
  size: string | null
  color: string | null
  is_available: boolean
  added_at: string
  store?: Store
}

export type Order = {
  id: string
  user_id: string
  order_number: string
  total_amount: number
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "paid" | "refunded"
  payment_method_id: string | null
  shipping_address_id: string | null
  delivery_type: "delivery" | "pickup"
  tracking_number: string | null
  estimated_delivery: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  store_id: string
  product_external_id: string
  product_name: string
  product_image_url: string | null
  price: number
  quantity: number
  size: string | null
  color: string | null
  options: Record<string, any> | null
  created_at: string
  store?: Store
}

export type Appointment = {
  id: string
  user_id: string
  store_id: string
  service_external_id: string
  service_name: string
  service_description: string | null
  price: number
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "rescheduled"
  payment_status: "pending" | "paid"
  payment_method_id: string | null
  confirmation_code: string | null
  cancellation_reason: string | null
  refund_status: "none" | "pending" | "processed" | null
  notes: string | null
  created_at: string
  updated_at: string
  store?: Store
}
