/**
 * Relación conservadora de noticias MLB.com y registros MLB StatsAPI.
 * Solo confirma el movimiento registrado, nunca cifras u otras afirmaciones.
 */
export type MlbSigningNews = {
  url: string;
  originalTitle: string;
  date: string | null;
};
export type MlbSigningTransaction = {
  player: string | null;
  date: string;
  isConfirmedSigning: boolean;
  isConfirmedWaiverClaim?: boolean;
  tradeDirection?: MlbTradeDirection | null;
  tradeCounterpart?: string | null;
};
export type VerifiedMlbSigning = { player: string; date: string };

const normalize = (value: string): string => value.normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const signingContext = /\b(?:agreement|agrees?|agreed|deal|contract|signs?|signed|signing|re-?signs?|acuerdo|contrato|firma|firmo|contratacion|pacta)\b/i;
// El reclamo en waivers es una incorporación, NO una firma de agente libre.
const waiverContext = /\b(?:claimed|claims?|claiming)\b.*\bwaivers?\b|\boff waivers?\b/i;
const speculativeContext = /\b(?:could|might|may|perhaps|potential|possibly|possible|rumor|rumour|podria|podrian|quizas|posible|rumor)\b/i;
const MAX_SIGNING_DAYS = 14;
const MAX_WAIVER_DAYS = 5;

function matchOfficialMovement(
  story: MlbSigningNews,
  transactions: readonly MlbSigningTransaction[],
  kind: "signing" | "waiver",
): VerifiedMlbSigning | null {
  if (!story.date || !Number.isFinite(Date.parse(story.date))) return null;
  let url: URL;
  try { url = new URL(story.url); } catch { return null; }
  if (url.protocol !== "https:" || url.hostname !== "www.mlb.com" ||
      !url.pathname.includes("/news/")) return null;
  const headline = normalize(story.originalTitle).replace(/-/g, " ");
  // Titulares en forma de hipótesis no pueden recibir una marca automática,
  // ni siquiera cuando existe después un registro real de ese jugador.
  if (speculativeContext.test(headline) || /[¿?]/.test(story.originalTitle)) return null;
  if (kind === "signing" ? !signingContext.test(headline) :
      !waiverContext.test(headline)) return null;

  const normalizedHeadline = "-" + normalize(story.originalTitle) + "-";
  const slug = "-" + normalize(url.pathname.split("/").filter(Boolean).at(-1) ?? "") + "-";
  const storyTime = Date.parse(story.date);
  const maxDays = kind === "waiver" ? MAX_WAIVER_DAYS : MAX_SIGNING_DAYS;
  const matches = transactions.filter(tx => {
    if (!(kind === "waiver" ? tx.isConfirmedWaiverClaim : tx.isConfirmedSigning) ||
        !tx.player || !/^\d{4}-\d{2}-\d{2}$/.test(tx.date)) return false;
    const name = normalize(tx.player);
    const tokens = name.split("-").filter(Boolean);
    if (tokens.length < 2 || tokens.some(token => token.length < 2)) return false;
    const surname = tokens.at(-1)!;
    if (!slug.includes("-" + name + "-") ||
        !normalizedHeadline.includes("-" + surname + "-")) return false;
    const date = Date.parse(tx.date + "T12:00:00Z");
    return Number.isFinite(date) &&
      Math.abs(date - storyTime) <= maxDays * 24 * 60 * 60 * 1000;
  });
  // En caso de varios registros compatibles, no inferir el movimiento.
  if (matches.length !== 1) return null;
  return { player: matches[0].player!, date: matches[0].date };
}
export function findVerifiedMlbSigning(
  story: MlbSigningNews,
  transactions: readonly MlbSigningTransaction[],
): VerifiedMlbSigning | null {
  return matchOfficialMovement(story, transactions, "signing");
}
export function findVerifiedMlbWaiverClaim(
  story: MlbSigningNews,
  transactions: readonly MlbSigningTransaction[],
): VerifiedMlbSigning | null {
  return matchOfficialMovement(story, transactions, "waiver");
}


