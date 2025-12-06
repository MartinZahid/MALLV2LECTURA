export interface VentaProductoRequest {
  id: number;
  store_id: number;
  order_id: string;
  product_external_id: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  created_at: string;
  payment_status: string;
  api_url: string;
}