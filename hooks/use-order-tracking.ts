"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useOrderTracking(orderId?: string) {
  const [tracking, setTracking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function load() {
      const supabase = createClient();
      setLoading(true);

      try {
        const { data, error: err } = await supabase
          .from("order_tracking")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: false });

        if (err) throw err;

        setTracking(data || []);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [orderId]);

  return { tracking, loading, error };
}
