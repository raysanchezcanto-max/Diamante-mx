import type { Metadata } from "next";
import { getTeamLogo } from "@/lib/teamLogos";
import LmbClubTabs, { type LmbClubView } from "@/components/LmbClubTabs";
import LmpAlgodonerosEditorialHistory from "@/components/LmpAlgodonerosEditorialHistory";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
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
          <section className="clubPanel clubCalendarPanel">
            <span className="clubKicker">{COPY.summary.calendarKicker("LMP")}</span>
            <h2>{COPY.summary.calendarTitle}</h2>
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

          <section className="clubPanel clubRecordPanel">
            <span className="clubKicker">TEMPORADA REGULAR 2026–27 · LMP</span>
            <h2>{COPY.summary.recordTitle}</h2>
            <div className="clubRecordGrid">
              <div><strong>{record?.wins??"—"}</strong><span>GANADOS</span></div>
              <div><strong>{record?.losses??"—"}</strong><span>PERDIDOS</span></div>
              <div><strong>{record?.pct??"—"}</strong><span>PCT</span></div>
            </div>
            <p>Registro oficial de temporada 2026; consulta automática. No representa el marcador de un juego en vivo.</p>
            {record&&<p>Posición calculada por porcentaje de victorias: {record.standing}.ª</p>}
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
            <div className="clubSectionTitle"><div><span className="clubKicker">NOTICIAS · ALGODONEROS DE GUASAVE</span><h2>{COPY.summary.newsTitle}</h2></div></div>
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
            <div className="clubSectionTitle"><div><span className="clubKicker">{COPY.summary.videosKicker("LMP")}</span><h2>{COPY.summary.videosTitle}</h2></div></div>
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
            <div className="clubSideHeading"><h2>{COPY.summary.headlineTitle}</h2><span>LMP</span></div>
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
        <div className="clubSectionTitle"><div><span className="clubKicker">PLANTILLA · FUENTE OFICIAL LMP · 2026–27</span><h2>{COPY.roster.title(name)}</h2></div>
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
        <div className="clubSectionTitle"><div><span className="clubKicker">{COPY.movements.kicker("LMP")}</span><h2>{COPY.movements.title(name)}</h2></div><a href={official} target="_blank" rel="noopener noreferrer">Fuente oficial ↗</a></div>
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

      {view==="grandes-ligas"&&<section className="clubBigLeagues clubDirectoryMlb" aria-labelledby="lmpGuasaveMlbTitle">
        <header className="clubBigLeaguesHeader">
          <div><span className="clubKicker">{COPY.mlb.kicker}</span>
            <h2 id="lmpGuasaveMlbTitle">{COPY.mlb.title(name)}</h2>
            <p>{COPY.mlb.intro}</p>
          </div>
          <div className="clubBigLeaguesHeaderMark" aria-hidden="true">
            {logo?<img className="clubToMlbHeroLogo" src={logo} alt="" width={65} height={65}/>:<span>GSV</span>}
            <strong>→</strong><span>MLB</span>
          </div>
        </header>
        <div className="clubBigLeaguesSummary" aria-label="Trayectorias documentadas">
          <div><strong>01</strong><span>Debut posterior en MLB verificado</span></div>
          <div><strong>03</strong><span>Jugadores con experiencia MLB previa</span></div>
          <div><strong>01</strong><span>Prospecto de MiLB documentado</span></div>
        </div>

        <div className="clubBigLeaguesSectionHead">
          <span className="clubKicker">{COPY.mlb.debutKicker}</span>
          <h3>{COPY.mlb.debutTitle}</h3>
        </div>
        <div className="clubBigLeaguesProspects">
          <article className="clubBigLeaguesProspect">
            <div className="clubBigLeaguesProspectHeader">
              <span className="clubBigLeaguesInitials" aria-hidden="true">DA</span>
              <span className="clubBigLeaguesYear">2025</span>
            </div>
            <span className="clubBigLeaguesStatus">DEBUT MLB CONFIRMADO</span>
            <h4>Drew Avans</h4>
            <span className="clubBigLeaguesProspectOrganization">Athletics · 27/05/2025</span>
            <p>Jugó con Guasave desde 2024–25 y debutó en Grandes Ligas el 27 de mayo de 2025. La cronología acredita su debut posterior, pero no un traspaso directo de derechos desde LMP.</p>
            <a href="https://www.mlb.com/player/drew-avans-682183" target="_blank" rel="noopener noreferrer">Ver debut en fuente oficial ↗</a>
            <a className="lmpClubSecondSource" href="https://losalgodoneros.com/drew-avans-retorna-con-algodoneros-tras-debutar-en-grandes-ligas/" target="_blank" rel="noopener noreferrer">Ver vínculo con Algodoneros ↗</a>
          </article>
        </div>

        <div className="clubBigLeaguesSectionHead">
          <span className="clubKicker">EXPERIENCIA PREVIA EN GRANDES LIGAS</span>
          <h3>Jugaron en MLB antes de llegar al club</h3>
        </div>
        <p className="clubBigLeaguesNote">Estos peloteros pertenecen a la historia de Guasave, pero no se presentan como prospectos exportados por el equipo, porque su debut en MLB fue anterior a su participación documentada en Algodoneros.</p>
        <div className="clubBigLeaguesProspects clubToMlbProspectGrid">
          {[
            {name:"Jacob Nix",initials:"JN",year:"2018",org:"San Diego Padres",role:"Lanzador derecho",detail:"Debutó en MLB en 2018 y después se integró a Guasave en 2025–26. El club confirmó su incorporación al cuerpo de abridores.",club:"https://losalgodoneros.com/jacob-nix-se-integra-al-cuerpo-de-abridores-de-algodoneros/",mlb:"https://www.mlb.com/player/jacob-nix-656798"},
            {name:"Domingo Acevedo",initials:"DA",year:"2021",org:"Oakland Athletics",role:"Lanzador derecho",detail:"Debutó en MLB en 2021 y se unió a la rotación de Guasave durante 2025–26 tras su experiencia con Oakland.",club:"https://losalgodoneros.com/domingo-acevedo-redondea-la-rotacion-abridora-de-los-algodoneros/",mlb:"https://www.mlb.com/player/domingo-acevedo-642758"},
            {name:"Noé Muñoz",initials:"NM",year:"1995",org:"Los Angeles Dodgers",role:"Receptor histórico",detail:"Debutó en MLB con Dodgers en 1995. El club documenta su paso por Guasave y su entronización en el Salón de la Fama del Beisbol Mexicano.",club:"https://losalgodoneros.com/un-algodonero-con-marca-de-salon-de-la-fama/",mlb:"https://www.mlb.com/player/noe-munoz-477510"}
          ].map(player=><article className="clubBigLeaguesProspect" key={player.name}>
            <div className="clubBigLeaguesProspectHeader">
              <span className="clubBigLeaguesInitials" aria-hidden="true">{player.initials}</span>
              <span className="clubBigLeaguesYear">{player.year}</span>
            </div>
            <span className="clubBigLeaguesStatus clubBigLeaguesStatus-minor">DEBUT MLB PREVIO AL PASO POR GUASAVE</span>
            <h4>{player.name}</h4>
            <span className="clubBigLeaguesProspectOrganization">{player.role} · {player.org}</span>
            <p>{player.detail}</p>
            <a href={player.mlb} target="_blank" rel="noopener noreferrer">Ver historial MLB ↗</a>
            <a className="lmpClubSecondSource" href={player.club} target="_blank" rel="noopener noreferrer">Ver fuente del club ↗</a>
          </article>)}
        </div>

        <div className="clubBigLeaguesSectionHead">
          <span className="clubKicker">{COPY.mlb.minorKicker}</span>
          <h3>{COPY.mlb.minorTitle}</h3>
        </div>
        <p className="clubBigLeaguesNote">Una firma con una organización estadounidense o la participación en MiLB no equivalen a un debut en MLB ni confirman un contrato vigente.</p>
        <div className="clubBigLeaguesProspects">
          <article className="clubBigLeaguesProspect">
            <div className="clubBigLeaguesProspectHeader"><span className="clubBigLeaguesInitials" aria-hidden="true">IM</span><span className="clubBigLeaguesYear">2025</span></div>
            <span className="clubBigLeaguesStatus clubBigLeaguesStatus-minor">LIGAS MENORES · SIN DEBUT MLB CONFIRMADO</span>
            <h4>Ian Medina</h4>
            <span className="clubBigLeaguesProspectOrganization">Lanzador · Miami Marlins (liga Rookie)</span>
            <p>El club documentó su actividad en la liga Rookie de Miami durante 2025. Este dato no acredita participación en Grandes Ligas.</p>
            <a href="https://losalgodoneros.com/ian-medina-suma-cuatro-rescates-en-la-liga-rookie-con-los-marlins/" target="_blank" rel="noopener noreferrer">{COPY.mlb.sourceLabel}</a>
          </article>
        </div>

        <div className="clubBigLeaguesFooter">
          <strong>Una trayectoria de ida no es lo mismo que una de regreso</strong>
          <p>Presentamos por separado los debuts MLB posteriores al paso por Guasave, la experiencia MLB previa a su llegada y los vínculos de desarrollo en Ligas Menores. Esta selección no pretende abarcar a todos los peloteros que han vestido ambas franelas.</p>
          <a href="https://losalgodoneros.com/" target="_blank" rel="noopener noreferrer" className="clubDirectorySource">Consultar archivo del club ↗</a>
        </div>
      </section>}

      {view==="historia"&&<LmpAlgodonerosEditorialHistory name={name} logo={logo} />}

    </div>
  </main>;
}
