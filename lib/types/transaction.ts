// Solicitud para crear una nueva transacción (Pago)
export interface TransactionRequest {
  numero_tarjeta_origen: string;
  numero_tarjeta_destino: string;
  nombre_cliente: string;
  mes_exp: number; // Mes de expiración (ej: 1 a 12)
  anio_exp: number; // Año de expiración (ej: 2025)
  cvv: string;
  monto: number; // El monto total a pagar
}

// Respuesta recibida tras una transacción exitosa
export interface TransactionResponse {
  CreadaUTC: string;
  IdTransaccion: string;
  TipoTransaccion: string;
  MontoTransaccion: number;
  NumeroTarjeta: string;
  NumeroAutorizacion: string;
  NombreEstado: string; // Estado de la transacción (ej: Aprobada, Rechazada)
  Firma: string; // Firma o hash de seguridad
  Descripcion: string; // Mensaje de la transacción (ej: 'Transacción exitosa')
}