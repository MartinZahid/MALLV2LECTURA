import type { EstadoEnvioRequest, EstadoEnvioResponse } from '@/lib/types/estado_envio'

export const enviosApi = {
    async getByOrder(request: EstadoEnvioRequest): Promise<EstadoEnvioResponse> {
        // Tu API (backend propio), no el negocio
        const url = `${process.env.NEXT_PUBLIC_API_URL}/estado_envio/`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        let res: Response;

        try {
            res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    api_url: request.api_url,
                    order_id: request.order_id
                }),
                signal: controller.signal
            });
        } catch (error: any) {
            clearTimeout(timeout);
            if (error.name === 'AbortError') {
                throw new Error('La solicitud excedió el tiempo límite');
            }
            throw new Error('No se pudo conectar con el servidor');
        }

        clearTimeout(timeout);

        if (!res.ok) {
            let msg = 'Error consultando estado del envío';
            try {
                const errBody = await res.json();
                msg = errBody.detail || errBody.message || msg;
            } catch (_) {}
            throw new Error(msg);
        }

        const data = await res.json() as EstadoEnvioResponse;

        if (!data.estado_actual) throw new Error('Backend no envió estado_actual');
        if (!data.id_envio) throw new Error('Backend no envió id_envio');

        return data;
    }
};
