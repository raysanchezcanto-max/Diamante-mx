import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStandings } from "@/lib/mlb";
import { getTeamLogo } from "@/lib/teamLogos";
import { getMlbClub, mlbOfficialTeamUrl } from "@/lib/mlbClubDirectory";
import {
  getMlbClubOverview, getMlbClubRoster, getMlbClubTransactions, getMlbClubNextGame,
  getMlbClubNews,
} from "@/lib/mlbClubContent";
import MlbClubEditorialHistory from "@/components/MlbClubEditorialHistory";
import { mlbEditorialHistory } from "@/lib/mlbHistoryEditorial";
import MlbRosterHeadshot from "@/components/MlbRosterHeadshot";
import MlbMexicanConnections from "@/components/MlbMexicanConnections";
import ClubStatisticsProfile from "@/components/ClubStatisticsProfile";
import { getClubSeasonStandings, getLatestClubSeasonStatistics, mexicoSeasonYear } from "@/lib/clubStatistics";
import LmbClubTabs, { type LmbClubView } from "@/components/LmbClubTabs";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";

export const revalidate = 1800;
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ vista?: string }>;
};
const views: LmbClubView[] = ["resumen", "estadisticas", "plantilla", "movimientos", "grandes-ligas", "historia"];
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
      : "Clubes de Grandes Ligas",
  };
}

