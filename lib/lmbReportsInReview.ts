/**
 * Reportes periodísticos en seguimiento. Este catálogo NO confirma
 * nombramientos ni reemplaza el feed oficial. Solo se incorporan piezas
 * que un editor comprobó en fuentes identificables y se caducan para
 * impedir que rumores antiguos parezcan noticias del día.
 */
export type ReportInReview = {
  slug: string;
  subject: string;
  date: string;
  validThrough: string;
  headline: string;
  summary: string;
  articleUrl: string;
  sourceName: string;
};
const pending: readonly ReportInReview[] = [
  {
    slug: "leones",
    subject: "Yadier Molina",
    date: "2026-11-20",
    validThrough: "2026-12-05",
    headline: "Reportes sitúan a Yadier Molina como próximo mánager de Leones",
    summary: "Francys Romero y John Denton informan de un acuerdo para 2027. Hasta que Leones o la LMB lo anuncien, se presenta como reporte periodístico, NO como contratación oficial.",
    articleUrl: "https://roundtable.io/sports/mlb/cardinals/news/cardinals-hall-of-famer-yadier-molina-named-manager-of-mexican-league-team-for-27",
    sourceName: "John Denton · Roundtable Sports",
  },
];
const normalized = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("es");
// Mencionar a un candidato no confirma su contratación. Solo un titular
// afirmativo de la fuente oficial permite retirar el reporte pendiente.
const officialAppointment = (title: string, subject: string): boolean => {
  const text = normalized(title);
  if (!text.includes(normalized(subject))) return false;
  if (/[¿?]/.test(text) || /\b(?:rumor|posible|podria|seria|perfilado|negocia|sin confirmar|no sera|descarta)\b/.test(text)) return false;
  return /\b(?:nuevo (?:manager|director tecnico)|nombrad[oa] (?:como )?(?:manager|director tecnico)|designad[oa] (?:como )?(?:manager|director tecnico)|(?:anuncia|confirma|presenta|contrata) (?:a |como ))\b/.test(text);
};
export function lmbReportsInReview(
  slug: string,
  officialTitles: readonly string[],
  now = new Date(),
): ReportInReview[] {
  const day = now.toISOString().slice(0,10);
  return pending.filter(report => report.slug === slug &&
    report.date <= day && day <= report.validThrough &&
    !officialTitles.some(title => officialAppointment(title, report.subject)));
}
