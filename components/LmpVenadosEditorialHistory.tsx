import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import type { LmpClubDefinition } from "@/lib/lmpClubDirectory";
import { getTeamLogo } from "@/lib/teamLogos";

/** Venados: nueve coronas del circuito moderno LMP, dos Series del Caribe.
 * La primera corona histórica 1945–46 fue en la Liga de la Costa.
 * Estadio Teodoro Mariscal (1962), anterior a debut moderno (1965).
 */
const guide="https://viewer.lmp.mx/files/GuiaBeisbolPacifico2020COMPLETO.pdf";
const clubGuide="https://viewer.lmp.mx/files/lamp_guia_oficial_25_26.pdf";
const pacho="https://www.venados.com/venados-en-el-tiempo-juan-jose-pacho-y-su-huella-en-venados/";
const caribbean="https://www.resguardo.venados.com/mazatlan-y-su-paso-en-serie-del-caribe/";
const comeback="https://www.venados.com/regresa-el-idolo-inmortal-1/";
const stadium="https://www.venados.com/el-estadio-teodoro-mariscal-llega-a-los-62-anos-de-su-gloriosa-inauguracion/";
const hall2025="https://www.venados.com/orgullo-venados-pancho-ponches-saucedo-y-ramirez-al-salon-de-la-fama-del-beisbol-mexicano-clase-2025/";
const felipe="https://www.venados.com/fallece-un-historico-de-venados-de-mazatlan-felipe-el-clipper-montemayor/";
const legends="https://www.venados.com/ocho-decadas-de-historia-en-una-noche-venados-ilumina-el-teodoro-mariscal-en-su-ceremonia-inaugural/";
const heber="https://www.venados.com/super-heber-esta-de-regreso-con-venados-de-mazatlan/";
const homage="https://www.venados.com/brillan-las-leyendas-plaza-acaya-y-venados-de-mazatlan-develan-placas-en-el-paseo-de-la-fama/";
const seasons=["1973–74","1976–77","1986–87","1992–93","1997–98","2004–05","2005–06","2008–09","2015–16"] as const;
type Milestone={year:string;title:string;description:string;source:string};
const timeline:readonly Milestone[]=[
 {year:"1945–46",title:"La primera estrella, antes de LMP",description:"La franquicia conquistó una corona en la antigua Liga de la Costa del Pacífico. Este campeonato no forma parte de las nueve coronas LMP.",source:stadium},
 {year:"1962",title:"Nace el Estadio Teodoro Mariscal",description:"La construcción empezó en 1961 y el recinto abrió en 1962, años antes de la etapa moderna de Venados en LMP.",source:stadium},
 {year:"1965–66",title:"Primera campaña del circuito moderno",description:"Mazatlán comenzó su participación en la Liga Invernal Sonora-Sinaloa; sus triunfos de la Liga de la Costa se contabilizan por separado.",source:clubGuide},
 {year:"1973–74",title:"Primera corona moderna de Venados",description:"Ronaldo Camacho dirigió a Mazatlán en la primera de sus nueve temporadas campeonas de LMP.",source:guide},
 {year:"1976–77",title:"La segunda estrella",description:"Bajo el mando de Alfredo Ortiz, Venados consiguió la segunda corona LMP.",source:guide},
 {year:"1986–93",title:"Las coronas de Carlos Paz y Ramón Montoya",description:"La franquicia fue campeona en 1986–87 y 1992–93, ampliando su tradición ganadora.",source:guide},
 {year:"1997–98",title:"La quinta corona del club",description:"Raúl Cano dirigió a los rojos al campeonato de 1997–98.",source:guide},
 {year:"2004–05",title:"Juan José Pacho y el primer título del Caribe",description:"Venados ganó su sexta corona de LMP y la Serie del Caribe 2005 en su propio estadio con marca de 5–1.",source:comeback},
 {year:"2005–06",title:"El primer bicampeonato de LMP",description:"La séptima corona llegó de nuevo con Pacho, después de vencer a Guasave en la Serie Final.",source:comeback},
 {year:"2008–09",title:"Un nuevo título con Lorenzo Bundy",description:"La octava corona llegó bajo la dirección de Lorenzo Bundy; Venados fue posteriormente subcampeón de la Serie del Caribe 2009.",source:guide},
 {year:"2015–16",title:"Novena corona y segundo Caribe invicto",description:"Juan José Pacho condujo otro título LMP y ganó la Serie del Caribe de Santo Domingo de manera invicta, con récord 6–0.",source:comeback},
 {year:"2025",title:"Ocho décadas de tradición mazatleca",description:"La franquicia celebró 80 años con homenajes a Juan José Pacho, Héber Gómez y otras figuras de la historia roja.",source:legends}
];
type Figure={name:string;era:string;role:string;description:string;source:string};
const figures:readonly Figure[]=[
 {name:"Juan José Pacho",era:"1980–2000 / 2004–16",role:"Parador en corto y mánager histórico",description:"Defendió 20 temporadas a Venados como jugador y dirigió tres coronas LMP y dos Series del Caribe; inmortal nacional desde 2009.",source:pacho},
 {name:"Ronaldo «Ronnie» Camacho",era:"1973–74",role:"Mánager de la primera corona LMP",description:"El palmarés oficial le acredita la primera corona del circuito moderno en Mazatlán.",source:guide},
 {name:"Alfredo Ortiz",era:"1976–77",role:"Mánager de la segunda corona",description:"Dirigió a los rojos en el campeonato de la temporada 1976–77.",source:guide},
 {name:"Francisco «Pancho» Campos",era:"2000–10",role:"Lanzador e inmortal nacional",description:"Acumuló 531 ponches para el club; ganó con Venados la Serie del Caribe de 2005 y fue entronizado al Salón de la Fama en 2025.",source:hall2025},
 {name:"Roberto Saucedo",era:"2000–10",role:"Bateador de poder e inmortal",description:"Compartió la marca histórica de 75 cuadrangulares de Venados y recibió entronización nacional en 2025.",source:hall2025},
 {name:"Felipe «El Clipper» Montemayor",era:"Etapa histórica",role:"Exligamayorista e inmortal",description:"Defendió el uniforme de Mazatlán, jugó con Pittsburgh en MLB y fue entronizado en el Salón de la Fama mexicano en 1983.",source:felipe},
 {name:"Héber Gómez",era:"1999–2014",role:"Bateador y dorsal retirado",description:"Campeón de bateo con Venados en 2002–03; su número 34 fue retirado en diciembre de 2015.",source:heber},
 {name:"Juan Lizárraga",era:"Historia roja",role:"Segunda base homenajeado",description:"El club lo reconoció junto con Juan José Pacho en el Paseo de la Fama local en 2025; este homenaje es distinto de la entronización nacional.",source:homage}
];
const immortals=[
 {name:"Felipe «El Clipper» Montemayor",year:"1983",role:"Exjugador de Venados y exligamayorista de Pittsburgh",source:felipe},
 {name:"Juan José Pacho",year:"2009",role:"Jugador histórico y mánager multicampeón de Mazatlán",source:pacho},
 {name:"Francisco «Pancho» Campos",year:"2025",role:"Lanzador de Venados, campeón del Caribe en 2005",source:hall2025},
 {name:"Roberto Saucedo",year:"2025",role:"Bateador histórico de Venados, 75 cuadrangulares",source:hall2025},
 {name:"Roberto «La Metralleta» Ramírez",year:"2025",role:"Lanzador histórico vinculado a la franquicia",source:hall2025}
] as const;
const initials=(name:string)=>name.replace(/[«»]/g,"").split(/\s+/).filter(Boolean).slice(0,2).map(t=>t[0]).join("").toLocaleUpperCase("es");

