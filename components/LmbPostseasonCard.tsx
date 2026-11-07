import Link from "next/link";
import { getTeamLogo, getTeamDisplayName } from "@/lib/teamLogos";
import {
  type LmbPostseason,
  type LmbPlayoffRound,
  type LmbPlayoffSeries,
  LMB_PLAYOFF_ROUND_LABELS,
} from "@/lib/lmbPostseason";

function SeriesCard({ series }: { series: LmbPlayoffSeries }) {
  const winner = series.teams.find(team => team.code === series.winnerCode);
  const live = !winner ? series.timeline?.find(game => game.status === "Live") : null;
  const upcoming = !winner ? series.timeline?.find(game => game.status === "Preview") : null;
  const activeGame = live ?? upcoming;
  function displayDate(value: string) {
    if (!value || Number.isNaN(Date.parse(value))) return null;
    return new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Mexico_City",
      day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
    }).format(new Date(value));
  }

  return (
    <div className="mlbPostseasonSeriesCard mlbPostseasonSeriesCardCompact lmbPostseasonSeriesCard">
      <div className="mlbPostseasonSeriesTeams">
        {series.teams.map(team => {
          const logo = getTeamLogo("LMB", 0, team.name);
          const winnerStyle = winner
            ? series.winnerCode === team.code
              ? "mlbPostseasonSeriesTeamWinner"
              : "mlbPostseasonSeriesTeamLoser"
            : "";
          return (
            <div className={"mlbPostseasonSeriesTeam " + winnerStyle} key={team.code}>
              <div>
                {logo
                  ? <img src={logo} alt="" loading="lazy" />
                  : <span className="lmbPostseasonNoLogo" aria-hidden="true" />}
                <span>{getTeamDisplayName("LMB", team.name)}</span>
              </div>
              <strong>{team.wins}</strong>
            </div>
          );
        })}
      </div>
      <div className="mlbPostseasonSeriesStatus lmbPostseasonSeriesStatus">
        {winner ? (
          <strong>
            {series.round === "rey" ? "CAMPEÓN" : "GANÓ LA SERIE"}
            {" · "}{getTeamDisplayName("LMB", winner.name)}
          </strong>
        ) : live ? (
          <span className="lmbPostseasonLive">
            <span className="livePulseDot" aria-hidden="true" />
            EN VIVO{live.gameNumber ? " · JUEGO " + live.gameNumber : ""}
          </span>
        ) : upcoming ? (
          <span>PRÓXIMO{upcoming.gameNumber ? " · JUEGO " + upcoming.gameNumber : ""}</span>
        ) : (
          <span>SERIE EN DISPUTA</span>
        )}
        {activeGame && (
          <Link href={"/game/lmb/" + activeGame.id}>
            {live ? "VER JUEGO" :
              !activeGame.startTimeTBD && displayDate(activeGame.date)
                ? displayDate(activeGame.date)
                : "HORA POR CONFIRMAR"}
          </Link>
        )}
      </div>
      {series.bestLoserCode && (
        <p className="lmbPostseasonBestLoser">
          <span>MEJOR PERDEDOR · </span>
          {getTeamDisplayName(
            "LMB",
            series.teams.find(team => team.code === series.bestLoserCode)?.name ?? ""
          )} también avanzó a Series de Zona.
        </p>
      )}
    </div>
  );
}

function Round({
  postseason,
  round,
}: {
  postseason: LmbPostseason;
  round: LmbPlayoffRound;
}) {
  const series = postseason.series.filter(item => item.round === round);
  if (!series.length) return null;
  const zones = (round === "rey" ? ["General"] : ["Norte", "Sur"])
    .map(zone => ({ zone, matches: series.filter(item => item.zone === zone) }))
    .filter(group => group.matches.length > 0);

  return (
    <div className="lmbPostseasonRound">
      <div className="mlbPostseasonHistoryPhaseHeader">
        <span>{LMB_PLAYOFF_ROUND_LABELS[round]}</span>
      </div>
      <div className={round === "championship" ? "lmbPostseasonChampionshipColumns" : "lmbPostseasonZoneRows"}>
        {zones.map(({ zone, matches }) => (
          <div className="lmbPostseasonZone" key={zone}>
            {zone !== "General" && <h3>Zona {zone}</h3>}
            <div className="mlbPostseasonGrid lmbPostseasonGrid">
              {matches.map(item => (
                <SeriesCard
                  series={item}
                  key={[item.round,item.zone,item.teams[0].code,item.teams[1].code].join("-")}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LmbPostseasonCard({
  postseason,
  mode = "history",
}: {
  postseason: LmbPostseason;
  mode?: "active" | "history";
}) {
  if (!postseason.series.length) return null;
  const order: LmbPlayoffRound[] = ["first","zone","championship","rey"];
  const hasRound = (round: LmbPlayoffRound) =>
    postseason.series.some(series => series.round === round);
  const rounds: LmbPlayoffRound[] = (["championship", "zone", "first"] as const)
    .filter(hasRound);
  if (mode === "active") {
    const current = (["rey", "championship", "zone", "first"] as const)
      .find(hasRound);
    if (!current) return null;
    const earlier = rounds.filter(round => order.indexOf(round) < order.indexOf(current));
    return (
      <section className="section lmbPostseasonSection" aria-label="Playoffs LMB">
        <div className="lmbPostseasonHeading">
          <div>
            <span className="eyebrow">PLAYOFFS · LMB {postseason.season}</span>
            <h2>{current === "rey" ? "Serie del Rey" : "Camino a la Serie del Rey"}</h2>
          </div>
          <p>Resultados y enfrentamientos oficiales · En tiempo real</p>
        </div>
        <Round postseason={postseason} round={current} />
        {earlier.length > 0 && (
          <details className="mlbPostseasonHistory lmbPostseasonHistory">
            <summary>Camino a la Serie del Rey</summary>
            <div className="mlbPostseasonHistoryContent">
              {earlier.map(round => (
                <Round key={round} postseason={postseason} round={round} />
              ))}
            </div>
          </details>
        )}
      </section>
    );
  }
  if (!rounds.length) return null;
  return (
    <section className="section mlbPostseasonHistorySection lmbPostseasonSection" aria-label="Camino a la Serie del Rey">
      <details className="mlbPostseasonHistory lmbPostseasonHistory">
        <summary>Camino a la Serie del Rey</summary>
        <div className="mlbPostseasonHistoryContent">
          {rounds.map(round => (
            <Round key={round} postseason={postseason} round={round} />
          ))}
          <p className="lmbPostseasonSource">
            Resultados oficiales LMB · Temporada {postseason.season}
          </p>
        </div>
      </details>
    </section>
  );
}
