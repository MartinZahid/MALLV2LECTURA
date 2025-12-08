import { VentaRequest } from "@/lib/types/venta_registro";

export const ventaProductoApi = {
  registerSale: async (payload: VentaRequest) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/venta_producto/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        console.error("Error creando venta producto:", await res.text());
        throw new Error("Error en el endpoint venta_producto");
      }

      return await res.json();
    } catch (error) {
      console.error("Error en registerSale:", error);
      throw error;
    }
  },
};
