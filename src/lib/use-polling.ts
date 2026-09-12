"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function usePolling<T>(url: string, intervalMs = 15000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refetch = useCallback(async () => {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    if (mounted.current) {
      setData(json);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    mounted.current = true;
    refetch();
    const interval = setInterval(refetch, intervalMs);
    const onFocus = () => refetch();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      mounted.current = false;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [refetch, intervalMs]);

  return { data, loading, refetch };
}