export default async function MlbClubProfile({ params, searchParams }: PageProps) {
  const [{ id }, q] = await Promise.all([params, searchParams]);
  const club = getMlbClub(Number(id));
  if (!club || String(club.id) !== id) notFound();
  const view: LmbClubView = views.includes(q?.vista as LmbClubView)
    ? (q?.vista as LmbClubView) : "resumen";
  const [overview, summaryStandings, roster, transactions, nextGame, statistics, news] = await Promise.all([
    getMlbClubOverview(club),
    view === "resumen" ? getStandings() : Promise.resolve([]),
    view === "plantilla" ? getMlbClubRoster(club) : Promise.resolve(null),
    view === "movimientos" ? getMlbClubTransactions(club) : Promise.resolve(null),
    view === "resumen" ? getMlbClubNextGame(club) : Promise.resolve(null),
    view === "estadisticas" ? getLatestClubSeasonStatistics("MLB", club.id, mexicoSeasonYear()) : Promise.resolve(null),
    view === "resumen" ? getMlbClubNews(club) : Promise.resolve(null),
  ]);
  const standings = view === "estadisticas"
    ? await getClubSeasonStandings("MLB", statistics?.season ?? mexicoSeasonYear())
    : summaryStandings;
  const logo = getTeamLogo("MLB", club.id, club.name);
  const home = "/equipos/mlb/" + club.id;
  const official = mlbOfficialTeamUrl(club);
  const record = standings.find(s => s.teamId === club.id);
  const editorial = mlbEditorialHistory(club.id);
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
            <span className="clubKicker">EQUIPOS · GRANDES LIGAS</span>
            <h1>{club.name}</h1>
            <p>{overview.division} · Temporada {new Date().getUTCFullYear()} y archivo histórico</p>
          </div>
        </div>
        <div className="clubHeroMeta">
          <div><span>ESTADIO</span><strong>{overview.stadium ?? "Por verificar"}</strong></div>
          <div><span>{overview.capacity ? "CAPACIDAD" : "LIGA"}</span>
            <strong>{overview.capacity
              ? new Intl.NumberFormat("es-MX").format(overview.capacity) + " espectadores"
              : overview.league}</strong></div>
          <div className="clubHeroLinks">
            <a href={official} target="_blank" rel="noopener noreferrer">Ficha MLB ↗</a>
            <a href={official + "/tickets"} target="_blank" rel="noopener noreferrer">Boletos ↗</a>
            <a href={official + "/roster"} target="_blank" rel="noopener noreferrer">Plantilla oficial ↗</a>
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
          {editorial ? <article className="clubFeature" aria-label={"Reportaje verificado de " + club.name}>
            {logo && <img className="clubFeatureEmblem" src={logo} alt=""/>}
            <div className="clubFeatureShade" aria-hidden="true"/>
            <div className="clubFeatureContent">
              <span className="clubKicker">{editorial.featuredStory.kicker}</span>
              <h2>{editorial.featuredStory.title}</h2>
              <p>{editorial.featuredStory.excerpt}</p>
              <a href={editorial.featuredStory.url} target="_blank" rel="noopener noreferrer">
                Leer nota oficial ↗</a>
            </div>
          </article> : news?.items.length ? <article className="clubFeature"
            aria-label={"Noticia oficial de " + club.name}>
            {logo && <img className="clubFeatureEmblem" src={logo} alt=""/>}
            <div className="clubFeatureShade" aria-hidden="true"/>
            <div className="clubFeatureContent">
              <span className="clubKicker">ACTUALIDAD · FUENTE MLB</span>
              <h2>{news.items[0].title}</h2>
              <p>Una publicación reciente del canal oficial de noticias de {club.name}.</p>
              <a href={news.items[0].url} target="_blank" rel="noopener noreferrer">
                Leer noticia en MLB ↗</a>
            </div>
          </article> : <section className="clubDirectoryNotice" aria-label={"Noticias de " + club.name}>
            <span className="clubKicker">FUENTE DE NOTICIAS · MLB</span>
            <h2>Publicaciones oficiales</h2>
            <p>Consulta la actualidad de {club.name} en su portal oficial.
              Todavía no hay artículos individuales verificados para mostrar dentro de Diamante MX.</p>
            <a href={official + "/news"} target="_blank" rel="noopener noreferrer">
              Noticias del equipo en MLB ↗</a>
          </section>}
          <section className="clubEditorialSection">
            <div className="clubSectionTitle">
              <div><span className="clubKicker">NOTICIAS · FUENTE MLB</span>
                <h2>{COPY.summary.newsTitle}</h2></div>
            </div>
            <p className="clubSmallNote">{news?.items.length
              ? "Titulares del canal oficial de " + club.name + " en MLB. Se actualizan aproximadamente cada 30 minutos."
              : "No se recibieron artículos verificables del canal oficial en esta consulta."}</p>
            {news?.items.length ? <div className="clubNewsGrid">
              {news.items.slice(0, 3).map(story => <a href={story.url}
                className="clubNewsCard" key={story.url} target="_blank" rel="noopener noreferrer">
                <span>NOTICIA · MLB</span><strong>{story.title}</strong>
                <small>Leer publicación oficial ↗</small>
              </a>)}
            </div> : <div className="clubDirectoryNotice">
              <p>Consulta todas las publicaciones recientes en el portal del club.</p>
              <a href={official + "/news"} target="_blank" rel="noopener noreferrer">
                Noticias oficiales MLB ↗</a>
            </div>}
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
            {news?.items.length ? <div className="clubMlbHeadlines">
              {news.items.slice(0, 3).map(story =>
                <a key={story.url} href={story.url} target="_blank" rel="noopener noreferrer">
                  {story.title}<span> ↗</span>
                </a>)}
            </div> : <p className="clubSmallNote">Consulta la actualidad en la fuente oficial del club.</p>}
            <a href={official + "/news"} target="_blank" rel="noopener noreferrer">
              Todas las noticias MLB ↗</a>
          </section>
          <section className="clubPanel">
            <div className="clubSideHeading"><h2>Legado del club</h2><span>MLB</span></div>
            <p className="clubSmallNote">{editorial
              ? editorial.pennants.length + " banderines de liga y " +
                editorial.divisionTitles.length + " títulos divisionales hasta " +
                editorial.titlesVerifiedThrough + "."
              : "Consulta el historial de la franquicia, sus figuras documentadas y el archivo de sus logros deportivos."}</p>
            <a href={home + "?vista=historia"} className="clubDirectoryDetailLink">
              Historia y palmarés ↗</a>
            <a href="https://baseballhall.org/hall-of-famers" target="_blank"
              rel="noopener noreferrer" className="clubDirectoryDetailLink" style={{ display: "block" }}>
              Salón de la Fama ↗</a>
          </section>
        </aside>
      </div>}

      {view === "estadisticas" && <ClubStatisticsProfile league="MLB" clubName={club.name}
        teamId={club.id} season={statistics?.season ?? mexicoSeasonYear()}
        standings={divisionTeams} statistics={statistics} standingsUrl="/?league=mlb#posiciones"
        officialStatsUrl={`https://www.mlb.com/es/${club.webSlug}/stats`}/>}

      {view === "plantilla" && <section className="clubRosterContent">
        <div className="clubSectionTitle">
          <div><span className="clubKicker">PLANTILLA · {roster?.sourceStatus === "connected"
            ? "FUENTE OFICIAL MLB" : "NO VERIFICADA"}</span>
            <h2>{COPY.roster.title(club.name)}</h2></div>
          <a href={official + "/roster"} target="_blank" rel="noopener noreferrer">
            {COPY.roster.sourceLabel}</a>
        </div>
        <p className="clubSmallNote">{roster?.sourceStatus === "connected"
          ? "Plantilla de hasta 40 jugadores, posiciones y dorsales según la respuesta oficial de MLB. Las plantillas cambian durante la temporada y pueden estar sujetas a ajustes."
          : "MLB no devolvió una plantilla válida en esta consulta; no añadimos jugadores inventados."}</p>
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

      {view === "movimientos" && <section className="clubMovementsContent clubMovementsContent--mlb">
        <div className="clubSectionTitle">
          <div><span className="clubKicker">{COPY.movements.kicker("MLB")}</span>
            <h2>{COPY.movements.title(club.name)}</h2></div>
          <a href={official + "/roster/transactions"} target="_blank" rel="noopener noreferrer">
            Consultar movimientos MLB ↗</a>
        </div>
        <p className="clubSmallNote">{transactions?.sourceStatus === "connected"
          ? "Movimientos oficiales MLB de los últimos 90 días, presentados en español. Cuando la fuente no permite identificar un detalle con seguridad, se muestra una descripción general."
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

      {view === "grandes-ligas" && <MlbMexicanConnections club={club} logo={logo}/>}

      {view === "historia" && <MlbClubEditorialHistory
        club={club} overview={overview} logo={logo}/>}
    </div>
  </main>;
}
