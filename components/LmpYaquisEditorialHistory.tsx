import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import type { LmpClubDefinition } from "@/lib/lmpClubDirectory";
import { getTeamLogo } from "@/lib/teamLogos";

/** Yaquis: la fecha de fundación en Liga de la Costa (1947) NO equivale
 * al debut en el circuito moderno (1960), ni al Estadio Yaquis (2016).
 * Salón de la Fama nacional separado del recinto histórico propio del club.
 */
const history = "https://www.yaquis.com.mx/historia";
const stadium = "https://www.yaquis.com.mx/2016/10/12/estrenan-yaquis-su-nueva-casa-con-colorida-fiesta/";
const stadiumInfo = "https://www.yaquis.com.mx/estadio";
const leagueGuide = "https://viewer.lmp.mx/files/lamp_guia_oficial_25_26.pdf";
const caribbean = "https://www.lmp.mx/posts/miercoles-de-serie-del-caribe-yaquis-de-obregon";
const hall = "https://www.salondelafamadelbeisbolmexicano.com/inmortales-por-orden-alfabetico";
const paquin = "https://en.salondelafamadelbeisbolmexicano.com/inmortales-98-2000";
const earlyHall = "https://en.salondelafamadelbeisbolmexicano.com/inmortales-89-90";
const ronnie = "https://www.yaquis.com.mx/2015/12/12/ronnie-camacho-ya-es-un-inmortal-yaqui/";
const archive = "https://www.yaquis.com.mx/2016/10/28/abre-sus-puertas-el-recinto-historico-alfonso-r-bours/";

