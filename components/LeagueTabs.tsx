import Link from "next/link";

type LeagueTabsProps = {
  activeLeague: "MLB" | "LMB" | "LMP" | "CARIBE";
};

const LEAGUES = [
  { code: "MLB", href: "/?league=mlb", image: "/logos/leagues/mlb.svg", label: "Major League Baseball", visibleName: "MLB" },
  { code: "LMB", href: "/?league=lmb", image: "/logos/leagues/lmb.png", label: "Liga Mexicana de Beisbol", visibleName: "LMB" },
  { code: "LMP", href: "/?league=lmp", image: "/logos/leagues/lmp.png", label: "Liga Mexicana del Pacífico", visibleName: "LMP" },
  { code: "CARIBE", href: "/serie-del-caribe", image: "/logos/leagues/caribe.svg", label: "Serie del Caribe", visibleName: "SERIE DEL CARIBE" },
] as const;

export default function LeagueTabs({ activeLeague }: LeagueTabsProps) {
  return (
    <div className="leagueWrap">
      <div className="tabs" role="navigation" aria-label="Seleccionar liga">
        {LEAGUES.map((league) => {
          const active = activeLeague === league.code;
          return (
            <Link
              key={league.code}
              href={league.href}
              prefetch={false}
              className={active ? "tab active" : "tab"}
              aria-label={`Ir a ${league.label}`}
              aria-current={active ? "page" : undefined}
              title={league.label}
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
