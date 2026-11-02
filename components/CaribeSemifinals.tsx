import { getTeamDisplayName } from "@/lib/teamLogos";
import Link from "next/link";
import type { CaribeMatch, CaribeTeam, CaribeTournament } from "@/lib/caribeTournament";
import { caribeDisplayStatus, caribeDisplayStatusClass } from "@/lib/caribeGameStatus";

function teamLine(game: CaribeMatch | undefined, side: "home" | "away") {
  const team: CaribeTeam | undefined = game?.[side];
  const score = side === "home" ? game?.homeScore : game?.awayScore;
  const showScore = game?.state === "Live" || game?.state === "Final";
  const won = game?.state === "Final" && team && game.winnerId === team.id;
  return (
    <div className={`mlbPostseasonSeriesTeam ${won ? "mlbPostseasonSeriesTeamWinner" : ""}`}>
      <div>
        {team?.logoSrc ? <img src={team.logoSrc} alt="" /> :
          team?.flagSrc ? <img src={team.flagSrc} alt="" /> : null}
        <span>{team?.name ? getTeamDisplayName("CARIBE", team.name) : "Por confirmar"}</span>
      </div>
      <strong>{showScore && typeof score === "number" ? score : "–"}</strong>
    </div>
  );
}

export default function CaribeSemifinals({
  tournament,
}: {
  tournament: CaribeTournament | null;
}) {
  const games = (tournament?.matches ?? [])
    .filter((game) => game.phase === "semifinal")
    .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));

  return (
    <section className="section caribeSemifinalsSection" id="semifinales">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">6 DE FEBRERO DE 2027 · ELIMINACIÓN DIRECTA</span>
          <h2>Semifinales</h2>
        </div>
      </div>
      <div className="caribeSemifinalsPanel">
        <div className="caribeSemifinalsIntro">
          <span className="championBadge">⚾ RUMBO AL CAMPEONATO</span>
          <span className="championChip">DOS JUEGOS ÚNICOS</span>
        </div>
        <div className="mlbPostseasonGrid caribeSemifinalsGrid">
          {[0, 1].map((index) => {
            const game = games[index];
            const label = game ? caribeDisplayStatus(game) : "POR DEFINIR";
            const detail = (
              <>
                <div className="mlbPostseasonSeriesTop">
                  <strong>SEMIFINAL {index + 1}</strong>
                  <span className={game ? caribeDisplayStatusClass(label as ReturnType<typeof caribeDisplayStatus>) : ""}>
                    {label === "EN VIVO" && <span className="livePulseDot" aria-hidden="true" />}
                    {label}
                  </span>
                </div>
                <div className="mlbPostseasonSeriesTeams">
                  {teamLine(game, "away")}
                  {teamLine(game, "home")}
                </div>
              </>
            );
            return game?.home && game?.away ? (
              <Link
                href={`/game/caribe/${game.id}`}
                className="mlbPostseasonSeriesCard caribeSemifinalGame caribeClickableCard"
                key={game.id}
              >
                {detail}
              </Link>
            ) : (
              <div className="mlbPostseasonSeriesCard caribeSemifinalGame" key={game?.id ?? index}>
                {detail}
              </div>
            );
          })}
        </div>
        <p className="caribeSemifinalsNote">
          Los cruces se confirmarán al concluir la clasificación. Cada semifinal se decide en un partido.
        </p>
      </div>
    </section>
  );
}
