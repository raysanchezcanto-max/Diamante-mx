import { ALGODONEROS_MOVEMENTS } from "./algodonerosProfile";

// Datos públicos de LMB. No hay API oficial de movimientos documentada
// para este uso: se leen enlaces y comunicados publicados en lmb.com.mx.
export type ClubMovement = {
  date: string;
  type: string;
  title: string;
  description: string;
  url: string;
  automatic?: boolean;
};

export type MovementResult = {
  movements: ClubMovement[];
  sourceStatus: "connected" | "fallback";
  verifiedAt: string | null;
  recentDetected: number;
};

const BASE = "https://lmb.com.mx";
const PROFILE = BASE + "/equipos/algodoneros";

export type LmbClubMovementSource = {
  profileUrl: string;
  headingAliases: readonly string[];
  archive: readonly Omit<ClubMovement, "automatic">[];
};
const MONTHS: Record<string, number> = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
};
const MONTH_NAMES = Object.keys(MONTHS);
const LINK_RE = /\/noticias\/lmb-movimientos-en-listas-de-reserva-\d{1,2}-de-[a-z]+-de-\d{4}(?:-\d+)?/gi;
const TTL_SECONDS = 1800;

function movementDate(url: string): string | null {
  const m = url.match(/reserva-(\d{1,2})-de-([a-z]+)-de-(\d{4})(?:-\d+)?$/i);
  if (!m) return null;
  const day = Number(m[1]), month = MONTHS[m[2].toLowerCase()], year = Number(m[3]);
  if (!month || day < 1 || day > 31 || year < 2020 || year > 2100) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCDate() !== day || date.getUTCMonth() !== month - 1) return null;
  return year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

function linksFromOfficialProfile(html: string): string[] {
  const urls = new Set<string>();
  for (const match of html.matchAll(LINK_RE)) {
    if (movementDate(match[0])) urls.add(BASE + match[0]);
  }
  return [...urls].slice(0, 12);
}

function stripTags(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ").trim();
}

function normalizeHeading(value: string): string {
  return stripTags(value).normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase().trim();
}

// El cuerpo de los comunicados se incluye en la carga de React de la
// página oficial como HTML escapado \u003cp\u003e...
function decodeEmbeddedArticle(html: string): string {
  return html
    .replace(/\\u003c/gi, "<")
    .replace(/\\u003e/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/\\r|\\n|\\t/g, " ");
}

function relevantMovementsFromArticle(html: string, headingAliases: readonly string[]): string[] {
  const decoded = decodeEmbeddedArticle(html);
  const headings = [...decoded.matchAll(/<p[^>]*>\s*<(?:strong|b)[^>]*>([^<]{1,150})<\/(?:strong|b)>\s*<\/p>/gi)];
  const reports: string[] = [];
  for (let i = 0; i < headings.length; i++) {
    const title = normalizeHeading(headings[i][1]);
    // Solo encabezados de equipos expresamente autorizados por su configuración.
    // Impide confundir equipos homónimos de LMB, LMP y softbol.
    if (!headingAliases.some(alias => {
      const normalized = normalizeHeading(alias);
      return normalized.length > 2 && title.split(/[^A-Z]+/).includes(normalized);
    })) continue;
    const start = headings[i].index! + headings[i][0].length;
    const end = headings[i + 1]?.index ?? Math.min(decoded.length, start + 6500);
    const section = decoded.slice(start, Math.min(end, start + 6500));
    const entries = [...section.matchAll(/<(?:li|p)\b[^>]*>([\s\S]*?)<\/(?:li|p)>/gi)];
    for (const entry of entries) {
      const text = stripTags(entry[1])
        .replace(/\\+"?\s*$/, "")
        .trim();
      if (!text || text.length < 18 || text.length > 1500) continue;
      // Omitir encabezados, notas y texto del pie de la página.
      if (!/(?:activa|desactiva|alta|baja|ced[ei]|derechos|lista|roster|recibe|env[ií]a|coloca|club)/i.test(text)) continue;
      if (!reports.includes(text)) reports.push(text);
    }
  }
  return reports.slice(0, 8);
}

function classification(text: string): string {
  if (/academia rookie/i.test(text)) return "Academia rookie";
  if (/ced[ei]|cesi[oó]n|derechos/i.test(text)) return "Cesión de derechos";
  if (/activa en roster/i.test(text)) return "Activación de roster";
  if (/baja|desactiva/i.test(text)) return "Baja o desactivación";
  if (/alta/i.test(text)) return "Alta de lista";
  return "Movimiento oficial";
}

function shortExcerpt(text: string): string {
  // No reproducir íntegro el comunicado oficial; el detalle queda en LMB.
  const withoutBio = text.replace(/\([^)]{5,200}\)/g, "").replace(/\s+/g," ").trim();
  const words = withoutBio.split(/\s+/);
  return words.slice(0, 18).join(" ") + (words.length > 18 ? "…" : "");
}

