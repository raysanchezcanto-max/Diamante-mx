import { getTeamDisplayName, getTeamLogo } from "@/lib/teamLogos";
import { clubSeasonLabel, type ClubSeasonStatistics, type ClubStanding, type ClubStatsLeague } from "@/lib/clubStatistics";
import ClubStatisticsLeaders from "./ClubStatisticsLeaders";

type Props = {
  league: ClubStatsLeague;
  clubName: string;
  teamId: number;
  season: number;
  standings: ClubStanding[];
  statistics: ClubSeasonStatistics | null;
  standingsUrl: string;
};

function metric(value: string | undefined, label: string) {
  return <div key={label}><strong>{value ?? "—"}</strong><span>{label}</span></div>;
}

export default function ClubStatisticsProfile({ league, clubName, teamId, season,
  standings, statistics, standingsUrl }: Props) {
  const period = clubSeasonLabel(league, statistics?.season ?? season);
  const sorted = [...standings].sort((a, b) =>
    (a.rank ?? Infinity) - (b.rank ?? Infinity) || Number(b.pct) - Number(a.pct) ||
    b.wins - a.wins || a.team.localeCompare(b.team, "es"));
  const position = sorted.findIndex(row => row.teamId === teamId);
  const current = position >= 0 ? sorted[position] : null;

  return <section className="clubStatsView" aria-label={`Estadísticas del equipo ${clubName}`}>
    <header className="clubStatsHero">
      <div>
        <span className="clubKicker">ESTADÍSTICAS OFICIALES · {league} · TEMPORADA {period}</span>
        <h2>Estadísticas de {clubName}</h2>
        <p>Clasificación de temporada regular, números colectivos y líderes individuales
          documentados. Cada liga conserva su propia temporada y sus registros.</p>
      </div>
      <span className="clubStatsSeasonBadge">{period}</span>
    </header>

    <div className="clubStatsOverview" aria-label="Rendimiento en la clasificación">
      <div><span>POSICIÓN EN {league === "LMP" ? "LA LIGA" : "SU DIVISIÓN O ZONA"}</span>
        <strong>{position >= 0 ? `${current?.rank ?? position + 1} de ${sorted.length}` : "—"}</strong>
        <small>{current?.division ?? "Clasificación por verificar"}</small></div>
      <div><span>JUEGOS GANADOS / PERDIDOS</span>
        <strong>{current ? `${current.wins} / ${current.losses}` : "—"}</strong>
        <small>Temporada regular</small></div>
      <div><span>PORCENTAJE DE VICTORIAS</span>
        <strong>{current?.pct ?? "—"}</strong>
        <small>Fuente oficial {league}</small></div>
    </div>

    <div className="clubStatsStandings">
      <div className="clubBigLeaguesSectionHead">
        <span className="clubKicker">CLASIFICACIÓN · {league}</span>
        <h3>{league === "LMP" ? "Tabla general de posiciones" : "El equipo frente a sus rivales"}</h3>
      </div>
      {sorted.length ? <div className="clubStandingsScroll">
        <table className="clubStandingsTable clubStatsTable">
          <thead><tr><th>Pos.</th><th>Equipo</th><th>G</th><th>P</th><th>PCT</th></tr></thead>
          <tbody>{sorted.map((team, i) => <tr key={`${team.teamId}-${team.team}`}
            className={team.teamId === teamId ? "clubCurrentTeam" : ""}>
            <td>{team.rank ?? i + 1}</td>
            <td>{getTeamLogo(league, team.teamId, team.team) &&
              <img src={getTeamLogo(league, team.teamId, team.team)!} alt="" width={25} height={25}/>}
              <span>{getTeamDisplayName(league, team.team)}</span></td>
            <td>{team.wins}</td><td>{team.losses}</td><td>{team.pct}</td>
          </tr>)}</tbody>
        </table>
      </div> : <div className="clubDirectoryNotice"><p>La liga no devolvió una clasificación verificable
        para este equipo en esta consulta.</p></div>}
      <a className="clubStandingsLink" href={standingsUrl}>Ver tabla completa ↗</a>
    </div>

    <div className="clubStatsCollective">
      <div className="clubBigLeaguesSectionHead">
        <span className="clubKicker">NÚMEROS DEL EQUIPO · TEMPORADA {period}</span>
        <h3>Rendimiento de temporada regular</h3>
      </div>
      {statistics?.batting || statistics?.pitching ? <>
        <h4>Bateo colectivo</h4>
        <div className="clubBigLeaguesSummary">
          {metric(statistics?.batting?.runs, "Carreras anotadas")}
          {metric(statistics?.batting?.homeRuns, "Cuadrangulares")}
          {metric(statistics?.batting?.avg, "Promedio de bateo")}
        </div>
        <h4>Pitcheo colectivo</h4>
        <div className="clubBigLeaguesSummary">
          {metric(statistics?.pitching?.era, "Efectividad")}
          {metric(statistics?.pitching?.strikeOuts, "Ponches recetados")}
          {metric(statistics?.pitching?.whip, "Corredores permitidos por entrada")}
        </div>
        <a className="clubDirectorySource" href={statistics.source} target="_blank"
          rel="noopener noreferrer">Consultar estadísticas oficiales ↗</a>
      </> : <div className="clubDirectoryNotice"><p>No hay estadísticas colectivas
        verificables para esta temporada en la fuente consultada. No se muestran cifras
        de otro club ni se sustituyen por otra categoría.</p></div>}
    </div>

    <ClubStatisticsLeaders clubName={clubName}
      batting={statistics?.leaders.batting ?? []} pitching={statistics?.leaders.pitching ?? []}/>
    <p className="clubStatsFootnote">Las estadísticas son de temporada regular y pueden actualizarse
      cuando la liga publique nuevos resultados. La temporada indicada corresponde a los datos
      recuperados, no necesariamente al año calendario actual.</p>
  </section>;
}
