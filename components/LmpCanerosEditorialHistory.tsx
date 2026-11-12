import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import type { LmpClubDefinition } from "@/lib/lmpClubDirectory";
import { getTeamLogo } from "@/lib/teamLogos";

/** Historia de Cañeros respaldada por el propio club. El Estadio Mochis de
 * 1947 estuvo en OTRA ubicación; la casa actual abrió el 2 de noviembre
 * de 1962. La obra 2018–19 y la denominación Chevron Park de 2022 no
 * constituyen una nueva inauguración.
 */
const titles = "https://caneros.net/campeonatos.htm";
const title1968 = "https://caneros.net/campeonato1.htm";
const title1984 = "https://caneros.net/campeonato2.htm";
const title2003 = "https://caneros.net/campeonato3.htm";
const title2023 = "https://www.caneros.net/noticias/leer.php?paginado=2832";
const stadiumHistory = "https://www.caneros.net/estadiohistoria.htm";
const stadium = "https://www.caneros.net/estadio.htm";
const legendsSource = "https://caneros.net/leyendas.htm";
const chico2012 = "https://www.caneros.net/noticias/leer.php?paginado=2862";
const chico2025 = "https://caneros.net/noticias/leer.php?paginado=3170";
const luque1999 = "https://www.caneros.net/noticias/leer.php?paginado=3263";
const hall = "https://www.salondelafamadelbeisbolmexicano.com/inmortales";
const seasons = ["1968–69", "1983–84", "2002–03", "2022–23"] as const;
type Moment = {year:string;title:string;description:string;source:string};
const timeline:readonly Moment[] = [
 {year:"1947",title:"Primer Estadio Mochis y Liga de la Costa",description:"Los Mochis participó en la antigua Liga de la Costa del Pacífico y construyó un primer parque en el centro de la ciudad, distinto de la sede actual.",source:stadiumHistory},
 {year:"1962–63",title:"Regreso a la liga invernal y nueva casa",description:"Cañeros se incorporó a la Liga Invernal de Sonora. El 2 de noviembre de 1962 estrenó el nuevo Estadio Mochis, al pie del Cerro de la Memoria.",source:stadiumHistory},
 {year:"1963",title:"El béisbol nocturno llega a Los Mochis",description:"El nuevo estadio recibió alumbrado y jugó su primer encuentro nocturno el 10 de octubre.",source:stadiumHistory},
 {year:"1968–69",title:"Primera corona de la Fuerza Verde",description:"Benjamín «Papelero» Valenzuela tomó el mando del equipo y lo llevó a su primer campeonato del circuito moderno.",source:title1968},
 {year:"1972",title:"Estadio Emilio Ibarra Almada",description:"El 5 de octubre el Ayuntamiento de Ahome aprobó nombrar al estadio en honor al directivo que impulsó el béisbol profesional en la ciudad.",source:stadiumHistory},
 {year:"1983–84",title:"Segunda estrella en doce entradas",description:"Vinicio García dirigió el campeonato frente a Ostioneros de Guaymas; la serie culminó en un duelo de 1–0 en doce entradas.",source:title1984},
 {year:"2002–03",title:"Chico Rodríguez y la tercera corona",description:"Juan Francisco «Chico» Rodríguez condujo a Cañeros a su tercer campeonato de LMP.",source:title2003},
 {year:"2018–19",title:"Reconstrucción del parque histórico",description:"Se reconstruyeron tribunas e instalaciones, conservando la ubicación y parte de la estructura lateral del estadio. Las obras concluyeron oficialmente en 2019.",source:stadiumHistory},
 {year:"2022",title:"El recinto adopta el nombre Chevron Park",description:"La denominación comercial Chevron Park llegó en la temporada 2022–23. El club también inauguró un recinto de homenaje a sus inmortales.",source:stadiumHistory},
 {year:"2022–23",title:"Cuarto título de LMP ante Guasave",description:"Bajo la dirección de José Moreno, Los Mochis venció 5–0 a Algodoneros en el juego decisivo con una sólida actuación de Nick Struck.",source:title2023},
 {year:"2025",title:"El número 3 de Chico Rodríguez es retirado",description:"Cañeros homenajeó a Juan Francisco Rodríguez al retirar su dorsal, después de haber sido jugador campeón en 1983–84 y mánager campeón en 2002–03.",source:chico2025}
];
type Figure={name:string;era:string;role:string;text:string;source:string};
const figures:readonly Figure[]=[
 {name:"Benjamín «Papelero» Valenzuela",era:"1968–69",role:"Mánager de la primera corona",text:"Dirigió el primer campeonato verde; el club retiró su dorsal 14 en octubre de 2015.",source:legendsSource},
 {name:"Vinicio García",era:"1983–84",role:"Mánager campeón",text:"Condujo la segunda corona en una final frente a Ostioneros de Guaymas.",source:title1984},
 {name:"Juan Francisco «Chico» Rodríguez",era:"1981–2025",role:"Jugador, mánager e inmortal",text:"Fue campeón como pelotero en 1983–84 y como mánager en 2002–03; el equipo retiró su número 3 en 2025.",source:chico2025},
 {name:"Gregorio Luque",era:"1962–80",role:"Receptor e inmortal",text:"Defendió a Cañeros en sus 15 temporadas de béisbol invernal y formó parte del primer título de 1968–69.",source:luque1999},
 {name:"Aurelio Rodríguez",era:"1966–84",role:"Tercera base histórico",text:"Jugó con Los Mochis durante ambas primeras etapas campeonas, en 1968–69 y 1983–84.",source:legendsSource},
 {name:"Saúl Soto",era:"1999–2022",role:"Receptor y bateador emblemático",text:"El club retiró su dorsal 5 en 2019; fue parte del equipo campeón de 2002–03.",source:legendsSource},
 {name:"Ramón Orantes",era:"1998–2017",role:"Bateador de la tercera corona",text:"Integró el conjunto campeón de 2002–03 y recibió el retiro del número 24 en 2016.",source:legendsSource},
 {name:"Teodoro Higuera",era:"1995–2003",role:"Lanzador e inmortal",text:"Exligamayorista de Milwaukee, colaboró como coach de pitcheo en el campeonato 2002–03 y su número 49 está retirado.",source:legendsSource}
];
const immortals=[
 {name:"Gregorio Luque",year:"1999",role:"Receptor campeón de Cañeros en 1968–69",source:luque1999},
 {name:"Teodoro Higuera",year:"2011",role:"Lanzador y coach campeón con Los Mochis",source:legendsSource},
 {name:"Juan Francisco «Chico» Rodríguez",year:"2012",role:"Jugador campeón y mánager del título 2002–03",source:chico2012}
] as const;
function monogram(name:string){return name.replace(/[«»]/g,"").split(/\s+/).filter(Boolean).slice(0,2).map(p=>p[0]).join("").toLocaleUpperCase("es");}

