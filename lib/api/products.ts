// API layer for products - calls external APIs configured in stores
export const productsApi = {
  // Fetch products from a store's external API
  async getByStore(storeId: number): Promise<any[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
    const response = await fetch(`${apiUrl}/catalogo/${storeId}`);

    if (!response.ok) throw new Error("Failed to fetch products");

    const data = await response.json();

    console.log("RAW API DATA:", data);

    // If the backend returns an array, return it directly
    if (Array.isArray(data)) return data;

    // Fallbacks in case backend changes
    return data.products ?? data.catalogo ?? [];
  },


  // Fetch all products from all product stores
  async getAll(stores: Array<{ id: number; name: string }>): Promise<any[]> {
    const productPromises = stores.map(async (store) => {
      const products = await this.getByStore(store.id)
      return products.map((p: any) => ({
        ...p,
        storeId: store.id,
        storeName: store.name,
      }))
    })

    const productsArrays = await Promise.all(productPromises)
    return productsArrays.flat()
  },
}
