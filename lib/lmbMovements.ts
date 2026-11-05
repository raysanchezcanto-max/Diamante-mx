import { ALGODONEROS_MOVEMENTS } from "./algodonerosProfile";
import { LMB_CLUB_DIRECTORY } from "./lmbClubs";

// Datos públicos de LMB. No hay API oficial de movimientos documentada
// para este uso: se leen enlaces y comunicados publicados en lmb.com.mx.
export type ClubMovement = {
  date: string;
  type: string;
  title: string;
  description: string;
  url: string;
  automatic?: boolean;
  // Solo las cesiones explícitas permiten afirmar quién entrega o recibe derechos.
  direction?: "out" | "in";
  otherClub?: string;
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
  clubName?: string;
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
  // Los artículos LMB contienen el boletín en el payload Next.js codificado:
  // <p><span><strong><span>TABASCO</span></strong></span></p>
  // seguido de <ul><li><span>Activa en roster a ...</span></li></ul>.
  // El parser anterior solo admitía <p><strong>... inmediato y descartaba todo.
  const decoded = decodeEmbeddedArticle(html);
  const headings = [...decoded.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .filter(m => /<strong\b/i.test(m[1]))
    .map(m => ({
      index: m.index!,
      end: m.index! + m[0].length,
      label: normalizeHeading(m[1]).replace(/\s*[–—-]\s*/g, " - ").replace(/\s+/g, " ").trim(),
    }))
    .filter(m => m.label.length >= 4 && m.label.length < 100 && /^[A-Z0-9 -]+$/.test(m.label));
  const matches = new Set<string>();
  const cleanAliases = headingAliases.map(a => normalizeHeading(a).replace(/\s+/g, " ").trim());
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const parts = heading.label.split(/\s+-\s+/);
    if (!parts.some(part => cleanAliases.includes(part))) continue;
    const end = headings[i + 1]?.index ?? Math.min(decoded.length, heading.end + 12000);
    const section = decoded.slice(heading.end, Math.min(end, heading.end + 12000));
    for (const match of section.matchAll(/<(li|p)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
      const entry = stripTags(match[2]).replace(/\\[rn]\b/g, " ").trim();
      if (entry.length < 18 || entry.length > 1200) continue;
      if (!/(?:activa|desactiva|da de alta|da de baja|ced[ei]|derechos|lista|roster|recibe|env[ií]a|coloca|pr[eé]stamo|adquiere|contrata|registra|m[aá]nager|coach)/i.test(entry)) continue;
      // No repetir el mismo anuncio en un boletín con contenido duplicado.
      matches.add(entry);
    }
  }
  return [...matches].slice(0, 20);
}

// No confundir una cesión de derechos con un traspaso del roster activo.
function normalizedClub(value: string): string {
  return normalizeHeading(value)
    .replace(/\b(?:DE|DEL|LA|EL|LOS|LAS)\b/g, " ")
    .replace(/[^A-Z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function rightsTransfer(entry: string, headingAliases: readonly string[]): {
  title: string;
  direction: "out" | "in";
  otherClub: string;
} | null {
  const content = stripTags(entry).replace(/^[*•·–—\s]+/, "").trim();
  const match = content.match(
    /\bel club\s+(.+?)\s+(?:cede|cedió|cedio)\s+(?:de manera definitiva\s+)?(?:los\s+)?derechos\s+de\s+(.+?)\s+al club\s+(.+?)(?:\.|$)/i
  );
  if (!match) return null;
  const from = match[1].trim();
  const to = match[3].trim();
  const playerNames = match[2].replace(/\([^)]*\)/g, " ")
    .replace(/\s+/g, " ").trim();
  if (!playerNames) return null;

  const current = LMB_CLUB_DIRECTORY.find(club =>
    headingAliases.some(alias => normalizedClub(alias) === normalizedClub(club.bulletinHeading))
  );
  if (!current) return null;

  const origin = normalizedClub(from);
  const destination = normalizedClub(to);
  const own = normalizedClub(current.name);
  const outgoing = own === origin;
  const incoming = own === destination;
  // Si no puede identificarse la dirección con nombres oficiales, omitirla.
  if (outgoing === incoming) return null;

  const counterparty = outgoing ? to : from;
  const heading = outgoing ? "Derechos cedidos" : "Derechos recibidos";
  const words = playerNames.split(/\s+/);
  const concise = words.slice(0, 14).join(" ") + (words.length > 14 ? "…" : "");
  return {
    title: heading + ": " + concise,
    direction: outgoing ? "out" : "in",
    otherClub: counterparty,
  };
}

function classification(text: string): string {
  if (/academia rookie/i.test(text)) return "Academia rookie";
  if (/ced[ei]|cesi[oó]n|derechos|pr[eé]stamo/i.test(text)) return "Traspaso o derechos";
  if (/cuerpo t[eé]cnico|m[aá]nager|coach|trainers?|batboys?|clubby|traductor/i.test(text)) return "Cuerpo técnico";
  if (/da de baja|waiver/i.test(text)) return "Baja de lista";
  if (/lesionados/i.test(text)) return "Lista de lesionados";
  if (/da de alta.*activ[a-zá]* en roster/i.test(text)) return "Alta y activación";
  if (/activa en roster/i.test(text)) return "Activación de roster";
  if (/desactiva/i.test(text)) return "Desactivación de roster";
  if (/da de alta|registra/i.test(text)) return "Alta de lista";
  if (/m[aá]nager|coach|cuerpo t[eé]cnico/i.test(text)) return "Cuerpo técnico";
  return "Operación oficial";
}

function operationTitle(text: string): string {
  const clean = text.replace(/\([^)]{2,250}\)/g, " ")
    .replace(/\s+/g, " ").replace(/^[*•·–—\s]+/, "")
    .replace(/^(?:asimismo|además)[,;:]?\s+/i, "").trim();
  const action = classification(text);
  if (action === "Cuerpo técnico") {
    const name = clean.match(/\b(?:a los|a las|al|a la)\s+(?:coaches?|trainers?|batboys?|clubby|traductores?|m[aá]nager(?:es)?)\s+(.+?)(?:\s+de su lista|\s*\.|$)/i)?.[1];
    if (name) {
      const words = name.split(/\s+/);
      return "Cuerpo técnico: " + words.slice(0, 9).join(" ") + (words.length > 9 ? "…" : "");
    }
  }
  // La mayoría son operaciones en singular; usar nombre y dorsal reales.
  const patterns = [
    /^(?:activa en roster(?: a)?|desactiva(?: de roster)? a|coloca a|da de baja(?: \(envía a waiver\))? a|da de alta (?:al agente libre |a ))\s*(.+)/i,
    /^(?:el club\s+.+?\s+)?(?:cede|recibe)\s+(?:de manera definitiva\s+)?(?:los\s+)?derechos de\s+(.+)/i,
  ];
  let name = "";
  for (const pattern of patterns) {
    const m = clean.match(pattern);
    if (m) { name = m[1]; break; }
  }
  if (!name) {
    // En comunicados complejos mostramos una frase real, no un título genérico.
    const words = clean.split(/\s+/);
    return words.slice(0, 10).join(" ") + (words.length > 10 ? "…" : "");
  }
  name = name.split(/\s+(?:en su lista|de su lista|a su lista|procedente|al club|y lo activa|y la activa)\b/i)[0]
    .replace(/\s*#\d{1,3}\b/g, "").replace(/[.,;]+\s*$/g, "").trim();
  const words = name.split(/\s+/);
  return action + ": " + words.slice(0, 8).join(" ") + (words.length > 8 ? "…" : "");
}

function shortExcerpt(text: string): string {
  const clean = text
    .replace(/\\[rn]\b/g, " ")
    .replace(/\s+/g, " ").trim();
  const words = clean.split(/\s+/);
  return words.slice(0, 35).join(" ") + (words.length > 35 ? "…" : "");
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
  // Los enlaces de la ficha del equipo pueden quedarse en julio/agosto. La
  // portada de Noticias sí presenta boletines recientes (p.ej. noviembre).
  const [html, newsIndex] = await Promise.all([
    officialHtml(config.profileUrl),
    officialHtml(BASE + "/noticias"),
  ]);
  const profileLinks = html ? linksFromOfficialProfile(html) : [];
  const newsLinks = newsIndex ? linksFromOfficialProfile(newsIndex) : [];
  const candidates = [...new Set([...profileLinks, ...newsLinks, ...recentSlugs(now)])]
    .filter(url => movementDate(url) !== null)
    .sort((a,b) => (movementDate(b) ?? "").localeCompare(movementDate(a) ?? ""))
    .slice(0, 24);
  const existingUrls = new Set<string>(fallback.map(item => item.url));
  const freshCandidates = candidates.filter(url => !existingUrls.has(url));
  const articles = await Promise.all(freshCandidates.map(async url => {
    const date = movementDate(url);
    if (!date) return [];
    const source = await officialHtml(url);
    if (!source) return [];
    const excerpts = relevantMovementsFromArticle(source, config.headingAliases);
    // No inventar una operación cuando el cuerpo del boletín no pudo leerse.
    if (excerpts.length === 0) return [];
    return excerpts.map(entry => {
      const transfer = rightsTransfer(entry, config.headingAliases);
      return {
        date,
        type: classification(entry),
        title: transfer?.title ?? operationTitle(entry),
        description: shortExcerpt(entry),
        url,
        automatic: true,
        ...(transfer ? {
          direction: transfer.direction,
          otherClub: transfer.otherClub,
        } : {}),
      };
    });
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
    sourceStatus: (html && profileLinks.length > 0) || (newsIndex && newsLinks.length > 0)
      ? "connected" : "fallback",
    verifiedAt: html || newsIndex ? new Date().toISOString() : null,
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
    clubName: "Unión Laguna",
  }, now);
}
