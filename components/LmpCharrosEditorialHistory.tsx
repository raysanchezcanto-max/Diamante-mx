import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import type { LmpClubDefinition } from "@/lib/lmpClubDirectory";
import { getTeamLogo } from "@/lib/teamLogos";

/** Charros LMP: 4 crowns from 2014 onward; old LMB titles and Caribbean title are separate. */
const official="https://cms2.charrosjalisco.com/historia/";
const league="https://editor.lmp.mx/charros-de-jalisco-es-bicampeon-de-la-liga-arco-mexicana-del-pacifico/";
const second="https://editor.lmp.mx/charros-de-jalisco-campeones-de-la-liga-arco-mexicana-del-pacifico/";
const third="https://cms2.charrosjalisco.com/charros-de-jalisco-es-campeon-de-la-liga-arco-mexicana-del-pacifico/";
const fourth="https://cms2.charrosjalisco.com/charros-es-bicampeon-jalisco-conquista-el-titulo-con-barrida-sobre-tomateros/";
const caribbean="https://editor.lmp.mx/records-hazanas-y-un-titulo-en-casa-lo-que-dejo-la-final-de-jalisco-2026/";
const panamericano="https://www.zapopan.gob.mx/wp-content/uploads/2011/06/Acta-de-la-Sesi%C3%B3n-Ordinaria-24-de-marzo-de-2015.pdf";
const manny="https://editor.lmp.mx/anuncia-manny-rodriguez-que-jugara-su-ultima-temporada-como-profesional/";
const zazueta="https://editor.lmp.mx/amadeo-zazueta-pone-fin-a-su-carrera-charros-le-rendira-homenaje/";
const vizcarra="https://editor.lmp.mx/chapo-vizcarra-es-ratificado-como-manager-de-aguilas-de-mexicali/";
const julio="https://editor.lmp.mx/si-sigo-en-charros-es-gracias-a-mis-pitchers-julio-cesar-miranda/";
const michael="https://cms2.charrosjalisco.com/jalisco-ya-tiene-a-su-2b-michael-wielansky-vuelve-al-bicampeon/";
const reyes="https://www.salondelafamadelbeisbolmexicano.com/inmortales-91-92";
const orta="https://www.salondelafamadelbeisbolmexicano.com/post/un-26-de-noviembre-pero-de-1950-nace-jorge-charolito-orta";
const seasons=["2018–19","2021–22","2024–25","2025–26"] as const;

