import { getTeamDisplayName } from "@/lib/teamLogos";
import type { Metadata } from "next";

import LeagueTeamExplorer from "@/components/LeagueTeamExplorer";
import CaribeFixtures from "@/components/CaribeFixtures";
import CaribeSemifinals from "@/components/CaribeSemifinals";
import CaribeFinalGameCard from "@/components/CaribeFinalGameCard";
import { getCaribeTournament2027, resolveCaribeFinalWinner } from "@/lib/caribeTournament";
import SmartHeader from "@/components/SmartHeader";
import AutoRefresh from "@/components/AutoRefresh";
import {
  CARIBE_2027,
  CARIBE_2027_PARTICIPANTS,
} from "@/lib/caribe";

export const metadata: Metadata = {
  title: "Serie del Caribe 2027 | Diamante MX",
  description:
    "Sede, fechas y camino a la Serie del Caribe Hermosillo 2027, en Diamante MX.",
};

export const dynamic = "force-dynamic";

export default async function SerieDelCaribePage({
  searchParams,
}: {
  searchParams?: Promise<{ teams?: string }>;
}) {
  const params = await searchParams;
  const tournament = await getCaribeTournament2027();
  const finalMatch = tournament?.matches.find((match) => match.phase === "final") ?? null;
  const finalChampion = resolveCaribeFinalWinner(finalMatch);
  const showFinalCard = !!finalMatch?.home && !!finalMatch?.away && !finalChampion;
  const championLogo = finalChampion
    ? finalChampion.winner.logoSrc ?? finalChampion.winner.flagSrc ?? null
    : "/logos/lmp/charros-jalisco.png";
  const now = Date.now();
  const tournamentStart = new Date(CARIBE_2027.start).getTime();
  const tournamentEnd = new Date(CARIBE_2027.endExclusive).getTime();
  const tournamentStarted = now >= tournamentStart;
  // Ocultar tarjetas vacías hasta que un proveedor oficial entregue
  // al menos un enfrentamiento real y confirmado de cada fase.
  const hasOfficialFixtures = Boolean(tournament?.matches.some(
    (game) =>
      (game.phase === "roundRobin" || game.phase === "thirdPlace") &&
      game.home &&
      game.away
  ));
  const hasOfficialSemifinals = Boolean(tournament?.matches.some(
    (game) =>
      game.phase === "semifinal" &&
      game.home &&
      game.away
  ));
  // Sin un calendario enlazado no retiramos al último campeón,
  // incluso si ya pasó la fecha de inicio.
  const showActiveTournament = tournamentStarted && (
    hasOfficialFixtures ||
    hasOfficialSemifinals ||
    showFinalCard ||
    Boolean(finalChampion)
  );
  const showChampion = !showActiveTournament || Boolean(finalChampion);
  const hasLiveGame = tournament?.matches.some((game) =>
    game.state === "Live" || game.state === "Warmup"
  ) ?? false;
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
      <AutoRefresh
        enabled={hasLiveGame || (tournamentStarted && hasOfficialFixtures && !finalChampion)}
        intervalMs={hasLiveGame ? 15000 : 60000}
      />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Diamante MX inicio">
          <span className="diamond">◆</span>
          <span><strong>DIAMANTE</strong><em>MX</em></span>
        </a>
        <nav>
          {hasOfficialFixtures && <a href="#juegos">Juegos</a>}
          <a href="#participantes">Participantes</a>
          {hasOfficialSemifinals && <a href="#semifinales">Semifinales</a>}
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

      <LeagueTeamExplorer
        key="CARIBE"
        activeLeague="CARIBE"
        initiallyOpen={params?.teams === "1"}
        participants={[...CARIBE_2027_PARTICIPANTS]}
      />

      <section className="section caribeBroadcastSection" aria-label="Transmisiones Serie del Caribe 2027">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">TRANSMISIÓN · HERMOSILLO 2027</span>
            <h2>Dónde ver</h2>
          </div>
        </div>
        <p className="broadcastDisclaimer">
          La televisión y el streaming para la Serie del Caribe 2027 todavía no están confirmados.
          Los canales que transmitieron en 2026 no se atribuyen automáticamente a Hermosillo 2027.
        </p>
        <div className="broadcastLinks">
          <a className="watchButton" href="https://www.seriedelcaribe.net/"
             target="_blank" rel="noopener noreferrer">Consultar anuncios oficiales</a>
        </div>
      </section>

      {tournamentStarted && showFinalCard && finalMatch && (
        <CaribeFinalGameCard game={finalMatch} />
      )}

      {tournamentStarted && hasOfficialFixtures && !finalChampion && (
        <CaribeFixtures tournament={tournament} started />
      )}

      {tournamentStarted && hasOfficialSemifinals && !finalChampion && (
        <CaribeSemifinals tournament={tournament} />
      )}

      {showChampion && (
      <section className="section caribeChampionSection" id="campeon">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">SERIE DEL CARIBE · CAMPEÓN {finalChampion ? "2027" : "2026"}</span>
            <h2>{finalChampion ? "Campeón Serie del Caribe 2027" : "El último campeón"}</h2>
          </div>
        </div>

        <div className="championCardPro caribeChampionCard">
          <div className="championGlow championGlowLeft" aria-hidden="true" />
          <div className="championGlow championGlowRight" aria-hidden="true" />
          <div className="championPattern" aria-hidden="true" />

          <div className="championCardTop">
            <span className="championBadge">
              🏆 CAMPEÓN SERIE DEL CARIBE {finalChampion ? "2027" : "2026"}
            </span>
            <span className="championChip">{finalChampion ? "HERMOSILLO 2027" : "ZAPOPAN 2026"}</span>
          </div>

          <div className="championCardBody">
            <div className="championTrophy">
              {championLogo ? (
                <img
                  src={championLogo}
                  alt={finalChampion ? `Emblema de ${getTeamDisplayName("CARIBE", finalChampion.winner.name)}` : "Escudo de Charros de Jalisco"}
                  className="championTeamLogo"
                />
              ) : (
                <span aria-label="Campeón" role="img">🏆</span>
              )}
            </div>
            <h3 className="championTeamName">{finalChampion?.winner.name ? getTeamDisplayName("CARIBE", finalChampion.winner.name) : "Charros de Jalisco"}</h3>
            <div className="championResultPill">
              <span className="championResultLabel">
                RESULTADO DE LA FINAL
              </span>
              <strong className="championResultText">
                {finalChampion
                  ? `${getTeamDisplayName("CARIBE", finalChampion.winner.name)} ${finalChampion.winnerScore} – ${finalChampion.runnerUpScore} ${getTeamDisplayName("CARIBE", finalChampion.runnerUp.name)}`
                  : "Charros de Jalisco 12 – 11 Tomateros de Culiacán"}
              </strong>
            </div>
          </div>
        </div>
      </section>
      )}

      {tournamentStarted && finalChampion && (
        <>
          {hasOfficialFixtures && (
            <CaribeFixtures tournament={tournament} started />
          )}
          {hasOfficialSemifinals && (
            <CaribeSemifinals tournament={tournament} />
          )}
        </>
      )}

      {!tournamentStarted && (
      <>
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
      </>
      )}

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

      {!tournamentStarted && (hasOfficialFixtures || hasOfficialSemifinals) && (
        <>
          {hasOfficialFixtures && (
            <CaribeFixtures tournament={tournament} started={false} />
          )}
          {hasOfficialSemifinals && (
            <CaribeSemifinals tournament={tournament} />
          )}
        </>
      )}

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
