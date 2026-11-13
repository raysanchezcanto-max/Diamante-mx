import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import type { LmpClubDefinition } from "@/lib/lmpClubDirectory";
import { getTeamLogo } from "@/lib/teamLogos";

/** Mayos: debut histórico 1959-60, regreso 1962-63; dos títulos LMP, sede Navojoa 2026-27. */
const timelineLmp="https://viewer.lmp.mx/files/Enciclopedia75aniversarioLMP.pdf";
const league="https://editor.lmp.mx/es-oficial-los-mayos-de-navojoa-regresan-a-la-lamp/amp/";
const guide="https://viewer.lmp.mx/files/lamp_guia_oficial_25_26.pdf";
const stadium="https://www.sonora.gob.mx/gobierno/acciones/gobernador/arranca-gobernador-durazo-modernizacion-del-estadio-de-los-mayos-ciclon-echeverria";
const cityStadium="https://www.navojoa.gob.mx/arranca-remodelacion-historica-del-estadio-ciclon-echeverria/";
const tucson="https://editor.lmp.mx/jaguares-de-nayarit-llega-a-la-lamp-mayos-jugara-en-tucson/";
const tucsonNote="https://editor.lmp.mx/comunicado-oficial-tucson-baseball-team/";
const manager="https://editor.lmp.mx/regresa-lorenzo-bundy-al-timon-de-los-mayos-de-navojoa/";
const final2018="https://www.lmp.mx/noticias/jesse-castillo-jugara-con-algodoneros-de-guasave-en-cambio-con-mayos-de-navojoa";
const paquin="https://editor.lmp.mx/se-va-una-leyenda-del-beisbol-mexicano-fallece-francisco-paquin-estrada/amp/";
const cyclone="https://www.salondelafamadelbeisbolmexicano.com/inmortales-80-82";
const isidro="https://www.salondelafamadelbeisbolmexicano.com/copia-de-2020-al-2023";
const immortalsIndex="https://www.salondelafamadelbeisbolmexicano.com/inmortales-por-orden-alfabetico";
const fernando="https://editor.lmp.mx/es-oficial-los-mayos-de-navojoa-regresan-a-la-lamp/amp/";
const cochito="https://www.mayosbeisbol.mx/noticia.php?articulo=despedida-de-una-leyenda-del-beisbol-mexicano-luis-alfonso-quot-cochito-quot-cruz-y-ultimo-juego-para-mayos-en-la-temporada-24-25&dia=31&mes=.php&otro=&year=12";
const tejada="https://editor.lmp.mx/miguel-tejada-es-oficialmente-el-manager-de-mayos/amp/";
const seasons=["1978–79","1999–00"] as const;