type Milestone={year:string;title:string;description:string;source:string};
const timeline:readonly Milestone[]=[
 {year:"1946–49",title:"Las raíces de la tradición jalisciense",description:"La historia institucional reconoce como antecedente a los Pozoleros de la antigua Liga del Centro; no corresponde todavía a una participación en LMP.",source:official},
 {year:"1949–95",title:"Distintas épocas de Charros en LMB",description:"Jalisco tuvo etapas veraniegas en 1949–52, 1964–75, 1988 y 1991–95. Esta historia es diferente al palmarés invernal.",source:official},
 {year:"1967",title:"Primer título histórico en LMB",description:"Charros conquistó una corona de la liga de verano décadas antes de ingresar al circuito invernal.",source:official},
 {year:"1971",title:"La remontada de «Cananea» Reyes",description:"En la Serie Final de LMB, el equipo remontó una desventaja de 0–3 ante Saraperos de Saltillo y ganó cuatro juegos seguidos.",source:official},
 {year:"2011",title:"Nace el recinto panamericano",description:"El inmueble de atletismo de Zapopan se construyó para Guadalajara 2011 y más adelante se transformó en parque de béisbol.",source:panamericano},
 {year:"2014–15",title:"Regreso de Charros: ahora en LMP",description:"La organización reactivó el béisbol en Jalisco; el Estadio Panamericano se adaptó y el equipo debutó en LMP con un subcampeonato.",source:official},
 {year:"2018–19",title:"Primera corona de LMP",description:"Roberto Vizcarra condujo al conjunto al título frente a Yaquis de Ciudad Obregón, por cuatro juegos a dos.",source:official},
 {year:"2021–22",title:"Segunda corona del Pacífico",description:"Jalisco venció a Tomateros de Culiacán en siete partidos de la Serie Final, otra vez con Roberto Vizcarra.",source:second},
 {year:"2024",title:"Regreso paralelo a la LMB",description:"Tras la adquisición de la franquicia de Mariachis de Guadalajara, la organización retomó su presencia en el circuito de verano.",source:official},
 {year:"2024–25",title:"Tercera estrella y final del Caribe",description:"Con Benjamín Gil, Charros volvió a vencer a Tomateros por el título LMP y terminó subcampeón de la Serie del Caribe 2025.",source:third},
 {year:"2025–26",title:"Bicampeón de LMP",description:"Charros ganó su cuarta corona y completó una barrida 4–0 a Tomateros en la Serie Final.",source:fourth},
 {year:"Feb 2026",title:"Primera Serie del Caribe en casa",description:"Como México Rojo, Jalisco venció a México Verde en el Panamericano y conquistó su primer título caribeño, separado de las cuatro coronas LMP.",source:caribbean},
 {year:"Oct 2026",title:"El Museo Charros abre sus puertas",description:"En el arranque de la temporada 2026–27 la organización inauguró un museo dedicado a su historia.",source:"https://www.lmp.mx/noticias/charros-arranca-la-defensa-de-su-bicampeonato-con-triunfo-ante-jaguares"}
];
type Figure={name:string;era:string;role:string;description:string;source:string};
const figures:readonly Figure[]=[
 {name:"Benjamín «Cananea» Reyes",era:"1971 · LMB",role:"Mánager de la remontada histórica",description:"Dirigió el campeonato veraniego de 1971; inmortal nacional desde 1992. No se le atribuye el título LMP de esta etapa moderna.",source:reyes},
 {name:"Jorge «Charolito» Orta",era:"Etapa LMB",role:"Pelotero surgido de Charros e inmortal",description:"El Salón de la Fama documenta sus orígenes en la organización jalisciense y su posterior trayectoria en MLB.",source:orta},
 {name:"Roberto «Chapo» Vizcarra",era:"2018–22 · LMP",role:"Mánager de dos títulos",description:"Dirigió las primeras dos coronas del club en la Liga Mexicana del Pacífico: 2018–19 y 2021–22.",source:vizcarra},
 {name:"José Manuel «Manny» Rodríguez",era:"2014–22 · LMP",role:"Capitán y figura albiazul",description:"Ganó las dos primeras coronas LMP de Charros y recibió tres premios al Jugador Más Valioso del circuito.",source:manny},
 {name:"Amadeo Zazueta",era:"2014–24 · LMP",role:"Infielder campeón y Guante de Oro",description:"Pieza de los títulos 2018–19 y 2021–22; recibió tres Guantes de Oro con el equipo.",source:zazueta},
 {name:"Benjamín «El Matador» Gil",era:"2024–26 · LMP",role:"Mánager bicampeón y monarca del Caribe",description:"Dirigió la tercera y cuarta corona LMP y el primer campeonato de Serie del Caribe de la organización.",source:fourth},
 {name:"Julio César «La Chiva» Miranda",era:"2016–26 · LMP",role:"Coach de pitcheo multicampeón",description:"El club lo identifica como su único coach presente en los cuatro campeonatos LMP.",source:julio},
 {name:"Michael Wielansky",era:"2025–26 · Caribe",role:"Protagonista de la corona caribeña",description:"Bateó .538 en seis juegos de la Serie del Caribe 2026 y anotó la carrera decisiva en la final.",source:michael}
];
const immortals=[
 {name:"Benjamín «Cananea» Reyes",year:"1992",role:"Mánager campeón de Charros en LMB (1971)",source:reyes},
 {name:"Jorge «Charolito» Orta",year:"Salón de la Fama",role:"Pelotero surgido de Charros en su etapa histórica de LMB",source:orta}
] as const;
const initials=(name:string)=>name.replace(/[«»]/g,"").split(/\s+/).filter(Boolean).slice(0,2).map(t=>t[0]).join("").toLocaleUpperCase("es");

