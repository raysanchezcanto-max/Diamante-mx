"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AutoRefreshProps = {
  enabled?: boolean;
  intervalMs?: number;
  refreshOnFocus?: boolean;
};

export default function AutoRefresh({
  enabled = true,
 intervalMs = 15000,
  refreshOnFocus = false,
}: AutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let lastRefresh = Date.now();
    const refreshVisible = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastRefresh < intervalMs) return;
      lastRefresh = now;
      router.refresh();
    };

    const timer = setInterval(refreshVisible, intervalMs);
    if (refreshOnFocus) {
      window.addEventListener("focus", refreshVisible);
      document.addEventListener("visibilitychange", refreshVisible);
    }

    return () => {
      clearInterval(timer);
      if (refreshOnFocus) {
        window.removeEventListener("focus", refreshVisible);
        document.removeEventListener("visibilitychange", refreshVisible);
      }
    };
  }, [enabled, intervalMs, refreshOnFocus, router]);

  return null;
}