export default function LmpCanerosEditorialHistory({club}:{club:LmpClubDefinition}){
 const logo=getTeamLogo("LMP",club.id,club.name);
 return <section className="clubHistory clubDirectoryHistory" aria-labelledby="canerosHistoryTitle">
  <header className="clubHistoryHeading"><div>
   <span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span>
   <h2 id="canerosHistoryTitle">{COPY.history.title(club.name)}</h2>
   <p>La Fuerza Verde representa a Los Mochis en el béisbol invernal mexicano. Desde su etapa moderna de 1962, Cañeros ha conquistado cuatro campeonatos de liga y construido una identidad propia alrededor de su estadio histórico.</p>
  </div>{logo&&<img src={logo} alt={"Escudo de "+club.name} width={98} height={98}/>}</header>

  <ClubHistoryMetrics league="LMP" debutYear="1962" championships={seasons.length} seasonLabel="2025–26" stadiumName="Chevron Park" stadiumOpened="1962"/>

  <div className="clubHistorySectionHead"><div>
   <span className="clubKicker">{COPY.history.recordKicker}</span>
   <h3>{COPY.history.recordTitle("Liga Mexicana del Pacífico")}</h3>
  </div><span className="clubHistoryNote">4 títulos LMP · última corona 2022–23</span></div>
  <div className="clubHistoryChampions">
   {[seasons[0],seasons[seasons.length-1]].map((season,i)=><article className="clubHistoryChampionCard" key={season}>
    <span className="clubHistoryStar" aria-hidden="true">★</span>
    <span className="clubHistoryChampLabel">{i===0?COPY.history.firstCrown:COPY.history.recentCrown} · LMP</span>
    <strong>{season}</strong><h4>{i===0?COPY.history.firstGlory:COPY.history.mostRecentGlory}</h4>
    <p>{i===0?"Benjamín «Papelero» Valenzuela dirigió a Cañeros a su primer título.":"José Moreno fue el mánager del cuarto campeonato, conseguido ante Algodoneros de Guasave."}</p>
    <a href={i===0?title1968:title2023} target="_blank" rel="noopener noreferrer">Consultar palmarés ↗</a>
   </article>)}
  </div>
  <p className="clubSmallNote">Campeonatos del circuito moderno: {seasons.join(" · ")}. La participación anterior en la Liga de la Costa se documenta por separado y no se suma a estas cuatro coronas.</p>

  <div className="clubHistorySectionHead"><div>
   <span className="clubKicker">{COPY.history.timelineKicker}</span><h3>{COPY.history.timelineTitle}</h3>
  </div></div>
  <ol className="clubHistoryTimeline">{timeline.map((event,i)=><li key={event.year+"-"+i}>
   <span className="clubHistoryYear">{event.year}</span>
   <div className="clubHistoryTimelineBody"><h4>{event.title}</h4><p>{event.description}</p>
    <a href={event.source} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a>
   </div>
  </li>)}</ol>

  <div className="clubHistorySectionHead"><div>
   <span className="clubKicker">{COPY.history.figuresKicker}</span><h3>{COPY.history.figuresTitle}</h3>
  </div></div>
  <p className="clubHistoryIntro">{COPY.history.figuresNote}</p>
  <div className="clubHistoryLegends">{figures.map(person=><article className="clubHistoryLegend" key={person.name}>
   <div className="clubHistoryLegendTop"><span className="clubHistoryLegendMonogram" aria-hidden="true">{monogram(person.name)}</span>
    <span className="clubHistoryLegendEra">{person.era}</span></div>
   <h4>{person.name}</h4><span className="clubHistoryLegendRole">{person.role}</span>
   <p>{person.text}</p><a href={person.source} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
  </article>)}</div>

  <section className="clubHistoryHall">
   <div className="clubHistoryHallHeader"><div><span className="clubKicker">{COPY.history.hallKicker}</span>
    <h3>{COPY.history.hallTitle}</h3><p>{COPY.history.hallNote}</p>
   </div><a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a></div>
   <div className="clubHistoryHallGrid">{immortals.map(person=><a className="clubHistoryHallMember" href={person.source} key={person.name} target="_blank" rel="noopener noreferrer">
    <span className="clubHistoryHallMedal" aria-hidden="true">★</span>
    <strong>{person.name}</strong><small>{person.role}</small><span>Entronizado {person.year} ↗</span>
   </a>)}</div>
  </section>

  <div className="clubHistoryOrigins"><div>
   <span className="clubKicker">{COPY.history.stadiumKicker}</span>
   <h3>Chevron Park · Estadio Emilio Ibarra Almada</h3>
   <p>El parque actual, construido a los pies del Cerro de la Memoria, abrió el 2 de noviembre de 1962. Se llamó Emilio Ibarra Almada desde 1972, fue reconstruido entre 2018 y 2019 y adoptó el nombre comercial Chevron Park en 2022. El primer Estadio Mochis de 1947 estaba en otra ubicación.</p>
   <a href={stadiumHistory} target="_blank" rel="noopener noreferrer">Conocer el estadio ↗</a>
  </div><ClubHistoryStadiumYear stadiumOpened="1962"/></div>

  <footer className="clubHistorySources">
   <span className="clubKicker">{COPY.history.sourcesKicker}</span>
   <p>Los hitos, títulos, leyendas y entronizaciones se documentaron con el archivo del propio Club Cañeros. Un dorsal retirado no demuestra por sí solo una entronización nacional; por ello ambas categorías se presentan separadas.</p>
   <div>
    <a href={titles} target="_blank" rel="noopener noreferrer">Campeonatos oficiales ↗</a>
    <a href={stadiumHistory} target="_blank" rel="noopener noreferrer">Historia del estadio ↗</a>
    <a href={legendsSource} target="_blank" rel="noopener noreferrer">Números retirados ↗</a>
    <a href={title2023} target="_blank" rel="noopener noreferrer">Cuarta corona 2023 ↗</a>
    <a href={hall} target="_blank" rel="noopener noreferrer">Salón de la Fama nacional ↗</a>
   </div>
  </footer>
 </section>;
}
