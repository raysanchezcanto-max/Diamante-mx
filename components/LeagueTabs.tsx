type LeagueTabsProps = {
  activeLeague: "MLB" | "LMB" | "LMP" | "CARIBE";
};

const LEAGUES = [
  { code: "MLB", href: "/?league=mlb", image: "/logos/leagues/mlb.svg", label: "Major League Baseball" },
  { code: "LMB", href: "/?league=lmb", image: "/logos/leagues/lmb.png", label: "Liga Mexicana de Beisbol" },
  { code: "LMP", href: "/?league=lmp", image: "/logos/leagues/lmp.png", label: "Liga Mexicana del Pacífico" },
  { code: "CARIBE", href: "/serie-del-caribe", image: "/logos/leagues/caribe.svg", label: "Serie del Caribe" },
] as const;

export default function LeagueTabs({ activeLeague }: LeagueTabsProps) {
  return (
    <div className="leagueWrap">
      <nav className="tabs" aria-label="Seleccionar liga">
        {LEAGUES.map((league) => {
          const active = activeLeague === league.code;
          return (
            <a
              key={league.code}
              href={league.href}
              className={active ? "tab active" : "tab"}
              aria-label={`Ir a ${league.label}`}
              aria-current={active ? "page" : undefined}
              title={league.label}
            >
              <img
                src={league.image}
                alt={league.code}
                className={`leagueLogo leagueLogo--${league.code.toLowerCase()}`}
                width={80}
                height={46}
              />
            </a>
          );
        })}
      </nav>
    </div>
  );
}
