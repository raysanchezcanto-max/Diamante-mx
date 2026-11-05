"use client";

import { useEffect, useRef } from "react";

export type LmbClubView =
  | "resumen"
  | "plantilla"
  | "movimientos"
  | "grandes-ligas"
  | "historia";

type Props = {
  home: string;
  clubName: string;
  currentView: LmbClubView;
};

const views: ReadonlyArray<{ id: LmbClubView; label: string }> = [
  { id: "resumen", label: "Resumen" },
  { id: "plantilla", label: "Plantilla" },
  { id: "movimientos", label: "Movimientos" },
  { id: "grandes-ligas", label: "Grandes Ligas" },
  { id: "historia", label: "Historia" },
];

export default function LmbClubTabs({ home, clubName, currentView }: Props) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const showActiveTab = () => {
      const active = nav.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!active || nav.scrollWidth <= nav.clientWidth + 2) return;

      const bounds = nav.getBoundingClientRect();
      const selected = active.getBoundingClientRect();
      const padding = 10;

      // Solo desplazar el menú horizontal, nunca toda la página.
      // Es especialmente importante al abrir Historia o Grandes Ligas
      // directamente desde un enlace en una pantalla pequeña.
      if (selected.left < bounds.left + padding) {
        nav.scrollLeft += selected.left - bounds.left - padding;
      } else if (selected.right > bounds.right - padding) {
        nav.scrollLeft += selected.right - bounds.right + padding;
      }
    };

    const frame = requestAnimationFrame(showActiveTab);
    window.addEventListener("resize", showActiveTab);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", showActiveTab);
    };
  }, [currentView]);

  return (
    <nav
      className="clubProfileTabs"
      aria-label={`Secciones de ${clubName}`}
      ref={navRef}
    >
      {views.map((tab) => (
        <a
          key={tab.id}
          href={tab.id === "resumen" ? home : `${home}?vista=${tab.id}`}
          className={currentView === tab.id ? "is-active" : ""}
          aria-current={currentView === tab.id ? "page" : undefined}
        >
          {tab.label}
        </a>
      ))}
    </nav>
  );
}
