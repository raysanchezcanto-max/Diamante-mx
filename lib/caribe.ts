// Datos anunciados por la Confederación de Béisbol Profesional del Caribe.
// Las fechas del torneo NO equivalen a un calendario de partidos confirmado.
// Cuando esté disponible una fuente estructurada de marcadores, añadirla aquí
// sin inferir enfrentamientos, participantes ni horarios.
export const CARIBE_2027 = {
  year: 2027,
  edition: 69,
  host: "Hermosillo, Sonora, México",
  ballpark: "Estadio Fernando Valenzuela",
  start: "2027-02-01T00:00:00-07:00",
  endExclusive: "2027-02-08T00:00:00-07:00",
  dateLabel: "1 AL 7 DE FEBRERO DE 2027",
  officialSource:
    "https://seriedelcaribe.net/en/news/serie-del-caribe-hermosillo-2027-del-1-al-7-de-febrero",
  calendarSource: "https://seriedelcaribe.net/calendario",
} as const;

export const CARIBE_2027_PARTICIPANTS = [
  { country: "México", flagSrc: "/flags/mx.svg", league: "Liga Mexicana del Pacífico" },
  { country: "República Dominicana", flagSrc: "/flags/do.svg", league: "LIDOM" },
  { country: "Puerto Rico", flagSrc: "/flags/pr.svg", league: "LBPRC" },
  { country: "Venezuela", flagSrc: "/flags/ve.svg", league: "LVBP" },
] as const;

export const CARIBE_2027_STAGES = [
  { name: "Fase clasificatoria", dates: "1 al 5 de febrero" },
  { name: "Semifinales", dates: "6 de febrero" },
  { name: "Final y tercer lugar", dates: "7 de febrero" },
] as const;
