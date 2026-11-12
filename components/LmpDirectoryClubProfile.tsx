import { getLmpStadiumYear } from "@/lib/lmpStadiumFacts";
import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import type {LmpClubDefinition} from "@/lib/lmpClubDirectory";
import type {LmpClubPlayer,LmpClubNews,LmpClubRecord,AlgodonerosFixture} from "@/lib/lmpAlgodonerosContent";
import type {LmpMlbAlumnus,LmpDirectoryMovement} from "@/lib/lmpClubDirectoryData";
import {CLUB_PROFILE_COPY as COPY} from "@/lib/clubProfileCopy";
import {getTeamLogo} from "@/lib/teamLogos";
import LmbClubTabs, {type LmbClubView} from "./LmbClubTabs";
import LmpNaranjerosEditorialHistory from "./LmpNaranjerosEditorialHistory";
import LmpAguilasEditorialHistory from "./LmpAguilasEditorialHistory";

type Props={club:LmpClubDefinition;view:LmbClubView;roster:LmpClubPlayer[];news:LmpClubNews[];record:LmpClubRecord|null;fixtures:AlgodonerosFixture[];mlbAlumni:LmpMlbAlumnus[];movements:LmpDirectoryMovement[]};
const groups=["Lanzadores","Receptores","Jugadores del cuadro","Jardineros"];
const dateTime=(iso:string)=>new Intl.DateTimeFormat("es-MX",{timeZone:"America/Mexico_City",month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:true}).format(new Date(iso));
const year=(season:string)=>season.slice(0,4);
const titleYear=(season:string)=>season.replace("–","-");
const initial=(name:string)=>name.split(/\s+/).slice(0,2).map(s=>s[0]??"").join("").toLocaleUpperCase("es");
const source="https://www.baseball-reference.com/bullpen/LMP";

