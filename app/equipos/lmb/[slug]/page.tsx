import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLmbStandings } from "@/lib/lmb";
import { getTeamLogo } from "@/lib/teamLogos";
import { getLmbClub, findLmbClubByName } from "@/lib/lmbClubs";
import { getLmbClubNews, getLmbClubRoster, getLmbClubOverview } from "@/lib/lmbClubContent";
import { getLmbClubMovements } from "@/lib/lmbMovements";
import LmbToMlbClubProfile from "@/components/LmbToMlbClubProfile";
import { lmbClubChampionships } from "@/lib/lmbClubHistory";
import LmbClubEditorialHistory from "@/components/LmbClubEditorialHistory";
import LmbRosterHeadshot from "@/components/LmbRosterHeadshot";

export const revalidate = 1800;
type PageProps = {
  params: Promise<{slug: string}>;
  searchParams?: Promise<{vista?: string}>;
};
const views = [
  {id:"resumen",label:"Resumen"},
  {id:"plantilla",label:"Plantilla"},
  {id:"movimientos",label:"Movimientos"},
  {id:"grandes-ligas",label:"Grandes Ligas"},
  {id:"historia",label:"Historia"},
] as const;
type View=typeof views[number]["id"];
const official=(slug:string)=>"https://lmb.com.mx/equipos/"+slug;
const formatDate=(d:string)=>new Intl.DateTimeFormat("es-MX",{
  day:"numeric",month:"long",year:"numeric",timeZone:"UTC"
}).format(new Date(d+"T12:00:00Z"));

