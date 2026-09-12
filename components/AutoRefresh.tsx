"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AutoRefreshProps = {
  enabled?: boolean;
  intervalMs?: number;
};

export default function AutoRefresh({
  enabled = true,
  intervalMs = 30000,
}: AutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timer = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [enabled, intervalMs, router]);

  return null;
}
