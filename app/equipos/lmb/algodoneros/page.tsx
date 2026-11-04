
import type { Metadata } from "next";
import { getLmbStandings } from "@/lib/lmb";
import AlgodonerosLeaders from "@/components/AlgodonerosLeaders";
import { getTeamLogo, getTeamDisplayName } from "@/lib/teamLogos";
import {
  ALGODONEROS_OFFICIAL as club,
  ALGODONEROS_STORIES as stories,
  ALGODONEROS_VIDEOS as videos,
  ALGODONEROS_ROSTER as roster,
  ALGODONEROS_NORTH_2026 as fallbackNorth,
} from "@/lib/algodonerosProfile";

export const revalidate = 3600;
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

// Foto editorial opcional: se lee del metadato de la publicación oficial.
// Si LMB no lo ofrece, el diseño sigue funcionando sin inventar fotografías.
async function getFeaturePhoto(): Promise<string | null> {
  try {
    const response = await fetch(stories[0].url, {
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return null;
    const html = await response.text();
    const match = html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["']/i);
    if (!match?.[1]) return null;
    const raw = match[1].replace(/&amp;/g, "&");
    const url = new URL(raw, stories[0].url);
    if (url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

export default async function AlgodonerosProfile({searchParams}: PageProps) {
  const params = await searchParams;
  const rosterView = params?.vista === "plantilla";
  const [officialStandings, featurePhoto] = await Promise.all([
    getLmbStandings(),
    getFeaturePhoto(),
  ]);

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
          <a href="/equipos/lmb/algodoneros" className={!rosterView ? "is-active":""} aria-current={!rosterView ? "page":undefined}>Resumen</a>
          <a href="/equipos/lmb/algodoneros?vista=plantilla" className={rosterView ? "is-active":""} aria-current={rosterView ? "page":undefined}>Plantilla</a>
        </nav>

        {rosterView ? (
          <section className="clubRosterContent" aria-label="Plantilla de Algodoneros">
            <div className="clubSectionTitle">
              <div><span className="clubKicker">PLANTILLA · ARCHIVO 2026</span><h2>Jugadores de Algodoneros</h2></div>
              <a href={club.lmbRoster} target="_blank" rel="noopener noreferrer">Ver roster oficial ↗</a>
            </div>
            <p className="clubSmallNote">Nombres y dorsales tomados del roster publicado por LMB para 2026. No representa un listado de altas y bajas actualizado en tiempo real.</p>
            <div className="clubRosterGrid">
              {roster.map(group=>(
                <section className="clubRosterGroup" key={group.name}>
                  <h3>{group.name} <span>{group.players.length}</span></h3>
                  <div className="clubRosterPlayers">
                    {group.players.map(player=>(
                      <div className="clubRosterPlayer" key={group.name + player.number + player.name}>
                        <span className="clubJersey">{player.number}</span>
                        <span>{player.name}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
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
                {featurePhoto ? (
                  <img src={featurePhoto} className="clubFeatureImage" alt="Fotografía de la noticia destacada publicada por LMB" loading="lazy" />
                ) : (
                  <img src={logo} className="clubFeatureEmblem" alt="" width={220} height={220} />
                )}
                <div className="clubFeatureShade"/>
                <div className="clubFeatureContent">
                  <span className="clubKicker">NOTICIA DESTACADA · LMB 2026</span>
                  <h2>{stories[0].title}</h2>
                  <p>La postemporada de Algodoneros y sus momentos más importantes.</p>
                  <a href={stories[0].url} target="_blank" rel="noopener noreferrer">Leer nota oficial ↗</a>
                </div>
              </section>
              <section className="clubEditorialSection">
                <div className="clubSectionTitle">
                  <div><span className="clubKicker">ARCHIVO LMB · 2026</span><h2>Noticias relacionadas</h2></div>
                </div>
                <div className="clubNewsGrid">
                  {stories.slice(1,4).map(story=>(
                    <a className="clubNewsCard" href={story.url} target="_blank" rel="noopener noreferrer" key={story.url}>
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
                <div className="clubSideHeading"><h2>Titulares</h2><span>2026</span></div>
                <div className="clubHeadlines">
                  {stories.slice(2).map((story,i)=>(
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
