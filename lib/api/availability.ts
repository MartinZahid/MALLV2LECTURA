// ARCHIVO: lib/api/availability.ts

// Esta es la URL de TU backend (Python/FastAPI)
// En local usa localhost, en producción tomará la variable de entorno
const NEXUS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// --- MAPA DE APIS EXTERNAS POR TIENDA ---
// Aquí defines manualmente qué API usa cada tienda.
// ID 1 = Vanden (según tus ejemplos anteriores)
const STORE_APIS: Record<number, string> = {
  1: "https://e-commerce-test-mm6o.onrender.com/api/productos/verificar-disponibilidad",
  // Si agregas otra tienda en el futuro, solo añades su línea aquí:
  // 2: "https://api.otra-tienda.com/stock",
};

export const availabilityApi = {
  /**
   * Verifica el stock conectándose a tu Nexus API.
   * * @param storeId ID numérico de la tienda (ej. 1 para Vanden)
   * @param productId ID del producto a verificar
   * @param quantity Cantidad total que el usuario quiere comprar
   * @returns true si hay stock suficiente, false si no.
   */
  async checkStock(storeId: number, productId: string | number, quantity: number): Promise<boolean> {
    try {
      // 1. Buscamos la URL de la API externa correspondiente a esta tienda
      const targetApiUrl = STORE_APIS[storeId];

      // Si la tienda no está en la lista (no tiene API externa),
      // retornamos true para no bloquear la compra (asumimos stock local o infinito).
      if (!targetApiUrl) {
        return true; 
      }

      // 2. Hacemos la petición a TU API (Nexus API /dispo_producto/)
      // Tu API actúa como puente (proxy) para evitar problemas de CORS y ocultar la lógica.
      const response = await fetch(`${NEXUS_API_URL}/dispo_producto/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_producto: productId,        // ID que espera tu schema de Python
          cantidad_solicitada: quantity, // Cantidad que espera tu schema
          api_url: targetApiUrl          // La URL de Vanden que tu API necesita
        }),
      });

      if (!response.ok) {
        console.error("Error en Nexus API:", await response.text());
        return false; // Si falla la conexión, asumimos "sin stock" por seguridad
      }

      const data = await response.json();
      
      // 3. Validamos la respuesta de tu API Python
      // Tu API devuelve una lista: [{ "id_producto": "1", "stock": 85 }]
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        // Comparamos si el stock real es mayor o igual a lo que pide el usuario
        return item.stock >= quantity;
      }

      return false; // Si la respuesta está vacía, asumimos que no hay stock.

    } catch (error) {
      console.error("Error general verificando disponibilidad:", error);
      return false;
    }
  }
};