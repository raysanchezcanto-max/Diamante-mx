"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AutoRefreshProps = {
  enabled?: boolean;
  intervalMs?: number;
  refreshOnFocus?: boolean;
  snapshotAt?: number;
};

export default function AutoRefresh({
  enabled = true,
 intervalMs = 15000,
  refreshOnFocus = false,
  snapshotAt,
}: AutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // El historial del navegador y el Router Cache pueden restaurar un
    // render de hace horas. Usar su hora REAL, no la hora de montaje,
    // evita tratar la pantalla vieja como si acabara de actualizarse.
    let lastRefresh = snapshotAt ?? Date.now();
    const refreshVisible = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastRefresh < intervalMs) return;
      lastRefresh = now;
      router.refresh();
    };

    // Si Next.js entrega al cliente un estado LMP ya caducado, no esperar
    // otros 12–15 segundos para ponerlo al día. En las demás ligas
    // permanece el comportamiento anterior.
    if (refreshOnFocus && typeof snapshotAt === "number") {
      refreshVisible();
    }

    const timer = setInterval(refreshVisible, intervalMs);
    if (refreshOnFocus) {
      window.addEventListener("focus", refreshVisible);
      window.addEventListener("pageshow", refreshVisible);
      document.addEventListener("visibilitychange", refreshVisible);
    }

    return () => {
      clearInterval(timer);
      if (refreshOnFocus) {
        window.removeEventListener("focus", refreshVisible);
        window.removeEventListener("pageshow", refreshVisible);
        document.removeEventListener("visibilitychange", refreshVisible);
      }
    };
  }, [enabled, intervalMs, refreshOnFocus, router, snapshotAt]);

  return null;
}
