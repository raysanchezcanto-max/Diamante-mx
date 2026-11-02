import type {
  BaseballDecision, BaseballLineScore, BaseballTeamStats,
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

type StatKind = "batting" | "pitching";

function TeamStatsTable({
  team, name, kind,
}: {
  team: BaseballTeamStats;
  name: string;
  kind: StatKind;
}) {
  const players = kind === "batting" ? team.batters : team.pitchers;
  if (players.length === 0) {
    return <div className="baseballExtrasTeam baseballExtrasTeamEmpty" />;
  }
  const number = (value?: number) => typeof value === "number" ? value : "–";
  return (
    <div className="baseballExtrasTeam">
      <h3>{name}</h3>
      <div
        className="baseballExtrasScroll"
        role="region"
        tabIndex={0}
        aria-label={`${kind === "batting" ? "Bateo" : "Pitcheo"} de ${name}`}
      >
        <table className="baseballExtrasStats">
          <thead>
            {kind === "batting" ? (
              <tr><th>JUGADOR</th><th>AB</th><th>H</th><th>R</th><th>RBI</th><th>HR</th></tr>
            ) : (
              <tr><th>JUGADOR</th><th>IP</th><th>ER</th><th>SO</th><th>BB</th><th>P</th></tr>
            )}
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td>{player.name}</td>
                {kind === "batting" ? (
                  <>
                    <td>{number(player.atBats)}</td>
                    <td>{number(player.hits)}</td>
                    <td>{number(player.runs)}</td>
                    <td>{number(player.rbi)}</td>
                    <td>{number(player.homeRuns)}</td>
                  </>
                ) : (
                  <>
                    <td>{player.inningsPitched ?? "–"}</td>
                    <td>{number(player.earnedRuns)}</td>
                    <td>{number(player.strikeOuts)}</td>
                    <td>{number(player.walks)}</td>
                    <td>{number(player.pitches)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BaseballPlayerStats({
  awayStats, homeStats, away, home,
}: {
  awayStats: BaseballTeamStats;
  homeStats: BaseballTeamStats;
  away: string;
  home: string;
}) {
  const sections: { kind: StatKind; title: string; available: boolean }[] = [
    {
      kind: "batting",
      title: "BATEO",
      available: awayStats.batters.length > 0 || homeStats.batters.length > 0,
    },
    {
      kind: "pitching",
      title: "PITCHEO",
      available: awayStats.pitchers.length > 0 || homeStats.pitchers.length > 0,
    },
  ];
  if (!sections.some((section) => section.available)) return null;

  return (
    <section className="baseballExtrasPanel">
      <details className="baseballExtrasDetails">
        <summary>ESTADÍSTICAS DEL PARTIDO · BATEO Y PITCHEO</summary>
        {sections.filter((section) => section.available).map((section) => (
          <div className="baseballExtrasStatSection" key={section.kind}>
            <h4>{section.title}</h4>
            <div className="baseballExtrasTeamGrid">
              <TeamStatsTable team={awayStats} name={away} kind={section.kind} />
              <TeamStatsTable team={homeStats} name={home} kind={section.kind} />
            </div>
          </div>
        ))}
      </details>
    </section>
  );
}