type Milestone={year:string;title:string;description:string;source:string};
const timeline:readonly Milestone[]=[
 {year:"1959–60",title:"Primera aparición en la Invernal",description:"Navojoa ingresó a la Liga Invernal de Sonora al recibir el roster que dejó temporalmente Ciudad Obregón. La enciclopedia oficial de LMP registra esta participación.",source:timelineLmp},
 {year:"1962–63",title:"El regreso en la expansión",description:"Mayos regresó en la expansión de la Liga Invernal de Sonora junto a Cañeros de Los Mochis; esta reaparición no reemplaza el debut de 1959.",source:timelineLmp},
 {year:"1970",title:"Se inaugura la casa de la Tribu",description:"El parque de Navojoa abrió sus puertas y se convirtió en símbolo del béisbol de la región.",source:stadium},
 {year:"1978",title:"El estadio recibe su nombre histórico",description:"La instalación fue dedicada al lanzador navojoense Manuel «Ciclón» Echeverría, figura de la antigua Liga de la Costa.",source:stadium},
 {year:"1978–79",title:"La primera estrella de los Mayos",description:"Chuck Goggins dirigió al equipo al título de la Liga Mexicana del Pacífico, imponiéndose en la final a Naranjeros de Hermosillo.",source:league},
 {year:"1999–00",title:"Lorenzo Bundy lleva la segunda corona",description:"La Tribu conquistó su segundo título LMP, nuevamente ante Naranjeros, ahora bajo el mando de Lorenzo Bundy.",source:league},
 {year:"2017–18",title:"Otra final llena de emoción",description:"Navojoa disputó la Serie Final contra Tomateros de Culiacán, que se resolvió en siete encuentros.",source:league},
 {year:"Dic 2024",title:"La despedida de «Cochito» Cruz",description:"Luis Alfonso Cruz cerró su trayectoria profesional con el equipo donde había iniciado su carrera.",source:cochito},
 {year:"May 2025",title:"Mudanza temporal del proyecto a Tucson",description:"LMP aprobó que la franquicia disputara la siguiente campaña como local en Arizona. El equipo apareció bajo el nombre Tucson Baseball Team; no se agregan sus resultados a un título de Mayos.",source:tucson},
 {year:"Oct 2025",title:"Cambios en el plan de Tucson",description:"La liga comunicó la postergación de actividades en Kino Veterans Memorial Stadium por procesos con autoridades estadounidenses.",source:tucsonNote},
 {year:"Abr 2026",title:"Se confirma el regreso a Navojoa",description:"La liga y autoridades estatales anunciaron el retorno de Mayos para 2026–27 y la renovación del Estadio «Ciclón» Echeverría.",source:league},
 {year:"Jun 2026",title:"Comienza la modernización del estadio",description:"Las autoridades municipales y estatales pusieron en marcha los trabajos para actualizar el histórico recinto inaugurado en 1970.",source:cityStadium},
 {year:"2026–27",title:"Una nueva etapa con Miguel Tejada",description:"El exligamayorista dominicano fue presentado como mánager para la temporada de regreso de la Tribu.",source:tejada}
];
type Figure={name:string;era:string;role:string;description:string;source:string};
const figures:readonly Figure[]=[
 {name:"Manuel «Ciclón» Echeverría",era:"Liga de la Costa · 1940–50",role:"Lanzador histórico y nombre del estadio",description:"Serpentinero navojoense inmortal desde 1982; su carrera antecede a la etapa moderna de LMP.",source:cyclone},
 {name:"Chuck Goggins",era:"1978–79",role:"Mánager de la primera corona",description:"Dirigió a Mayos en su primer campeonato LMP, obtenido ante Naranjeros.",source:league},
 {name:"Lorenzo Bundy",era:"1999–00",role:"Mánager de la segunda corona",description:"Guio la conquista de 1999–00 y volvió a dirigir a Navojoa en etapas posteriores.",source:manager},
 {name:"Francisco «Paquín» Estrada",era:"Desde 1964–65",role:"Receptor, mánager e inmortal",description:"Debutó en LMP con Mayos a los 16 años. Sus siete campeonatos como dirigente llegaron con otras franquicias, no con Navojoa.",source:paquin},
 {name:"Isidro Márquez",era:"Trayectoria LMP",role:"Relevista histórico e inmortal",description:"Nacido en Navojoa, jugó con la Tribu y otros clubes; fue elegido al Salón de la Fama en 2020.",source:isidro},
 {name:"Fernando Valenzuela",era:"Raíces en Etchohuaquila",role:"Lanzador histórico de MLB y ex Mayo",description:"Originario de una comunidad de Navojoa, también defendió a Mayos durante su carrera; se distingue su legado en Grandes Ligas.",source:fernando},
 {name:"Luis Alfonso «Cochito» Cruz",era:"Hasta 2024–25",role:"Infielder y exligamayorista",description:"Comenzó y terminó su carrera profesional con Mayos; también jugó en Yankees y Dodgers.",source:league},
 {name:"Miguel Tejada",era:"2026–27",role:"Mánager del regreso",description:"El exligamayorista dominicano fue presentado para dirigir la primera campaña de regreso a Navojoa.",source:tejada}
];
const immortals=[
 {name:"Manuel «Ciclón» Echeverría",year:"1982",role:"Lanzador de la Liga de la Costa, homenajeado en el estadio de Navojoa",source:cyclone},
 {name:"Francisco «Paquín» Estrada",year:"2000",role:"Receptor que debutó en Mayos; mánager multicampeón en otros clubes",source:immortalsIndex},
 {name:"Isidro Márquez",year:"2020",role:"Relevista navojoense que defendió también los colores de Mayos",source:isidro}
] as const;
const initials=(name:string)=>name.replace(/[«»]/g,"").split(/\s+/).filter(Boolean).slice(0,2).map(t=>t[0]).join("").toLocaleUpperCase("es");

