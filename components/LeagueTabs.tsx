"use client";

type LeagueTabsProps = {
  activeLeague: "MLB" | "LMB" | "LMP" | "CARIBE";
  expanded: boolean;
  panelId: string;
  onActiveHover: () => void;
  onActiveClick: () => void;
};

const LEAGUES = [
  { code: "MLB", href: "/?league=mlb", image: "/logos/leagues/mlb.svg", label: "Major League Baseball", visibleName: "MLB" },
  { code: "LMB", href: "/?league=lmb", image: "/logos/leagues/lmb.png", label: "Liga Mexicana de Beisbol", visibleName: "LMB" },
  { code: "LMP", href: "/?league=lmp", image: "/logos/leagues/lmp.png", label: "Liga Mexicana del Pacífico", visibleName: "LMP" },
  { code: "CARIBE", href: "/serie-del-caribe", image: "/logos/leagues/caribe.svg", label: "Serie del Caribe", visibleName: "SERIE DEL CARIBE" },
] as const;

export default function LeagueTabs({
  activeLeague, expanded, panelId, onActiveHover, onActiveClick,
}: LeagueTabsProps) {
  return (
    <div className="leagueWrap">
      <div className="tabs" role="navigation" aria-label="Seleccionar liga">
        {LEAGUES.map((league) => {
          const active = activeLeague === league.code;
          const href = active
            ? league.href
            : `${league.href}${league.href.includes("?") ? "&" : "?"}teams=1`;
          return (
            <a
              key={league.code}
              href={href}
              className={active ? "tab active" : "tab"}
              aria-label={active
                ? `Mostrar u ocultar equipos de ${league.label}`
                : `Ir a ${league.label} y mostrar sus equipos`}
              aria-current={active ? "page" : undefined}
              aria-expanded={active ? expanded : undefined}
              aria-controls={active ? panelId : undefined}
              title={league.label}
              onPointerEnter={(event) => {
                if (active && event.pointerType === "mouse") onActiveHover();
              }}
              onClick={active ? (event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey ||
                    event.shiftKey || event.altKey) return;
                event.preventDefault();
                onActiveClick();
              } : undefined}
            >
              <img
                src={league.image}
                alt=""
                aria-hidden="true"
                className={`leagueLogo leagueLogo--${league.code.toLowerCase()}`}
                width={80}
                height={46}
              />
              <span className="leagueName">{league.visibleName}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
