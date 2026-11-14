import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStandings } from "@/lib/mlb";
import { getTeamLogo } from "@/lib/teamLogos";
import { getMlbClub, mlbOfficialTeamUrl } from "@/lib/mlbClubDirectory";
import {
  getMlbClubOverview, getMlbClubRoster, getMlbClubTransactions, getMlbClubNextGame,
} from "@/lib/mlbClubContent";
import MlbClubEditorialHistory from "@/components/MlbClubEditorialHistory";
import MlbRosterHeadshot from "@/components/MlbRosterHeadshot";
import LmbClubTabs, { type LmbClubView } from "@/components/LmbClubTabs";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";

export const revalidate = 1800;
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ vista?: string }>;
};
const views: LmbClubView[] = ["resumen", "plantilla", "movimientos", "grandes-ligas", "historia"];
const dateLabel = (value: string) => new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Mexico_City", day: "numeric", month: "long", year: "numeric",
}).format(new Date(value));
const gameDateLabel = (value: string) => new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Mexico_City",
  weekday: "long", day: "numeric", month: "long",
  hour: "numeric", minute: "2-digit",
}).format(new Date(value));

export async function generateMetadata({ params }: Pick<PageProps, "params">): Promise<Metadata> {
  const { id } = await params;
  const club = getMlbClub(Number(id));
  return {
    title: club ? club.name + " | Equipos MLB | Diamante MX" : "Equipos MLB | Diamante MX",
    description: club
      ? "Noticias oficiales, plantilla, movimientos, historia y estadísticas de " + club.name + "."
      : "Clubes de Major League Baseball",
  };
}

