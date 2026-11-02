import { getTeamDisplayName } from "@/lib/teamLogos";
import Link from "next/link";
import type { CaribeMatch, CaribeTeam, CaribeTournament } from "@/lib/caribeTournament";
import { caribeDisplayStatus, caribeDisplayStatusClass } from "@/lib/caribeGameStatus";

const tz = "America/Mexico_City";

function startLabel(startTime?: string): string {
  if (!startTime) return "HORA POR CONFIRMAR";
  const date = new Date(startTime);
  if (!Number.isFinite(date.getTime())) return "HORA POR CONFIRMAR";
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: tz,
    day: "numeric", month: "short",
    hour: "numeric", minute: "2-digit",
  }).format(date);
}

function TeamRow({
  team,
  score,
  showScore,
}: {
  team?: CaribeTeam;
  score?: number;
  showScore: boolean;
}) {
  return (
    <div className="teamRow">
      <div className="teamIdentity">
        {team?.logoSrc ? <img src={team.logoSrc} alt="" /> :
          team?.flagSrc ? <img src={team.flagSrc} alt="" /> : null}
        <span>{team?.name ? getTeamDisplayName("CARIBE", team.name) : "Por confirmar"}</span>
      </div>
      <strong>{showScore && typeof score === "number" ? score : "–"}</strong>
    </div>
  );
}

function FixtureCard({ game }: { game: CaribeMatch }) {
  const status = caribeDisplayStatus(game);
  const showScore = game.state === "Live" || game.state === "Final";
  return (
    <Link href={`/game/caribe/${game.id}`} className="gameCard gameCardLink caribeFixtureCard">
      <div className={`gameStatus caribeFixtureStatus ${status === "EN VIVO" ? "live" : ""}`}>
        <span className={`caribeStatusLabel ${caribeDisplayStatusClass(status)}`}>
          {status === "EN VIVO" && <span className="livePulseDot" aria-hidden="true" />}
          {status}
        </span>
        <span className="caribeFixtureTime">
          {game.phase === "thirdPlace" ? "TERCER LUGAR · " : ""}
          {startLabel(game.startTime)}
        </span>
      </div>
      <TeamRow team={game.away} score={game.awayScore} showScore={showScore} />
      <TeamRow team={game.home} score={game.homeScore} showScore={showScore} />
    </Link>
  );
}

export default function CaribeFixtures({
  tournament,
  started,
}: {
  tournament: CaribeTournament | null;
  started: boolean;
}) {
  // Solo la fase clasificatoria y tercer lugar usan tarjetas normales.
  // Semifinales y final tienen un componente propio.
  const scheduled = (tournament?.matches ?? []).filter(
    (game) => game.phase === "roundRobin" || game.phase === "thirdPlace"
  );
  const upcoming = scheduled
    .filter((game) => game.state !== "Final")
    .sort((a, b) =>
      (a.state === "Live" ? 0 : 1) - (b.state === "Live" ? 0 : 1) ||
      (a.startTime ?? "").localeCompare(b.startTime ?? "")
    );
  const finished = scheduled
    .filter((game) => game.state === "Final")
    .sort((a, b) =>
      (b.startTime ?? "").localeCompare(a.startTime ?? "")
    );

  return (
    <section className="section caribeFixturesSection" id="juegos">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">SERIE DEL CARIBE 2027 · CALENDARIO</span>
          <h2>{started ? "Próximos juegos" : "Programa de juegos"}</h2>
        </div>
        <span className="liveDot">Datos CARIBE · {tournament ? "CALENDARIO" : "PENDIENTES"}</span>
      </div>

      {upcoming.length ? (
        <>
          <p className="caribeFixturesNote">Horarios mostrados en hora del centro de México.</p>
          <div className="gamesGrid">
            {upcoming.map((game) => <FixtureCard key={game.id} game={game} />)}
          </div>
        </>
      ) : (
        <div className="caribeFixturesEmpty">
          <strong>{!tournament ? "Calendario oficial por integrar" :
            finished.length ? "No quedan encuentros pendientes en esta fase" :
            "No hay partidos confirmados todavía"}</strong>
          <p>
            {tournament
              ? "Mostraremos los encuentros cuando los publique la fuente oficial."
              : "Aún no tenemos conectados los horarios y marcadores de la edición 2027. No se mostrarán encuentros ni resultados sin confirmar."}
          </p>
          <a href="https://seriedelcaribe.net/calendario" target="_blank" rel="noopener noreferrer">
            Consultar calendario oficial ↗
          </a>
        </div>
      )}

      {finished.length > 0 && (
        <div className="caribeFinishedGames">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">ÚLTIMOS RESULTADOS</span>
              <h2>Resultados recientes</h2>
            </div>
          </div>
          <div className="gamesGrid">
            {finished.map((game) => <FixtureCard key={game.id} game={game} />)}
          </div>
        </div>
      )}
    </section>
  );
}
