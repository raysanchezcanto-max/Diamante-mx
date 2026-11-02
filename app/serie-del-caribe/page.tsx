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

        <div className="championCardPro caribeChampionCard">
          <div className="championGlow championGlowLeft" aria-hidden="true" />
          <div className="championGlow championGlowRight" aria-hidden="true" />
          <div className="championPattern" aria-hidden="true" />

          <div className="championCardTop">
            <span className="championBadge">
              🏆 CAMPEÓN SERIE DEL CARIBE 2026
            </span>
            <span className="championChip">ZAPOPAN 2026</span>
          </div>

          <div className="championCardBody">
            <div className="championTrophy">
              <img
                src="/logos/lmp/charros-jalisco.png"
                alt="Escudo de Charros de Jalisco"
                className="championTeamLogo"
              />
            </div>
            <h3 className="championTeamName">Charros de Jalisco</h3>
            <div className="championResultPill">
              <span className="championResultLabel">
                RESULTADO DE LA FINAL
              </span>
              <strong className="championResultText">
                Charros de Jalisco 12 – 11 Tomateros de Culiacán
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section caribeNextSection">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">EDICIÓN {CARIBE_2027.edition} · {status}</span>
            <h2>Hermosillo 2027</h2>
          </div>
        </div>
      </section>

      <div className="seasonNotice caribeSeasonNotice">
        <div>
          <span className="eyebrow">PRÓXIMA SERIE DEL CARIBE</span>
          <h3>Del 1 al 7 de febrero de 2027</h3>
          <p>{CARIBE_2027.ballpark} · {CARIBE_2027.host}</p>
          <p className="caribePendingSchedule">
            Rol de juegos y horarios por confirmar.
          </p>
        </div>

        <div className="seasonCountdown">
          {now < tournamentStart ? (
            <>
              <strong>{daysUntil}</strong>
              <span>DÍAS PARA EL PLAYBALL</span>
            </>
          ) : (
            <>
              <strong>2027</strong>
              <span>{status}</span>
            </>
          )}
        </div>
      </div>

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
                <img
                  src={participant.flagSrc}
                  alt={`Bandera de ${participant.country}`}
                  width={36}
                  height={27}
                  loading="lazy"
                />
                <strong>{participant.country}</strong>
              </div>
              <p>{participant.league}</p>
              <small>REPRESENTANTE POR CONFIRMAR</small>
            </div>
          ))}
          <div className="caribeCountry">
            <div className="caribeCountryTop">
              <span className="caribeInvitedIcon" aria-label="País invitado por confirmar" role="img">🌎</span>
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