/** StatsAPI fromTeam/toTeam: no inferir el sentido a partir de una descripción. */
export type MlbTradeDirection = "received" | "sent";
export type OfficialMlbTradeSide = {
  direction: MlbTradeDirection;
  counterpart: string | null;
};
type RawMlbTradeRecord = {
  typeCode?: string;
  description?: string;
  fromTeam?: { id?: number; name?: string } | null;
  toTeam?: { id?: number; name?: string } | null;
};
type KnownMlbClub = { id: number; name: string };
export function officialMlbTradeSide(
  record: RawMlbTradeRecord,
  clubId: number,
  player?: string | null,
  knownClubs: readonly KnownMlbClub[] = [],
): OfficialMlbTradeSide | null {
  if (record.typeCode !== "TE" || !Number.isInteger(clubId)) return null;
  const from = Number(record.fromTeam?.id);
  const to = Number(record.toTeam?.id);
  const validFrom = Number.isInteger(from) && from > 0;
  const validTo = Number.isInteger(to) && to > 0;
  if (validFrom && validTo) {
    if (from === to) return null;
    if (to === clubId) {
      return {direction: "received", counterpart: record.fromTeam?.name?.trim() || null};
    }
    if (from === clubId) {
      return {direction: "sent", counterpart: record.toTeam?.name?.trim() || null};
    }
    return null;
  }
  // Algunos registros de transacción TE omiten fromTeam/toTeam.
  // Respaldo estricto: texto ORIGINAL de StatsAPI, dos clubes canónicos
  // y nombre completo del jugador antes del "to" de la operación.
  if (!player?.trim() || !record.description?.trim() || !knownClubs.length) return null;
  const desc = record.description.trim();
  const p = player.trim().toLowerCase();
  const candidates: Array<{origin: KnownMlbClub; destination: KnownMlbClub}> = [];
  for (const origin of knownClubs) {
    const prefix = origin.name + " traded ";
    if (!desc.toLowerCase().startsWith(prefix.toLowerCase())) continue;
    const rest = desc.slice(prefix.length);
    for (const destination of knownClubs) {
      if (origin.id === destination.id) continue;
      const marker = " to " + destination.name;
      const index = rest.toLowerCase().indexOf(marker.toLowerCase());
      if (index < 0) continue;
      const after = rest.slice(index + marker.length);
      if (after && !/^(?:\s+(?:for|in exchange for)\b|[.,;])/.test(after)) continue;
      const playerSegment = rest.slice(0, index).toLowerCase();
      const at = playerSegment.indexOf(p);
      if (at < 0 || /[a-z]/.test(playerSegment[at - 1] ?? "") ||
          /[a-z]/.test(playerSegment[at + p.length] ?? "")) continue;
      // Una identidad de club presente en la respuesta debe coincidir.
      if ((validFrom && from !== origin.id) || (validTo && to !== destination.id)) continue;
      candidates.push({origin, destination});
    }
  }
  if (candidates.length !== 1) return null;
  const {origin, destination} = candidates[0];
  if (destination.id === clubId) return {direction: "received", counterpart: origin.name};
  if (origin.id === clubId) return {direction: "sent", counterpart: destination.name};
  return null;
}

export type VerifiedMlbTrade = VerifiedMlbSigning & OfficialMlbTradeSide;
const tradeContext = /\b(?:trades?|traded|trading|trade[ds]?|acquire[ds]?|acquired|acquiring|swaps?|swapped|exchange[ds]?|intercambio|intercambia|intercambiado|canje|traspaso|traspasado|cedido|traspasaron)\b/i;
const MAX_TRADE_DAYS = 7;
/** Confirma el registro de un jugador, no todos los detalles de un intercambio múltiple. */
export function findVerifiedMlbTrade(
  story: MlbSigningNews,
  transactions: readonly MlbSigningTransaction[],
): VerifiedMlbTrade | null {
  if (!story.date || !Number.isFinite(Date.parse(story.date))) return null;
  let url: URL;
  try { url = new URL(story.url); } catch { return null; }
  if (url.protocol !== "https:" || url.hostname !== "www.mlb.com" ||
      !url.pathname.includes("/news/")) return null;
  const headline = normalize(story.originalTitle).replace(/-/g, " ");
  const tradeLanguage = tradeContext.test(headline) || /\bdeal\b.*\bto\b/.test(headline);
  if (!tradeLanguage || speculativeContext.test(headline) ||
      /[¿?]/.test(story.originalTitle)) return null;
  const normalizedHeadline = "-" + normalize(story.originalTitle) + "-";
  const slug = "-" + normalize(url.pathname.split("/").filter(Boolean).at(-1) ?? "") + "-";
  const storyTime = Date.parse(story.date);
  const matches = transactions.filter(tx => {
    if (!tx.tradeDirection || !tx.player ||
        !/^\d{4}-\d{2}-\d{2}$/.test(tx.date)) return false;
    const name = normalize(tx.player);
    const tokens = name.split("-").filter(Boolean);
    if (tokens.length < 2 || tokens.some(t => t.length < 2)) return false;
    const surname = tokens.at(-1)!;
    if (!slug.includes("-" + name + "-") ||
        !normalizedHeadline.includes("-" + surname + "-")) return false;
    const date = Date.parse(tx.date + "T12:00:00Z");
    return Number.isFinite(date) &&
      Math.abs(date - storyTime) <= MAX_TRADE_DAYS * 24 * 60 * 60 * 1000;
  });
  if (matches.length !== 1) return null;
  const match = matches[0];
  return {
    player: match.player!,
    date: match.date,
    direction: match.tradeDirection!,
    counterpart: match.tradeCounterpart || null,
  };
}