export default function LmpCharrosEditorialHistory({club}:{club:LmpClubDefinition}){
 const logo=getTeamLogo("LMP",club.id,club.name);
 return <section className="clubHistory clubDirectoryHistory" aria-labelledby="charrosHistoryTitle">
  <header className="clubHistoryHeading"><div>
   <span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span>
   <h2 id="charrosHistoryTitle">{COPY.history.title(club.name)}</h2>
   <p>Una tradición jalisciense con raíces en el béisbol de verano y una etapa invernal iniciada en 2014. En LMP, Charros suma cuatro campeonatos, incluido el bicampeonato 2024–26, y conquistó su primera Serie del Caribe en 2026.</p>
  </div>{logo&&<img src={logo} alt={"Escudo de "+club.name} width={98} height={98}/>}</header>

  <ClubHistoryMetrics league="LMP" debutYear="2014" championships={seasons.length} seasonLabel="2025–26" stadiumName="Estadio Panamericano de los Charros" stadiumOpened="2011"/>

  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.recordKicker}</span>
   <h3>{COPY.history.recordTitle("Liga Mexicana del Pacífico")}</h3>
  </div><span className="clubHistoryNote">4 títulos LMP · 1 Serie del Caribe</span></div>
  <div className="clubHistoryChampions">{[seasons[0],seasons[3]].map((season,i)=><article className="clubHistoryChampionCard" key={season}>
   <span className="clubHistoryStar" aria-hidden="true">★</span>
   <span className="clubHistoryChampLabel">{i===0?COPY.history.firstCrown:COPY.history.recentCrown} · LMP</span>
   <strong>{season}</strong><h4>{i===0?COPY.history.firstGlory:COPY.history.mostRecentGlory}</h4>
   <p>{i===0?"Roberto Vizcarra lideró la primera coronación del circuito invernal frente a Yaquis.":"Benjamín Gil condujo el bicampeonato con barrida 4–0 ante Tomateros; semanas después llegó la corona del Caribe."}</p>
   <a href={i===0?official:league} target="_blank" rel="noopener noreferrer">Consultar palmarés ↗</a>
  </article>)}</div>
  <p className="clubSmallNote">Títulos LMP: {seasons.join(" · ")}. Las coronas LMB de 1967 y 1971 y la Serie del Caribe 2026 pertenecen a competiciones diferentes y no se añaden al contador LMP.</p>

  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.timelineKicker}</span><h3>{COPY.history.timelineTitle}</h3></div></div>
  <ol className="clubHistoryTimeline">{timeline.map(event=><li key={event.year+"-"+event.title}>
   <span className="clubHistoryYear">{event.year}</span><div className="clubHistoryTimelineBody"><h4>{event.title}</h4><p>{event.description}</p>
    <a href={event.source} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a></div>
  </li>)}</ol>

  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.figuresKicker}</span><h3>{COPY.history.figuresTitle}</h3></div></div>
  <p className="clubHistoryIntro">{COPY.history.figuresNote} Las figuras de los años de LMB están identificadas de manera expresa para no mezclar épocas.</p>
  <div className="clubHistoryLegends">{figures.map(person=><article className="clubHistoryLegend" key={person.name}>
   <div className="clubHistoryLegendTop"><span className="clubHistoryLegendMonogram" aria-hidden="true">{initials(person.name)}</span><span className="clubHistoryLegendEra">{person.era}</span></div>
   <h4>{person.name}</h4><span className="clubHistoryLegendRole">{person.role}</span>
   <p>{person.description}</p><a href={person.source} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
  </article>)}</div>

  <section className="clubHistoryHall"><div className="clubHistoryHallHeader"><div>
   <span className="clubKicker">{COPY.history.hallKicker}</span><h3>{COPY.history.hallTitle}</h3>
   <p>{COPY.history.hallNote} Estos vínculos proceden de la historia de Charros en la Liga Mexicana de Beisbol, no de la etapa invernal iniciada en 2014.</p>
  </div><a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a></div>
   <div className="clubHistoryHallGrid">{immortals.map(person=><a className="clubHistoryHallMember" key={person.name} href={person.source} target="_blank" rel="noopener noreferrer">
    <span className="clubHistoryHallMedal" aria-hidden="true">★</span><strong>{person.name}</strong><small>{person.role}</small><span>{person.year} ↗</span>
   </a>)}</div>
  </section>

  <div className="clubHistoryOrigins"><div>
   <span className="clubKicker">{COPY.history.stadiumKicker}</span><h3>Estadio Panamericano de los Charros</h3>
   <p>El recinto de Zapopan se inauguró para los Juegos Panamericanos de 2011 como sede de atletismo. Fue acondicionado y reinaugurado para el béisbol en octubre de 2014 con el regreso de Charros. Alberga la Serie del Caribe conquistada en 2026.</p>
   <a href={panamericano} target="_blank" rel="noopener noreferrer">Consultar documento municipal ↗</a>
  </div><ClubHistoryStadiumYear stadiumOpened="2011"/></div>

  <footer className="clubHistorySources"><span className="clubKicker">{COPY.history.sourcesKicker}</span>
   <p>Historia institucional oficial de Charros, comunicados de LMP, acta del Ayuntamiento de Zapopan y fichas del Salón de la Fama del Béisbol Mexicano. Las conquistas se clasifican por competición para evitar títulos duplicados.</p>
   <div><a href={official} target="_blank" rel="noopener noreferrer">Historia oficial Charros ↗</a>
    <a href={league} target="_blank" rel="noopener noreferrer">Cuatro títulos LMP ↗</a>
    <a href={caribbean} target="_blank" rel="noopener noreferrer">Campeones Caribe 2026 ↗</a>
    <a href={panamericano} target="_blank" rel="noopener noreferrer">Historia del estadio ↗</a>
   </div>
  </footer>
 </section>;
}
