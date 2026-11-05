
import type { Metadata } from "next";
import { getLmbStandings } from "@/lib/lmb";
import LmbRosterHeadshot from "@/components/LmbRosterHeadshot";
import { getAlgodonerosMovements } from "@/lib/lmbMovements";
import { getAlgodonerosNews, getAlgodonerosRoster } from "@/lib/lmbClubContent";
import AlgodonerosLeaders from "@/components/AlgodonerosLeaders";
import AlgodonerosHistory from "@/components/AlgodonerosHistory";
import AlgodonerosGrandesLigas from "@/components/AlgodonerosGrandesLigas";
import { getTeamLogo, getTeamDisplayName } from "@/lib/teamLogos";
import {
  ALGODONEROS_OFFICIAL as club,
  ALGODONEROS_STORIES as stories,
  ALGODONEROS_VIDEOS as videos,
  ALGODONEROS_ROSTER as roster,
  ALGODONEROS_NORTH_2026 as fallbackNorth,
  ALGODONEROS_MOVEMENTS as movements,
} from "@/lib/algodonerosProfile";

export const revalidate = 1800;
export const metadata: Metadata = {
  title: "Algodoneros del Unión Laguna | Equipos LMB | Diamante MX",
  description: "Perfil de Algodoneros, noticias destacadas, videos oficiales, roster y posiciones LMB 2026.",
};
type PageProps = { searchParams?: Promise<{ vista?: string }> };