export default function LmpMayosEditorialHistory({club}:{club:LmpClubDefinition}){
 const logo=getTeamLogo("LMP",club.id,club.name);
 return <section className="clubHistory clubDirectoryHistory" aria-labelledby="mayosHistoryTitle">
  <header className="clubHistoryHeading"><div>
   <span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span>
   <h2 id="mayosHistoryTitle">{COPY.history.title(club.name)}</h2>
   <p>La Tribu de Navojoa comenzó en el béisbol invernal de Sonora en 1959–60 y ha conquistado dos campeonatos de LMP. Tras una temporada marcada por el proyecto de Tucson, regresó a su ciudad para 2026–27.</p>
  </div>{logo&&<img src={logo} alt={"Escudo de "+club.name} width={98} height={98}/>}</header>

  <ClubHistoryMetrics league="LMP" debutYear="1959" championships={seasons.length} seasonLabel="2025–26" stadiumName="Estadio Manuel Ciclón Echeverría" stadiumOpened="1970"/>

  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.recordKicker}</span>
   <h3>{COPY.history.recordTitle("Liga Mexicana del Pacífico")}</h3>
  </div><span className="clubHistoryNote">2 títulos LMP · 1978–79 y 1999–00</span></div>
  <div className="clubHistoryChampions">{seasons.map((season,i)=><article className="clubHistoryChampionCard" key={season}>
   <span className="clubHistoryStar" aria-hidden="true">★</span>
   <span className="clubHistoryChampLabel">{i===0?COPY.history.firstCrown:COPY.history.recentCrown} · LMP</span>
   <strong>{season}</strong><h4>{i===0?COPY.history.firstGlory:COPY.history.mostRecentGlory}</h4>
   <p>{i===0?"Chuck Goggins dirigió a la Tribu en su primer título, frente a Naranjeros de Hermosillo.":"Lorenzo Bundy encabezó la segunda coronación, también ante Naranjeros de Hermosillo."}</p>
   <a href={league} target="_blank" rel="noopener noreferrer">Consultar palmarés ↗</a>
  </article>)}</div>
  <p className="clubSmallNote">Palmarés LMP: {seasons.join(" · ")}. El traslado temporal a Tucson y el regreso de 2026 no constituyen campeonatos adicionales ni nuevas estrellas.</p>

  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.timelineKicker}</span><h3>{COPY.history.timelineTitle}</h3></div></div>
  <ol className="clubHistoryTimeline">{timeline.map(event=><li key={event.year+"-"+event.title}>
   <span className="clubHistoryYear">{event.year}</span><div className="clubHistoryTimelineBody"><h4>{event.title}</h4><p>{event.description}</p>
    <a href={event.source} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a></div>
  </li>)}</ol>

  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.figuresKicker}</span><h3>{COPY.history.figuresTitle}</h3></div></div>
  <p className="clubHistoryIntro">{COPY.history.figuresNote} Se diferencia a los protagonistas de la antigua Liga de la Costa, los campeonatos LMP y el regreso de 2026.</p>
  <div className="clubHistoryLegends">{figures.map(person=><article className="clubHistoryLegend" key={person.name}>
   <div className="clubHistoryLegendTop"><span className="clubHistoryLegendMonogram" aria-hidden="true">{initials(person.name)}</span><span className="clubHistoryLegendEra">{person.era}</span></div>
   <h4>{person.name}</h4><span className="clubHistoryLegendRole">{person.role}</span>
   <p>{person.description}</p><a href={person.source} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
  </article>)}</div>

  <section className="clubHistoryHall"><div className="clubHistoryHallHeader"><div>
   <span className="clubKicker">{COPY.history.hallKicker}</span><h3>{COPY.history.hallTitle}</h3>
   <p>{COPY.history.hallNote} La vinculación puede ser histórica, local o como jugador; no equivale necesariamente a haber obtenido una corona con el equipo.</p>
  </div><a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a></div>
   <div className="clubHistoryHallGrid">{immortals.map(person=><a className="clubHistoryHallMember" key={person.name} href={person.source} target="_blank" rel="noopener noreferrer">
    <span className="clubHistoryHallMedal" aria-hidden="true">★</span><strong>{person.name}</strong>
    <small>{person.role}</small><span>Entronizado {person.year} ↗</span>
   </a>)}</div>
  </section>

  <div className="clubHistoryOrigins"><div>
   <span className="clubKicker">{COPY.history.stadiumKicker}</span><h3>Estadio Manuel «Ciclón» Echeverría</h3>
   <p>El inmueble original de Navojoa abrió en 1970 y recibió el nombre del histórico lanzador en 1978. En junio de 2026 comenzó un programa de modernización para acompañar el regreso de los Mayos. La fecha 1970 identifica la apertura del recinto original, no la conclusión de las obras recientes.</p>
   <a href={cityStadium} target="_blank" rel="noopener noreferrer">Consultar modernización oficial ↗</a>
  </div><ClubHistoryStadiumYear stadiumOpened="1970"/></div>

  <footer className="clubHistorySources"><span className="clubKicker">{COPY.history.sourcesKicker}</span>
   <p>Historia contrastada con la enciclopedia y comunicados oficiales de LMP, el Gobierno de Sonora, el Ayuntamiento de Navojoa y el Salón de la Fama del Béisbol Mexicano.</p>
   <div><a href={timelineLmp} target="_blank" rel="noopener noreferrer">Enciclopedia histórica LMP ↗</a>
    <a href={guide} target="_blank" rel="noopener noreferrer">Guía LMP ↗</a>
    <a href={league} target="_blank" rel="noopener noreferrer">Regreso de Mayos ↗</a>
    <a href={cityStadium} target="_blank" rel="noopener noreferrer">Estadio de Navojoa ↗</a>
   </div>
  </footer>
 </section>;
}
