import { TransactionRequest, TransactionResponse } from "../types/transaction"

const bankUrl = process.env.NEXT_PUBLIC_API_URL!;

export const bankApi = {
  async createTransaction(
    transactionData: TransactionRequest
  ): Promise<TransactionResponse> {
    const response = await fetch(`${bankUrl}/transactions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));

      throw new Error(
        errorData.detail?.[0]?.msg || 
        errorData.Mensaje || 
        `Error en la transacción: Código ${response.status}`
      );
    }

    return response.json() as Promise<TransactionResponse>;
  }
}