
"use client";

import { useEffect } from "react";

export default function SmartHeader() {
  useEffect(() => {
    const header =
      document.querySelector<HTMLElement>(".topbar");

    if (!header) return;

    const root = document.documentElement;
    const mobile = window.matchMedia(
      "(max-width: 720px)"
    );

    let lastY = Math.max(0, window.scrollY);
    let travel = 0;

    const syncMode = () => {
      root.classList.toggle(
        "smart-header",
        mobile.matches
      );

      if (!mobile.matches) {
        header.classList.remove("is-hidden");
      }

      lastY = Math.max(0, window.scrollY);
      travel = 0;
    };

    const handleScroll = () => {
      if (!mobile.matches) return;

      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      lastY = y;

      if (y <= 24) {
        header.classList.remove("is-hidden");
        travel = 0;
        return;
      }

      if (delta === 0) return;

      travel =
        Math.sign(delta) === Math.sign(travel)
          ? travel + delta
          : delta;

      if (travel >= 14 && y > 80) {
        header.classList.add("is-hidden");
        travel = 0;
      } else if (travel <= -14) {
        header.classList.remove("is-hidden");
        travel = 0;
      }
    };

    syncMode();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    mobile.addEventListener("change", syncMode);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
      mobile.removeEventListener(
        "change",
        syncMode
      );

      root.classList.remove("smart-header");
      header.classList.remove("is-hidden");
    };
  }, []);

  return null;
}
