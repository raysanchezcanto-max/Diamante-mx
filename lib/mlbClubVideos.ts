/** Selección editorial de videos oficiales verificados, por franquicia MLB.
 *  No se inventan clips ni se incrustan reproducciones sin autorización.
 *  Se amplía club por club junto con la auditoría del perfil completo.
 */
export type MlbClubVideo = {
  title: string;
  date: string;
  duration: string;
  description: string;
  url: string;
};

const verified: Readonly<Record<number, readonly MlbClubVideo[]>> = {
  144: [
    {
      title: "Los mejores momentos de Chris Sale en 2026",
      date: "9 oct 2026",
      duration: "12:50",
      description: "Repaso oficial de la temporada 2026 del lanzador de Atlanta.",
      url: "https://www.mlb.com/braves/video/chris-sale-s-best-moments-of-2026",
    },
    {
      title: "Chris Sale completa una blanqueada ante Dodgers",
      date: "27 ago 2026",
      duration: "0:29",
      description: "Ángulo de campo del último ponche en su blanqueada de juego completo.",
      url: "https://www.mlb.com/braves/video/field-view-chris-sale-notches-complete-game-shutout",
    },
    {
      title: "Atlanta conquista la Serie Mundial de 2021",
      date: "2 nov 2021",
      duration: "5:16",
      description: "El video de MLB sobre el cuarto campeonato de la franquicia.",
      url: "https://www.mlb.com/braves/video/braves-are-world-champions",
    },
  ],
};

export function getMlbClubVerifiedVideos(clubId: number): readonly MlbClubVideo[] {
  return verified[clubId] ?? [];
}
