/**
 * Registro editorial de eventos del cuerpo técnico con fuente primaria.
 * No es un catálogo de técnicos actuales: conserva el evento histórico y su fecha.
 * No se crean eventos desde rumores o menciones incidentales.
 */
export type VerifiedStaffKind =
  | "appointment" | "ratification" | "replacement"
  | "interim" | "departure" | "dismissal" | "resignation"
  | "coach-addition" | "coach-departure";

export type VerifiedPersonnelEvent = {
  league: "LMB" | "LMP";
  clubSlug: string;
  date: string;
  person: string;
  role: string;
  kind: VerifiedStaffKind;
  effectiveSeason: string;
  url: string;
  description: string;
  replaces?: string;
};

const EVENTS: readonly VerifiedPersonnelEvent[] = [
  {
    league:"LMB",clubSlug:"leones",date:"2026-11-23",person:"Yadier Molina",role:"Mánager",
    kind:"appointment",effectiveSeason:"2027",
    url:"https://lmb.com.mx/noticias/el-historico-ex-receptor-yadier-molina-es-el-nuevo-manager-de-los-leones-de-yucatan",
    description:"Leones de Yucatán anunció a Yadier Molina como nuevo mánager para 2027. Es un nombramiento de cuerpo técnico, no un alta de jugador.",
  },
  {
    league:"LMB",clubSlug:"saraperos",date:"2026-11-11",person:"Lloyd McClendon",role:"Mánager",
    kind:"appointment",effectiveSeason:"2027",
    url:"https://lmb.com.mx/noticias/lloyd-mcclendon-experiencia-de-grandes-ligas-al-frente-de-saraperos",
    description:"Saraperos de Saltillo anunció a Lloyd McClendon como mánager para 2027, mediante comunicado oficial.",
  },
  {
    league:"LMB",clubSlug:"guerreros",date:"2026-10-20",person:"Asdrúbal Cabrera",role:"Mánager",
    kind:"appointment",effectiveSeason:"2027",
    url:"https://lmb.com.mx/noticias/asdrubal-cabrera-nuevo-manager-de-los-guerreros-de-oaxaca",
    description:"Guerreros de Oaxaca anunció a Asdrúbal Cabrera como su nuevo mánager para la temporada 2027.",
  },
  {
    league:"LMB",clubSlug:"diablos-rojos",date:"2026-10-15",person:"Benjamín Gil",role:"Mánager",
    kind:"appointment",effectiveSeason:"2027",
    url:"https://lmb.com.mx/noticias/benjamin-gil-llega-al-infierno-es-el-nuevo-manager-de-los-diablos-rojos",
    description:"Diablos Rojos del México anunció oficialmente a Benjamín Gil como nuevo mánager para 2027; una presentación posterior no crea un segundo nombramiento.",
  },
  {
    league:"LMB",clubSlug:"dorados",date:"2026-09-03",person:"Tony DeFrancesco",role:"Mánager",
    kind:"appointment",effectiveSeason:"2027",
    url:"https://lmb.com.mx/noticias/tony-defrancesco-sera-el-nuevo-manager-de-los-dorados-de-chihuahua",
    description:"Dorados de Chihuahua anunció la incorporación de Tony DeFrancesco como mánager para la temporada 2027.",
  },
  {
    league:"LMP",clubSlug:"jaguares",date:"2026-11-05",person:"Erik Rodríguez",role:"Mánager",
    kind:"replacement",effectiveSeason:"2026–27",replaces:"Luis Carlos Rivera",
    url:"https://editor.lmp.mx/erik-rodriguez-nuevo-manager-de-jaguares/",
    description:"Jaguares de Nayarit nombró a Erik Rodríguez como nuevo mánager en sustitución de Luis Carlos Rivera. La fuente no atribuye una causa específica a la salida.",
  },
  {
    league:"LMP",clubSlug:"yaquis",date:"2026-06-29",person:"José Mosquera",role:"Mánager",
    kind:"appointment",effectiveSeason:"2026–27",
    url:"https://editor.lmp.mx/jose-mosquera-sera-el-manager-de-yaquis/",
    description:"Yaquis de Obregón anunció a José Mosquera como nuevo mánager para la temporada 2026–27.",
  },
  {
    league:"LMP",clubSlug:"mayos",date:"2026-05-21",person:"Miguel Tejada",role:"Mánager",
    kind:"appointment",effectiveSeason:"2026–27",
    url:"https://editor.lmp.mx/miguel-tejada-sera-el-nuevo-manager-de-los-mayos-de-navojoa/",
    description:"Mayos de Navojoa anunció a Miguel Tejada como nuevo mánager para la temporada 2026–27.",
  },
  {
    league:"LMP",clubSlug:"naranjeros",date:"2026-07-23",person:"Gil Velázquez",role:"Coach de banca",
    kind:"coach-addition",effectiveSeason:"2026–27",
    url:"https://editor.lmp.mx/definido-el-cuerpo-tecnico-de-naranjeros/",
    description:"Naranjeros de Hermosillo anunció la incorporación de Gil Velázquez como coach de banca para 2026–27. Es parte del cuerpo técnico y no un movimiento de jugador.",
  },
  {
    league:"LMP",clubSlug:"aguilas",date:"2026-08-18",person:"Adulfo Camacho",role:"Coach de tercera base",
    kind:"coach-addition",effectiveSeason:"2026–27",
    url:"https://editor.lmp.mx/aguilas-de-mexicali-presenta-su-staff-de-coaches/",
    description:"Águilas de Mexicali anunció la llegada de Adulfo Camacho como coach de tercera base para 2026–27. El nombramiento no implica alta de pelotero.",
  },
  {
    league:"LMP",clubSlug:"naranjeros",date:"2026-05-08",person:"José “Cheo” Moreno",role:"Mánager",
    kind:"appointment",effectiveSeason:"2026–27",
    url:"https://editor.lmp.mx/naranjeros-anuncia-a-jose-cheo-moreno-como-su-nuevo-manager/",
    description:"Naranjeros de Hermosillo anunció a José “Cheo” Moreno como nuevo mánager para la temporada 2026–27.",
  },
  {
    league:"LMP",clubSlug:"aguilas",date:"2026-03-02",person:"Roberto “Chapo” Vizcarra",role:"Mánager",
    kind:"ratification",effectiveSeason:"2026–27",
    url:"https://editor.lmp.mx/chapo-vizcarra-es-ratificado-como-manager-de-aguilas-de-mexicali/",
    description:"Águilas de Mexicali ratificó a Roberto “Chapo” Vizcarra como mánager para la temporada 2026–27; no se trata de un nuevo nombramiento.",
  },
  {
    league:"LMP",clubSlug:"venados",date:"2026-02-21",person:"Chris Roberson",role:"Mánager",
    kind:"appointment",effectiveSeason:"2026–27",
    url:"https://editor.lmp.mx/chris-roberson-toma-el-mando-de-los-venados-de-mazatlan/",
    description:"Venados de Mazatlán presentó oficialmente a Chris Roberson como nuevo mánager para la temporada 2026–27.",
  },
];

export function verifiedPersonnelEventsForClub(
  league: "LMB" | "LMP", clubSlug: string,
): VerifiedPersonnelEvent[] {
  if (!/^[a-z0-9-]+$/.test(clubSlug)) return [];
  return EVENTS.filter(e => e.league === league && e.clubSlug === clubSlug)
    .sort((a,b) => b.date.localeCompare(a.date))
    .map(e => ({...e}));
}

export function staffEventLabel(kind: VerifiedStaffKind): string {
  const labels: Record<VerifiedStaffKind,string> = {
    appointment:"Nombramiento oficial",
    ratification:"Ratificación oficial",
    replacement:"Cambio de mánager confirmado",
    interim:"Designación interina",
    departure:"Salida anunciada",
    dismissal:"Destitución confirmada",
    resignation:"Renuncia confirmada",
    "coach-addition":"Incorporación al cuerpo técnico",
    "coach-departure":"Salida del cuerpo técnico",
  };
  return labels[kind];
}
