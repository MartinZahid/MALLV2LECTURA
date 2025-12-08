export interface ProductoItem {
  external_id: number | string;
  quantity: number;
  size: string | null;
  color: string | null;
}

export interface ClientData {
  nombre: string;
  email: string;
  telofono?: string | null;
  direccion: string;
}

export interface VentaRequest {
  id: string;
  order_id: string;
  price: number;
  products: ProductoItem[];
  datos_cliente: ClientData;
  created_at: string;
  payment_status: string;
  api_url: string;
}
