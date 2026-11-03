"use client";

import { useState } from "react";
import type { Game, Standing } from "@/lib/mlb";
import LeagueTabs from "@/components/LeagueTabs";
import TeamLogoStrip from "@/components/TeamLogoStrip";

type ActiveLeague = "MLB" | "LMB" | "LMP" | "CARIBE";
type Participant = { country: string; flagSrc: string; league: string };

// Las pestañas siguen siendo enlaces reales. Solo la liga activa alterna su franja.
export default function LeagueTeamExplorer({
  activeLeague,
  initiallyOpen = false,
  standings = [],
  games = [],
  nextGames = [],
  participants = [],
}: {
  activeLeague: ActiveLeague;
  initiallyOpen?: boolean;
  standings?: Standing[];
  games?: Game[];
  nextGames?: Game[];
  participants?: Participant[];
}) {
  const [pinnedOpen, setPinnedOpen] = useState(initiallyOpen);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const expanded = pinnedOpen || hoverOpen || selectedTeam !== null;
  const panelId = "clubes-de-la-liga";

  const collapse = () => {
    setPinnedOpen(false);
    setHoverOpen(false);
    setSelectedTeam(null);
  };

  const toggle = () => {
    if (pinnedOpen || selectedTeam !== null) {
      collapse();
    } else {
      // Si estaba visible solo por hover, el clic lo fija abierto.
      setPinnedOpen(true);
      setHoverOpen(false);
    }
  };

  return (
    <div
      className={`leagueTeamDropdown${expanded ? " is-expanded" : ""}`}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHoverOpen(false);
      }}
    >
      <LeagueTabs
        activeLeague={activeLeague}
        expanded={expanded}
        panelId={panelId}
        onActiveHover={() => setHoverOpen(true)}
        onActiveClick={toggle}
      />
      <div className="clubExplorerControlRow">
        <button
          type="button"
          className="clubExplorerToggle"
          onClick={() => expanded ? collapse() : setPinnedOpen(true)}
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={expanded ? `Ocultar equipos de ${activeLeague}` : `Ver equipos de ${activeLeague}`}
        >
          {expanded ? "OCULTAR EQUIPOS" : "VER EQUIPOS"}
          <span aria-hidden="true">{expanded ? "⌃" : "⌄"}</span>
        </button>
      </div>
      <div className="clubExplorerPanel" id={panelId} hidden={!expanded}>
        <TeamLogoStrip
          league={activeLeague}
          standings={standings}
          games={games}
          nextGames={nextGames}
          participants={participants}
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
        />
      </div>
    </div>
  );
}
