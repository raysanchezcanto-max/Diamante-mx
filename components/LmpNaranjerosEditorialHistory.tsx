import {CLUB_PROFILE_COPY as COPY} from "@/lib/clubProfileCopy";
import type {LmpClubDefinition} from "@/lib/lmpClubDirectory";
import {getTeamLogo} from "@/lib/teamLogos";

const source="https://editor.lmp.mx/naranjeros-una-historia-de-ocho-decadas-de-grandeza/";
const titles="https://www.lmp.mx/noticias/naranjeros-gana-su-campeonato-17-en-la-liga-arco-mexicana-del-pacifico";
const caribbean="https://editor.lmp.mx/miercoles-de-serie-del-caribe-naranjeros-de-hermosillo/amp/";
const encyclopedia="https://viewer.lmp.mx/files/Enciclopedia75aniversarioLMP.pdf";
const hall="https://www.salondelafamadelbeisbolmexicano.com/inmortales-por-orden-alfabetico";
const arcadio="https://editor.lmp.mx/fallece-don-arcadio-valenzuela/";
const timeline=[
 {year:"1945–57",name:"Los orígenes en la Costa del Pacífico",description:"En Hermosillo existía béisbol invernal antes de la creación de la LMP moderna; la institución obtuvo títulos bajo distintas denominaciones.",link:source},
 {year:"1958",name:"La nueva era de la Liga Mexicana del Pacífico",description:"Naranjeros participó en los primeros años de la actual LMP, cuyas coronas se contabilizan independientemente de la antigua Liga de la Costa.",link:source},
 {year:"1960–84",name:"El legado incomparable de Héctor Espino",description:"Defendió la franela naranja durante 24 años, estableciendo marcas de bateo que transformaron la historia del club.",link:source},
 {year:"1975–76",name:"Primera Serie del Caribe ganada por México",description:"Bajo el mando de Benjamín «Cananea» Reyes, Naranjeros conquistó la Serie del Caribe de 1976 en Santo Domingo.",link:caribbean},
 {year:"2013–14",name:"Otro campeonato y segunda Serie del Caribe",description:"Hermosillo volvió a conquistar la LMP y posteriormente ganó la Serie del Caribe de 2014.",link:caribbean},
 {year:"2023–24",name:"La decimoséptima corona de LMP",description:"Naranjeros venció a Venados de Mazatlán y sumó su título número 17 de la actual Liga Mexicana del Pacífico.",link:titles},
];
const legends=[
 {name:"Héctor Espino",year:"1960–84",role:"Bateador e inmortal",description:"Figura fundamental de la institución, con 299 cuadrangulares en la pelota invernal y récords históricos de bateo.",link:source},
 {name:"Benjamín «Cananea» Reyes",year:"1975–76",role:"Mánager campeón",description:"Condujo a Hermosillo a un título LMP y al primer campeonato de México en Serie del Caribe.",link:caribbean},
 {name:"Francisco Barrios",year:"Década de 1970",role:"Lanzador histórico",description:"Integró las generaciones naranjas que ganaron campeonatos en los años setenta.",link:source},
 {name:"Vinicio Castilla",year:"2000–01",role:"Bateador histórico",description:"Fue parte de la generación que levantó el campeonato de LMP en 2000–01.",link:source},
 {name:"Erubiel Durazo",year:"2000–01",role:"Bateador campeón",description:"Formó parte de la base que devolvió la corona a Hermosillo al inicio del nuevo siglo.",link:source},
 {name:"Aaron Altherr",year:"2023–24",role:"MVP de la Serie Final",description:"Conectó dos cuadrangulares y produjo cinco carreras en la serie por el campeonato ante Mazatlán.",link:titles}
];
const initials=(value:string)=>value.split(/\s+/).filter(x=>!x.includes("«")).slice(0,2).map(x=>x[0]).join("").toUpperCase();
export default function LmpNaranjerosEditorialHistory({club}:{club:LmpClubDefinition}){
 const logo=getTeamLogo("LMP",club.id,club.name);
 return <section className="clubHistory clubDirectoryHistory">
  <header className="clubHistoryHeading"><div><span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span><h2>{COPY.history.title(club.name)}</h2><p>La historia de Naranjeros une la antigua Liga de la Costa, 17 coronas de la actual LMP y dos títulos de Serie del Caribe. Distinguimos cada etapa para no sumar campeonatos de circuitos diferentes.</p></div>{logo&&<img src={logo} alt="Escudo de Naranjeros" width={98} height={98}/>}</header>
  <div className="clubHistoryStats">
   <div><span>INICIO DE LA LMP MODERNA</span><strong>1958</strong><small>Antecedentes del equipo desde 1945</small></div>
   <div><span>CAMPEONATOS LMP</span><strong>17</strong><small>Hasta la temporada 2025–26</small></div>
   <div><span>SERIES DEL CARIBE</span><strong>02</strong><small>1976 · 2014</small></div>
  </div>
  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.recordKicker}</span><h3>{COPY.history.recordTitle("Liga Mexicana del Pacífico")}</h3></div><span className="clubHistoryNote">17 coronas de LMP · era moderna</span></div>
  <div className="clubHistoryChampions">
   {[club.championships[0],club.championships[club.championships.length-1]].map((season,i)=><article className="clubHistoryChampionCard" key={season}>
    <span className="clubHistoryStar" aria-hidden="true">★</span><span className="clubHistoryChampLabel">{i===0?COPY.history.firstCrown:COPY.history.recentCrown} · LMP</span>
    <strong>{season}</strong><h4>{i===0?COPY.history.firstGlory:COPY.history.mostRecentGlory}</h4><p>Temporada {season}, incluida en el palmarés de campeones de Naranjeros de Hermosillo.</p><a href={titles} target="_blank" rel="noopener noreferrer">Consultar palmarés ↗</a>
   </article>)}
  </div>
  <p className="clubSmallNote">Títulos LMP: {club.championships.join(" · ")}. La corona de 1956–57 corresponde a la antigua Liga de la Costa del Pacífico y no forma parte de este recuento.</p>
  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.timelineKicker}</span><h3>{COPY.history.timelineTitle}</h3></div></div>
  <ol className="clubHistoryTimeline">{timeline.map(item=><li key={item.year}><span className="clubHistoryYear">{item.year}</span><div className="clubHistoryTimelineBody"><h4>{item.name}</h4><p>{item.description}</p><a href={item.link} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a></div></li>)}</ol>
  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.figuresKicker}</span><h3>{COPY.history.figuresTitle}</h3></div></div>
  <p className="clubHistoryIntro">{COPY.history.figuresNote}</p>
  <div className="clubHistoryLegends">{legends.map(person=><article className="clubHistoryLegend" key={person.name}>
   <div className="clubHistoryLegendTop"><span className="clubHistoryLegendMonogram" aria-hidden="true">{initials(person.name)}</span><span className="clubHistoryLegendEra">{person.year}</span></div>
   <h4>{person.name}</h4><span className="clubHistoryLegendRole">{person.role}</span><p>{person.description}</p><a href={person.link} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
  </article>)}</div>
  <section className="clubHistoryHall"><div className="clubHistoryHallHeader"><div><span className="clubKicker">{COPY.history.hallKicker}</span><h3>{COPY.history.hallTitle}</h3><p>{COPY.history.hallNote}</p></div><a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a></div>
   <div className="clubHistoryHallGrid">
    {[{name:"Héctor Espino",year:1988,role:"Bateador legendario de Naranjeros",url:hall},{name:"Arcadio Valenzuela",year:2008,role:"Presidente de Naranjeros entre 1962 y 1986",url:arcadio}].map(p=><a className="clubHistoryHallMember" href={p.url} key={p.name} target="_blank" rel="noopener noreferrer"><span className="clubHistoryHallMedal" aria-hidden="true">★</span><strong>{p.name}</strong><small>{p.role}</small><span>Entronizado {p.year} ↗</span></a>)}
   </div>
  </section>
  <div className="clubHistoryOrigins"><div><span className="clubKicker">{COPY.history.stadiumKicker}</span><h3>Estadio Fernando Valenzuela</h3><p>La casa actual de Naranjeros está en Hermosillo, Sonora. La franquicia jugó durante décadas en el antiguo Estadio Héctor Espino, vinculado estrechamente con su identidad.</p><a href={encyclopedia} target="_blank" rel="noopener noreferrer">Conocer historia de las sedes ↗</a></div><div className="clubHistoryStadiumMark" aria-hidden="true"><span>ESTADIO</span><strong>2013</strong><span>INICIO DE LA NUEVA SEDE</span></div></div>
  <footer className="clubHistorySources"><span className="clubKicker">{COPY.history.sourcesKicker}</span><p>Campeonatos, hitos, figuras e inmortales respaldados por publicaciones de LMP y el Salón de la Fama. Los años de Liga de la Costa se presentan separados de la LMP moderna.</p><div><a href={source} target="_blank" rel="noopener noreferrer">Historia oficial del club ↗</a><a href={titles} target="_blank" rel="noopener noreferrer">Palmarés LMP ↗</a><a href={caribbean} target="_blank" rel="noopener noreferrer">Serie del Caribe ↗</a><a href={hall} target="_blank" rel="noopener noreferrer">Salón de la Fama ↗</a></div></footer>
 </section>;
}
