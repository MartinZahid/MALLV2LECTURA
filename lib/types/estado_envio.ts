export interface EstadoEnvio {
  id: number;
  order_id: string;
  status: string;
  location: string;
  created_at: string;
}

export interface EstadoEnvioRequest {
  order_id: string;
  api_url: string;
}

export interface EstadoEnvioResponse {
  id_envio: number;
  id_pedido: number;
  id_orden_externa: string;
  codigo_seguimiento: string;
  estado_actual: string;
  ubicacion_actual: string;
  fecha_actualizacion: string;
}