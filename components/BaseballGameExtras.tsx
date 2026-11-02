import type {
  BaseballDecision, BaseballLineScore, BaseballStatPlayer, BaseballTeamStats,
} from "@/lib/baseballGameExtras";

const show = (x?: number) => typeof x === "number" ? x : "–";

export function BaseballLineScoreCard({
  data, away, home, activeInning,
}: {
  data: BaseballLineScore;
  away: string;
  home: string;
  activeInning?: number;
}) {
  const { lines, totals } = data;
  if (!totals || lines.length === 0) return null;
  const ar = totals.away.runs, hr = totals.home.runs;
  const hasRuns = typeof ar === "number" && typeof hr === "number";
  const awayRunsClass = !hasRuns || ar === hr ? "baseballRunsTie" :
    ar! > hr! ? "baseballRunsWinning" : "baseballRunsLosing";
  const homeRunsClass = !hasRuns || ar === hr ? "baseballRunsTie" :
    hr! > ar! ? "baseballRunsWinning" : "baseballRunsLosing";
  return (
    <section className="baseballExtrasPanel">
      <span className="eyebrow">LÍNEA DEL JUEGO</span>
      <p className="baseballExtrasSwipe">DESLIZA PARA VER MÁS →</p>
      <div className="baseballExtrasScroll" role="region" tabIndex={0} aria-label="Línea del juego por entradas">
        <table className="baseballExtrasLine">
          <thead><tr>
            <th>EQUIPO</th>
            {lines.map((line) => (
              <th key={line.number} className={line.number === activeInning ? "baseballActiveInning" : ""}>{line.number}</th>
            ))}
            <th>R</th><th className="baseballHits">H</th><th className="baseballErrors">E</th>
          </tr></thead>
          <tbody>{(["away", "home"] as const).map((side) => (
            <tr key={side}>
              <td>{side === "away" ? away : home}</td>
              {lines.map((line) => (
                <td key={line.number} className={line.number === activeInning ? "baseballActiveInning" : ""}>
                  {show(line[side])}
                </td>
              ))}
              <td className={side === "away" ? awayRunsClass : homeRunsClass}>{show(totals[side].runs)}</td>
              <td className="baseballHits">{show(totals[side].hits)}</td>
              <td className="baseballErrors">{show(totals[side].errors)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}

export function BaseballPitchingDecisions({
  decisions, finished,
}: { decisions: BaseballDecision[]; finished: boolean }) {
  if (!finished || decisions.length === 0) return null;
  return (
    <section className="baseballExtrasPanel">
      <span className="eyebrow">DECISIONES DE PITCHEO</span>
      <div className="baseballExtrasDecisions">
        {decisions.map(({ label, name }) => (
          <div key={label}><small>{label}</small><strong>{name}</strong></div>
        ))}
      </div>
    </section>
  );
}

function TeamStats({
  team, name,
}: { team: BaseballTeamStats; name: string }) {
  if (!team.batters.length && !team.pitchers.length) return null;
  const number = (v?: number) => typeof v === "number" ? v : "–";
  return (
    <div className="baseballExtrasTeam">
      <h3>{name}</h3>
      {team.batters.length > 0 && (
        <>
          <h4>BATEO</h4>
          <div className="baseballExtrasScroll" role="region" tabIndex={0} aria-label={`Bateo de ${name}`}>
            <table className="baseballExtrasStats">
              <thead><tr><th>JUGADOR</th><th>AB</th><th>H</th><th>R</th><th>RBI</th><th>HR</th></tr></thead>
              <tbody>{team.batters.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td><td>{number(p.atBats)}</td><td>{number(p.hits)}</td>
                  <td>{number(p.runs)}</td><td>{number(p.rbi)}</td><td>{number(p.homeRuns)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
      {team.pitchers.length > 0 && (
        <>
          <h4>PITCHEO</h4>
          <div className="baseballExtrasScroll" role="region" tabIndex={0} aria-label={`Pitcheo de ${name}`}>
            <table className="baseballExtrasStats">
              <thead><tr><th>JUGADOR</th><th>IP</th><th>ER</th><th>SO</th><th>BB</th><th>P</th></tr></thead>
              <tbody>{team.pitchers.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td><td>{p.inningsPitched ?? "–"}</td>
                  <td>{number(p.earnedRuns)}</td><td>{number(p.strikeOuts)}</td>
                  <td>{number(p.walks)}</td><td>{number(p.pitches)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export function BaseballPlayerStats({
  awayStats, homeStats, away, home,
}: {
  awayStats: BaseballTeamStats;
  homeStats: BaseballTeamStats;
  away: string; home: string;
}) {
  if (!awayStats.batters.length && !awayStats.pitchers.length &&
      !homeStats.batters.length && !homeStats.pitchers.length) return null;
  return (
    <section className="baseballExtrasPanel">
      <details className="baseballExtrasDetails">
        <summary>ESTADÍSTICAS DEL PARTIDO · BATEO Y PITCHEO</summary>
        <div className="baseballExtrasTeamGrid">
          <TeamStats team={awayStats} name={away} />
          <TeamStats team={homeStats} name={home} />
        </div>
      </details>
    </section>
  );
}
