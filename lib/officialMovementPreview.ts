import type { VerifiedStaffKind } from "./verifiedPersonnelEvents";

/**
 * Entradas oficiales independientes de los titulares periodísticos.
 * LMB publica boletines individuales; LMP publica un registro de movimientos
 * cuya API no expone un enlace distinto para cada transacción.
 */
export type OfficialMovementPreview = {
  date: string;
  title: string;
  excerpt: string;
  sourceUrl: string | null;
  kind?: "official-appointment";
  staffKind?: VerifiedStaffKind;
};

type LmbMovementInput = {
  date: string; title: string; description: string; url: string; automatic?: boolean;
  sourceKind?: "official-appointment";
  staffKind?: VerifiedStaffKind;
};
type LmpMovementInput = {date:string;description:string;sourceKind?:"official-appointment";staffKind?:VerifiedStaffKind;sourceUrl?:string;person?:string};

const validDate = (date: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(date + "T12:00:00Z");
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
};
const compress = (value: string, max = 230): string => {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + "…" : clean;
};
const isLmbBulletin = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "lmb.com.mx" &&
      /^\/noticias\/lmb-movimientos-en-listas-de-reserva-[a-z0-9-]+$/.test(url.pathname) &&
      !url.search && !url.hash;
  } catch { return false; }
};

const isOfficialAppointment = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "lmb.com.mx" &&
      /^\/noticias\/[a-z0-9-]+$/.test(url.pathname) &&
      !url.search && !url.hash;
  } catch { return false; }
};

/** Solo boletines y nombramientos institucionales previamente verificados, jamás archivo. */
export function previewLmbMovements(
  movements: readonly LmbMovementInput[],
  limit = 2,
): OfficialMovementPreview[] {
  const seen = new Set<string>();
  const items = movements.flatMap(item => {
    const validBulletin = item.automatic === true && isLmbBulletin(item.url);
    const validAppointment = item.sourceKind === "official-appointment" &&
      item.automatic === false && isOfficialAppointment(item.url);
    if ((!validBulletin && !validAppointment) || !validDate(item.date) ||
        item.title.trim().length < 8 || item.description.trim().length < 18) return [];
    const key = item.date + "|" + item.url + "|" + item.description;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{
      date: item.date,
      title: compress(item.title, 130),
      excerpt: compress(item.description, 220),
      sourceUrl: item.url,
      ...(validAppointment ? {kind:"official-appointment" as const,staffKind:item.staffKind??"appointment"} : {}),
    }];
  });
  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, Math.max(0, Math.min(limit, 3)));
}

const isOfficialLmpAnnouncement = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "editor.lmp.mx" &&
      /^\/[a-z0-9-]+\/$/.test(url.pathname) && !url.search && !url.hash;
  } catch { return false; }
};

/** LMP: diferenciar anuncios institucionales de la API de altas/bajas. */
export function previewLmpMovements(
  movements: readonly LmpMovementInput[],
  limit = 2,
): OfficialMovementPreview[] {
  const seen = new Set<string>();
  const items = movements.flatMap(item => {
    const description = item.description.replace(/\s+/g, " ").trim();
    const staff = item.sourceKind === "official-appointment" &&
      Boolean(item.staffKind && item.person?.trim() && item.sourceUrl &&
      isOfficialLmpAnnouncement(item.sourceUrl));
    if (item.sourceKind === "official-appointment" && !staff) return [];
    if (!validDate(item.date) || description.length < 18) return [];
    const key = item.date + "|" + description;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{
      date: item.date,
      title: staff ? item.person!.trim() : compress(description, 180),
      excerpt: staff ? compress(description, 220) :
        description.length > 180 ? "Extracto del registro; consulta el historial para leer el movimiento completo." : "",
      sourceUrl: staff ? item.sourceUrl! : null,
      ...(staff ? {kind:"official-appointment" as const,staffKind:item.staffKind} : {}),
    }];
  });
  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, Math.max(0, Math.min(limit, 3)));
}