function normalize(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function isAlgodoneros(name: string) {
  const n = normalize(name);
  return n.includes("algodoneros") && n.includes("laguna");
}
function formatPct(value: string) { return value.startsWith(".") ? value : "." + value; }

const PLAYER_LOGO = "/logos/lmb/algodoneros-union-laguna.png";

export default async function AlgodonerosProfile({searchParams}: PageProps) {
  const params = await searchParams;
  const rosterView = params?.vista === "plantilla";
  const movementsView = params?.vista === "movimientos";
  const historyView = params?.vista === "historia";
  const grandesLigasView = params?.vista === "grandes-ligas";
  const [officialStandings, newsResult, rosterResult, movementResult] = await Promise.all([
    getLmbStandings(),
    !rosterView && !movementsView && !historyView && !grandesLigasView ? getAlgodonerosNews() : Promise.resolve(null),
    rosterView ? getAlgodonerosRoster() : Promise.resolve(null),
    movementsView ? getAlgodonerosMovements() : Promise.resolve(null),
  ]);
  const displayedStories = newsResult?.stories ?? stories.map(story => ({
    ...story, imageUrl: null as string | null,
  }));
  const displayedRoster = rosterResult?.roster ?? roster;
  const newsConnected = newsResult?.sourceStatus === "connected";
  const rosterConnected = rosterResult?.sourceStatus === "connected";
  const featuredStory = displayedStories[0];

  // Tabla real: solo si incluye al club; si falla, conservar el corte oficial 2026.
  const officialNorth = officialStandings.filter(s => normalize(s.division).includes("norte"));
  const liveDataPresent = officialNorth.length > 0 && officialNorth.some(s => isAlgodoneros(s.team));
  const north = liveDataPresent
    ? officialNorth.map(s => ({
        team: getTeamDisplayName("LMB", s.team),
        wins: s.wins,
        losses: s.losses,
        pct: String(s.pct),
        gamesBack: String(s.gamesBack),
      })).sort((a,b)=>b.wins-a.wins)
    : [...fallbackNorth];
  const record = north.find(s => isAlgodoneros(s.team));
  const seasonLabel = "Temporada regular 2026";
  const logo = getTeamLogo("LMB",0,"Algodoneros de Unión Laguna") ?? PLAYER_LOGO;

  return (
    <main className="clubProfile">
      <header className="clubTopbar">
        <a className="clubBrand" href="/?league=lmb">
          <span className="clubDiamond" aria-hidden="true">◆</span>
          <strong>DIAMANTE <em>MX</em></strong>
        </a>
        <a className="clubBack" href="/?league=lmb">← Volver a LMB</a>
      </header>
      <div className="clubShell">
        <div className="clubHero">
          <div className="clubHeroIdentity">
            <div className="clubHeroLogo"><img src={logo} alt="" width={108} height={108}/></div>
            <div className="clubHeroText">
              <span className="clubKicker">EQUIPOS · LIGA MEXICANA DE BEISBOL</span>
              <h1>{club.name}</h1>
              <p>{club.nickname} <span aria-hidden="true">·</span> {club.zone}</p>
            </div>
          </div>
          <div className="clubHeroMeta">
            <div><span>ESTADIO</span><strong>{club.stadium}</strong></div>
            <div><span>CAPACIDAD</span><strong>{club.capacity.toLocaleString("es-MX")} espectadores</strong></div>
            <div className="clubHeroLinks">
              <a href={club.website} target="_blank" rel="noopener noreferrer">Sitio oficial ↗</a>
              <a href={club.tickets} target="_blank" rel="noopener noreferrer">Boletos ↗</a>
            </div>
          </div>
        </div>

        <nav className="clubProfileTabs" aria-label="Secciones del equipo">
          <a href="/equipos/lmb/algodoneros" className={!rosterView && !movementsView && !historyView && !grandesLigasView ? "is-active":""} aria-current={!rosterView && !movementsView && !historyView && !grandesLigasView ? "page":undefined}>Resumen</a>
          <a href="/equipos/lmb/algodoneros?vista=plantilla" className={rosterView ? "is-active":""} aria-current={rosterView ? "page":undefined}>Plantilla</a>
          <a href="/equipos/lmb/algodoneros?vista=movimientos" className={movementsView ? "is-active":""} aria-current={movementsView ? "page":undefined}>Movimientos</a>
          <a href="/equipos/lmb/algodoneros?vista=grandes-ligas" className={grandesLigasView ? "is-active":""} aria-current={grandesLigasView ? "page":undefined}>Grandes Ligas</a>
          <a href="/equipos/lmb/algodoneros?vista=historia" className={historyView ? "is-active":""} aria-current={historyView ? "page":undefined}>Historia</a>
        </nav>

        {rosterView ? (
          <section className="clubRosterContent" aria-label="Plantilla de Algodoneros">
            <div className="clubSectionTitle">
              <div>
                <span className="clubKicker">{rosterConnected ? "PLANTILLA · FUENTE OFICIAL LMB" : "PLANTILLA · ARCHIVO 2026"}</span>
                <h2>Jugadores de Algodoneros</h2>
              </div>
              <a href={club.lmbRoster} target="_blank" rel="noopener noreferrer">Ver roster oficial ↗</a>
            </div>
            <p className="clubSmallNote">
              {rosterConnected
                ? "Roster obtenido de LMB. Se consulta automáticamente al visitar la página, con caché aproximada de 30 minutos. Los cambios aparecen cuando la liga actualiza su lista."
                : "Archivo de respaldo 2026. La fuente oficial no pudo verificarse o no devolvió un roster válido; este listado no debe interpretarse como plantilla actual."}
            </p>
            <div className="clubRosterGrid">
              {displayedRoster.map(group=>(
                <section className="clubRosterGroup" key={group.name}>
                  <h3>{group.name} <span>{group.players.length}</span></h3>
                  <div className="clubRosterPlayers">
                    {group.players.map(player=>(
                      <div className="clubRosterPlayer" key={group.name + player.number + player.name}>
                        <LmbRosterHeadshot playerId={player.playerId} name={player.name} />
                        <span className="clubRosterPlayerInfo">
                          <strong>{player.name}</strong>
                          <small>#{player.number} · {group.name}</small>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        ) : movementsView ? (
          <section className="clubMovementsContent" aria-label="Movimientos de Algodoneros">
            <div className="clubSectionTitle">
              <div>
                <span className="clubKicker">MOVIMIENTOS · LMB 2026</span>
                <h2>Últimas operaciones oficiales</h2>
              </div>
              <a href="https://lmb.com.mx/equipos/algodoneros" target="_blank" rel="noopener noreferrer">
                Ver equipo en LMB ↗
              </a>
            </div>
            <p className="clubSmallNote">
              Operaciones oficiales de Unión Laguna. Las altas de academia y las cesiones
              de derechos no implican necesariamente movimientos del roster activo.
              {movementResult?.sourceStatus === "connected"
                ? " Fuente LMB conectada · consulta automática con caché de 30 minutos."
                : " Archivo de respaldo: no se pudo verificar la fuente oficial recientemente."}
            </p>
            <div className="clubMovementsTimeline">
              {(movementResult?.movements ?? movements).map((event, index) => (
                <article className="clubMovementItem" key={event.url + event.title + index}>
                  <div className="clubMovementDate">
                    <span>{new Intl.DateTimeFormat("es-MX", {
                      day: "numeric", month: "long", year: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(event.date + "T12:00:00Z"))}</span>
                    <span className="clubMovementType">{event.type}</span>
                  </div>
                  <div className="clubMovementBody">
                    <img src={logo} alt="" width={53} height={53} />
                    <div>
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      {"direction" in event && "otherClub" in event && event.direction && event.otherClub && (
                        <div className="clubMovementDirection">
                          <span>{event.direction === "out" ? "DERECHOS CEDIDOS A" : "DERECHOS RECIBIDOS DE"}</span>
                          <strong>{event.otherClub}</strong>
                        </div>
                      )}
                      <a href={event.url} target="_blank" rel="noopener noreferrer">
                        Consultar comunicado de LMB ↗
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="clubSmallNote">
              Se combinan los movimientos archivados con publicaciones recientes de LMB,
              sin duplicar los comunicados. Esta página verifica nuevas publicaciones al
              recibir visitas, aproximadamente cada 30 minutos; no son alertas instantáneas.
              Los registros anteriores no garantizan el estado actual del roster.
            </p>
          </section>
        ) : grandesLigasView ? (
          <AlgodonerosGrandesLigas />
        ) : historyView ? (
          <AlgodonerosHistory logo={logo} />
        ) : (
          <div className="clubContentGrid">
            <aside className="clubSideLeft">
              <section className="clubPanel clubCalendarPanel">
                <span className="clubKicker">CALENDARIO</span>
                <h2>Próximos juegos</h2>
                <div className="clubCalendarEmblem" aria-hidden="true">⚾</div>
                <strong>Temporada 2026 finalizada</strong>
                <p>El próximo encuentro de Algodoneros todavía no está confirmado.</p>
                <a href={club.lmbPage} target="_blank" rel="noopener noreferrer">Consultar calendario oficial ↗</a>
              </section>
              <section className="clubPanel clubRecordPanel">
                <span className="clubKicker">{seasonLabel}</span>
                <h2>Balance del equipo</h2>
                <div className="clubRecordGrid">
                  <div><strong>{record?.wins ?? "—"}</strong><span>GANADOS</span></div>
                  <div><strong>{record?.losses ?? "—"}</strong><span>PERDIDOS</span></div>
                  <div><strong>{record?.pct ?? "—"}</strong><span>PCT</span></div>
                </div>
              </section>
            </aside>

            <div className="clubMainColumn">
              <section className="clubFeature" aria-label="Noticia destacada">
                {featuredStory.imageUrl ? (
                  <img src={featuredStory.imageUrl} className="clubFeatureImage" alt={"Imagen de " + featuredStory.title} loading="lazy" />
                ) : (
                  <img src={logo} className="clubFeatureEmblem" alt="" width={220} height={220} />
                )}
                <div className="clubFeatureShade"/>
                <div className="clubFeatureContent">
                  <span className="clubKicker">{newsConnected ? "NOTICIA DESTACADA · FUENTE LMB" : "NOTICIA DESTACADA · ARCHIVO 2026"}</span>
                  <h2>{featuredStory.title}</h2>
                  <p>{newsConnected
                    ? "Selección publicada en el sitio oficial de LMB. Se consulta periódicamente."
                    : "Selección del archivo histórico de LMB mientras se recupera la fuente."}</p>
                  <a href={featuredStory.url} target="_blank" rel="noopener noreferrer">Leer nota oficial ↗</a>
                </div>
              </section>
              <section className="clubEditorialSection">
                <div className="clubSectionTitle">
                  <div><span className="clubKicker">{newsConnected ? "NOTICIAS · FUENTE LMB" : "ARCHIVO LMB · 2026"}</span><h2>Noticias relacionadas</h2></div>
                </div>
                <p className="clubSmallNote">{newsConnected
                  ? "Publicaciones seleccionadas por la LMB. Actualización automática al abrir la página, con caché de aproximadamente 30 minutos."
                  : "Archivo histórico 2026: no se pudo verificar la fuente oficial recientemente."}</p>
                <div className="clubNewsGrid">
                  {displayedStories.slice(1,4).map(story=>(
                    <a className="clubNewsCard" href={story.url} target="_blank" rel="noopener noreferrer" key={story.url}>
                      {story.imageUrl && <img className="clubNewsThumb" src={story.imageUrl} alt="" loading="lazy" />}
                      <span>{story.label}</span><strong>{story.title}</strong><small>Leer en LMB ↗</small>
                    </a>
                  ))}
                </div>
              </section>
              <section className="clubEditorialSection">
                <div className="clubSectionTitle">
                  <div><span className="clubKicker">MOMENTOS DEL JUEGO</span><h2>Videos destacados</h2></div>
                  <a href="https://lmb.com.mx/videos" target="_blank" rel="noopener noreferrer">Ver más en LMB ↗</a>
                </div>
                <div className="clubVideoGrid">
                  {videos.map((video,i)=>(
                    <a className="clubVideoCard" href={video.url} target="_blank" rel="noopener noreferrer" key={video.url}>
                      <div className="clubVideoPoster"><img src={logo} alt="" width={70} height={70}/><span aria-hidden="true">▶</span><small>CLIP {i+1}</small></div>
                      <strong>{video.title}</strong>
                    </a>
                  ))}
                </div>
                <p className="clubSmallNote">Los clips abren sus páginas oficiales de LMB; la disponibilidad del reproductor depende del proveedor.</p>
              </section>
            </div>

            <aside className="clubSideRight">
              <section className="clubPanel">
                <div className="clubSideHeading"><h2>Titulares</h2><span>{newsConnected ? "LMB" : "2026"}</span></div>
                <div className="clubHeadlines">
                  {displayedStories.slice(2,9).map((story,i)=>(
                    <a href={story.url} target="_blank" rel="noopener noreferrer" key={story.url}>
                      <span className="clubHeadlineIndex">{String(i+1).padStart(2,"0")}</span>
                      <strong>{story.title}</strong>
                    </a>
                  ))}
                </div>
              </section>
              <section className="clubPanel" id="tabla-de-posiciones">
                <div className="clubSideHeading"><h2>Posiciones</h2><span>NORTE</span></div>
                <p className="clubSmallNote">{seasonLabel}{liveDataPresent ? " · fuente API LMB" : " · corte oficial LMB"}</p>
                <div className="clubStandingsScroll">
                  <table className="clubStandingsTable">
                    <thead><tr><th>Equipo</th><th>G</th><th>P</th><th>PCT</th></tr></thead>
                    <tbody>
                      {north.map(s=>(
                        <tr key={s.team} className={isAlgodoneros(s.team) ? "clubCurrentTeam":""}>
                          <td>
                            {getTeamLogo("LMB",0,s.team) && <img src={getTeamLogo("LMB",0,s.team) ?? PLAYER_LOGO} alt="" width={25} height={25}/>}
                            <span>{s.team}</span>
                          </td>
                          <td>{s.wins}</td><td>{s.losses}</td><td>{formatPct(s.pct)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <a className="clubStandingsLink" href="/?league=lmb#posiciones">Ver tabla completa ↗</a>
              </section>
              <AlgodonerosLeaders />
            </aside>
          </div>
        )}
        <footer className="clubFooter">
          <span>DIAMANTE MX · Perfil editorial independiente</span>
          <a href={club.lmbPage} target="_blank" rel="noopener noreferrer">Datos y publicaciones: Liga Mexicana de Beisbol ↗</a>
        </footer>
      </div>
    </main>
  );
}
