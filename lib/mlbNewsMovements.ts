/**
 * Relación conservadora entre una noticia de MLB.com y la contratación
 * registrada en MLB StatsAPI. No acredita cifras, duración del contrato
 * ni otras afirmaciones del artículo: solo la existencia del movimiento.
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
};
export type VerifiedMlbSigning = { player: string; date: string };

const normalize = (value: string): string => value.normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const signingContext = /\b(?:agreement|agrees?|agreed|deal|contract|signs?|signed|signing|re-?signs?|returns?|returning|acuerdo|contrato|firma|firmo|contratacion|pacta)\b/i;
const MAX_DAYS = 14;

export function findVerifiedMlbSigning(
  story: MlbSigningNews,
  transactions: readonly MlbSigningTransaction[],
): VerifiedMlbSigning | null {
  if (!story.date || !Number.isFinite(Date.parse(story.date))) return null;
  let url: URL;
  try { url = new URL(story.url); } catch { return null; }
  if (url.protocol !== "https:" || url.hostname !== "www.mlb.com" ||
      !url.pathname.includes("/news/")) return null;
  if (!signingContext.test(normalize(story.originalTitle).replace(/-/g, " "))) return null;

  const normalizedHeadline = "-" + normalize(story.originalTitle) + "-";
  const slug = "-" + normalize(url.pathname.split("/").filter(Boolean).at(-1) ?? "") + "-";
  const storyTime = Date.parse(story.date);
  const matches = transactions.filter(tx => {
    if (!tx.isConfirmedSigning || !tx.player ||
        !/^\d{4}-\d{2}-\d{2}$/.test(tx.date)) return false;
    const name = normalize(tx.player);
    const tokens = name.split("-").filter(Boolean);
    if (tokens.length < 2 || tokens.some(token => token.length < 2)) return false;
    const surname = tokens.at(-1)!;
    if (!slug.includes("-" + name + "-") ||
        !normalizedHeadline.includes("-" + surname + "-")) return false;
    const date = Date.parse(tx.date + "T12:00:00Z");
    return Number.isFinite(date) &&
      Math.abs(date - storyTime) <= MAX_DAYS * 24 * 60 * 60 * 1000;
  });
  // Más de un alta comparable podría ser otra operación; no atribuir por intuición.
  if (matches.length !== 1) return null;
  return { player: matches[0].player!, date: matches[0].date };
}