export default function LmpVenadosEditorialHistory({club}:{club:LmpClubDefinition}){
 const logo=getTeamLogo("LMP",club.id,club.name);
 return <section className="clubHistory clubDirectoryHistory" aria-labelledby="venadosHistoryTitle">
  <header className="clubHistoryHeading"><div>
   <span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span>
   <h2 id="venadosHistoryTitle">{COPY.history.title(club.name)}</h2>
   <p>La tradición beisbolera de Mazatlán se remonta a 1945. En el circuito moderno, Venados ha conquistado nueve campeonatos de liga y dos Series del Caribe, ambas con Juan José Pacho como mánager.</p>
  </div>{logo&&<img src={logo} alt={"Escudo de "+club.name} width={98} height={98}/>}</header>

  <ClubHistoryMetrics league="LMP" debutYear="1965" championships={seasons.length} seasonLabel="2025–26" stadiumName="Estadio Teodoro Mariscal" stadiumOpened="1962"/>

  <div className="clubHistorySectionHead"><div>
   <span className="clubKicker">{COPY.history.recordKicker}</span>
   <h3>{COPY.history.recordTitle("Liga Mexicana del Pacífico")}</h3>
  </div><span className="clubHistoryNote">9 títulos LMP · 2 Series del Caribe</span></div>
  <div className="clubHistoryChampions">
   {[seasons[0],seasons[seasons.length-1]].map((season,i)=><article className="clubHistoryChampionCard" key={season}>
    <span className="clubHistoryStar" aria-hidden="true">★</span>
    <span className="clubHistoryChampLabel">{i===0?COPY.history.firstCrown:COPY.history.recentCrown} · LMP</span>
    <strong>{season}</strong><h4>{i===0?COPY.history.firstGlory:COPY.history.mostRecentGlory}</h4>
    <p>{i===0?"Ronaldo Camacho dirigió la primera corona en el circuito moderno.":"Juan José Pacho condujo la novena corona y posteriormente la Serie del Caribe invicta de 2016."}</p>
    <a href={i===0?guide:comeback} target="_blank" rel="noopener noreferrer">Consultar palmarés ↗</a>
   </article>)}
  </div>
  <p className="clubSmallNote">Campeonatos de LMP: {seasons.join(" · ")}. La corona 1945–46 fue de la antigua Liga de la Costa del Pacífico; 2005 y 2016 fueron títulos de Serie del Caribe, no coronas adicionales de LMP.</p>

  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.timelineKicker}</span>
   <h3>{COPY.history.timelineTitle}</h3></div></div>
  <ol className="clubHistoryTimeline">{timeline.map(event=><li key={event.year}>
   <span className="clubHistoryYear">{event.year}</span>
   <div className="clubHistoryTimelineBody"><h4>{event.title}</h4><p>{event.description}</p>
    <a href={event.source} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a></div>
  </li>)}</ol>

  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.figuresKicker}</span>
   <h3>{COPY.history.figuresTitle}</h3></div></div>
  <p className="clubHistoryIntro">{COPY.history.figuresNote}</p>
  <div className="clubHistoryLegends">{figures.map(person=><article className="clubHistoryLegend" key={person.name}>
   <div className="clubHistoryLegendTop"><span className="clubHistoryLegendMonogram" aria-hidden="true">{initials(person.name)}</span>
    <span className="clubHistoryLegendEra">{person.era}</span></div>
   <h4>{person.name}</h4><span className="clubHistoryLegendRole">{person.role}</span>
   <p>{person.description}</p><a href={person.source} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
  </article>)}</div>

  <section className="clubHistoryHall"><div className="clubHistoryHallHeader"><div>
   <span className="clubKicker">{COPY.history.hallKicker}</span><h3>{COPY.history.hallTitle}</h3>
   <p>{COPY.history.hallNote} Los homenajes del Paseo de la Fama de Mazatlán no equivalen a entronizaciones nacionales.</p>
  </div><a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a></div>
   <div className="clubHistoryHallGrid">{immortals.map(person=><a className="clubHistoryHallMember" key={person.name} href={person.source} target="_blank" rel="noopener noreferrer">
    <span className="clubHistoryHallMedal" aria-hidden="true">★</span><strong>{person.name}</strong>
    <small>{person.role}</small><span>Entronizado {person.year} ↗</span>
   </a>)}</div>
  </section>

  <div className="clubHistoryOrigins"><div>
   <span className="clubKicker">{COPY.history.stadiumKicker}</span><h3>Estadio Teodoro Mariscal</h3>
   <p>La casa de Venados se inauguró en 1962, después de colocarse su primera piedra en 1961. Ha recibido finales, Series del Caribe y celebraciones del puerto. Su nombre homenajea al impulsor del beisbol local Teodoro Mariscal.</p>
   <a href={stadium} target="_blank" rel="noopener noreferrer">Conocer el estadio ↗</a>
  </div><ClubHistoryStadiumYear stadiumOpened="1962"/></div>

  <footer className="clubHistorySources"><span className="clubKicker">{COPY.history.sourcesKicker}</span>
   <p>Palmarés contrastado con la guía oficial LMP, historia de las coronas del Caribe y publicaciones originales del club. La galería de figuras e inmortales es una selección documentada, no una lista exhaustiva.</p>
   <div><a href={clubGuide} target="_blank" rel="noopener noreferrer">Guía oficial LMP ↗</a>
    <a href={pacho} target="_blank" rel="noopener noreferrer">Juan José Pacho ↗</a>
    <a href={caribbean} target="_blank" rel="noopener noreferrer">Serie del Caribe ↗</a>
    <a href={stadium} target="_blank" rel="noopener noreferrer">Historia del estadio ↗</a>
    <a href={hall2025} target="_blank" rel="noopener noreferrer">Inmortales clase 2025 ↗</a>
   </div>
  </footer>
 </section>;
}
