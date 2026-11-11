// Lenguaje editorial común para perfiles de equipos de Diamante MX.
// Cada liga comparte títulos de sección, jerarquía y nombres de bloques.
// Los hechos, la dirección cronológica MLB y los años se documentan por club.
export const CLUB_PROFILE_COPY = {
  history: {
    title: (club: string) => "La historia de " + club,
    recordKicker: "EL PALMARÉS",
    recordTitle: (league: string) => "Campeonatos de " + league,
    timelineKicker: "MOMENTOS QUE DEFINIERON AL CLUB",
    timelineTitle: "Línea del tiempo",
    figuresKicker: "NOMBRES QUE DEJARON HUELLA",
    figuresTitle: "Figuras históricas del club",
    figuresNote: "Selección de jugadores, mánagers y personalidades documentadas en las fuentes del club. No es un ranking absoluto.",
    hallKicker: "RECONOCIMIENTO OFICIAL",
    hallTitle: "Inmortales vinculados al club",
    hallNote: "Personajes que tuvieron un vínculo documentado con este equipo y fueron entronizados en el Salón de la Fama del Beisbol Mexicano.",
    stadiumKicker: "LA CASA DEL EQUIPO",
    sourcesKicker: "FUENTES HISTÓRICAS",
    firstCrown: "PRIMERA CORONA",
    recentCrown: "CORONA MÁS RECIENTE",
    firstGlory: "La primera gloria",
    mostRecentGlory: "La conquista más reciente",
  },
  mlb: {
    kicker: "DEL BÉISBOL MEXICANO AL DIAMANTE INTERNACIONAL",
    intro: "Distinguimos a quienes debutaron en MLB después de su paso por el club, a quienes ya tenían experiencia en Grandes Ligas y a los prospectos vinculados con sus organizaciones. Una firma o participación en Ligas Menores no garantiza un debut en MLB ni demuestra una transferencia directa.",
    title: (club: string) => "De " + club + " a Grandes Ligas",
    debutKicker: "LLEGARON A LA GRAN CARPA",
    debutTitle: "Debutaron en MLB después de su paso por el club",
    minorKicker: "DEL SISTEMA DE DESARROLLO A ESTADOS UNIDOS",
    minorTitle: "Prospectos firmados por organizaciones MLB",
    sourceLabel: "Ver fuente documentada ↗",
  }
} as const;
