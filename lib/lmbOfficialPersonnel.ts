/**
 * Nombramientos del cuerpo técnico documentados con comunicado de club/LMB.
 * La API de boletines de listas de reserva NO garantiza incluirlos.
 * Cada registro de este catálogo exige verificación editorial de la fuente,
 * persona, club, cargo y fecha antes de incorporarse.
 */
export type LmbPersonnelAppointment = {
  clubSlug: string;
  date: string;
  person: string;
  role: string;
  effectiveSeason: string;
  url: string;
  description: string;
};

const VERIFIED_APPOINTMENTS: readonly LmbPersonnelAppointment[] = [
  {
    clubSlug: "leones",
    date: "2026-11-23",
    person: "Yadier Molina",
    role: "Mánager",
    effectiveSeason: "2027",
    url: "https://lmb.com.mx/noticias/el-historico-ex-receptor-yadier-molina-es-el-nuevo-manager-de-los-leones-de-yucatan",
    description: "Los Leones de Yucatán anunciaron oficialmente a Yadier Molina como nuevo mánager para la temporada 2027. Nombramiento de cuerpo técnico; no es un alta en roster ni una operación de lista de reserva.",
  },
];

export function officialLmbPersonnelAppointments(profileUrl: string): LmbPersonnelAppointment[] {
  const match = /^https:\/\/lmb\.com\.mx\/equipos\/([a-z0-9-]+)$/.exec(profileUrl);
  if (!match) return [];
  return VERIFIED_APPOINTMENTS.filter(item => item.clubSlug === match[1]).map(item => ({...item}));
}