export async function generateMetadata({params}:Pick<PageProps,"params">):Promise<Metadata>{
  const {slug}=await params;
  const club=getLmbClub(slug);
  return {
    title:club?club.name+" | Equipos LMB | Diamante MX":"Equipos LMB | Diamante MX",
    description:club?"Noticias, roster, movimientos, historial y vínculos con Grandes Ligas de "+club.name+".":"Clubes de Liga Mexicana de Beisbol",
  };
}
export default async function LmbClubProfile({params,searchParams}:PageProps){
  const [{slug},q]=await Promise.all([params,searchParams]);
  const club=getLmbClub(slug);
  if(!club)notFound();
  const view:View=views.some(v=>v.id===q?.vista)?(q?.vista as View):"resumen";
  const [overview,standings,news,roster,movements]=await Promise.all([
    getLmbClubOverview(club.slug),
    view==="resumen"?getLmbStandings():Promise.resolve([]),
    view==="resumen"?getLmbClubNews(club.slug):Promise.resolve(null),
    view==="plantilla"?getLmbClubRoster(club.slug):Promise.resolve(null),
    view==="movimientos"?getLmbClubMovements({
      profileUrl:official(club.slug),
      headingAliases:[club.bulletinHeading,club.bulletinHeading==="DOS LAREDOS"?"LAREDO":club.bulletinHeading],
      clubName:club.name,
      archive:[],
    }):Promise.resolve(null),
  ]);
  const logo=getTeamLogo("LMB",0,club.name);
  const home="/equipos/lmb/"+club.slug;
  const titleYears=lmbClubChampionships(club.slug);
  const teamRecord=standings.find(row=>findLmbClubByName(row.team)?.slug===club.slug);
  const topStory=news?.stories[0];
  return (
    <main className="clubProfile clubProfile--all">
      <header className="clubTopbar">
        <a className="clubBrand" href="/?league=lmb">
          <span className="clubDiamond" aria-hidden="true">◆</span>
          <strong>DIAMANTE <em>MX</em></strong>
        </a>
        <a className="clubBack" href="/?league=lmb">← Volver a LMB</a>
      </header>
      <div className="clubShell">
        <div className="clubHero clubDirectoryHero">
          <div className="clubHeroIdentity">
            <div className="clubHeroLogo">{logo?<img src={logo} alt="" width={108} height={108}/>:<span aria-hidden="true">⚾</span>}</div>
            <div className="clubHeroText">
              <span className="clubKicker">EQUIPOS · LIGA MEXICANA DE BEISBOL</span>
              <h1>{club.name}</h1>
              <p>Zona {club.region} · Temporada 2026 y archivo histórico</p>
            </div>
          </div>
          <div className="clubHeroMeta">
            <div><span>ESTADIO</span><strong>{overview.stadium??"Consultar ficha oficial"}</strong></div>
            <div><span>CAPACIDAD</span><strong>{overview.capacity?overview.capacity.toLocaleString("es-MX")+" espectadores":"No informada"}</strong></div>
            <div className="clubHeroLinks">
              <a href={official(club.slug)} target="_blank" rel="noopener noreferrer">Ficha LMB ↗</a>
              {overview.website&&<a href={overview.website} target="_blank" rel="noopener noreferrer">Sitio del club ↗</a>}
            </div>
          </div>
        </div>

        <nav className="clubProfileTabs" aria-label={"Secciones de "+club.name}>
          {views.map(tab=><a
            key={tab.id}
            href={tab.id==="resumen"?home:home+"?vista="+tab.id}
            className={view===tab.id?"is-active":""}
            aria-current={view===tab.id?"page":undefined}
          >{tab.label}</a>)}
        </nav>

        {view==="resumen"&&(
          <div className="clubContentGrid">
            <aside className="clubSideLeft">
              <section className="clubPanel clubCalendarPanel">
                <span className="clubKicker">TEMPORADA LMB</span>
                <h2>Calendario</h2>
                <div className="clubCalendarEmblem" aria-hidden="true">⚾</div>
                <p>Consulta las fechas de los próximos partidos directamente con LMB.</p>
                <a href={official(club.slug)} target="_blank" rel="noopener noreferrer">Ver calendario oficial ↗</a>
              </section>
              <section className="clubPanel clubRecordPanel">
                <span className="clubKicker">ÚLTIMA TABLA LMB DISPONIBLE</span>
                <h2>Balance del equipo</h2>
                <div className="clubRecordGrid">
                  <div><strong>{teamRecord?.wins??"—"}</strong><span>GANADOS</span></div>
                  <div><strong>{teamRecord?.losses??"—"}</strong><span>PERDIDOS</span></div>
                  <div><strong>{teamRecord?.pct??"—"}</strong><span>PCT</span></div>
                </div>
                <p>Datos de la tabla oficial disponible; no son un marcador en directo.</p>
              </section>
            </aside>
            <div className="clubMainColumn">
              {topStory?(
                <section className="clubFeature" aria-label={"Noticia de "+club.name}>
                  {topStory.imageUrl?<img src={topStory.imageUrl} className="clubFeatureImage" alt="" loading="lazy"/>:
                    <div className="clubDirectoryHeroBadge">{logo?<img src={logo} width={140} height={140} alt=""/>:"⚾"}</div>}
                  <div className="clubFeatureShade"/>
                  <div className="clubFeatureContent">
                    <span className="clubKicker">NOTICIA DESTACADA · FUENTE OFICIAL LMB</span>
                    <h2>{topStory.title}</h2>
                    <p>Selección de publicaciones oficiales del club. Se actualiza al consultar la página.</p>
                    <a href={topStory.url} target="_blank" rel="noopener noreferrer">Leer nota en LMB ↗</a>
                  </div>
                </section>
              ):(
                <section className="clubDirectoryNotice">
                  <span className="clubKicker">FUENTE DE NOTICIAS</span>
                  <h2>Publicaciones oficiales</h2>
                  <p>LMB no devolvió una selección verificable de noticias para este club. No mostramos artículos de otro equipo como respaldo.</p>
                  <a href={official(club.slug)} target="_blank" rel="noopener noreferrer">Consultar noticias en LMB ↗</a>
                </section>
              )}
              <section className="clubEditorialSection">
                <div className="clubSectionTitle">
                  <div>
                    <span className="clubKicker">{news?.sourceStatus==="connected"?"NOTICIAS · FUENTE LMB":"NOTICIAS · SIN CONEXIÓN"}</span>
                    <h2>Noticias relacionadas</h2>
                  </div>
                </div>
                <p className="clubSmallNote">La liga selecciona estas publicaciones. Consulta automática con caché aproximada de 30 minutos; no garantiza orden cronológico.</p>
                <div className="clubNewsGrid">
                  {(news?.stories??[]).slice(1,7).map(story=><a href={story.url} className="clubNewsCard" key={story.url} target="_blank" rel="noopener noreferrer">
                    {story.imageUrl&&<img src={story.imageUrl} className="clubNewsThumb" alt="" loading="lazy"/>}
                    <span>{story.label}</span><strong>{story.title}</strong><small>Leer en LMB ↗</small>
                  </a>)}
                </div>
              </section>
            </div>
            <aside className="clubSideRight">
              <section className="clubPanel">
                <span className="clubKicker">IDENTIDAD DEL CLUB</span>
                <h2>{club.name}</h2>
                <p>Zona {club.region}. Ficha enlazada a los recursos oficiales de la Liga Mexicana de Beisbol.</p>
                <a href={home+"?vista=historia"} className="clubDirectoryDetailLink">Explorar su historia ↗</a>
              </section>
              <section className="clubPanel">
                <span className="clubKicker">PALMARÉS LMB · HASTA 2026</span>
                <h2>{titleYears.years.length} {titleYears.years.length===1?"campeonato":"campeonatos"}</h2>
                <p>{titleYears.years.length?titleYears.years.join(" · "):"No registra una corona de liga en el historial consultado."}</p>
                <a href={home+"?vista=historia"} className="clubDirectoryDetailLink">Ver títulos documentados ↗</a>
              </section>
              <section className="clubPanel">
                <span className="clubKicker">SALÓN DE LA FAMA</span>
                <h2>Legado mexicano</h2>
                <p>Explora los inmortales reconocidos oficialmente. La asociación con este club se añadirá tras verificar trayectorias individuales.</p>
                <a href="/salon-de-la-fama" className="clubDirectoryDetailLink">Visitar Salón de la Fama ↗</a>
              </section>
            </aside>
          </div>
        )}

        {view==="plantilla"&&(
          <section className="clubRosterContent">
            <div className="clubSectionTitle">
              <div><span className="clubKicker">PLANTILLA · {roster?.sourceStatus==="connected"?"FUENTE OFICIAL LMB":"NO VERIFICADA"}</span><h2>Jugadores de {club.name}</h2></div>
              <a href={official(club.slug)+"/roster"} target="_blank" rel="noopener noreferrer">Ver roster oficial ↗</a>
            </div>
            <p className="clubSmallNote">{roster?.sourceStatus==="connected"?
              "Nombres, dorsales, posiciones y fotografías vinculadas a la plantilla publicada por LMB. Consulta automática con caché aproximada de 30 minutos.":
              "La fuente oficial no devolvió un roster válido. No se sustituyó por el de otro club ni por una lista inventada."}</p>
            {roster?.roster.length?(
              <div className="clubRosterGrid">
                {roster.roster.map(group=>(
                  <section className="clubRosterGroup" key={group.name}>
                    <h3>{group.name} <span>{group.players.length}</span></h3>
                    <div className="clubRosterPlayers">{group.players.map(player=>(
                      <div className="clubRosterPlayer" key={player.playerId}>
                        <LmbRosterHeadshot playerId={player.playerId} name={player.name}/>
                        <span className="clubRosterPlayerInfo"><strong>{player.name}</strong><small>#{player.number} · {group.name}</small></span>
                      </div>
                    ))}</div>
                  </section>
                ))}
              </div>
            ):<div className="clubDirectoryNotice"><p>Plantilla temporalmente no disponible; puedes consultarla en la página oficial.</p></div>}
          </section>
        )}

        {view==="movimientos"&&(
          <section className="clubMovementsContent">
            <div className="clubSectionTitle">
              <div><span className="clubKicker">MOVIMIENTOS · LMB</span><h2>Operaciones de {club.name}</h2></div>
              <a href={official(club.slug)} target="_blank" rel="noopener noreferrer">Ver equipo en LMB ↗</a>
            </div>
            <p className="clubSmallNote">
              {movements?.sourceStatus==="connected"?
                "Consultas automáticas de comunicados vinculados por LMB a este club, con caché de 30 minutos.":
                "La lista oficial no pudo verificarse recientemente. Consulta la fuente para confirmar movimientos."}
              {" "}Las altas de academia, bajas y cesiones de derechos no implican necesariamente cambios del roster activo.
            </p>
            {movements?.movements.length?(
              <div className="clubMovementsTimeline">
                {movements.movements.map((item,i)=>(
                  <article className="clubMovementItem" key={item.url+item.description+i}>
                    <div className="clubMovementDate"><span>{formatDate(item.date)}</span><span className="clubMovementType">{item.type}</span></div>
                    <div className="clubMovementBody">
                      {logo&&<img src={logo} alt="" width={53} height={53}/>}
                      <div><h3>{item.title}</h3><p>{item.description}</p>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">Consultar comunicado LMB ↗</a></div>
                    </div>
                  </article>
                ))}
              </div>
            ):<div className="clubDirectoryNotice"><h3>No hay movimientos verificados en esta consulta</h3>
              <p>Esto no significa que no hayan existido operaciones. El historial publicado por LMB puede ser parcial.</p>
              <a href="https://lmb.com.mx/movimientos" target="_blank" rel="noopener noreferrer">Ver movimientos LMB ↗</a></div>}
            <p className="clubSmallNote">Los boletines se actualizan al visitar la sección; no son alertas instantáneas ni un historial exhaustivo.</p>
          </section>
        )}

        {view==="grandes-ligas"&&(
          <LmbToMlbClubProfile club={club} logo={logo}/>
        )}

        {view==="historia"&&(
          <LmbClubEditorialHistory club={club} overview={overview} logo={logo}/>
        )}
      </div>
    </main>
  );
}
