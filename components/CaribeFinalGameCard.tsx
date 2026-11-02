import type { CaribeMatch } from "@/lib/caribeTournament";

export default function CaribeFinalGameCard({ game }: { game: CaribeMatch }) {
  if (!game.away || !game.home || game.phase !== "final") {
    return null;
  }
  const isLive = game.state === "Live";
  const showScores = isLive || game.state === "Final";
  const time = game.startTime
    ? new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Hermosillo",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(game.startTime))
    : "HORA POR CONFIRMAR";

  return (
    <section className="section caribeFinalSection">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">SERIE DEL CARIBE 2027 · JUEGO ÚNICO</span>
          <h2>Gran final</h2>
        </div>
        <span className={`caribeFinalStatus ${isLive ? "caribeFinalLive" : ""}`}>
          {isLive ? "EN VIVO" : game.state === "Final" ? "FINAL" : game.state === "Warmup" ? "POR COMENZAR" : "PRÓXIMO"}
        </span>
      </div>

      <div className="championCardPro mlbWorldSeriesCard caribeFinalCard">
        <div className="championGlow championGlowLeft" aria-hidden="true" />
        <div className="championGlow championGlowRight" aria-hidden="true" />
        <div className="championPattern" aria-hidden="true" />
        <div className="championCardTop">
          <span className="championBadge">🏆 FINAL · HERMOSILLO 2027</span>
          <span className="championChip">JUEGO ÚNICO</span>
        </div>

        <div className="caribeFinalMatchup">
          {(["away", "home"] as const).map((side) => {
            const team = game[side]!;
            const score = side === "home" ? game.homeScore : game.awayScore;
            return (
              <div className="caribeFinalTeam" key={team.id}>
                {team.logoSrc ? (
                  <img src={team.logoSrc} alt="" />
                ) : team.flagSrc ? (
                  <img src={team.flagSrc} alt="" />
                ) : <span aria-hidden="true">⚾</span>}
                <strong>{team.name}</strong>
                <b>{showScores && typeof score === "number" ? score : "–"}</b>
              </div>
            );
          })}
        </div>
        <p className="caribeFinalVenue">7 DE FEBRERO · {time} · ESTADIO FERNANDO VALENZUELA</p>
      </div>
    </section>
  );
}