export default async function MlbClubProfile({ params, searchParams }: PageProps) {
  const [{ id }, q] = await Promise.all([params, searchParams]);
  const club = getMlbClub(Number(id));
  if (!club || String(club.id) !== id) notFound();
  const view: LmbClubView = views.includes(q?.vista as LmbClubView)
    ? (q?.vista as LmbClubView) : "resumen";
  const [overview, standings, roster, transactions, nextGame] = await Promise.all([
    getMlbClubOverview(club),
    view === "resumen" || view === "grandes-ligas" ? getStandings() : Promise.resolve([]),
    view === "plantilla" ? getMlbClubRoster(club) : Promise.resolve(null),
    view === "movimientos" ? getMlbClubTransactions(club) : Promise.resolve(null),
    view === "resumen" ? getMlbClubNextGame(club) : Promise.resolve(null),
  ]);
  const logo = getTeamLogo("MLB", club.id, club.name);
  const home = "/equipos/mlb/" + club.id;
  const official = mlbOfficialTeamUrl(club);
  const record = standings.find(s => s.teamId === club.id);
  const divisionTeams = standings.filter(s => s.division === record?.division)
    .sort((a, b) => Number.parseFloat(b.pct) - Number.parseFloat(a.pct));
  const opponent = nextGame
    ? nextGame.awayId === club.id ? nextGame.home : nextGame.away
    : null;

  return <main className="clubProfile clubProfile--all">
    <header className="clubTopbar">
      <a className="clubBrand" href="/?league=mlb">
        <span className="clubDiamond" aria-hidden="true">◆</span>
        <strong>DIAMANTE <em>MX</em></strong>
      </a>
      <a className="clubBack" href="/?league=mlb">← Volver a MLB</a>
    </header>
    <div className="clubShell">
      <div className="clubHero clubDirectoryHero">
        <div className="clubHeroIdentity">
          <div className="clubHeroLogo">
            {logo ? <img src={logo} alt="" width={108} height={108}/>
              : <span aria-hidden="true">⚾</span>}
          </div>
          <div className="clubHeroText">
            <span className="clubKicker">EQUIPOS · MAJOR LEAGUE BASEBALL</span>
            <h1>{club.name}</h1>
            <p>{overview.division} · Temporada {new Date().getUTCFullYear()} y archivo histórico</p>
          </div>
        </div>
        <div className="clubHeroMeta">
          <div><span>ESTADIO</span><strong>{overview.stadium ?? "Por verificar"}</strong></div>
          <div><span>CAPACIDAD</span><strong>Por verificar</strong></div>
          <div className="clubHeroLinks">
            <a href={official} target="_blank" rel="noopener noreferrer">Ficha MLB ↗</a>
            <a href={official + "/tickets"} target="_blank" rel="noopener noreferrer">Boletos ↗</a>
            <a href={official + "/roster"} target="_blank" rel="noopener noreferrer">Roster oficial ↗</a>
          </div>
        </div>
      </div>

      <LmbClubTabs home={home} clubName={club.name} currentView={view}/>

      {view === "resumen" && <div className="clubContentGrid">
        <aside className="clubSideLeft">
          <section className="clubPanel clubCalendarPanel">
            <span className="clubKicker">{COPY.summary.calendarKicker("MLB")}</span>
            <h2>{COPY.summary.calendarTitle}</h2>
            <div className="clubCalendarEmblem" aria-hidden="true">⚾</div>
            {nextGame ? <>
              <strong>{club.name} vs. {opponent}</strong>
              <p>{gameDateLabel(nextGame.date)}</p>
              <a href={"/game/mlb/" + nextGame.id}>Ver próximo encuentro ↗</a>
            </> : <>
              <strong>Próxima fecha por confirmar</strong>
              <p>No mostramos un encuentro hasta contar con un calendario oficial verificable.</p>
              <a href={official + "/schedule"} target="_blank" rel="noopener noreferrer">
                Consultar programación MLB ↗</a>
            </>}
          </section>
          <section className="clubPanel clubRecordPanel">
            <span className="clubKicker">ÚLTIMA TABLA MLB DISPONIBLE</span>
            <h2>{COPY.summary.recordTitle}</h2>
            <div className="clubRecordGrid">
              <div><strong>{record?.wins ?? "—"}</strong><span>GANADOS</span></div>
              <div><strong>{record?.losses ?? "—"}</strong><span>PERDIDOS</span></div>
              <div><strong>{record?.pct ?? "—"}</strong><span>PCT</span></div>
            </div>
            <p>Datos de temporada regular publicados por MLB; no son un marcador en vivo.</p>
          </section>
        </aside>
        <div className="clubMainColumn">
          <section className="clubDirectoryNotice" aria-label={"Noticias de " + club.name}>
            <span className="clubKicker">FUENTE DE NOTICIAS · MLB</span>
            <h2>Publicaciones oficiales</h2>
            <p>Consulta la actualidad de {club.name} en su portal oficial.
              Todavía no hay artículos individuales verificados para mostrar dentro de Diamante MX.</p>
            <a href={official + "/news"} target="_blank" rel="noopener noreferrer">
              Noticias del equipo en MLB ↗</a>
          </section>
          <section className="clubEditorialSection">
            <div className="clubSectionTitle">
              <div><span className="clubKicker">NOTICIAS · FUENTE MLB</span>
                <h2>{COPY.summary.newsTitle}</h2></div>
            </div>
            <p className="clubSmallNote">No sustituimos las noticias de este club por las de otro equipo.
              La conexión de titulares individuales está pendiente de verificación.</p>
            <div className="clubNewsGrid"/>
          </section>
          <section className="clubEditorialSection" aria-label={"Videos relacionados con " + club.name}>
            <div className="clubSectionTitle">
              <div><span className="clubKicker">{COPY.summary.videosKicker("MLB")}</span>
                <h2>{COPY.summary.videosTitle}</h2></div>
              <a href={official + "/video"} target="_blank" rel="noopener noreferrer">
                Ver catálogo MLB ↗</a>
            </div>
            <div className="clubDirectoryNotice">
              <p>Los videos oficiales de {club.name} se consultan en MLB.
                No insertamos transmisiones o clips sin un enlace verificable.</p>
            </div>
          </section>
        </div>
        <aside className="clubSideRight">
          <section className="clubPanel">
            <div className="clubSideHeading"><h2>{COPY.summary.headlineTitle}</h2>
              <span>MLB</span></div>
            <p className="clubSmallNote">Titulares individuales pendientes de conexión con la fuente oficial.</p>
            <a href={official + "/news"} target="_blank" rel="noopener noreferrer">
              Ver noticias MLB ↗</a>
          </section>
          <section className="clubPanel" id="tabla-de-posiciones">
            <div className="clubSideHeading"><h2>Posiciones</h2><span>{record?.division ?? "MLB"}</span></div>
            <p className="clubSmallNote">Última tabla de temporada regular disponible en MLB.</p>
            {divisionTeams.length ? <div className="clubStandingsScroll">
              <table className="clubStandingsTable">
                <thead><tr><th>Equipo</th><th>G</th><th>P</th><th>PCT</th></tr></thead>
                <tbody>{divisionTeams.map(team => <tr key={team.teamId}
                  className={team.teamId === club.id ? "clubCurrentTeam" : ""}>
                  <td>{getTeamLogo("MLB", team.teamId, team.team) &&
                    <img src={getTeamLogo("MLB", team.teamId, team.team)!} alt="" width={25} height={25}/>}
                    <span>{team.team}</span></td>
                  <td>{team.wins}</td><td>{team.losses}</td><td>{team.pct}</td>
                </tr>)}</tbody>
              </table>
            </div> : <p className="clubSmallNote">La fuente oficial no devolvió una tabla verificable.</p>}
            <a className="clubStandingsLink" href="/?league=mlb#posiciones">Ver tabla completa ↗</a>
          </section>
          <section className="clubPanel">
            <div className="clubSideHeading"><h2>Legado del club</h2><span>MLB</span></div>
            <p className="clubSmallNote">Consulta el historial de la franquicia, sus figuras documentadas
              y el archivo de sus logros deportivos.</p>
            <a href={home + "?vista=historia"} className="clubDirectoryDetailLink">
              Historia y palmarés ↗</a>
            <a href="https://baseballhall.org/hall-of-famers" target="_blank"
              rel="noopener noreferrer" className="clubDirectoryDetailLink" style={{ display: "block" }}>
              Salón de la Fama ↗</a>
          </section>
        </aside>
      </div>}

      {view === "plantilla" && <section className="clubRosterContent">
        <div className="clubSectionTitle">
          <div><span className="clubKicker">PLANTILLA · {roster?.sourceStatus === "connected"
            ? "FUENTE OFICIAL MLB" : "NO VERIFICADA"}</span>
            <h2>{COPY.roster.title(club.name)}</h2></div>
          <a href={official + "/roster"} target="_blank" rel="noopener noreferrer">
            {COPY.roster.sourceLabel}</a>
        </div>
        <p className="clubSmallNote">{roster?.sourceStatus === "connected"
          ? "Lista de 40 jugadores, posiciones y dorsales según la respuesta oficial de MLB. Las plantillas cambian durante la temporada y pueden estar sujetas a ajustes."
          : "MLB no devolvió un roster válido en esta consulta; no añadimos jugadores inventados."}</p>
        {roster?.groups.length ? <div className="clubRosterGrid">
          {roster.groups.map(group => <section className="clubRosterGroup" key={group.name}>
            <h3>{group.name} <span>{group.players.length}</span></h3>
            <div className="clubRosterPlayers">{group.players.map(player =>
              <div className="clubRosterPlayer" key={player.id}>
                <MlbRosterHeadshot playerId={player.id} name={player.name}/>
                <span className="clubRosterPlayerInfo"><strong>{player.name}</strong>
                  <small>#{player.number} · {player.position}</small></span>
              </div>)}</div>
          </section>)}
        </div> : <div className="clubDirectoryNotice">
          <p>Plantilla temporalmente no disponible. Consulta la página oficial del club.</p>
        </div>}
      </section>}

      {view === "movimientos" && <section className="clubMovementsContent">
        <div className="clubSectionTitle">
          <div><span className="clubKicker">{COPY.movements.kicker("MLB")}</span>
            <h2>{COPY.movements.title(club.name)}</h2></div>
          <a href={official + "/roster/transactions"} target="_blank" rel="noopener noreferrer">
            Consultar movimientos MLB ↗</a>
        </div>
        <p className="clubSmallNote">{transactions?.sourceStatus === "connected"
          ? "Movimientos oficiales MLB de los últimos 90 días. Se muestran las descripciones que provee la fuente; pueden estar en inglés."
          : "El historial oficial no estuvo disponible en esta consulta."}
          {" "}{COPY.movements.note}</p>
        {transactions?.items.length ? <div className="clubMovementsTimeline">
          {transactions.items.map(item => <article className="clubMovementItem" key={item.key}>
            <div className="clubMovementDate">
              <span>{dateLabel(item.date + "T12:00:00Z")}</span>
              <span className="clubMovementType">{item.label}</span>
            </div>
            <div className="clubMovementBody">
              {logo && <img src={logo} alt="" width={53} height={53}/>}
              <div><h3>{item.player ?? "Transacción registrada por MLB"}</h3>
                <p>{item.description || item.label}</p>
                <a href={official + "/roster/transactions"} target="_blank"
                  rel="noopener noreferrer">Consultar fuente oficial MLB ↗</a>
              </div>
            </div>
          </article>)}
        </div> : <div className="clubDirectoryNotice">
          <h3>{COPY.movements.noneTitle}</h3>
          <p>Una consulta vacía no demuestra que no hayan existido movimientos.</p>
          <a href={official + "/roster/transactions"} target="_blank" rel="noopener noreferrer">
            Ver historial oficial MLB ↗</a>
        </div>}
      </section>}

      {view === "grandes-ligas" && <section className="clubBigLeagues clubDirectoryMlb"
        aria-labelledby="mlbTeamBigLeaguesTitle">
        <header className="clubBigLeaguesHeader">
          <div><span className="clubKicker">EL CLUB EN EL MÁXIMO NIVEL · MLB</span>
            <h2 id="mlbTeamBigLeaguesTitle">{club.name} en Grandes Ligas</h2>
            <p>{club.name} es una franquicia de Major League Baseball. Esta sección reúne
              los datos de participación de la organización; no presentamos fichajes como
              debuts ni confundimos su historia con la de clubes mexicanos.</p></div>
          <div className="clubBigLeaguesHeaderMark" aria-hidden="true">
            {logo && <img className="clubToMlbHeroLogo" src={logo} alt="" width={65} height={65}/>}
            <strong>·</strong><span>MLB</span>
          </div>
        </header>
        <div className="clubBigLeaguesSummary">
          <div><strong>{record?.wins ?? "—"}</strong><span>Victorias · última temporada disponible</span></div>
          <div><strong>{record?.losses ?? "—"}</strong><span>Derrotas · última temporada disponible</span></div>
          <div><strong>{record?.pct ?? "—"}</strong><span>Porcentaje de victorias</span></div>
        </div>
        <div className="clubBigLeaguesSectionHead">
          <span className="clubKicker">FUENTES OFICIALES</span>
          <h3>Trayectoria y estadísticas MLB</h3>
        </div>
        <div className="clubDirectoryNotice">
          <p>{overview.division} · {overview.league}.
            La composición histórica del equipo y sus títulos se documentan en Historia.</p>
          <a href={official + "/stats"} target="_blank" rel="noopener noreferrer">
            Estadísticas oficiales MLB ↗</a>
          <a href={official + "/roster"} target="_blank" rel="noopener noreferrer">
            Plantilla de Grandes Ligas ↗</a>
        </div>
        <div className="clubBigLeaguesFooter">
          <strong>Identidad deportiva: {club.name} · MLB</strong>
          <p>Esta sección usa datos del mismo equipo, su división y sus resultados.
            No se mezclan registros de filiales, LMB ni LMP.</p>
        </div>
      </section>}

      {view === "historia" && <MlbClubEditorialHistory
        club={club} overview={overview} logo={logo}/>}
    </div>
  </main>;
}
