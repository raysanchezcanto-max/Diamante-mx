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
  110: [
    {
      title: "Gunnar Henderson decide un triunfo sobre los Mets",
      date: "14 sep 2026",
      duration: "3:29",
      description: "Resumen oficial de la victoria 2-1 de Baltimore, con el jonrón de la ventaja de Gunnar Henderson y un doblete productor de Heston Kjerstad.",
      url: "https://www.mlb.com/orioles/video/gunnar-henderson-homers-in-orioles-2-1-win",
    },
    {
      title: "Homenaje a los 2,131 juegos de Cal Ripken Jr.",
      date: "6 sep 2025",
      duration: "1:04",
      description: "Los Orioles recuerdan el trigésimo aniversario de la noche en que Ripken superó la marca de Lou Gehrig.",
      url: "https://www.mlb.com/video/orioles-honor-cal-ripken-jr-on-anniversary-of-streak",
    },
    {
      title: "Baltimore conquista la Serie Mundial de 1983",
      date: "16 oct 1983",
      duration: "1:53:42",
      description: "Partido completo del quinto juego, con los dos cuadrangulares de Eddie Murray y la blanqueada de Scott McGregor.",
      url: "https://www.mlb.com/orioles/video/orioles-win-1983-world-series",
    },
  ],
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
