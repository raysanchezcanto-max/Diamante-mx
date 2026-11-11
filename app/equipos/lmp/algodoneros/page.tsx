import type { Metadata } from "next";
import { getTeamLogo } from "@/lib/teamLogos";
import LmbClubTabs, { type LmbClubView } from "@/components/LmbClubTabs";
import { getAlgodonerosNews, getAlgodonerosRoster, getAlgodonerosStanding, getAlgodonerosFixtures } from "@/lib/lmpAlgodonerosContent";

export const revalidate = 900;
export const metadata: Metadata = {
  title: "Algodoneros de Guasave | Equipos LMP | Diamante MX",
  description: "Noticias oficiales, plantilla 2026–27, movimientos documentados, historia y relación con Grandes Ligas de Algodoneros de Guasave."
};

const home = "/equipos/lmp/algodoneros";
const official = "https://losalgodoneros.com/";
const rosterLink = "https://losalgodoneros.com/team/algodoneros/roster";
const sections: LmbClubView[] = ["resumen","plantilla","movimientos","grandes-ligas","historia"];
const groupOrder = ["Lanzadores", "Receptores", "Jugadores del cuadro", "Jardineros", "Otros jugadores"];
const movements = [
  { date: "10 de noviembre de 2026", text: "Algodoneros inactiva a Drew Avans y activa al infielder Dalton Guthrie." },
  { date: "8 de noviembre de 2026", text: "Algodoneros activa a Adrián Gerardo Bojórquez y desactiva a José Álvarez." },
  { date: "7 de noviembre de 2026", text: "El club anuncia las activaciones de José Julián Álvarez, Jorge Sánchez, Víctor Rodríguez y Adrián Gerardo Bojórquez, y las desactivaciones de Víctor Manuel Buelna, Josué Gómez, Heber Villalobos y Saúl Vázquez." },
  { date: "5 de noviembre de 2026", text: "Algodoneros inactiva a Christian Isaías López y Víctor Rodríguez, y activa a Josué Gómez y Heber Villalobos." },
  { date: "4 de noviembre de 2026", text: "El equipo desactiva a Carlos Garzón y Yael Romero, y activa a Alberto Barriga y Christian Isaías López." }
] as const;

