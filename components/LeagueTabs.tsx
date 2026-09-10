type LeagueTabsProps = {
  activeLeague: "MLB" | "LMB" | "LMP";
};

export default function LeagueTabs({
  activeLeague,
}: LeagueTabsProps) {
  return (
    <div className="leagueWrap">
      <div className="tabs" role="navigation" aria-label="Ligas">
        <a
          href="/?league=mlb"
          className={
            activeLeague === "MLB"
              ? "tab active"
              : "tab"
          }
        >
          MLB
        </a>

        <span
          className={
            activeLeague === "LMB"
              ? "tab active disabledTab"
              : "tab disabledTab"
          }
          title="LMB próximamente"
        >
          LMB
        </span>

        <a
          href="/?league=lmp"
          className={
            activeLeague === "LMP"
              ? "tab active"
              : "tab"
          }
        >
          LMP
        </a>
      </div>
    </div>
  );
}
