/** Identifica republicaciones de una misma noticia entre el club y LMP.
 * Las fechas pueden variar un día porque ambos portales publican por separado.
 * No elimina artículos distintos que simplemente mencionen al mismo equipo.
 */
export type ComparableNews = { title: string; published: string };

const normalizeTitle = (title: string): string => title
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("es")
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim();

export function isRepublishedAlgodonerosNews(
  clubStories: readonly ComparableNews[],
  leagueStory: ComparableNews,
): boolean {
  const leagueDate = Date.parse(leagueStory.published);
  const title = normalizeTitle(leagueStory.title);
  if (!title || !Number.isFinite(leagueDate)) return false;
  const maxDateDifference = 3 * 24 * 60 * 60 * 1000;
  return clubStories.some(clubStory => {
    const clubDate = Date.parse(clubStory.published);
    return Number.isFinite(clubDate)
      && normalizeTitle(clubStory.title) === title
      && Math.abs(clubDate - leagueDate) <= maxDateDifference;
  });
}
