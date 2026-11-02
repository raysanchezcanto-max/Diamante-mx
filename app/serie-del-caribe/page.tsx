import type { Metadata } from "next";

import LeagueTabs from "@/components/LeagueTabs";
import SmartHeader from "@/components/SmartHeader";
import {
  CARIBE_2027,
  CARIBE_2027_PARTICIPANTS,
  CARIBE_2027_STAGES,
} from "@/lib/caribe";

export const metadata: Metadata = {
  title: "Serie del Caribe 2027 | Diamante MX",
  description:
    "Sede, fechas y camino a la Serie del Caribe Hermosillo 2027, en Diamante MX.",
};

export const dynamic = "force-dynamic";

export default function SerieDelCaribePage() {
  const now = Date.now();
  const tournamentStart = new Date(CARIBE_2027.start).getTime();
  const tournamentEnd = new Date(CARIBE_2027.endExclusive).getTime();
  const daysUntil = Math.max(
    0,
    Math.ceil((tournamentStart - now) / (24 * 60 * 60 * 1000))
  );

  const status =
    now < tournamentStart
      ? "PRÓXIMO"
      : now < tournamentEnd
        ? "FECHAS DEL TORNEO"
        : "EDICIÓN CONCLUIDA";

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Diamante MX inicio">
          <span className="diamond">◆</span>
          <span><strong>DIAMANTE</strong><em>MX</em></span>
        </a>
        <nav>
          <a href="#juegos">Serie</a>
          <a href="#participantes">Participantes</a>
          <a href="#formato">Formato</a>
        </nav>
      </header>

      <SmartHeader />

      <div className="hero" id="top">
        <div className="heroCopy">
          <span className="eyebrow">TODO EL BÉISBOL · UN SOLO DIAMANTE</span>
          <h1>El juego se vive<br /><span>dato a dato.</span></h1>
          <p>
            Marcadores, posiciones y líderes de bateo en una experiencia
            pensada para aficionados del béisbol.
          </p>
        </div>
        <div className="heroMark" aria-hidden="true">◆</div>
      </div>

      <LeagueTabs activeLeague="CARIBE" />

      <section className="section" id="juegos">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">SERIE DEL CARIBE · CAMPEÓN 2026</span>
            <h2>El último campeón</h2>
          </div>
        </div>

        <div className="caribeChampion">
          <img
            src="/logos/lmp/charros-jalisco.png"
            alt="Escudo de Charros de Jalisco"
          />
          <div>
            <span className="eyebrow">🏆 CAMPEÓN SERIE DEL CARIBE 2026</span>
            <strong>Charros de Jalisco</strong>
            <p>12–11 ante Tomateros de Culiacán · Zapopan, Jalisco</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">EDICIÓN {CARIBE_2027.edition} · {status}</span>
            <h2>Hermosillo 2027</h2>
          </div>
        </div>

        <div className="caribeIntro">
          <div>
            <span className="eyebrow">PRÓXIMA SERIE DEL CARIBE</span>
            <h3>{CARIBE_2027.dateLabel}</h3>
            <p>
              {CARIBE_2027.ballpark} · {CARIBE_2027.host}
            </p>
            <p className="caribeStatusMessage">
              Fechas generales confirmadas. El rol de juegos y los horarios
              de cada encuentro están pendientes de publicación oficial.
            </p>
          </div>
          <div className="caribeCountdown">
            {now < tournamentStart ? (
              <>
                <strong>{daysUntil}</strong>
                <span>DÍAS PARA LA SERIE DEL CARIBE</span>
              </>
            ) : (
              <>
                <strong>2027</strong>
                <span>{status}</span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="section" id="participantes">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">CLASIFICACIÓN INTERNACIONAL</span>
            <h2>Países participantes</h2>
          </div>
        </div>

        <p className="caribeFootnote">
          Cada liga miembro enviará a su campeón de la temporada 2026–2027.
          Los clubes representantes todavía están por definirse.
        </p>

        <div className="caribeCountryGrid">
          {CARIBE_2027_PARTICIPANTS.map((participant) => (
            <div className="caribeCountry" key={participant.country}>
              <div className="caribeCountryTop">
                <span aria-hidden="true">{participant.flag}</span>
                <strong>{participant.country}</strong>
              </div>
              <p>{participant.league}</p>
              <small>REPRESENTANTE POR CONFIRMAR</small>
            </div>
          ))}
          <div className="caribeCountry">
            <div className="caribeCountryTop">
              <span aria-hidden="true">🌎</span>
              <strong>País invitado</strong>
            </div>
            <p>Anuncio pendiente de la Confederación</p>
            <small>PARTICIPACIÓN POR CONFIRMAR</small>
          </div>
        </div>
      </section>

      <section className="section" id="formato">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">CAMINO A LA GRAN FINAL</span>
            <h2>Fases previstas</h2>
          </div>
        </div>

        <div className="caribePhases">
          {CARIBE_2027_STAGES.map((stage, index) => (
            <div className="caribePhase" key={stage.name}>
              <span>FASE {index + 1}</span>
              <strong>{stage.name}</strong>
              <p>{stage.dates}</p>
            </div>
          ))}
        </div>

        <p className="caribeFootnote">
          Las fases proceden del anuncio de la CBPC. No se asignan partidos
          ni horas hasta disponer del calendario oficial 2027.
        </p>

        <a
          className="caribeOfficialLink"
          href={CARIBE_2027.officialSource}
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar anuncio oficial ↗
        </a>
      </section>

      <footer>
        <div className="brand small">
          <span className="diamond">◆</span>
          <span><strong>DIAMANTE</strong><em>MX</em></span>
        </div>
        <p>Proyecto independiente de estadísticas de béisbol.</p>
      </footer>
    </main>
  );
}