const years = ["1965–66","1972–73","1980–81","2007–08","2010–11","2011–12","2012–13"];
const events = [
 {year:"1947",title:"Comienza el béisbol invernal en Obregón",desc:"La ciudad participa en la antigua Liga de la Costa del Pacífico bajo el nombre Arroceros. Este origen no se contabiliza como debut en LMP.",link:history},
 {year:"1950",title:"El equipo adopta el nombre Yaquis",desc:"La novena deja de identificarse como Arroceros y adopta la denominación Yaquis, con excepciones temporales posteriores.",link:history},
 {year:"1960",title:"Incorporación al circuito invernal sonorense",desc:"Yaquis se integra a la Liga Invernal de Sonora, antecedente directo de la actual LMP.",link:history},
 {year:"1965–66",title:"La primera corona",desc:"Manuel Magallón conduce el primer campeonato; destacan el lanzador Jesús Robles, Francisco García, Jorge Fitch y Alfredo Ríos.",link:history},
 {year:"1971–73",title:"Tomás Oroz Gaytán y segunda estrella",desc:"En 1971 abre el antiguo estadio Tomás Oroz Gaytán; la franquicia conquista su segunda corona en 1972–73 con Dave García.",link:history},
 {year:"1980–81",title:"Tercer campeonato de Yaquis",desc:"Lee Sigman dirige al equipo que obtiene el título de la temporada 1980–81.",link:leagueGuide},
 {year:"2007–08",title:"El regreso al campeonato",desc:"Homar Rojas dirige al plantel que termina con una espera de 27 años por el cuarto título.",link:history},
 {year:"2010–11",title:"Comienza la dinastía y llega la corona del Caribe",desc:"Con Eddie Díaz como mánager, la Tribu gana su quinta LMP y conquista la Serie del Caribe en Mayagüez.",link:caribbean},
 {year:"2011–12",title:"El bicampeonato de LMP",desc:"Yaquis vence a Algodoneros de Guasave en cuatro juegos, incluido el cierre de la Serie Final por 19–0.",link:history},
 {year:"2012–13",title:"Tricampeonato histórico y segunda Serie del Caribe",desc:"Obregón enlaza tres títulos de LMP y conquista el Caribe en Hermosillo tras una final de 18 entradas ante Escogido.",link:caribbean},
 {year:"2016",title:"Inauguración del actual Estadio Yaquis",desc:"El 12 de octubre abre el nuevo estadio ante Naranjeros; sustituye al Tomás Oroz Gaytán como sede principal.",link:stadium},
 {year:"2016",title:"Inauguran el recinto histórico Alfonso R. Bours",desc:"El club abre un espacio en el nuevo estadio destinado a conservar la memoria beisbolera de la franquicia.",link:archive}
] as const;
const legends=[
 {name:"Manuel Magallón",role:"Mánager de la primera corona",era:"1965–66",description:"Condujo al primer equipo campeón de Obregón en el circuito moderno.",link:history},
 {name:"Francisco «Paquín» Estrada",role:"Receptor histórico e inmortal nacional",era:"1967–81",description:"La historia oficial de Yaquis destaca sus años como receptor del equipo y su relevancia defensiva.",link:paquin},
 {name:"Alfredo Ríos",role:"Jugador de cuadro e inmortal nacional",era:"1965–66",description:"Fue parte de la primera corona y su carrera está reconocida por el Salón de la Fama mexicano.",link:earlyHall},
 {name:"Ronaldo «Ronnie» Camacho",role:"Bateador histórico del club",era:"Década de 1950",description:"Yaquis lo homenajeó formalmente en su propio recinto histórico en 2015; ese reconocimiento no se confunde con su entronización nacional.",link:ronnie},
 {name:"Homar Rojas",role:"Mánager campeón",era:"2007–08",description:"Dirigió el regreso al campeonato después de 27 años sin levantar el trofeo LMP.",link:history},
 {name:"Eddie Díaz",role:"Mánager del tricampeonato",era:"2010–13",description:"Encabezó tres coronas seguidas en LMP y dos campeonatos de Serie del Caribe.",link:caribbean},
 {name:"Luis Alonso Mendoza",role:"Lanzador de la dinastía",era:"2010–13",description:"Pieza clave de la rotación durante el tricampeonato y los torneos del Caribe.",link:caribbean},
 {name:"Douglas Clark",role:"Bateador decisivo del Caribe",era:"2013",description:"Conectó el batazo que definió el juego de 18 entradas de la Serie del Caribe 2013.",link:history}
] as const;
const immortals=[
 {name:"Francisco «Paquín» Estrada",year:"2000",relation:"Receptor histórico de Yaquis durante una parte importante de su carrera",link:paquin},
 {name:"Alfredo Ríos",year:"1990",relation:"Jugador de cuadro del equipo de Obregón en la era del primer campeonato",link:earlyHall},
 {name:"Alfonso Robinson Bours",year:"1990",relation:"Directivo pionero identificado por la historia oficial de la franquicia",link:earlyHall}
] as const;
const monogram=(value:string)=>value.replace(/[«»]/g,"").split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toLocaleUpperCase("es");
export default function LmpYaquisEditorialHistory({club}:{club:LmpClubDefinition}){
 const logo=getTeamLogo("LMP",club.id,club.name);
 return <section className="clubHistory clubDirectoryHistory" aria-labelledby="yaquisHistoryTitle">
  <header className="clubHistoryHeading"><div>
   <span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span>
   <h2 id="yaquisHistoryTitle">{COPY.history.title(club.name)}</h2>
   <p>La tradición de Obregón comenzó en la Liga de la Costa en 1947. En el circuito moderno, Yaquis acumula siete coronas LMP, un tricampeonato histórico y dos Series del Caribe.</p>
  </div>{logo&&<img src={logo} width={98} height={98} alt={"Escudo de "+club.name}/>}</header>

  <ClubHistoryMetrics league="LMP" debutYear="1960" championships={7} seasonLabel="2025–26" stadiumName="Estadio Yaquis" stadiumOpened="2016"/>

  <div className="clubHistorySectionHead"><div>
   <span className="clubKicker">{COPY.history.recordKicker}</span>
   <h3>{COPY.history.recordTitle("Liga Mexicana del Pacífico")}</h3>
  </div><span className="clubHistoryNote">7 campeonatos LMP · 2 Series del Caribe</span></div>
  <div className="clubHistoryChampions">
   {[years[0],years[years.length-1]].map((season,i)=><article className="clubHistoryChampionCard" key={season}>
    <span className="clubHistoryStar" aria-hidden="true">★</span>
    <span className="clubHistoryChampLabel">{i===0?COPY.history.firstCrown:COPY.history.recentCrown} · LMP</span>
    <strong>{season}</strong>
    <h4>{i===0?COPY.history.firstGlory:COPY.history.mostRecentGlory}</h4>
    <p>{i===0?"Manuel Magallón dirigió el primer equipo campeón de Yaquis.":"Eddie Díaz completó el histórico tricampeonato de 2010–11 a 2012–13."}</p>
    <a href={leagueGuide} target="_blank" rel="noopener noreferrer">Consultar palmarés ↗</a>
   </article>)}
  </div>
  <p className="clubSmallNote">Campeonatos LMP: {years.join(" · ")}. Series del Caribe: 2011 (Mayagüez) y 2013 (Hermosillo). Los orígenes de 1947 pertenecen a un circuito anterior.</p>

  <div className="clubHistorySectionHead"><div>
   <span className="clubKicker">{COPY.history.timelineKicker}</span><h3>{COPY.history.timelineTitle}</h3>
  </div></div>
  <ol className="clubHistoryTimeline">{events.map((event,i)=><li key={event.year+"-"+i}>
   <span className="clubHistoryYear">{event.year}</span>
   <div className="clubHistoryTimelineBody"><h4>{event.title}</h4><p>{event.desc}</p>
    <a href={event.link} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a>
   </div>
  </li>)}</ol>

  <div className="clubHistorySectionHead"><div>
   <span className="clubKicker">{COPY.history.figuresKicker}</span><h3>{COPY.history.figuresTitle}</h3>
  </div></div>
  <p className="clubHistoryIntro">{COPY.history.figuresNote}</p>
  <div className="clubHistoryLegends">{legends.map(person=><article className="clubHistoryLegend" key={person.name}>
   <div className="clubHistoryLegendTop"><span className="clubHistoryLegendMonogram" aria-hidden="true">{monogram(person.name)}</span>
    <span className="clubHistoryLegendEra">{person.era}</span></div>
   <h4>{person.name}</h4><span className="clubHistoryLegendRole">{person.role}</span>
   <p>{person.description}</p><a href={person.link} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
  </article>)}</div>

  <section className="clubHistoryHall">
   <div className="clubHistoryHallHeader"><div>
    <span className="clubKicker">{COPY.history.hallKicker}</span><h3>{COPY.history.hallTitle}</h3>
    <p>{COPY.history.hallNote} La galería nacional es distinta del recinto histórico creado por Yaquis.</p>
   </div><a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a></div>
   <div className="clubHistoryHallGrid">{immortals.map(person=><a className="clubHistoryHallMember" href={person.link} target="_blank" rel="noopener noreferrer" key={person.name}>
    <span className="clubHistoryHallMedal" aria-hidden="true">★</span>
    <strong>{person.name}</strong><small>{person.relation}</small>
    <span>Entronizado {person.year} ↗</span>
   </a>)}</div>
  </section>

  <div className="clubHistoryOrigins"><div>
   <span className="clubKicker">{COPY.history.stadiumKicker}</span><h3>Estadio Yaquis</h3>
   <p>La sede actual de la Tribu abrió el 12 de octubre de 2016 en Ciudad Obregón, Sonora, ante Naranjeros de Hermosillo. Sustituyó al histórico Tomás Oroz Gaytán, inaugurado en 1971. La información oficial del club indica capacidad para 16,000 aficionados.</p>
   <a href={stadiumInfo} target="_blank" rel="noopener noreferrer">Conocer el estadio ↗</a>
  </div><ClubHistoryStadiumYear stadiumOpened="2016"/></div>

  <footer className="clubHistorySources">
   <span className="clubKicker">{COPY.history.sourcesKicker}</span>
   <p>Hitos y figuras sustentados principalmente en la historia oficial del club y guía LMP. Las entronizaciones provienen del Salón de la Fama del Beisbol Mexicano; no se presentan todos los jugadores históricos como inmortales.</p>
   <div>
    <a href={history} target="_blank" rel="noopener noreferrer">Historia oficial Yaquis ↗</a>
    <a href={leagueGuide} target="_blank" rel="noopener noreferrer">Guía oficial LMP ↗</a>
    <a href={caribbean} target="_blank" rel="noopener noreferrer">Series del Caribe 2011 y 2013 ↗</a>
    <a href={stadium} target="_blank" rel="noopener noreferrer">Apertura del estadio de 2016 ↗</a>
    <a href={hall} target="_blank" rel="noopener noreferrer">Salón de la Fama nacional ↗</a>
   </div>
  </footer>
 </section>;
}
