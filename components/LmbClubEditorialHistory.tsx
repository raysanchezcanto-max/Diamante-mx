import type {LmbClubRecord} from "@/lib/lmbClubs";
import type {LmbClubOverview} from "@/lib/lmbClubContent";
import {LMB_CHAMPIONSHIP_SOURCE,lmbClubChampionships} from "@/lib/lmbClubHistory";
import {lmbEditorialHistory,type HistoryMilestone} from "@/lib/lmbHistoryEditorial";

type Props={club:LmbClubRecord;overview:LmbClubOverview;logo:string|null};
const initials=(name:string)=>name.split(/\s+/).filter(Boolean).slice(0,2)
  .map(part=>part.charAt(0).toLocaleUpperCase("es")).join("");

export default function LmbClubEditorialHistory({club,overview,logo}:Props){
 const titles=lmbClubChampionships(club.slug);
 const editorial=lmbEditorialHistory(club.slug);
 const years=[...titles.years].sort((a,b)=>Number.parseInt(a,10)-Number.parseInt(b,10));
 const selected=years.length<=6?years:[years[0],...years.slice(-5)];
 const timeline:readonly HistoryMilestone[]=editorial?.milestones??selected.map((year,i)=>({
   year:year.replace(/\s+(Primavera|Otoño)$/,""),
   title:i===0?"Primera corona registrada":i===selected.length-1?"La corona más reciente":"Nuevo campeonato de LMB",
   description:club.name+" conquistó el título de LMB en "+year+
     ". El año corresponde al palmarés histórico documentado de la franquicia.",
   url:LMB_CHAMPIONSHIP_SOURCE,
 }));
 const sourceList=editorial?.sources??[{label:"Historial de campeones · LMB",url:LMB_CHAMPIONSHIP_SOURCE}];
 return (
  <section className="clubHistory clubDirectoryHistory" aria-labelledby="clubGeneralHistoryTitle">
   <header className="clubHistoryHeading">
    <div>
     <span className="clubKicker">HISTORIA · LIGA MEXICANA DE BEISBOL</span>
     <h2 id="clubGeneralHistoryTitle">La historia de {club.name}</h2>
     <p>{editorial?.intro??
       "Los capítulos que definieron el legado del club en la Liga Mexicana de Beisbol: sus campeonatos, las fechas históricas documentadas y su sede actual. Las biografías se incorporarán únicamente al corroborar sus fuentes."}</p>
    </div>
    {logo&&<img src={logo} alt={"Escudo de "+club.name} width={98} height={98}/>}
   </header>

   <div className="clubHistoryStats">
    <div><span>{editorial?(editorial.debutLabel??"DEBUT HISTÓRICO LMB"):"ZONA LMB"}</span>
      <strong>{editorial?.debutYear??club.region}</strong>
      <small>{editorial?"Primeras temporadas documentadas":"Ubicación en la liga"}</small>
    </div>
    <div><span>CAMPEONATOS LMB</span><strong>{String(years.length).padStart(2,"0")}</strong><small>Hasta la temporada 2026</small></div>
    <div><span>{editorial?.stadiumOpened?"APERTURA DEL ESTADIO":"SEDE ACTUAL"}</span>
      <strong className={editorial?.stadiumOpened?"":"clubDirectoryStadiumText"}>{editorial?.stadiumOpened??(overview.stadium??"—")}</strong>
      <small>{editorial?.stadiumOpened?overview.stadium??"Recinto del club":"Fuente LMB"}</small>
    </div>
   </div>

   <div className="clubHistorySectionHead">
    <div><span className="clubKicker">EL PALMARÉS</span><h3>{years.length?"Campeonatos de Liga Mexicana":"La búsqueda de la primera estrella"}</h3></div>
    <span className="clubHistoryNote">Títulos de LMB hasta 2026</span>
   </div>
   {years.length?(
    <>
     <div className="clubHistoryChampions">
      {(years.length>1?[years[0],years[years.length-1]]:[years[0]]).map((year,i)=>(
       <article className="clubHistoryChampionCard" key={year}>
        <span className="clubHistoryStar" aria-hidden="true">★</span>
        <span className="clubHistoryChampLabel">{i===0?"PRIMERA CORONA":"CORONA MÁS RECIENTE"} · LMB</span>
        <strong>{year}</strong>
        <h4>{i===0?"La primera gloria":"La conquista más reciente"}</h4>
        <p>{club.name} forma parte del historial de campeones de la liga en {year}.</p>
        <a href={LMB_CHAMPIONSHIP_SOURCE} target="_blank" rel="noopener noreferrer">Consultar palmarés ↗</a>
       </article>
      ))}
     </div>
     <p className="clubSmallNote">Historial completo: {years.join(" · ")}. {titles.note??""}</p>
    </>
   ):(
    <div className="clubDirectoryNotice">
     <p>No se registra un campeonato de LMB en el palmarés consultado hasta 2026; esto no impide reconocer otros logros deportivos del club.</p>
    </div>
   )}

   <div className="clubHistorySectionHead">
    <div><span className="clubKicker">MOMENTOS QUE DEFINIERON AL CLUB</span><h3>Línea del tiempo</h3></div>
   </div>
   {timeline.length?(
    <>
     {!editorial&&<p className="clubHistoryIntro">Por ahora, esta cronología recoge campeonatos verificados. Investigaremos los demás hitos del club antes de incorporarlos.</p>}
     <ol className="clubHistoryTimeline">
      {timeline.map((item,i)=>(
       <li key={item.year+"-"+i}>
        <span className="clubHistoryYear">{item.year}</span>
        <div className="clubHistoryTimelineBody">
         <h4>{item.title}</h4><p>{item.description}</p>
         <a href={item.url} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a>
        </div>
       </li>
      ))}
     </ol>
    </>
   ):(
    <div className="clubDirectoryNotice"><p>La cronología de esta franquicia está en proceso de documentación. No añadimos años o sucesos sin una fuente confiable.</p></div>
   )}

   <div className="clubHistorySectionHead">
    <div><span className="clubKicker">NOMBRES QUE DEJARON HUELLA</span><h3>Figuras históricas del club</h3></div>
   </div>
   {editorial?.legends.length?(
    <>
     <p className="clubHistoryIntro">Selección de jugadores, mánagers y personalidades documentadas en las fuentes del club. No es un ranking absoluto.</p>
     <div className="clubHistoryLegends">
      {editorial.legends.map(legend=>(
       <article className="clubHistoryLegend" key={legend.name}>
        <div className="clubHistoryLegendTop">
         <span className="clubHistoryLegendMonogram" aria-hidden="true">{initials(legend.name)}</span>
         <span className="clubHistoryLegendEra">{legend.year}</span>
        </div>
        <h4>{legend.name}</h4><span className="clubHistoryLegendRole">{legend.role}</span>
        <p>{legend.highlight}</p>
        <a href={legend.url} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
       </article>
      ))}
     </div>
    </>
   ):(
    <div className="clubDirectoryNotice">
     <p>Las figuras históricas de {club.name} todavía requieren una revisión documental individual. Por ahora no trasladamos leyendas de otros equipos ni inventamos trayectorias.</p>
     <a href={"https://lmb.com.mx/equipos/"+club.slug} target="_blank" rel="noopener noreferrer">Consultar archivo oficial LMB ↗</a>
    </div>
   )}

   <section className="clubHistoryHall" aria-labelledby="clubHistoricHallTitle">
    <div className="clubHistoryHallHeader">
     <div>
      <span className="clubKicker">RECONOCIMIENTO OFICIAL</span>
      <h3 id="clubHistoricHallTitle">Inmortales vinculados al club</h3>
      <p>{editorial?.immortals.length?
       "Personajes que tuvieron un vínculo documentado con este equipo y fueron entronizados en el Salón de la Fama del Beisbol Mexicano.":
       "La relación de inmortales con este club se verificará antes de mostrar nombres y años de entronización."}</p>
     </div>
     <a className="clubHistoryHallAll" href={editorial?.immortals.length?
       "/salon-de-la-fama?club="+encodeURIComponent(club.slug):"/salon-de-la-fama"}>Explorar Salón de la Fama ↗</a>
    </div>
    {editorial?.immortals.length?(
     <div className="clubHistoryHallGrid">
      {editorial.immortals.map(person=>(
       <a className="clubHistoryHallMember" key={person.name}
        href={"/salon-de-la-fama?club="+encodeURIComponent(club.slug)+"&persona="+encodeURIComponent(person.name)}>
        <span className="clubHistoryHallMedal" aria-hidden="true">★</span>
        <strong>{person.name}</strong><small>{person.role}</small>
        <span>Entronizado {person.year} ↗</span>
       </a>
      ))}
     </div>
    ):null}
   </section>

   <div className="clubHistoryOrigins">
    <div>
     <span className="clubKicker">LA CASA DEL EQUIPO</span>
     <h3>{overview.stadium??"El estadio de "+club.name}</h3>
     <p>{editorial?.stadiumOpened?
       "El recinto abrió sus puertas en "+editorial.stadiumOpened+" y forma parte de la tradición deportiva del club. ":
       "Este es el estadio que la Liga Mexicana identifica actualmente como casa del equipo. "}
       {overview.capacity?" Capacidad actual informada por LMB: "+overview.capacity.toLocaleString("es-MX")+" espectadores.":""}</p>
     <a href={editorial?.stadiumSource??"https://lmb.com.mx/equipos/"+club.slug} target="_blank" rel="noopener noreferrer">Conocer el estadio ↗</a>
    </div>
    <div className="clubHistoryStadiumMark" aria-hidden="true">
      <span>ESTADIO</span><strong>{editorial?.stadiumOpened??"LMB"}</strong>
      <span>{editorial?.stadiumOpened?"HISTORIA DEL CLUB":"SEDE OFICIAL"}</span>
    </div>
   </div>

   <footer className="clubHistorySources">
    <span className="clubKicker">FUENTES HISTÓRICAS</span>
    <p>Los hechos y las personas que aparecen aquí tienen referencias documentales; la información actual del estadio procede de la ficha oficial de LMB. Los títulos se presentan hasta 2026.</p>
    <div>
     <a href={LMB_CHAMPIONSHIP_SOURCE} target="_blank" rel="noopener noreferrer">Palmarés de LMB ↗</a>
     {sourceList.map(x=><a href={x.url} target="_blank" rel="noopener noreferrer" key={x.url}>{x.label} ↗</a>)}
    </div>
   </footer>
  </section>
 );
}
