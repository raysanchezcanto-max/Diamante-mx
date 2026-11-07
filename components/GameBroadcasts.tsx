import type { Broadcast } from "@/lib/broadcasts";
import type { LeagueCode } from "@/lib/teamLogos";

// Server Component: se puede transmitir en Suspense sin retrasar el
// marcador mientras se consulta el catálogo público de LMB.TV.
export default async function GameBroadcasts({
  broadcastsPromise,
  league,
  isFinal,
}: {
  broadcastsPromise: Promise<Broadcast[]>;
  league: LeagueCode;
  isFinal: boolean;
}) {
  const broadcasts = await broadcastsPromise;
  const visibleBroadcasts = isFinal
    ? broadcasts.filter(item =>
        league === "LMB" &&
        /^https:\/\/(?:www\.)?lmb\.tv\/watch\/[0-9a-f-]{36}(?:[?#].*)?$/i.test(item.url ?? "")
      )
    : broadcasts;

  if (isFinal && visibleBroadcasts.length === 0) return null;

  return (
    <section className="broadcastSection">
      <div className="broadcastHeader">
        <span className="eyebrow">{isFinal ? "REPETICIÓN OFICIAL" : "TRANSMISIÓN"}</span>
        <h2>{isFinal ? "Partido completo" : "Dónde ver"}</h2>
      </div>

      {visibleBroadcasts.length > 0 ? (
        <>
          <div className="broadcastLinks">
            {visibleBroadcasts.map((broadcast, index) => (
              broadcast.url ? (
                <a
                  key={`${broadcast.name}-${index}`}
                  href={broadcast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={broadcast.note}
                  className="watchButton"
                >
                  {isFinal
                    ? `Consultar grabación · ${broadcast.name}`
                    : broadcast.url.includes("/watch/") || broadcast.url.includes("youtube.com/watch")
                      ? `Ver transmisión · ${broadcast.name}`
                      : `Consultar ${broadcast.name}`}
                </a>
              ) : (
                <span
                  key={`${broadcast.name}-${index}`}
                  title={broadcast.note}
                  className="watchButtonDisabled"
                >
                  {broadcast.name} · Sin enlace verificado
                </span>
              )
            ))}
          </div>
          <p className="broadcastDisclaimer">
            {isFinal
              ? "Página del partido completo en LMB.TV. La reproducción puede requerir suscripción y depende de derechos regionales."
              : "Los botones abren el canal o calendario oficial indicado, no siempre el reproductor del partido. Disponibilidad según programación, región y suscripción."}
          </p>
        </>
      ) : (
        <div className="broadcastEmpty">Transmisión del partido por confirmar</div>
      )}
    </section>
  );
}
