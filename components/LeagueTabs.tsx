type LeagueTabsProps = {
  activeLeague: "MLB" | "LMB" | "LMP";
};

export default function LeagueTabs({
  activeLeague,
}: LeagueTabsProps) {
  return (
    <div className="leagueWrap">
      <div
        className="tabs"
        role="navigation"
        aria-label="Ligas"
      >
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

        <a
          href="/?league=lmb"
          className={
            activeLeague === "LMB"
              ? "tab active"
              : "tab"
          }
        >
          LMB
        </a>

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