async function officialHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: TTL_SECONDS },
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) return null;
    const html = await response.text();
    return html.length >= 200 ? html : null;
  } catch {
    return null;
  }
}

function recentSlugs(now: Date): string[] {
  const localeDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
  const reference = new Date(localeDay + "T12:00:00Z");
  if (!Number.isFinite(reference.getTime())) return [];
  const links: string[] = [];
  // Cobertura adicional por si la ficha del club tarda en indexar un nuevo anuncio.
  for (let i = 0; i < 8; i++) {
    const day = new Date(reference.getTime() - i * 86400000);
    const monthName = MONTH_NAMES[day.getUTCMonth()];
    links.push(BASE + "/noticias/lmb-movimientos-en-listas-de-reserva-" +
      day.getUTCDate() + "-de-" + monthName + "-de-" + day.getUTCFullYear());
  }
  return links;
}

export async function getLmbClubMovements(
  config: LmbClubMovementSource, now = new Date()
): Promise<MovementResult> {
  const fallback = config.archive.map(item => ({ ...item, automatic: false }));
  const html = await officialHtml(config.profileUrl);
  const profileLinks = html ? linksFromOfficialProfile(html) : [];
  const candidates = [...new Set([...profileLinks, ...recentSlugs(now)])]
    .filter(url => movementDate(url) !== null)
    .slice(0, 20);
  const existingUrls = new Set<string>(fallback.map(item => item.url));
  const freshCandidates = candidates.filter(url => !existingUrls.has(url));
  const articles = await Promise.all(freshCandidates.map(async url => {
    const date = movementDate(url);
    if (!date) return [];
    const source = await officialHtml(url);
    if (!source) return [];
    const excerpts = relevantMovementsFromArticle(source, config.headingAliases);
    // Un enlace listado en la ficha del club es evidencia de pertinencia;
    // los artículos descubiertos por fecha requieren además mención LAGUNA.
    if (excerpts.length === 0) {
      return profileLinks.includes(url)
        ? [{
          date, type: "Movimiento oficial", title: "Movimiento publicado por LMB",
          description: "La liga publicó un movimiento vinculado a Unión Laguna. Consulta el comunicado para los detalles.",
          url, automatic: true,
        }]
        : [];
    }
    return excerpts.map((entry, index) => ({
      date, type: classification(entry),
      title: "Movimiento de Unión Laguna" + (excerpts.length > 1 ? " · " + (index + 1) : ""),
      description: shortExcerpt(entry),
      url, automatic: true,
    }));
  }));
  const combined = [...fallback, ...articles.flat()];
  const seen = new Set<string>();
  const movements = combined.filter(item => {
    const key = item.url + "|" + (item.automatic ? item.description : "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a,b) => b.date.localeCompare(a.date) || Number(b.automatic) - Number(a.automatic));
  return {
    movements,
    sourceStatus: html && profileLinks.length > 0 ? "connected" : "fallback",
    verifiedAt: html ? new Date().toISOString() : null,
    recentDetected: articles.flat().length,
  };
}

// Mismo lector reutilizable: próximos equipos solo aportan su URL, el encabezado
// de su nombre oficial en los boletines y el archivo histórico de respaldo.
export async function getAlgodonerosMovements(now = new Date()): Promise<MovementResult> {
  return getLmbClubMovements({
    profileUrl: PROFILE,
    headingAliases: ["LAGUNA"],
    archive: ALGODONEROS_MOVEMENTS,
  }, now);
}
