// lib/api/availability.ts

// URL de tu Backend Python (Nexus API)
const NEXUS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// --- MAPA DE CONFIGURACIÓN ---
// Aquí defines manualmente qué API usa cada tienda.
const STORE_APIS: Record<number, string> = {
  // Tienda ID 1 (Vanden) -> Usa esta URL específica
  1: "https://e-commerce-test-mm6o.onrender.com/api/productos/verificar-disponibilidad",
  
  // Si tienes otra tienda en el futuro, la agregas aquí:
  // 2: "https://api.nike.com/stock",
};

export const availabilityApi = {
  /**
   * Verifica el stock usando el mapa local STORE_APIS.
   */
  async checkStock(storeId: number, productId: string | number, quantity: number): Promise<boolean> {
    try {
      // 1. Buscamos la URL en el mapa manual (SIN ir a la BD)
      const targetApiUrl = STORE_APIS[storeId];

      // Si la tienda no está en el mapa, asumimos que no requiere validación externa
      if (!targetApiUrl) {
        console.log(`Tienda ${storeId} no tiene API configurada, saltando validación.`);
        return true; 
      }

      console.log(`Verificando stock en: ${targetApiUrl}`);

      // 2. Llamamos a tu Nexus API (Python)
      const response = await fetch(`${NEXUS_API_URL}/dispo_producto/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_producto: productId,
          cantidad_solicitada: quantity,
          api_url: targetApiUrl // Enviamos la URL que sacamos del mapa
        }),
      });

      if (!response.ok) {
        console.error("Error en Nexus API:", await response.text());
        return false; // Ante error, bloqueamos
      }

      const data = await response.json();
      
      // 3. Validar respuesta: [{ "id_producto": 1, "stock": 85 }]
      if (Array.isArray(data) && data.length > 0) {
        return data[0].stock >= quantity;
      }

      return false; // Respuesta vacía o sin stock

    } catch (error) {
      console.error("Error crítico verificando stock:", error);
      return false;
    }
  }
};