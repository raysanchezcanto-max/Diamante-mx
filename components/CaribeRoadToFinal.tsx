import type {
  CaribeMatch,
  CaribePhase,
  CaribeTournament,
} from "@/lib/caribeTournament";
import { resolveCaribeFinalWinner } from "@/lib/caribeTournament";

const phases: {
  id: CaribePhase;
  name: string;
  games: number;
  date: string;
}[] = [
  { id: "roundRobin", name: "Fase clasificatoria", games: 10, date: "1–5 FEB" },
  { id: "semifinal", name: "Semifinales", games: 2, date: "6 FEB" },
  { id: "thirdPlace", name: "Tercer lugar", games: 1, date: "7 FEB" },
  { id: "final", name: "Gran final", games: 1, date: "7 FEB" },
];

function stateLabel(match?: CaribeMatch) {
  if (!match) return "POR CONFIRMAR";
  if (match.state === "Live") return "EN VIVO";
  if (match.state === "Final") return "FINAL";
  if (match.state === "Warmup") return "POR COMENZAR";
  if (match.state === "Postponed") return "POSPUESTO";
  return "PRÓXIMO";
}

function TeamLine({
  match,
  side,
}: {
  match?: CaribeMatch;
  side: "home" | "away";
}) {
  const team = match?.[side];
  const score = side === "home" ? match?.homeScore : match?.awayScore;
  const isWinner =
    match?.state === "Final" &&
    !!match.winnerId &&
    team?.id === match.winnerId;

  return (
    <div
      className={`mlbPostseasonSeriesTeam caribeRoadTeam
        ${isWinner ? "mlbPostseasonSeriesTeamWinner" : ""}`}
    >
      <div>
        {team?.logoSrc ? (
          <img src={team.logoSrc} alt="" />
        ) : team?.flagSrc ? (
          <img src={team.flagSrc} alt="" />
        ) : null}
        <span>{team?.name ?? "Por confirmar"}</span>
      </div>
      <strong>
        {typeof score === "number" && match?.state !== "Preview"
          ? score
          : "–"}
      </strong>
    </div>
  );
}

export default function CaribeRoadToFinal({
  tournament,
}: {
  tournament: CaribeTournament | null;
}) {
  return (
    <section className="section mlbPostseasonHistorySection caribeRoadSection" id="formato">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">HERMOSILLO 2027 · RUTA AL TÍTULO</span>
          <h2>Camino a la final</h2>
        </div>
      </div>

      <details className="mlbPostseasonHistory">
        <summary>Camino a la Serie del Caribe 2027</summary>
        <div className="mlbPostseasonHistoryContent">
          <p className="caribeRoadNote">
            14 encuentros previstos · la final se decide en un solo juego.
            Los cruces y horarios se mostrarán cuando los confirme la fuente oficial.
          </p>
          {phases.map((phase) => {
            const matches = (tournament?.matches ?? [])
              .filter((m) => m.phase === phase.id)
              .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
            const count = Math.max(phase.games, matches.length);

            return (
              <div className="mlbPostseasonHistoryPhase" key={phase.id}>
                <div className="mlbPostseasonHistoryPhaseHeader">
                  <span>{phase.name} · {phase.date} · {phase.games} {phase.games === 1 ? "PARTIDO" : "PARTIDOS"}</span>
                </div>
                <div className="mlbPostseasonHistoryGrid caribeRoadGrid">
                  {Array.from({ length: count }, (_, index) => {
                    const match = matches[index];
                    const winner = resolveCaribeFinalWinner(
                      phase.id === "final" ? match ?? null : null
                    );

                    return (
                      <div className="mlbPostseasonSeriesCardCompact caribeRoadMatch" key={match?.id ?? `${phase.id}-${index}`}>
                        <div className="mlbPostseasonSeriesTop">
                          <strong>{phase.games === 1 ? phase.name : `PARTIDO ${index + 1}`}</strong>
                          <span className={match?.state === "Live" ? "caribeRoadLive" : ""}>
                            {stateLabel(match)}
                          </span>
                        </div>
                        <div className="mlbPostseasonSeriesTeams">
                          <TeamLine match={match} side="away" />
                          <TeamLine match={match} side="home" />
                        </div>
                        {winner && (
                          <div className="mlbPostseasonHistoryWinner">
                            <span>CAMPEÓN</span>
                            <strong>{winner.winner.name}</strong>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </section>
  );
}
