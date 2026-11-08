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
  // One shared postgame presentation, but only a verified LMB.TV /watch/
  // page is a full-game link. MLB.TV archive access opens a specific day's
  // catalog, and Film Room/LMP searches must never be sold as full replays.
  const visibleBroadcasts = isFinal
    ? broadcasts.filter(item =>
        (league === "LMB" && item.postgameKind === "fullReplay" &&
          /^https:\/\/(?:www\.)?lmb\.tv\/watch\/[0-9a-f-]{36}(?:[?#].*)?$/i.test(item.url ?? "")) ||
        (league === "LMP" && item.gameVideoSearch === true &&
          item.postgameKind === "gameVideos") ||
        (league === "MLB" && (item.postgameKind === "archiveLookup" ||
          item.postgameKind === "gameVideos") && !!item.url)
      )
    : broadcasts;

  if (isFinal && visibleBroadcasts.length === 0) return null;
  const hasReplay = visibleBroadcasts.some(item => item.postgameKind === "fullReplay");
  const hasArchive = visibleBroadcasts.some(item => item.postgameKind === "archiveLookup");

  return (
    <section className="broadcastSection">
      <div className="broadcastHeader">
        <span className="eyebrow">
          {isFinal ? hasReplay ? "REPETICIÓN OFICIAL" : hasArchive ? "ARCHIVOS Y VIDEOS" : "VIDEOS DEL PARTIDO" : "TRANSMISIÓN"}
        </span>
        <h2>{isFinal ? hasReplay ? "Partido completo" : hasArchive ? "Archivo y resúmenes" : "Videos del partido" : "Dónde ver"}</h2>
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
                  {broadcast.postgameKind === "fullReplay" && isFinal
                    ? `Consultar repetición · ${broadcast.name}`
                    : broadcast.postgameKind === "archiveLookup" && isFinal
                      ? "Consultar archivo del partido en MLB.TV"
                      : broadcast.postgameKind === "gameVideos" || broadcast.gameVideoSearch
                        ? league === "MLB" ? "Videos y resumen oficial del partido" : "Buscar videos de este juego en MLB.com"
                        : broadcast.verifiedGamePage
                          ? `Abrir video oficial · ${broadcast.name}`
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
              ? hasReplay
                ? "Página individual del partido completo identificada en LMB.TV. La reproducción puede requerir suscripción y depende de los derechos regionales."
                : hasArchive
                  ? "MLB.TV informa que hay una emisión archivada: el botón abre el catálogo del día, no el reproductor individual. Verifica suscripción y restricciones regionales. Los videos y resúmenes se ofrecen por separado."
                  : "Videos oficiales asociados al encuentro; pueden incluir jugadas, resúmenes o ningún resultado. No significa que esté disponible la repetición completa."
              : "Los botones abren el canal o calendario oficial indicado, no siempre el reproductor del partido. Disponibilidad según programación, región y suscripción."}
          </p>
        </>
      ) : (
        <div className="broadcastEmpty">Transmisión del partido por confirmar</div>
      )}
    </section>
  );
}