type Props = { searchParams: Promise<{vista?: string}> };
export default async function AlgodonerosLmpProfile({searchParams}:Props){
  const query=await searchParams;
  const view:LmbClubView = sections.includes(query.vista as LmbClubView)
    ? query.vista as LmbClubView : "resumen";
  const [news,roster,record,fixtures] = await Promise.all([
    view==="resumen"?getAlgodonerosNews():Promise.resolve([]),
    view==="plantilla"?getAlgodonerosRoster():Promise.resolve([]),
    view==="resumen"?getAlgodonerosStanding():Promise.resolve(null),
    view==="resumen"?getAlgodonerosFixtures():Promise.resolve([])
  ]);
  const name="Algodoneros de Guasave";
  const logo=getTeamLogo("LMP",5482,name);
  const topNews=news[0];
  return <main className="clubProfile clubProfile--all">
    <header className="clubTopbar">
      <a className="clubBrand" href="/?league=lmp"><span className="clubDiamond" aria-hidden="true">◆</span><strong>DIAMANTE <em>MX</em></strong></a>
      <a className="clubBack" href="/?league=lmp">← Volver a LMP</a>
    </header>
    <div className="clubShell">
      <div className="clubHero clubDirectoryHero">
        <div className="clubHeroIdentity">
          <div className="clubHeroLogo">{logo?<img src={logo} width={108} height={108} alt="" />:<span aria-hidden="true">⚾</span>}</div>
          <div className="clubHeroText">
            <span className="clubKicker">EQUIPOS · LIGA MEXICANA DEL PACÍFICO</span>
            <h1>{name}</h1>
            <p>Guasave, Sinaloa · Temporada 2026–27 · Béisbol invernal</p>
          </div>
        </div>
        <div className="clubHeroMeta">
          <div><span>ESTADIO</span><strong>Kuroda Park</strong></div>
          <div><span>CAPACIDAD</span><strong>8,000 espectadores</strong>
            <a className="clubCapacitySource" href="https://www.kuroda.com/kuroda-park" target="_blank" rel="noopener noreferrer">Información del recinto ↗</a>
          </div>
          <div className="clubHeroLinks">
            <a href={official} target="_blank" rel="noopener noreferrer">Sitio oficial ↗</a>
            <a href="https://losalgodoneros.com/noticias/" target="_blank" rel="noopener noreferrer">Noticias ↗</a>
          </div>
        </div>
      </div>
      <LmbClubTabs home={home} clubName={name} currentView={view}/>

      {view==="resumen"&&<div className="clubContentGrid">
        <aside className="clubSideLeft">
          <section className="clubPanel clubRecordPanel">
            <span className="clubKicker">TEMPORADA REGULAR 2026–27 · LMP</span>
            <h2>Balance del equipo</h2>
            <div className="clubRecordGrid">
              <div><strong>{record?.wins??"—"}</strong><span>GANADOS</span></div>
              <div><strong>{record?.losses??"—"}</strong><span>PERDIDOS</span></div>
              <div><strong>{record?.pct??"—"}</strong><span>PCT</span></div>
            </div>
            <p>Registro oficial de temporada 2026; consulta automática. No representa el marcador de un juego en vivo.</p>
            {record&&<p>Posición calculada por porcentaje de victorias: {record.standing}.ª</p>}
          </section>
          <section className="clubPanel clubCalendarPanel">
            <span className="clubKicker">CALENDARIO · LMP</span>
            <h2>Próximos partidos</h2>
            <div className="lmpClubCalendarDesktop">
              {fixtures.length ? <div className="lmpClubUpcomingList">
                {fixtures.map(game=><a key={game.id} href={"/game/lmp/"+game.id} className="lmpClubUpcomingGame">
                  <span>{new Intl.DateTimeFormat("es-MX",{timeZone:"America/Mexico_City",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",hour12:true}).format(new Date(game.startTime))}</span>
                  <strong>{game.home?"vs. ":"@ "}{game.opponent}</strong>
                  <small>{game.home?"LOCAL":"VISITANTE"} · {game.venue}</small>
                </a>)}
              </div>:<p>La fuente no devolvió próximos partidos verificables en esta consulta.</p>}
              <a href="/?league=lmp#juegos">Calendario completo LMP ↗</a>
            </div>
            <details className="lmpClubCalendarMobile">
              <summary className="lmpClubCalendarToggle">
                <span>{fixtures.length ? "Ver próximos "+fixtures.length+" juegos" : "Consultar próximos juegos"}</span>
                <span className="lmpClubCalendarChevron" aria-hidden="true">⌄</span>
              </summary>
              <div className="lmpClubCalendarExpanded">
                {fixtures.length ? <div className="lmpClubUpcomingList">
                  {fixtures.map(game=><a key={game.id} href={"/game/lmp/"+game.id} className="lmpClubUpcomingGame">
                    <span>{new Intl.DateTimeFormat("es-MX",{timeZone:"America/Mexico_City",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",hour12:true}).format(new Date(game.startTime))}</span>
                    <strong>{game.home?"vs. ":"@ "}{game.opponent}</strong>
                    <small>{game.home?"LOCAL":"VISITANTE"} · {game.venue}</small>
                  </a>)}
                </div>:<p>La fuente no devolvió próximos partidos verificables en esta consulta.</p>}
                <a href="/?league=lmp#juegos">Calendario completo LMP ↗</a>
              </div>
            </details>
          </section>
        </aside>
        <div className="clubMainColumn">
          {topNews?<section className="clubFeature" aria-label="Noticia destacada de Algodoneros">
            {topNews.image?<img src={topNews.image} className="clubFeatureImage" alt="" loading="lazy"/>:
              <div className="clubDirectoryHeroBadge">{logo?<img src={logo} width={140} height={140} alt=""/>:"⚾"}</div>}
            <div className="clubFeatureShade"/>
            <div className="clubFeatureContent">
              <span className="clubKicker">NOTICIA DESTACADA · SITIO OFICIAL ALGODONEROS</span>
              <h2>{topNews.title}</h2>
              <p>{topNews.excerpt||"Publicación del sitio oficial del equipo."}</p>
              <a href={topNews.url} target="_blank" rel="noopener noreferrer">Leer nota oficial ↗</a>
            </div>
          </section>:<section className="clubDirectoryNotice"><h2>Noticias oficiales</h2><p>El sitio oficial no devolvió publicaciones en esta consulta.</p><a href="https://losalgodoneros.com/noticias/" target="_blank" rel="noopener noreferrer">Consultar noticias ↗</a></section>}
          <section className="clubEditorialSection">
            <div className="clubSectionTitle"><div><span className="clubKicker">NOTICIAS · ALGODONEROS DE GUASAVE</span><h2>Actualidad del equipo</h2></div></div>
            <p className="clubSmallNote">Publicaciones automáticas del sitio oficial, con actualización aproximada cada 15 minutos.</p>
            <div className="clubNewsGrid">
              {news.slice(1,5).map(story=><a className="clubNewsCard" href={story.url} key={story.url} target="_blank" rel="noopener noreferrer">
                {story.image&&<img className="clubNewsThumb" src={story.image} alt="" loading="lazy"/>}
                <span>{story.published.slice(0,10)||"Sitio oficial"}</span>
                <strong>{story.title}</strong>
                <small>Leer noticia ↗</small>
              </a>)}
            </div>
          </section>
          <section className="clubEditorialSection">
            <div className="clubSectionTitle"><div><span className="clubKicker">COBERTURA AUDIOVISUAL · LMP</span><h2>Videos oficiales de Algodoneros</h2></div></div>
            <p className="clubSmallNote">Selección verificada de resúmenes del canal oficial de LMP. Estos clips corresponden a los juegos de Guasave del 7 de noviembre de 2026, no a transmisiones en vivo.</p>
            <div className="clubVideoGrid">
              {[
                {id:"54B29JD_lGo",title:"Naranjeros vs. Algodoneros · Juego 1",date:"7 de noviembre de 2026"},
                {id:"3HX6hEqbdto",title:"Naranjeros vs. Algodoneros · Juego 2",date:"7 de noviembre de 2026"}
              ].map(video=><a key={video.id} href={"https://www.youtube.com/watch?v="+video.id} className="clubVideoCard" target="_blank" rel="noopener noreferrer">
                <div className="clubVideoPoster clubVideoPoster--clip">
                  <img src={"https://i.ytimg.com/vi/"+video.id+"/hqdefault.jpg"} alt="" className="clubVideoThumbnail" loading="lazy"/>
                  <span aria-hidden="true">▶</span><small>RESUMEN OFICIAL</small>
                </div><strong>{video.title}</strong><small>{video.date}</small>
              </a>)}
            </div>
            <a className="clubDirectorySource" href="https://www.youtube.com/channel/UCdW_4rN3OarOoawQ4Er-ZXw/videos" target="_blank" rel="noopener noreferrer">Consultar canal oficial LMP ↗</a>
          </section>
        </div>
        <aside className="clubSideRight">
          <section className="clubPanel">
            <div className="clubSideHeading"><h2>Titulares</h2><span>LMP</span></div>
            <div className="clubHeadlines">
              {news.slice(5,8).map((story,i)=><a href={story.url} key={story.url} target="_blank" rel="noopener noreferrer">
                <span className="clubHeadlineIndex">{String(i+1).padStart(2,"0")}</span><strong>{story.title}</strong>
              </a>)}
            </div>
            {!news.length&&<p className="clubSmallNote">Sin publicaciones verificadas en este momento.</p>}
          </section>
          <section className="clubPanel">
            <div className="clubSideHeading"><h2>Historia</h2><span>GUASAVE</span></div>
            <p className="clubSmallNote">Fundado en 1970 en la LMP; campeón en 1971–72. Consulta su historia documentada.</p>
            <a className="clubDirectoryDetailLink" href={home+"?vista=historia"}>Historia del equipo ↗</a>
          </section>
        </aside>
      </div>}

      {view==="plantilla"&&<section className="clubRosterContent">
        <div className="clubSectionTitle"><div><span className="clubKicker">PLANTILLA · FUENTE OFICIAL LMP · 2026–27</span><h2>Jugadores de {name}</h2></div>
          <a href={rosterLink} target="_blank" rel="noopener noreferrer">Plantilla del club ↗</a></div>
        <p className="clubSmallNote">Plantilla activa obtenida directamente del servicio oficial de LMP, con fotografía, nombre, dorsal, posición y datos biográficos disponibles. Los registros pueden cambiar durante la temporada.</p>
        {roster.length?<div className="clubRosterGrid">
          {groupOrder.map(group=>{
            const players=roster.filter(player=>player.group===group);
            return players.length?<section className="clubRosterGroup" key={group}>
              <h3>{group} <span>{players.length}</span></h3>
              <div className="clubRosterPlayers">{players.map(player=><div className="clubRosterPlayer" key={player.id}>
                <span className="clubRosterAvatar lmpClubPlayerAvatar">{player.photo?<img src={player.photo} alt={"Retrato de "+player.name} width={52} height={52} loading="lazy"/>:<span aria-hidden="true">{player.name.charAt(0)}</span>}</span>
                <span className="clubRosterPlayerInfo"><strong>{player.name}</strong><small>#{player.number} · {player.position}</small>
                  <small>{[player.throws && "Lanza: "+(player.throws==="Right"?"D":player.throws==="Left"?"Z":player.throws), player.bats && "Batea: "+(player.bats==="Right"?"D":player.bats==="Left"?"Z":player.bats), player.birthDate && "Nac.: "+player.birthDate].filter(Boolean).join(" · ")}</small>
                </span>
              </div>)}</div>
            </section>:null;
          })}
        </div>:<div className="clubDirectoryNotice"><p>La API no devolvió una plantilla válida. No se agregaron jugadores de otros equipos.</p><a href={rosterLink} target="_blank" rel="noopener noreferrer">Ver plantilla oficial ↗</a></div>}
      </section>}

      {view==="movimientos"&&<section className="clubMovementsContent">
        <div className="clubSectionTitle"><div><span className="clubKicker">MOVIMIENTOS · ALGODONEROS · NOVIEMBRE 2026</span><h2>Altas y bajas del equipo</h2></div><a href={official} target="_blank" rel="noopener noreferrer">Fuente oficial ↗</a></div>
        <p className="clubSmallNote">Selección de comunicados publicados en «Últimos movimientos» por el club. Archivo verificado, no alimentación instantánea ni historial completo.</p>
        <div className="clubMovementsTimeline">
          {movements.map(item=><article className="clubMovementItem" key={item.date}>
            <div className="clubMovementDate"><span>{item.date}</span><span className="clubMovementType">Registro del club</span></div>
            <div className="clubMovementBody">{logo&&<img src={logo} alt="" width={53} height={53}/>}
              <div><h3>Movimiento de plantilla</h3><p>{item.text}</p><a href={official} target="_blank" rel="noopener noreferrer">Consultar sitio oficial ↗</a></div>
            </div>
          </article>)}
        </div>
      </section>}

      {view==="grandes-ligas"&&<section className="clubBigLeagues clubDirectoryMlb">
        <header className="clubBigLeaguesHeader"><div><span className="clubKicker">GUASAVE Y LA GRAN CARPA · FUENTES VERIFICADAS</span>
          <h2>Peloteros de Algodoneros con trayectoria en MLB</h2>
          <p>El vínculo significa que vistieron la franela de Guasave y también jugaron en Grandes Ligas. No implica que Algodoneros los transfiriera directamente a MLB ni que su debut ocurriera después de pasar por Guasave.</p>
        </div>{logo&&<img src={logo} width={72} height={72} alt=""/>}</header>
        <div className="clubBigLeaguesSummary">
          <div><strong>04</strong><span>Casos documentados con paso por MLB</span></div>
          <div><strong>01</strong><span>Prospecto documentado en MiLB, sin debut acreditado</span></div>
        </div>
        <div className="clubBigLeaguesSectionHead"><span className="clubKicker">JUGARON EN GRANDES LIGAS</span><h3>Trayectorias verificadas</h3></div>
        <div className="clubBigLeaguesProspects clubToMlbProspectGrid">
          {[
            {name:"Drew Avans",role:"Jardinero",org:"Athletics y Milwaukee Brewers",detail:"Jugó con Guasave desde 2024–25; debutó en MLB el 27 de mayo de 2025 con Athletics y también jugó para Milwaukee. No fue un traspaso directo desde LMP.",club:"https://losalgodoneros.com/drew-avans-retorna-con-algodoneros-tras-debutar-en-grandes-ligas/",mlb:"https://www.mlb.com/player/drew-avans-682183"},
            {name:"Jacob Nix",role:"Lanzador derecho",org:"San Diego Padres",detail:"Participó en MLB con Padres en 2018 y se incorporó a los Algodoneros durante la campaña invernal 2025–26. Su etapa MLB fue anterior a Guasave.",club:"https://losalgodoneros.com/jacob-nix-se-integra-al-cuerpo-de-abridores-de-algodoneros/",mlb:"https://www.mlb.com/player/jacob-nix-656798"},
            {name:"Domingo Acevedo",role:"Lanzador derecho",org:"Oakland Athletics",detail:"El club documentó su incorporación en diciembre de 2025 después de su experiencia de tres temporadas en MLB con Oakland. Su debut en Grandes Ligas fue previo.",club:"https://losalgodoneros.com/domingo-acevedo-redondea-la-rotacion-abridora-de-los-algodoneros/",mlb:"https://www.mlb.com/player/domingo-acevedo-642758"},
            {name:"Noé Muñoz",role:"Receptor histórico",org:"Los Angeles Dodgers",detail:"El club reconoce su trayectoria con Algodoneros y documenta su breve participación en MLB con Los Angeles Dodgers en 1995. También integra el Salón de la Fama del Beisbol Mexicano.",club:"https://losalgodoneros.com/noe-munoz-una-muralla-que-tuvo-algodoneros-detras-del-home/",mlb:"https://www.mlb.com/player/noe-munoz-477510"}
          ].map(p=><article key={p.name} className="clubBigLeaguesProspect">
            <span className="clubBigLeaguesStatus">MLB · PARTICIPACIÓN DOCUMENTADA</span>
            <h4>{p.name}</h4>
            <span className="clubBigLeaguesProspectOrganization">{p.role} · {p.org}</span>
            <p>{p.detail}</p>
            <a href={p.club} target="_blank" rel="noopener noreferrer">Fuente: Algodoneros de Guasave ↗</a>
            <a href={p.mlb} target="_blank" rel="noopener noreferrer" className="lmpClubSecondSource">Ficha / historial MLB ↗</a>
          </article>)}
        </div>
        <div className="clubBigLeaguesSectionHead"><span className="clubKicker">DESARROLLO EN ESTADOS UNIDOS</span><h3>Prospectos vinculados a MiLB</h3></div>
        <div className="clubBigLeaguesProspects">
          <article className="clubBigLeaguesProspect">
            <span className="clubBigLeaguesStatus clubBigLeaguesStatus-minor">LIGAS MENORES · NO DEBUT MLB</span>
            <h4>Ian Medina</h4><span className="clubBigLeaguesProspectOrganization">Lanzador · Miami Marlins (nivel Rookie)</span>
            <p>Algodoneros documentó su actividad de 2025 en la liga Rookie de Miami y su participación en pretemporada con Guasave. Este registro no acredita debut en MLB.</p>
            <a href="https://losalgodoneros.com/ian-medina-suma-cuatro-rescates-en-la-liga-rookie-con-los-marlins/" target="_blank" rel="noopener noreferrer">Ver publicación oficial ↗</a>
          </article>
        </div>
        <p className="clubSmallNote">Selección histórica documentada, no registro completo de todos los jugadores del club ni lista de contratos vigentes.</p>
      </section>}

      {view==="historia"&&<section className="clubHistory clubDirectoryHistory">
        <header className="clubHistoryHeading"><div><span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span>
          <h2>La historia de los Algodoneros de Guasave</h2>
          <p>El equipo representa a Guasave, Sinaloa, en la pelota invernal mexicana desde 1970. Su afición blanquiazul y Kuroda Park son parte de la identidad del club.</p>
        </div>{logo&&<img src={logo} alt="Escudo de Algodoneros" width={98} height={98}/>}</header>
        <div className="clubHistoryStats">
          <div><span>INGRESO A LMP</span><strong>1970</strong><small>Inicio de su historia en el circuito</small></div>
          <div><span>TÍTULOS LMP</span><strong>01</strong><small>Campeonato 1971–72</small></div>
          <div><span>ESTADIO</span><strong className="clubDirectoryStadiumText">Kuroda Park</strong><small>Nombre actual desde 2021</small></div>
        </div>
        <div className="clubEditorialSection">
          <div className="clubSectionTitle"><div><span className="clubKicker">MOMENTOS DOCUMENTADOS</span><h2>Legado del club</h2></div></div>
          <p>El club conquistó la LMP en la temporada 1971–72 y disputó cinco series finales a lo largo de su historia, según la información del recinto que alberga sus juegos.</p>
          <p>Su estadio fue renovado en 2019 y adoptó la denominación Kuroda Park en 2021.</p>
          <a className="clubDirectorySource" href="https://www.kuroda.com/kuroda-park" target="_blank" rel="noopener noreferrer">Consultar historia del estadio y club ↗</a>
        </div>
        <section className="clubHistoryHall">
          <div className="clubHistoryHallHeader"><div><span className="clubKicker">RECONOCIMIENTO HISTÓRICO</span>
            <h3>Jugadores y Salón de la Fama</h3>
            <p>Los nombres se incorporan solo cuando el propio club confirma su paso por Guasave y su entronización.</p>
          </div><a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a></div>
          <div className="clubHistoryHallGrid">
            <a className="clubHistoryHallMember" href="https://losalgodoneros.com/noe-munoz-una-muralla-que-tuvo-algodoneros-detras-del-home/" target="_blank" rel="noopener noreferrer">
              <span className="clubHistoryHallMedal" aria-hidden="true">★</span>
              <strong>Noé Muñoz</strong><small>Receptor histórico; número 28 retirado por Algodoneros</small>
              <span>Entronizado en 2023 · Fuente del club ↗</span>
            </a>
          </div>
        </section>
      </section>}
    </div>
  </main>;
}
