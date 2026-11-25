/**
 * Detector de TITULARES CANDIDATOS de cuerpo técnico en portales de LMB/LMP.
 * Nunca convierte una noticia en nombramiento confirmado. Solo el catálogo
 * editorial con evidencia individual permite publicar un movimiento.
 *
 * Auditoría: fuente identificable → titular con cargo y acción → revisión de
 * persona, club, fecha, cuerpo del anuncio, negación y anuncios posteriores.
 */
export type StaffLeague = "LMB" | "LMP";
export type StaffCandidateKind =
  | "appointment" | "ratification" | "replacement" | "interim"
  | "departure" | "dismissal" | "resignation"
  | "coach-addition" | "staff-change";
export type StaffCandidateStatus = "pending_review" | "already_verified";

export type StaffArticleInput = {
  league: StaffLeague;
  clubSlug: string;
  title: string;
  url: string;
  publishedAt?: string | null;
};
export type StaffAnnouncementCandidate = StaffArticleInput & {
  status: StaffCandidateStatus;
  proposedKind: StaffCandidateKind;
  publishedAt: string | null;
  validationNote: string;
};

function canonicalArticleUrl(raw: string, league: StaffLeague): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.search || url.hash) return null;
    if (league === "LMB" && url.hostname === "lmb.com.mx" &&
      /^\/noticias\/[a-z0-9-]+\/?$/.test(url.pathname)) return url.origin + url.pathname.replace(/\/$/, "");
    if (league === "LMP" && url.hostname === "editor.lmp.mx" &&
      /^\/[a-z0-9-]+\/$/.test(url.pathname)) return url.origin + url.pathname;
  } catch {}
  return null;
}

const normalize = (raw: string): string => raw.normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es")
  .replace(/[“”‘’]/g, '"').replace(/\s+/g, " ").trim();

/** Descarta noticias de LMS/Femenil aunque el dominio sea LMB. */
const otherSport = /\b(?:lms|softbol|softball|femenil|leonas|gloriosas|guerreras softbol)\b/;
const speculative = /[¿?]|\b(?:se perfila|podria|podrian|posible|posiblemente|rumor|rumores|rumorado|habria|seria|tendria|trascendio|estaria cerca|busca contratar|negociaciones|sin confirmar|no confirmado)\b/;
const role = /\b(?:manager|manejador|director tecnico|coach(?:es)?|entrenador(?:es)?|cuerpo tecnico|staff de coaches|asesor deportivo|coordinador deportivo|coach de banca|coach de pitcheo)\b/;
const staffRole = /\b(?:coach(?:es)?|entrenador(?:es)?|cuerpo tecnico|staff de coaches|asesor deportivo|coordinador deportivo)\b/;
const action = /\b(?:nuevo|nueva|nombrad[oa]|nombra|nombran|anuncia|anuncian|presenta|presentan|llega|sera|designad[oa]|designa|toma el mando|al frente|asume|incorpora|integrara|se integra|se suma|sum[aó]|ratifica|ratifican|ratificado|ratificada|renueva|renovad[oa]|repite|continua|continua al frente|reemplaza|sustituye|relevo|interino|renuncia|dimite|sale|salida|deja el cargo|deja de ser|no seguira|destituye|destituido|despide|despedido|cesa|definido|nueva etapa)\b/;

export function detectStaffAnnouncement(
  article: StaffArticleInput,
  verifiedUrls: readonly string[] = [],
): StaffAnnouncementCandidate | null {
  const url = canonicalArticleUrl(article.url, article.league);
  if (!url || !/^[a-z0-9-]{2,50}$/.test(article.clubSlug)) return null;
  const title = article.title.replace(/\s+/g," ").trim();
  if (title.length < 16 || title.length > 240) return null;
  const n = normalize(title);
  // Una mención casual al mánager o a un partido no acredita cambios.
  if (otherSport.test(n) || speculative.test(n) || !role.test(n) || !action.test(n)) return null;

  let proposedKind: StaffCandidateKind;
  if (/\b(?:renuncia|dimite)\b/.test(n)) proposedKind = "resignation";
  else if (/\b(?:destituye|destituido|despide|despedido|cesa)\b/.test(n)) proposedKind = "dismissal";
  else if (/\b(?:interino|interina|provisional)\b/.test(n)) proposedKind = "interim";
  else if (/\b(?:sustituye|reemplaza|relevo|en sustitucion de)\b/.test(n)) proposedKind = "replacement";
  else if (/\b(?:ratifica|ratifican|ratificado|ratificada|renueva|renovad[oa]|repite|continuara)\b/.test(n)) proposedKind = "ratification";
  else if (/\b(?:sale|salida|deja el cargo|deja de ser|no seguira)\b/.test(n)) proposedKind = "departure";
  else if (staffRole.test(n)) proposedKind = "coach-addition";
  else proposedKind = "appointment";

  // Cuando el artículo nombra todo el staff, no deducir cuántas altas contiene.
  if (/\b(?:cuerpo tecnico|staff de coaches)\b/.test(n)) proposedKind = "staff-change";

  const published = article.publishedAt && Number.isFinite(Date.parse(article.publishedAt))
    ? new Date(article.publishedAt).toISOString() : null;
  const alreadyVerified = verifiedUrls.some(known => canonicalArticleUrl(known,article.league) === url);
  return {
    league:article.league,clubSlug:article.clubSlug,title,url,
    publishedAt:published,
    proposedKind,
    status:alreadyVerified ? "already_verified" : "pending_review",
    validationNote:alreadyVerified
      ? "URL del comunicado ya documentada; comprobar cambios posteriores antes de afirmar vigencia."
      : "Titular candidato. Comprobar cuerpo, persona, club, cargo, fecha, negaciones y anuncios posteriores; NO publicar como confirmado.",
  };
}

export function dedupeStaffCandidates(
  entries: readonly StaffAnnouncementCandidate[],
): StaffAnnouncementCandidate[] {
  const seen=new Set<string>();
  return entries.filter(entry=>{
    const key=entry.league+"|"+entry.clubSlug+"|"+entry.url;
    if(seen.has(key))return false;
    seen.add(key);
    return true;
  }).sort((a,b)=>(b.publishedAt??"").localeCompare(a.publishedAt??"")||
    a.league.localeCompare(b.league)||a.clubSlug.localeCompare(b.clubSlug)||
    a.url.localeCompare(b.url));
}