export default function LmpDirectoryClubProfile({club,view,roster,news,record,fixtures,mlbAlumni,movements}:Props){
 const logo=getTeamLogo("LMP",club.id,club.name);
 const home="/equipos/lmp/"+club.slug;
 const first=club.championships[0],last=club.championships[club.championships.length-1];
 const titleCount=club.championships.length;
 const highlights=[first,last].filter((s,i,a):s is string=>Boolean(s)&&a.indexOf(s)===i);
 return <main className="clubProfile clubProfile--all">
  <header className="clubTopbar">
   <a className="clubBrand" href="/?league=lmp"><span className="clubDiamond" aria-hidden="true">◆</span><strong>DIAMANTE <em>MX</em></strong></a>
   <a className="clubBack" href="/?league=lmp">← Volver a LMP</a>
  </header>
  <div className="clubShell">
   <div className="clubHero clubDirectoryHero">
    <div className="clubHeroIdentity"><div className="clubHeroLogo">{logo?<img src={logo} width={108} height={108} alt=""/>:<span aria-hidden="true">⚾</span>}</div>
     <div className="clubHeroText"><span className="clubKicker">EQUIPOS · LIGA MEXICANA DEL PACÍFICO</span><h1>{club.name}</h1><p>{club.city} · Temporada 2026–27 y archivo histórico</p></div>
    </div>
    <div className="clubHeroMeta">
     <div><span>ESTADIO</span><strong>{club.stadium}</strong></div>
     <div><span>TÍTULOS LMP</span><strong>{String(titleCount).padStart(2,"0")}</strong></div>
     <div className="clubHeroLinks"><a href="https://www.lmp.mx/" target="_blank" rel="noopener noreferrer">Ficha LMP ↗</a>{club.website&&<a href={club.website} target="_blank" rel="noopener noreferrer">Sitio del club ↗</a>}</div>
    </div>
   </div>
   <LmbClubTabs home={home} clubName={club.name} currentView={view}/>

   {view==="resumen"&&<div className="clubContentGrid">
    <aside className="clubSideLeft">
     <section className="clubPanel clubRecordPanel">
      <span className="clubKicker">TEMPORADA REGULAR 2026–27 · LMP</span><h2>{COPY.summary.recordTitle}</h2>
      <div className="clubRecordGrid"><div><strong>{record?.wins??"—"}</strong><span>GANADOS</span></div><div><strong>{record?.losses??"—"}</strong><span>PERDIDOS</span></div><div><strong>{record?.pct??"—"}</strong><span>PCT</span></div></div>
      <p>Registro oficial de temporada, sujeto a actualización. No corresponde al marcador en vivo.</p>
     </section>
     <section className="clubPanel clubCalendarPanel">
      <span className="clubKicker">{COPY.summary.calendarKicker("LMP")}</span><h2>{COPY.summary.calendarTitle}</h2>
      <div className="lmpClubCalendarDesktop">
       <div className="lmpClubUpcomingList">{fixtures.map(g=><a key={g.id} className="lmpClubUpcomingGame" href={"/game/lmp/"+g.id}><span>{dateTime(g.startTime)}</span><strong>{g.home?"vs. ":"@ "}{g.opponent}</strong><small>{g.home?"LOCAL":"VISITANTE"} · {g.venue}</small></a>)}</div>
       {!fixtures.length&&<p>Sin juegos futuros confirmados por la fuente en esta consulta.</p>}
       <a href="/?league=lmp#juegos">Calendario completo LMP ↗</a>
      </div>
      <details className="lmpClubCalendarMobile"><summary className="lmpClubCalendarToggle"><span>{fixtures.length?"Ver próximos "+fixtures.length+" juegos":"Consultar calendario"}</span><span className="lmpClubCalendarChevron" aria-hidden="true">⌄</span></summary>
       <div className="lmpClubCalendarExpanded"><div className="lmpClubUpcomingList">{fixtures.map(g=><a key={g.id} className="lmpClubUpcomingGame" href={"/game/lmp/"+g.id}><span>{dateTime(g.startTime)}</span><strong>{g.home?"vs. ":"@ "}{g.opponent}</strong><small>{g.home?"LOCAL":"VISITANTE"} · {g.venue}</small></a>)}</div>
        {!fixtures.length&&<p>Sin juegos futuros confirmados por la fuente en esta consulta.</p>}
        <a href="/?league=lmp#juegos">Calendario completo LMP ↗</a>
       </div>
      </details>
     </section>
    </aside>
    <div className="clubMainColumn">
     {news[0]?<section className="clubFeature">
       {news[0].image?<img src={news[0].image} className="clubFeatureImage" alt="" loading="lazy"/>:<div className="clubDirectoryHeroBadge">{logo&&<img src={logo} width={140} height={140} alt=""/>}</div>}
       <div className="clubFeatureShade"/><div className="clubFeatureContent"><span className="clubKicker">NOTICIA DESTACADA · FUENTE OFICIAL LMP</span>
        <h2>{news[0].title}</h2><p>{news[0].excerpt}</p><a href={news[0].url} target="_blank" rel="noopener noreferrer">Leer nota oficial ↗</a></div>
      </section>:<section className="clubDirectoryNotice"><h2>Noticias oficiales</h2><p>La fuente oficial no devolvió noticias encabezadas por este equipo en las publicaciones más recientes. No mostramos las de otros clubes como propias.</p><a href="https://www.lmp.mx/" target="_blank" rel="noopener noreferrer">Consultar LMP ↗</a></section>}
     <section className="clubEditorialSection"><div className="clubSectionTitle"><div><span className="clubKicker">NOTICIAS · {club.name.toLocaleUpperCase("es")}</span><h2>{COPY.summary.newsTitle}</h2></div></div>
      <p className="clubSmallNote">Noticias de LMP cuyo titular identifica al equipo como protagonista. La selección no incluye todas las menciones al club.</p>
      <div className="clubNewsGrid">{news.slice(1,6).map(story=><a className="clubNewsCard" key={story.url} href={story.url} target="_blank" rel="noopener noreferrer">
       {story.image&&<img className="clubNewsThumb" src={story.image} alt="" loading="lazy"/>}
       <span>{story.published.slice(0,10)}</span><strong>{story.title}</strong><small>Leer noticia ↗</small></a>)}</div>
     </section>
     <section className="clubEditorialSection">
      <div className="clubSectionTitle"><div><span className="clubKicker">{COPY.summary.videosKicker("LMP")}</span><h2>{COPY.summary.videosTitle}</h2></div></div>
      <p className="clubSmallNote">Archivo audiovisual del canal oficial de la Liga Mexicana del Pacífico. Los clips individuales solo aparecerán aquí cuando el rival, partido y fecha estén comprobados.</p>
      <a className="clubDirectorySource" href="https://www.youtube.com/channel/UCdW_4rN3OarOoawQ4Er-ZXw/videos" target="_blank" rel="noopener noreferrer">Explorar canal oficial LMP ↗</a>
     </section>
    </div>
    <aside className="clubSideRight">
     <section className="clubPanel"><div className="clubSideHeading"><h2>{COPY.summary.headlineTitle}</h2><span>LMP</span></div>
      <div className="clubHeadlines">{news.slice(6,8).map((story,i)=><a key={story.url} href={story.url} target="_blank" rel="noopener noreferrer"><span className="clubHeadlineIndex">{String(i+1).padStart(2,"0")}</span><strong>{story.title}</strong></a>)}</div>
      {!news.length&&<p className="clubSmallNote">Sin publicaciones individuales verificadas en esta consulta.</p>}
     </section>
     <section className="clubPanel"><div className="clubSideHeading"><h2>Historia</h2><span>LMP</span></div><p>Palmarés histórico de {club.name}, títulos y sede actual.</p><a className="clubDirectoryDetailLink" href={home+"?vista=historia"}>Historia del equipo ↗</a></section>
    </aside>
   </div>}

   {view==="plantilla"&&<section className="clubRosterContent">
     <div className="clubSectionTitle"><div><span className="clubKicker">PLANTILLA · FUENTE OFICIAL LMP · TEMPORADA 2026–27</span><h2>{COPY.roster.title(club.name)}</h2></div><a href="https://www.lmp.mx/rosters" target="_blank" rel="noopener noreferrer">Rosters oficiales ↗</a></div>
     <p className="clubSmallNote">Fotografías oficiales, nombres, dorsales y posiciones de jugadores activos según el servicio de LMP. Cuerpo técnico excluido. Datos sujetos a cambios durante la temporada.</p>
     {roster.length?<div className="clubRosterGrid">
      {groups.map(group=>{const players=roster.filter(p=>p.group===group);return players.length?<section className="clubRosterGroup" key={group}><h3>{group} <span>{players.length}</span></h3>
       <div className="clubRosterPlayers">{players.map(p=><div className="clubRosterPlayer" key={p.id}><span className="clubRosterAvatar lmpClubPlayerAvatar">
        {p.photo?<img src={p.photo} alt={"Retrato de "+p.name} width={52} height={52} loading="lazy"/>:<span aria-hidden="true">{initial(p.name)}</span>}
       </span><span className="clubRosterPlayerInfo"><strong>{p.name}</strong><small>#{p.number} · {p.position}</small><small>{[p.throws&&"Lanza: "+p.throws,p.bats&&"Batea: "+p.bats,p.birthDate&&"Nac.: "+p.birthDate].filter(Boolean).join(" · ")}</small></span></div>)}</div>
      </section>:null})}
     </div>:<div className="clubDirectoryNotice"><p>La fuente oficial no devolvió jugadores activos en esta consulta. No se muestran nombres de otras temporadas como actuales.</p><a href="https://www.lmp.mx/rosters" target="_blank" rel="noopener noreferrer">Consultar rosters LMP ↗</a></div>}
   </section>}

   {view==="movimientos"&&<section className="clubMovementsContent">
    <div className="clubSectionTitle"><div><span className="clubKicker">{COPY.movements.kicker("LMP")}</span><h2>{COPY.movements.title(club.name)}</h2></div></div>
    <p className="clubSmallNote">{COPY.movements.note} Estas publicaciones han sido filtradas a partir de las noticias oficiales del club, no de un registro formal de transacciones.</p>
    {movements.length?<div className="clubMovementsTimeline">{movements.map(item=><article className="clubMovementItem" key={item.url}>
      <div className="clubMovementDate"><span>{item.published.slice(0,10)}</span><span className="clubMovementType">Noticia oficial LMP</span></div>
      <div className="clubMovementBody">{logo&&<img src={logo} alt="" width={53} height={53}/>}<div><h3>{item.title}</h3><p>{item.excerpt}</p><a href={item.url} target="_blank" rel="noopener noreferrer">Consultar nota oficial ↗</a></div></div>
    </article>)}</div>:<div className="clubDirectoryNotice"><h3>{COPY.movements.noneTitle}</h3><p>La lista oficial de movimientos requiere una fuente de transacciones específica. No presentaremos anuncios antiguos o rumores como altas y bajas actuales.</p><a href={club.website??"https://www.lmp.mx/"} target="_blank" rel="noopener noreferrer">Consultar fuente oficial ↗</a></div>}
   </section>}

   {view==="grandes-ligas"&&<section className="clubBigLeagues clubDirectoryMlb">
    <header className="clubBigLeaguesHeader"><div><span className="clubKicker">{COPY.mlb.kicker}</span><h2>{COPY.mlb.title(club.name)}</h2><p>{COPY.mlb.intro}</p></div>
     <div className="clubBigLeaguesHeaderMark" aria-hidden="true">{logo?<img className="clubToMlbHeroLogo" src={logo} alt="" width={65} height={65}/>:<span>LMP</span>}<strong>→</strong><span>MLB</span></div>
    </header>
    <div className="clubBigLeaguesSummary"><div><strong>{String(mlbAlumni.length).padStart(2,"0")}</strong><span>Integrantes actuales con debut MLB confirmado</span></div>
     <div><strong>—</strong><span>Debuts posteriores al paso por el club aún no documentados</span></div>
     <div><strong>—</strong><span>Firmas de prospectos por verificar</span></div></div>
    <div className="clubBigLeaguesSectionHead"><span className="clubKicker">EXPERIENCIA EN GRANDES LIGAS</span><h3>Peloteros del roster con debut MLB confirmado</h3></div>
    <p className="clubBigLeaguesNote">La coincidencia entre el roster oficial de LMP y la ficha de MLB confirma que estas personas jugaron en ambas competiciones. No acredita cuándo ingresaron a cada equipo ni que el club los exportara a Grandes Ligas.</p>
    {mlbAlumni.length?<div className="clubBigLeaguesProspects clubToMlbProspectGrid">{mlbAlumni.map(p=><article className="clubBigLeaguesProspect" key={p.id}>
     <div className="clubBigLeaguesProspectHeader"><span className="clubBigLeaguesInitials" aria-hidden="true">{initial(p.name)}</span><span className="clubBigLeaguesYear">{p.debut.slice(0,4)}</span></div>
     <span className="clubBigLeaguesStatus">DEBUT MLB CONFIRMADO</span><h4>{p.name}</h4><span className="clubBigLeaguesProspectOrganization">{p.role} · Debut {p.debut}</span>
     <p>Integrante de la plantilla de {club.name} según LMP y con fecha de debut en la base oficial MLB. El orden cronológico entre ambas etapas requiere documentación adicional.</p>
     <a href={"https://www.mlb.com/player/"+p.id} target="_blank" rel="noopener noreferrer">Ver ficha oficial MLB ↗</a>
    </article>)}</div>:<div className="clubDirectoryNotice"><h3>Trayectorias en proceso de documentación</h3><p>No se recuperaron debuts confirmados entre los jugadores activos de esta consulta. No significa que el equipo carezca de exjugadores de MLB en su historia.</p></div>}
    <div className="clubBigLeaguesFooter"><strong>Una trayectoria de ida no es lo mismo que una de regreso</strong><p>Antes de marcar a alguien como prospecto firmado desde LMP o debut posterior a su paso por el club, contrastaremos las fechas y los anuncios de ambas organizaciones.</p></div>
   </section>}

   {view==="historia" && club.slug==="naranjeros" && <LmpNaranjerosEditorialHistory club={club}/>}
   {view==="historia" && club.slug==="aguilas" && <LmpAguilasEditorialHistory club={club}/>}
   {view==="historia" && club.slug!=="naranjeros" && club.slug!=="aguilas" && <section className="clubHistory clubDirectoryHistory">
    <header className="clubHistoryHeading"><div><span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span><h2>{COPY.history.title(club.name)}</h2>
     <p>El palmarés de {club.name}, sus primeras etapas documentadas y los campeonatos que forman parte de su trayectoria en el béisbol invernal mexicano.</p>
    </div>{logo&&<img src={logo} alt={"Escudo de "+club.name} width={98} height={98}/>}</header>
    <ClubHistoryMetrics league="LMP" debutYear={club.debut} championships={titleCount} seasonLabel="2025–26" stadiumName={club.stadium} stadiumOpened={getLmpStadiumYear(club.slug)}/>
    <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.recordKicker}</span><h3>{titleCount?COPY.history.recordTitle("Liga Mexicana del Pacífico"):"La búsqueda de la primera estrella"}</h3></div><span className="clubHistoryNote">Títulos LMP hasta 2025–26</span></div>
    {highlights.length?<div className="clubHistoryChampions">{highlights.map((season,i)=><article className="clubHistoryChampionCard" key={season}>
     <span className="clubHistoryStar" aria-hidden="true">★</span><span className="clubHistoryChampLabel">{i===0?COPY.history.firstCrown:COPY.history.recentCrown} · LMP</span>
     <strong>{titleYear(season)}</strong><h4>{i===0?COPY.history.firstGlory:COPY.history.mostRecentGlory}</h4>
     <p>{club.name} forma parte del historial de campeones de la liga en la temporada {season}.</p>
     <a href={club.historicalSource} target="_blank" rel="noopener noreferrer">Consultar palmarés ↗</a>
    </article>)}</div>:<div className="clubDirectoryNotice"><p>El historial consultado no registra todavía un título LMP de esta franquicia. La participación en el circuito y su desarrollo deportivo forman parte de su historia.</p></div>}
    {titleCount>0&&<p className="clubSmallNote">Historial de campeonatos LMP: {club.championships.join(" · ")}. {club.slug==="venados"?"No se suman aquí las coronas anteriores de la Liga de la Costa del Pacífico.":""}</p>}
    <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.timelineKicker}</span><h3>{COPY.history.timelineTitle}</h3></div></div>
    <ol className="clubHistoryTimeline">
     <li><span className="clubHistoryYear">{club.debut}</span><div className="clubHistoryTimelineBody"><h4>Primeras temporadas de {club.name}</h4><p>El origen histórico de la franquicia precede a sus logros más recientes en el circuito del Pacífico.</p><a href={club.historicalSource} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a></div></li>
     {highlights.map((season,i)=><li key={season}><span className="clubHistoryYear">{season}</span><div className="clubHistoryTimelineBody"><h4>{i===0?"La primera corona":"Una nueva etapa ganadora"}</h4><p>{club.name} conquistó el campeonato de la temporada {season}.</p><a href={club.historicalSource} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a></div></li>)}
     <li><span className="clubHistoryYear">2026–27</span><div className="clubHistoryTimelineBody"><h4>Temporada actual</h4><p>La franquicia participa en la campaña 2026–27 de LMP, con sede en {club.stadium}.</p><a href="https://www.lmp.mx/" target="_blank" rel="noopener noreferrer">Consultar liga ↗</a></div></li>
    </ol>
    <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.figuresKicker}</span><h3>{COPY.history.figuresTitle}</h3></div></div>
    <div className="clubDirectoryNotice"><p>La investigación de las figuras históricas de {club.name} continúa. Para incluir a un personaje aquí debemos comprobar su paso por esta franquicia y su contribución, sin confundir etapas en otros equipos.</p><a href={club.website??club.historicalSource} target="_blank" rel="noopener noreferrer">Consultar archivo histórico ↗</a></div>
    <section className="clubHistoryHall"><div className="clubHistoryHallHeader"><div><span className="clubKicker">{COPY.history.hallKicker}</span><h3>{COPY.history.hallTitle}</h3><p>La relación de inmortales con este club se verificará antes de mostrar nombres y años de entronización.</p></div><a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a></div></section>
    <div className="clubHistoryOrigins"><div><span className="clubKicker">{COPY.history.stadiumKicker}</span><h3>{club.stadium}</h3><p>La sede actual del club se ubica en {club.city}. Se conservará el dato oficial del estadio sin atribuirle una fecha de construcción no verificada.</p><a href="https://www.lmp.mx/" target="_blank" rel="noopener noreferrer">Consultar información de la liga ↗</a></div><ClubHistoryStadiumYear stadiumOpened={getLmpStadiumYear(club.slug)}/></div>
    <footer className="clubHistorySources"><span className="clubKicker">{COPY.history.sourcesKicker}</span><p>Selección editorial basada en la fuente histórica del circuito y los datos oficiales de la temporada. Los hitos y las trayectorias pendientes se incorporarán solo tras verificarse.</p><div><a href={club.historicalSource} target="_blank" rel="noopener noreferrer">Historial de campeones ↗</a><a href="https://www.lmp.mx/" target="_blank" rel="noopener noreferrer">Liga Mexicana del Pacífico ↗</a></div></footer>
   </section>}
  </div>
 </main>
}
